namespace ClothesShop.DTOs.ResponseDTO
{
    public class UserCartResponseDTO
    {
        public int CartId { get; set; }
        public int CartItemId { get; set; }
        public int VariantId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public List<ColorCartDTO> Colors { get; set; } 
        public string Image { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice => Price * Quantity;
    }
}
