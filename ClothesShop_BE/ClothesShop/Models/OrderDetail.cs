using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ClothesShop.Models
{
    public class OrderDetail
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }
        public Order Order { get; set; }

        [Required]
        [ForeignKey("ProductVariant")]
        public int VariantId { get; set; }
        public ProductVariant ProductVariant { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required, Column(TypeName = "decimal(10,2)")]
        public decimal UnitPrice { get; set; }
    }
}
