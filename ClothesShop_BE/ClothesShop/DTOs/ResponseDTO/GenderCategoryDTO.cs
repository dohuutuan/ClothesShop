namespace ClothesShop.DTOs.ResponseDTO
{
    public class GenderCategoryDTO
    {
        public IEnumerable<CategoryResponseDTO> Male { get; set; } 
        public IEnumerable<CategoryResponseDTO> Female { get; set; }
    }
}
