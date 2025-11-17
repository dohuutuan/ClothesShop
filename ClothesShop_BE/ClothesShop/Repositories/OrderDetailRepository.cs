using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClothesShop.Repositories
{
    public class OrderDetailRepository : Repository<OrderDetail>, IOrderDetailRepository
    {
        public OrderDetailRepository(ClothesShopDbContext context) : base(context)
        {
        }

        public async Task<List<int>> GetTopSellingProductIdsAsync(int quantity)
        {
            return await _context.OrderDetails
                .GroupBy(od => od.ProductVariant.ProductId)
                .OrderByDescending(g => g.Sum(od => od.Quantity))
                .Take(quantity)
                .Select(g => g.Key)
                .ToListAsync();
        }

    }
}
