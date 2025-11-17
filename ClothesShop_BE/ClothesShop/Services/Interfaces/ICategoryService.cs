using ClothesShop.DTOs.ResponseDTO;

namespace ClothesShop.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryResponseDTO>> GetSubCategoriesBySlug(string slug, int quantity);

    }
}
