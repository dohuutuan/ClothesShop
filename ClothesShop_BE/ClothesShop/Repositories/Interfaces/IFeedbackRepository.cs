using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Models;

namespace ClothesShop.Repositories.Interfaces
{
    public interface IFeedbackRepository : IRepository<Feedback>
    {
        Task<FeedbackPagedResponseDTO> GetFeedbackByProductId(
            int productId, int page, int limit, string? sort, int? starRating);
    }
}
