using System.ComponentModel.DataAnnotations;

namespace ClothesShop.DTOs.RequestDTO
{
    public class RegisterRequestDTO
    {
        [Required(ErrorMessage = "Full name can not be empty")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Phone can not be empty")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be 10 digits long and contain only numbers")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Email can not be empty")]
        [EmailAddress(ErrorMessage = "Invalid email address format")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Password can not be empty")]
        [MinLength(6, ErrorMessage ="Password must be at least 6 character")]
        [MaxLength(32, ErrorMessage = "Password must be at most 32 characters")]
        public string Password { get; set; }

    }
}
