using System.ComponentModel.DataAnnotations;

namespace ClothesShop.Models
{
    public class Ward
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        public int DistrictId { get; set; }
        public virtual District District { get; set; }
        public ICollection<Order> Orders { get; set; }
        public ICollection<UserAddress> UserAddresses { get; set; }

    }
}