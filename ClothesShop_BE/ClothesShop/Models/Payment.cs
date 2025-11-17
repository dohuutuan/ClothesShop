using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using ClothesShop.Enums;

namespace ClothesShop.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }
        public Order Order { get; set; }

        public DateTime PaymentDate { get; set; } = DateTime.Now;

        [Required, Column(TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        public string? PaymentMethod { get; set; }

        public PaymentStatus? Status { get; set; }
    }
}
