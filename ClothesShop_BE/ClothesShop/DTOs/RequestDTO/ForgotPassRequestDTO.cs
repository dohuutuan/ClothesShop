using System.ComponentModel.DataAnnotations;

namespace ClothesShop.DTOs.RequestDTO
{
    public class ForgotPassRequestDTO
    {
        [Required(ErrorMessage = "Account is required. Please provide your email or phone number.")]
        public string Account { get; set; }
    }
}
