using System.ComponentModel.DataAnnotations;

namespace ClothesShop.DTOs.RequestDTO
{
    public class AddCartRequestDTO
    {
        public string? GuestToken { get; set; }
        [Required(ErrorMessage = "Variant ID is required.")]
        public int VariantId { get; set; }
        [Required(ErrorMessage = "Quantity is required.")]
        public int Quantity { get; set; }
    }
}
