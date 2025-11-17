using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using ClothesShop.Enums;

namespace ClothesShop.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public int? UserId { get; set; }
        public User? User { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;
        [Column(TypeName = "decimal(10,2)")]
        public decimal ShippingFee { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        [Required]
        public int ProvinceId { get; set; }
        public Province Province { get; set; }
        [Required]
        public int DistrictId { get; set; }

        public District District { get; set; }

        [Required]
        public int WardId { get; set; }
        public Ward Ward { get; set; }
        public string AddressDetail { get; set; }


        public ICollection<OrderDetail> OrderDetails { get; set; }
        public ICollection<Payment> Payments { get; set; }
    }
}
