using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Enums;
using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using System.Net.NetworkInformation;
using X.PagedList;
using X.PagedList.Extensions;
using ClothesPagedResult = ClothesShop.DTOs.ResponseDTO.PagedResult<object>;

namespace ClothesShop.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(ClothesShopDbContext context) : base(context)
        {
        }

        public async Task<List<int>> GetLatestProductIdsAsync(int quantity)
        {
            return await _context.Products.OrderByDescending(p => p.CreatedAt)
                .Take(quantity)
                .Select(p => p.Id)
                .ToListAsync();
        }

        public async Task<List<ProductCardDTO>> GetProductCardByIdsAsync(List<int> productIds)
        {
            return await _context.Products.Include(p => p.Feedbacks)
                .Where(p => productIds.Contains(p.Id))
                .Select(p => new ProductCardDTO
                {
                    ProductId = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    Rating = new RatingDTO
                    {
                        Average = Math.Round(
                            p.Feedbacks != null && p.Feedbacks.Any()
                                ? p.Feedbacks.Average(f => (double)f.Rating)
                                : 0, 1),
                        Count = p.Feedbacks.Count
                    },
                    Colors = p.ProductVariants
                        .GroupBy(v => v.Color)
                        .Select(cg => new ColorDTO
                        {
                            Id = cg.Key.Id,
                            Name = cg.Key.Name,
                            ThumbnailUrl = cg.Key.Image,
                            Images = _context.ProductImages
                                .Where(pi => pi.ProductId == p.Id && pi.ColorId == cg.Key.Id)
                                .Select(pi => pi.Image)
                                .ToList(),
                            Sizes = cg.Select(v => new SizeDTO
                            {
                                Id = v.Size!.Id,
                                Name = v.Size.Name,
                                Description = v.Size.Description!,
                                Stock = v.Quantity,
                                VariantId = v.Id
                            }).ToList()
                        }).ToList()
                })
                .ToListAsync();
        }
        public async Task<ProductCardDTO?> GetProductDetail(int productId)
        {
            var product = await _context.Products
                .Include(p => p.Feedbacks)
                .Include(p => p.ProductVariants)
                    .ThenInclude(v => v.Size)
                .Include(p => p.ProductVariants)
                    .ThenInclude(v => v.Color)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null)
                return null;

            var productImages = await _context.ProductImages
                .Where(pi => pi.ProductId == productId)
                .ToListAsync();

            return new ProductCardDTO
            {
                ProductId = product.Id,
                Name = product.Name,
                Price = product.Price,
                Rating = new RatingDTO
                {
                    Average = Math.Round(
                        product.Feedbacks != null && product.Feedbacks.Any()
                            ? product.Feedbacks.Average(f => (double)f.Rating)
                            : 0, 1),
                    Count = product.Feedbacks.Count
                },
                Colors = product.ProductVariants
                    .GroupBy(v => v.Color)
                    .Select(cg => new ColorDTO
                    {
                        Id = cg.Key!.Id,
                        Name = cg.Key.Name,
                        ThumbnailUrl = cg.Key.Image,
                        Images = productImages
                            .Where(pi => pi.ColorId == cg.Key.Id)
                            .Select(pi => pi.Image)
                            .ToList(),
                        Sizes = cg.Select(v => new SizeDTO
                        {
                            Id = v.Size!.Id,
                            Name = v.Size.Name,
                            Description = v.Size.Description!,
                            Stock = v.Quantity,
                            VariantId = v.Id
                        }).ToList()
                    }).ToList()
            };
        }
        public async Task<OrderResponseDTO> CreateOrderAsync(CreateOrderRequest request, int? userId)
        {
            var cartItems = await _context.CartItems
                .Include(ci => ci.Variant)
                    .ThenInclude(v => v.Product)
                .Where(ci => request.Products.Contains(ci.CartItemID))
                .ToListAsync();

            if (!cartItems.Any())
                throw new Exception("Không có sản phẩm hợp lệ trong giỏ hàng.");

            decimal total = cartItems.Sum(ci => ci.Quantity * ci.Variant.Product.Price);
            decimal shippingFee = 0;

            // Lấy thông tin địa lý
            var province = await _context.Provinces.FindAsync(request.Province);
            var district = await _context.Districts.FindAsync(request.District);
            var ward = await _context.Wards.FindAsync(request.Ward);

            if (province == null || district == null || ward == null)
                throw new Exception("Địa chỉ không hợp lệ.");

            // Tạo đơn hàng
            var order = new Order
            {
                UserId = userId ?? null,
                ProvinceId = request.Province,
                DistrictId = request.District,
                WardId = request.Ward,
                AddressDetail = request.Address,
                TotalAmount = total + shippingFee,
                ShippingFee = shippingFee,
                Status = OrderStatus.Pending,
                OrderDate = DateTime.Now,
                OrderDetails = cartItems.Select(ci => new OrderDetail
                {
                    VariantId = ci.VariantId,
                    Quantity = ci.Quantity,
                    UnitPrice = ci.Variant.Product.Price
                }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var payment = new Payment
            {
                OrderId = order.Id,
                Amount = order.TotalAmount,
                PaymentMethod = request.PaymentMethod,
                Status = PaymentStatus.Pending
            };

            _context.Payments.Add(payment);
            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return new OrderResponseDTO
            {
                OrderId = order.Id,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                ShippingFee = order.ShippingFee,
                Province = province.Name,
                District = district.Name,
                Ward = ward.Name,
                AddressDetail = order.AddressDetail,
                Products = cartItems.Select(ci => new OrderedProductDTO
                {
                    ProductName = ci.Variant.Product.Name,
                    Quantity = ci.Quantity,
                    UnitPrice = ci.Variant.Product.Price
                }).ToList()
            };
        }

        public async Task<IPagedList<ProductCardDTO>> SearchProductCardAsync(string? keyword, int pageNumber, int pageSize)
        {
            var query = _context.Products
                .Include(p => p.Feedbacks)
                .Include(p => p.ProductVariants)
                    .ThenInclude(v => v.Color)
                .Include(p => p.ProductVariants)
                    .ThenInclude(v => v.Size)
                .AsQueryable();

            // Nếu có từ khóa, lọc theo tên sản phẩm
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(p => p.Name.Contains(keyword));
            }

            var result = query
                .Select(p => new ProductCardDTO
                {
                    ProductId = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    Rating = new RatingDTO
                    {
                        Average = Math.Round(
                            p.Feedbacks != null && p.Feedbacks.Any()
                                ? p.Feedbacks.Average(f => (double)f.Rating)
                                : 0, 1),
                        Count = p.Feedbacks.Count
                    },
                    Colors = p.ProductVariants
                        .GroupBy(v => v.Color)
                        .Select(cg => new ColorDTO
                        {
                            Id = cg.Key.Id,
                            Name = cg.Key.Name,
                            ThumbnailUrl = cg.Key.Image,
                            Images = _context.ProductImages
                                .Where(pi => pi.ProductId == p.Id && pi.ColorId == cg.Key.Id)
                                .Select(pi => pi.Image)
                                .ToList(),
                            Sizes = cg.Select(v => new SizeDTO
                            {
                                Id = v.Size.Id,
                                Name = v.Size.Name,
                                Description = v.Size.Description,
                                Stock = v.Quantity,
                                VariantId = v.Id
                            }).ToList()
                        }).ToList()
                })
                .ToPagedList(pageNumber, pageSize);

            return result;
        }



        public async Task<DTOs.ResponseDTO.PagedResult<ProductCardDTO>> GetProductsByCategorySlugPaged(
                string categorySlug,
                int pageNumber,
                int pageSize,
                string sort)
        {
            var query = _context.Products
                .Include(p => p.Feedbacks)
                .Include(p => p.Category)
                .Include(p => p.ProductVariants)
                    .ThenInclude(v => v.Size)
                .Include(p => p.ProductVariants)
                    .ThenInclude(v => v.Color)
                .Where(p => p.Category.Slug == categorySlug)
                .AsQueryable();

            // Parse sort
            string sortColumn = "price";
            string sortDirection = "asc";

            if (!string.IsNullOrEmpty(sort) && sort.Contains(":"))
            {
                var parts = sort.Split(':');
                if (parts.Length == 2)
                {
                    sortColumn = parts[0].ToLower();
                    sortDirection = parts[1].ToLower() == "desc" ? "desc" : "asc"; 
                }
            }

            
            var mappedSortColumn = sortColumn switch
            {
                "price" => "Price",
                "created_at" => "CreatedAt",
            };

            try
            {
                query = query.OrderBy($"{mappedSortColumn} {sortDirection}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"OrderBy error: {ex.Message}");
                query = query.OrderBy("Price asc");
            }

            var pagedList = query.ToPagedList(pageNumber, pageSize);

            if (!pagedList.Any())
            {
                return new DTOs.ResponseDTO.PagedResult<ProductCardDTO>
                {
                    Items = new List<ProductCardDTO>(),
                    CurrentPage = pageNumber,
                    PageSize = pageSize,
                    TotalItems = pagedList.TotalItemCount,
                    TotalPages = pagedList.PageCount
                };
            }

            var productIds = pagedList.Select(p => p.Id).ToList();

            var productImages = await _context.ProductImages
                .Where(pi => productIds.Contains(pi.ProductId))
                .ToListAsync();

            var items = pagedList.Select(product => new ProductCardDTO
            {
                ProductId = product.Id,
                Name = product.Name,
                Price = product.Price,
                Rating = new RatingDTO
                {
                    Average = Math.Round(
                        product.Feedbacks != null && product.Feedbacks.Any()
                            ? product.Feedbacks.Average(f => (double)f.Rating)
                            : 0, 1),
                    Count = product.Feedbacks.Count
                },
                Colors = product.ProductVariants
                    .GroupBy(v => v.Color)
                    .Select(cg => new ColorDTO
                    {
                        Id = cg.Key!.Id,
                        Name = cg.Key.Name,
                        ThumbnailUrl = cg.Key.Image,
                        Images = productImages
                            .Where(pi => pi.ColorId == cg.Key.Id && pi.ProductId == product.Id)
                            .Select(pi => pi.Image)
                            .ToList(),
                        Sizes = cg.Select(v => new SizeDTO
                        {
                            Id = v.Size!.Id,
                            Name = v.Size.Name,
                            Description = v.Size.Description!,
                            Stock = v.Quantity,
                            VariantId = v.Id
                        }).ToList()
                    }).ToList()
            }).ToList();

            return new DTOs.ResponseDTO.PagedResult<ProductCardDTO>
            {
                Items = items,
                CurrentPage = pagedList.PageNumber,
                PageSize = pagedList.PageSize,
                TotalItems = pagedList.TotalItemCount,
                TotalPages = pagedList.PageCount
            };
        }

    }
}

