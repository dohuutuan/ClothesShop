using System.ComponentModel.DataAnnotations;

namespace ClothesShop.Models
{
    public class ProductImage
    {
        [Key]
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int ColorId { get; set; }
        public Color Color { get; set; }
        public string Image { get; set; }
    }
}
