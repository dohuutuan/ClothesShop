namespace ClothesShop.DTOs.ResponseDTO
{
    public class FeedbackResponseDTO
    {
        public string UserName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
