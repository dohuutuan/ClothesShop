using AutoMapper;
using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using ClothesShop.Services.Interfaces;
using System.Collections.Generic;

namespace ClothesShop.Services
{
    public class AddressService : IAddressService
    {
        private readonly IAddressRepository _addressRepository;
        private readonly IMapper _mapper;
        public AddressService(IAddressRepository addressRepository, IMapper mapper)
        {
            _addressRepository = addressRepository;
            _mapper = mapper;
        }
        public async Task<List<AddressResponseDTO>> GetDistrictListByProvince(int provinceId)
        {
            return _mapper.Map<List<AddressResponseDTO>>(await _addressRepository.GetDistrictListByProvince(provinceId));
        }

        public async Task<List<AddressResponseDTO>> GetProvinceList()
        {
            return _mapper.Map<List<AddressResponseDTO>>(await _addressRepository.GetProvinceList());
        }

        public async Task<List<AddressResponseDTO>> GetWardListByDistrict(int districtId)
        {
            return _mapper.Map<List<AddressResponseDTO>>(await _addressRepository.GetWardListByDistrict(districtId));
        }
    }
}
