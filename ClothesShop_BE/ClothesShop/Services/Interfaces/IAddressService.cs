using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Models;

namespace ClothesShop.Services.Interfaces
{
    public interface IAddressService
    {
        Task<List<AddressResponseDTO>> GetProvinceList();
        Task<List<AddressResponseDTO>> GetDistrictListByProvince(int provinceId);
        Task<List<AddressResponseDTO>> GetWardListByDistrict(int districtId);
    }
}
