using ClothesShop.Models;

namespace ClothesShop.DTOs.ResponseDTO
{
    public class FeedbackPagedResponseDTO
    {
        public int Page { get; set; }             
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalItems { get; set; }
        public double AverageRating { get; set; }
        public int RatingCount { get; set; }
        public List<FeedbackResponseDTO> Feedbacks { get; set; }
    }
}
