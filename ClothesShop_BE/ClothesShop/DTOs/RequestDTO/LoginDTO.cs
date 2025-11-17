using System.ComponentModel.DataAnnotations;

namespace ClothesShop.DTOs.RequestDTO
{
    /// <summary>
    /// Login request data containing user credentials.
    /// </summary>
    public class LoginDTO
    {
        /// <summary>
        /// The user's email or phone.
        /// </summary>
        [Required(ErrorMessage = "Account is required")]
        public string Account { get; set; }

        /// <summary>
        /// The user's password.
        /// </summary>
        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
        [MaxLength(16, ErrorMessage = "Password must be less than 16 characters long")]
        public string Password { get; set; }
    }
}
