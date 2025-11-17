using AutoMapper;
using ClothesShop.DTOs.RequestDTO;
using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using ClothesShop.Services.Interfaces;
using X.PagedList;

namespace ClothesShop.Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private EmailService _emailService;
        public ProductService(IUnitOfWork unitOfWork, IMapper mapper, EmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _emailService = emailService;
        }

        public async Task<List<ProductCardDTO>> GetBestSellersAsync(int quantity)
        {
            var topProductIds = await _unitOfWork.OrderDetailRepository.GetTopSellingProductIdsAsync(quantity);
            var products = await _unitOfWork.ProductRepository.GetProductCardByIdsAsync(topProductIds);

            return topProductIds
                .Select(id => products.FirstOrDefault(p => p.ProductId == id))
                .Where(p => p is not null)
                .Select(p => p!)
                .ToList();
        }

        public async Task<List<ProductCardDTO>> GetLatestProductsAsync(int quantity)
        {
            var latestId = await _unitOfWork.ProductRepository.GetLatestProductIdsAsync(quantity);
            var products = await _unitOfWork.ProductRepository.GetProductCardByIdsAsync(latestId);
            return latestId
                .Select(id => products.FirstOrDefault(p => p.ProductId == id))
                .Where(p => p != null)
                .Select(p => p!)
                .ToList();
        }
        public async Task<ProductDescriptionDTO?> GetProductDescription(int productId)
        {
            return _mapper.Map<ProductDescriptionDTO>(await _unitOfWork.ProductDescriptionRepository.GetByIdAsync(productId));
        }

        public async Task<ProductCardDTO?> GetProductDetail(int productId)
        {
            return await _unitOfWork.ProductRepository.GetProductDetail(productId);
        }
        public async Task AddToCartByToken(AddCartRequestDTO data)
        {
            if (!string.IsNullOrEmpty(data.GuestToken))
            {
                var cart = await _unitOfWork.CartRepository.GetCartByTokenOrId(data.GuestToken);
                if (cart == null)
                {
                    cart = new Cart
                    {
                        GuestToken = data.GuestToken,
                    };
                    await _unitOfWork.CartRepository.AddAsync(cart);
                    await _unitOfWork.SaveChangesAsync();
                }
                var cartItem = await _unitOfWork.CartItemRepository.GetCartItemByVariantId(data.VariantId, cart.CartID);
                if (cartItem != null)
                {
                    cartItem.Quantity += data.Quantity;
                    await _unitOfWork.CartItemRepository.UpdateAsync(cartItem);
                }
                else
                {
                    await _unitOfWork.CartItemRepository.AddAsync(new CartItem
                    {
                        CartID = cart.CartID,
                        VariantId = data.VariantId,
                        Quantity = data.Quantity
                    });
                }
                await _unitOfWork.SaveChangesAsync();
            }
        }
        public async Task AddToCartByUserId(AddCartRequestDTO data)
        {
            if (!string.IsNullOrEmpty(data.GuestToken))
            {
                var cart = await _unitOfWork.CartRepository.GetCartByTokenOrId(data.GuestToken);
                if (cart == null)
                {
                    cart = new Cart
                    {
                        UserID = int.Parse(data.GuestToken),
                    };
                    await _unitOfWork.CartRepository.AddAsync(cart);
                    await _unitOfWork.SaveChangesAsync();

                }
                var cartItem = await _unitOfWork.CartItemRepository.GetCartItemByVariantId(data.VariantId, cart.CartID);
                if (cartItem != null)
                {
                    cartItem.Quantity += data.Quantity;
                    await _unitOfWork.CartItemRepository.UpdateAsync(cartItem);
                }
                else
                {
                    await _unitOfWork.CartItemRepository.AddAsync(new CartItem
                    {
                        CartID = cart.CartID,
                        VariantId = data.VariantId,
                        Quantity = data.Quantity
                    });
                }
                await _unitOfWork.SaveChangesAsync();
            }
        }
        public async Task<int> GetCartQuantity(string guestToken)
        {
            return await _unitOfWork.CartItemRepository.GetCartQuantity(guestToken);
        }

        public async Task<FeedbackPagedResponseDTO> GetFeedbackByProductId
            (int productId, int page, int limit, string? sort, int? starRating)
        {
            return await _unitOfWork.FeedbackRepository.GetFeedbackByProductId
                (productId, page, limit, sort, starRating);
        }

        public async Task<List<UserCartResponseDTO>> GetUserCart(string guestToken)
        {
            return await _unitOfWork.CartItemRepository.GetUserCart(guestToken);
        }

        public async Task DeleteCartItem(int cartItemId)
        {
            if (cartItemId == 0)
            {
                await _unitOfWork.CartItemRepository.DeleteAllCartItem(cartItemId);
            }
            await _unitOfWork.CartItemRepository.DeleteAsync(cartItemId);
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task DeleteAllCartItem(string guestToken)
        {
            var cart = await _unitOfWork.CartRepository.GetCartByTokenOrId(guestToken);
            if (cart != null)
            {
                await _unitOfWork.CartItemRepository.DeleteAllCartItem(cart.CartID);
                await _unitOfWork.SaveChangesAsync();
            }
        }

        public async Task<OrderResponseDTO> CreateOrderAsync(CreateOrderRequest request, int? userId)
        {
            var orderData = await _unitOfWork.ProductRepository.CreateOrderAsync(request, userId);
            string subject = "Order Confirmation - Order #" + orderData.OrderId;
            string htmlBody = $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;'>
                <h2 style='color: #333;'>Cảm ơn bạn đã đặt hàng tại Zest!</h2>
                <p style='font-size: 16px; color: #555;'>Đơn hàng của bạn đã được tạo thành công với thông tin như sau:</p>

                <h3 style='color: #2E35B1;'>Thông tin đơn hàng</h3>
                <p><strong>Mã đơn hàng:</strong> #{orderData.OrderId}</p>
                <p><strong>Ngày đặt:</strong> {DateTime.Parse(orderData.OrderDate.ToString()).ToString("dd/MM/yyyy HH:mm")}</p>
                <p><strong>Địa chỉ:</strong> {orderData.AddressDetail}, {orderData.Ward}, {orderData.District}, {orderData.Province}</p>

                <h3 style='color: #2E35B1; margin-top: 20px;'>Chi tiết sản phẩm</h3>
                <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f2f2f2;'>
                            <th style='border: 1px solid #ddd; padding: 8px;'>Sản phẩm</th>
                            <th style='border: 1px solid #ddd; padding: 8px;'>Số lượng</th>
                            <th style='border: 1px solid #ddd; padding: 8px;'>Đơn giá</th>
                            <th style='border: 1px solid #ddd; padding: 8px;'>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
            ";

            foreach (var product in orderData.Products)
            {
                var name = product.ProductName;
                var quantity = product.Quantity;
                var price = ((decimal)product.UnitPrice).ToString("N0");
                var total = (quantity * (decimal)product.UnitPrice).ToString("N0");

                htmlBody += $@"
                        <tr>
                            <td style='border: 1px solid #ddd; padding: 8px;'>{name}</td>
                            <td style='border: 1px solid #ddd; padding: 8px; text-align: center;'>{quantity}</td>
                            <td style='border: 1px solid #ddd; padding: 8px;'>{price}₫</td>
                            <td style='border: 1px solid #ddd; padding: 8px;'>{total}₫</td>
                        </tr>";
            }

            var shippingFee = ((decimal)orderData.ShippingFee).ToString("N0");
            var totalAmount = ((decimal)orderData.TotalAmount).ToString("N0");

            htmlBody += $@"
                    </tbody>
                </table>

                <h3 style='margin-top: 20px; color: #2E35B1;'>Tổng thanh toán</h3>
                <p><strong>Phí vận chuyển:</strong> {shippingFee}₫</p>
                <p><strong>Tổng cộng:</strong> <span style='font-size: 18px; color: #d32f2f;'>{totalAmount}₫</span></p>

                <p style='font-size: 14px; color: #888; margin-top: 30px;'>Chúng tôi sẽ sớm liên hệ với bạn để xác nhận và giao hàng.</p>
                <p style='font-size: 14px; color: #888; text-align: right;'>— SellGon Team</p>
            </div>";
            await _emailService.SendEmailAsync(request.Email, subject, htmlBody);
            return orderData;
        }

        public async Task<IPagedList<ProductCardDTO>> SearchProductCardAsync(string? keyword, int pageNumber, int pageSize)
        {
            return await _unitOfWork.ProductRepository.SearchProductCardAsync(keyword, pageNumber, pageSize);
        }

        public async Task<PagedResult<ProductCardDTO>> GetProductsByCategorySlugPaged(
                string categorySlug,
                int pageNumber,
                int pageSize,
                string sort)
        {
            return await _unitOfWork.ProductRepository.GetProductsByCategorySlugPaged(categorySlug, pageNumber, pageSize, sort);
        }
    }
}
