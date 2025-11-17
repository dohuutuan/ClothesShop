using ClothesShop.Enums;
using System.ComponentModel.DataAnnotations;

namespace ClothesShop.Models
{
    public class Tokens
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int UserId { get; set; }
        public User User { get; set; }
        [Required]
        public string Token { get; set; }
        [Required]
        public TokenType TokenType { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime ExpireAt { get; set; }
        public bool IsRevoke { get; set; }
        public string? ReplaceByToken { get; set; }
    }
}
