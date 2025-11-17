using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClothesShop.Repositories
{
    public class CartItemRepository : Repository<CartItem>, ICartItemRepository
    {
        public CartItemRepository(ClothesShopDbContext context) : base(context)
        {
        }

        public async Task DeleteAllCartItem(int cartId)
        {
            await _context.CartItems
                .Where(ci => ci.CartID == cartId)
                .ExecuteDeleteAsync();
        }

        public async Task<CartItem?> GetCartItemByVariantId(int variantId, int cartId)
        {
            return await _context.CartItems.Where(ci => ci.CartID == cartId)
                .FirstOrDefaultAsync(ci => ci.VariantId == variantId);
        }

        public async Task<int> GetCartQuantity(string guestToken)
        {
            if (int.TryParse(guestToken, out int userId))
            {
                var cart = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserID == userId);
                if (cart != null)
                {
                    return await _context.CartItems
                .CountAsync(ci => ci.CartID == cart.CartID);
                }
            }
            var cartToken = await _context.Carts
                .FirstOrDefaultAsync(c => c.GuestToken == guestToken);
            if (cartToken != null)
            {
                return await _context.CartItems
                .CountAsync(ci => ci.CartID == cartToken.CartID);
            }
            return 0;
        }

        public async Task<List<UserCartResponseDTO>> GetUserCart(string guestToken)
        {
            int? userId = int.TryParse(guestToken, out int parsedUserId) ? parsedUserId : 0;

            var cart = await _context.Carts
                .FirstOrDefaultAsync(c => c.GuestToken == guestToken || c.UserID == userId);

            if (cart == null)
                return new List<UserCartResponseDTO>();

            var cartItems = await _context.CartItems
                .Include(ci => ci.Variant)
                    .ThenInclude(v => v.Product)
                .Include(ci => ci.Variant.Color)
                .Include(ci => ci.Variant.Size)
                .Where(ci => ci.CartID == cart.CartID)
                .ToListAsync();

            var productIds = cartItems.Select(ci => ci.Variant.ProductId).Distinct().ToList();

            // Load tất cả variants & images để tránh N+1
            var allVariants = await _context.ProductVariants
                .Include(v => v.Color)
                .Include(v => v.Size)
                .Where(v => productIds.Contains(v.ProductId))
                .ToListAsync();

            var productImages = await _context.ProductImages
                .Where(pi => productIds.Contains(pi.ProductId))
                .ToListAsync();

            var result = new List<UserCartResponseDTO>();

            foreach (var ci in cartItems)
            {
                var product = ci.Variant.Product;
                var productId = product.Id;

                var colors = allVariants
                    .Where(v => v.ProductId == productId)
                    .GroupBy(v => v.Color)
                    .Select(g => new ColorCartDTO
                    {
                        Id = g.Key!.Id,
                        Name = g.Key.Name,
                        Sizes = g.Select(v => new SizeCartDTO
                        {
                            Id = v.Size!.Id,
                            Name = v.Size.Name,
                            VariantId = v.Id,
                            Stock = v.Quantity
                        }).ToList()
                    }).ToList();

                var image = productImages
                    .Where(pi => pi.ProductId == productId && pi.ColorId == ci.Variant.ColorId)
                    .Select(pi => pi.Image)
                    .FirstOrDefault() ?? string.Empty;

                result.Add(new UserCartResponseDTO
                {
                    CartId = cart.CartID,
                    CartItemId = ci.CartItemID,
                    VariantId = ci.VariantId,
                    ProductName = product.Name,
                    Colors = colors,
                    Price = product.Price,
                    Quantity = ci.Quantity,
                    Image = image
                });
            }

            return result;
        }



    }
}
