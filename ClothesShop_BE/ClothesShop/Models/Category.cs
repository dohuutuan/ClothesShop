using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClothesShop.Models
{
    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        public int? ParentId { get; set; }
        [Required, MaxLength(100)]
        public string Slug { get; set; }
        public string? Image { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public virtual Category ParentCategory { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}
