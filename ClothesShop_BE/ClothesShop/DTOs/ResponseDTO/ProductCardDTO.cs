namespace ClothesShop.DTOs.ResponseDTO
{
    public class ProductCardDTO
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }

        public RatingDTO Rating { get; set; } = null!;
        public List<ColorDTO> Colors { get; set; } = new();
    }
}
