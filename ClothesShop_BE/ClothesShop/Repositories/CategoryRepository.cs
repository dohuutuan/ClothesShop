using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClothesShop.Repositories
{
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        public CategoryRepository(ClothesShopDbContext context) : base(context)
        {
        }
        public async Task<IEnumerable<Category>> FindSubCategoryBySlug(string slug, int quantity)
        {
            var parent = await _context.Categories
        .Where(c => c.Slug == slug)
        .FirstOrDefaultAsync();

            if (parent == null) return Enumerable.Empty<Category>();

            // Tìm các category có ParentID trỏ đến category cha
            return await _context.Categories
                .Where(c => c.ParentId == parent.Id)
                .Take(quantity)
                .ToListAsync();
        }
    }
}
