using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Models;
using X.PagedList;

namespace ClothesShop.Repositories.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<List<ProductCardDTO>> GetProductCardByIdsAsync(List<int> productIds);
        Task<List<int>> GetLatestProductIdsAsync(int quantity);
        Task<ProductCardDTO?> GetProductDetail(int productId);
        Task<OrderResponseDTO> CreateOrderAsync(CreateOrderRequest request, int? userId);
        Task<IPagedList<ProductCardDTO>> SearchProductCardAsync(string? keyword, int pageNumber, int pageSize);
        Task<PagedResult<ProductCardDTO>> GetProductsByCategorySlugPaged(
                string categorySlug,
                int pageNumber,
                int pageSize,
                string sort);
    }
}
