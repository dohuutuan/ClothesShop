using ClothesShop.Models;

namespace ClothesShop.Repositories.Interfaces
{
    public interface IAddressRepository
    {
        Task<List<Province>> GetProvinceList();
        Task<List<District>> GetDistrictListByProvince(int provinceId);
        Task<List<Ward>> GetWardListByDistrict(int districtId);
    }
}
