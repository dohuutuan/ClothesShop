namespace ClothesShop.DTOs.ResponseDTO
{
    public class ColorCartDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<SizeCartDTO> Sizes { get; set; }
    }
}
