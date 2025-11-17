using AutoMapper;
using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using ClothesShop.Services.Interfaces;

namespace ClothesShop.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public UserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<ProfileResponseDTO> GetUserById(int id)
        {
            return _mapper.Map<ProfileResponseDTO>(await _unitOfWork.UserRepository.GetByIdAsync(id));
        }
    }
}
