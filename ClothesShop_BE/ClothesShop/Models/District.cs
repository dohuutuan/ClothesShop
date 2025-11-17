using System.ComponentModel.DataAnnotations;

namespace ClothesShop.Models
{
    public class District
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        public int ProvinceId { get; set; }
        public virtual Province Province { get; set; }
        public virtual ICollection<Ward> Wards { get; set; }
        public ICollection<Order> Orders { get; set; }
        public ICollection<UserAddress> UserAddresses { get; set; }

    }
}
