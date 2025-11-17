using ClothesShop.Enums;
using Microsoft.AspNetCore.Components;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClothesShop.Models
{

    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [MaxLength(20)]
        public string Phone { get; set; }
        [Required]
        [MaxLength(50)]
        public string Fullname { get; set; }

        [EmailAddress]
        [Required]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
        [Required]
        [MaxLength(20)]
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        [Required]
        public UserStatus Status { get; set; }
        public ICollection<Order> Orders { get; set; }
        public ICollection<UserAddress> UserAddresses { get; set; }

    }
}
