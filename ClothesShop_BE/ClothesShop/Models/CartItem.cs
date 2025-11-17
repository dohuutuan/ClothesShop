using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ClothesShop.Models
{
    public class CartItem
    {
        [Key]
        public int CartItemID { get; set; }
        public int CartID { get; set; }
        public virtual Cart Cart { get; set; } = null!;
        public int VariantId { get; set; }
        public virtual ProductVariant Variant { get; set; } = null!;
        public int Quantity { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
