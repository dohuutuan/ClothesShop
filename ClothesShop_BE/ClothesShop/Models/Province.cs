using System.ComponentModel.DataAnnotations;

namespace ClothesShop.Models
{
    public class Province
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        public virtual ICollection<District> Districts { get; set; }
        public ICollection<Order> Orders { get; set; }
        public ICollection<UserAddress> UserAddresses { get; set; }

    }
}
