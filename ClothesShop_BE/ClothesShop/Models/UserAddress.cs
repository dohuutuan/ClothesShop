using System.ComponentModel.DataAnnotations;

namespace ClothesShop.Models
{
    public class UserAddress
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int UserId { get; set; }
        public User User { get; set; }
        [Required]
        public int ProvinceId { get; set; }
        public Province Province { get; set; }
        [Required]
        public int DistrictId { get; set; }
        public District District { get; set; }
        [Required]
        public int WardId { get; set; }
        public Ward Ward { get; set; }
        [Required]
        public string AddressDetail { get; set; }
    }
}
