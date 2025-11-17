using AutoMapper;
using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Repositories.Interfaces;
using ClothesShop.Services.Interfaces;

namespace ClothesShop.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CategoryResponseDTO>> GetSubCategoriesBySlug(string slug, int quantity)
        {
            return _mapper.Map<IEnumerable<CategoryResponseDTO>>
                (await _unitOfWork.CategoryRepository.FindSubCategoryBySlug(slug, quantity));
        }
    }
}
