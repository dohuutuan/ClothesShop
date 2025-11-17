using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClothesShop.Models
{
    public class Color
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
        [Required]
        public string Image { get; set; }
        public ICollection<ProductVariant>? ProductVariants { get; set; }

        public ICollection<ProductImage>? ProductImages { get; set; }
    }
}
