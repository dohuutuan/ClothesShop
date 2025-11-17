namespace ClothesShop.DTOs.ResponseDTO
{
    public class SizeCartDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int VariantId { get; set; }
        public int Stock { get; set; }
    }
}
