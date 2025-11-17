using AutoMapper;
using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Models;

namespace ClothesShop.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, ProfileResponseDTO>();
            CreateMap<Category, CategoryResponseDTO>();
            CreateMap<ProductDescription, ProductDescriptionDTO>();
            CreateMap<District, AddressResponseDTO>();
            CreateMap<Province, AddressResponseDTO>();
            CreateMap<Ward, AddressResponseDTO>();
        }
    }
}
