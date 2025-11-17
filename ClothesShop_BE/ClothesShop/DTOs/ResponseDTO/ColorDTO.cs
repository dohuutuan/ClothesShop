namespace ClothesShop.DTOs.ResponseDTO
{
    public class ColorDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string ThumbnailUrl { get; set; } = null!;
        public List<string> Images { get; set; } = new();
        public List<SizeDTO> Sizes { get; set; } = new();
    }
}
