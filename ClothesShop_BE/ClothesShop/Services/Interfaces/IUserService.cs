using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Models;

namespace ClothesShop.Services.Interfaces
{
    public interface IUserService
    {
        public Task<ProfileResponseDTO>  GetUserById(int id);
    }
}
