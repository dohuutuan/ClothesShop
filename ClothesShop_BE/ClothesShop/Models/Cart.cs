using System.ComponentModel.DataAnnotations;

namespace ClothesShop.Models
{
    public class Cart
    {
        [Key]
        public int CartID { get; set; }
        public int? UserID { get; set; }
        [MaxLength(64)]
        public string? GuestToken { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
