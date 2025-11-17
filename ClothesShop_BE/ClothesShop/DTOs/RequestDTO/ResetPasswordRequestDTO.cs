using System.ComponentModel.DataAnnotations;

namespace ClothesShop.DTOs.RequestDTO
{
    public class ResetPasswordRequestDTO
    {
        [Required(ErrorMessage = "Token is required.")]
        public string Token { get; set; }
        [Required(ErrorMessage = "New password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 character")]
        [MaxLength(32, ErrorMessage = "Password must be at most 32 characters")]
        public string NewPassword { get; set; }
        [Required(ErrorMessage = "Confirm password is required.")]
        [Compare("NewPassword", ErrorMessage = "Confirm password does not match the new password.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 character")]
        [MaxLength(32, ErrorMessage = "Password must be at most 32 characters")]
        public string ConfirmPassword { get; set; }
    }
}
