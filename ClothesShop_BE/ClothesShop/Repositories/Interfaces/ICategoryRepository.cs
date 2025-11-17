using ClothesShop.Models;

namespace ClothesShop.Repositories.Interfaces
{
    public interface ICategoryRepository : IRepository<Category>
    {
        Task<IEnumerable<Category>> FindSubCategoryBySlug(string slug, int quantity);
    }
}
