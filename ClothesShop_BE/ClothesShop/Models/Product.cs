using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ClothesShop.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; }

        [Required, Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public ProductDescription ProductDescription { get; set; }

        public ICollection<ProductVariant> ProductVariants { get; set; }

        public ICollection<ProductImage> ProductImages { get; set; }
        public ICollection<Feedback> Feedbacks { get; set; }

    }
}
