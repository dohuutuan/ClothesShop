using ClothesShop.DTOs.RequestDTO;
using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using X.PagedList;

namespace ClothesShop.Services.Interfaces
{
    public interface IProductService
    {
        Task<List<ProductCardDTO>> GetBestSellersAsync(int quantity);
        Task<List<ProductCardDTO>> GetLatestProductsAsync(int quantity);
        Task<ProductCardDTO?> GetProductDetail(int productId);
        Task<ProductDescriptionDTO?> GetProductDescription(int productId);
        Task AddToCartByUserId(AddCartRequestDTO data);
        Task AddToCartByToken(AddCartRequestDTO data);
        Task<int> GetCartQuantity(string guestToken);
        Task<FeedbackPagedResponseDTO> GetFeedbackByProductId
            (int productId, int page, int limit, string? sort, int? starRating);
        Task<List<UserCartResponseDTO>> GetUserCart(string guestToken);
        Task DeleteCartItem(int cartItemId);
        Task DeleteAllCartItem(string guestToken);
        Task<OrderResponseDTO> CreateOrderAsync(CreateOrderRequest request, int? userId);
        Task<IPagedList<ProductCardDTO>> SearchProductCardAsync(string? keyword, int pageNumber, int pageSize);
        Task<PagedResult<ProductCardDTO>> GetProductsByCategorySlugPaged(
                string categorySlug,
                int pageNumber,
                int pageSize,
                string sort);
    }
}
