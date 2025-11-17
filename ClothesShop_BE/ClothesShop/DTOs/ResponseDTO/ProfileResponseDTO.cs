using ClothesShop.Enums;
using ClothesShop.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ClothesShop.DTOs.ResponseDTO
{
    public class ProfileResponseDTO
    {
        public string? Phone { get; set; }
        public string? Fullname { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }
    }
}
