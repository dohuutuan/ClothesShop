using System.ComponentModel.DataAnnotations;

namespace ClothesShop.Models
{
    public class ProductVariant
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int? ColorId { get; set; }
        public Color? Color { get; set; }
        public int? SizeId { get; set; }
        public Size? Size { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public bool IsActive { get; set; }
        public ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
