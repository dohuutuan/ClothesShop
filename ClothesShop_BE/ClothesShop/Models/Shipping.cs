using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClothesShop.Models
{
    public class Shipping
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal MaxDistanceKm { get; set; }
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Fee { get; set; }
    }
}
