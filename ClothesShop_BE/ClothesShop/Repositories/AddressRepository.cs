using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClothesShop.Repositories
{
    public class AddressRepository : IAddressRepository
    {
        private readonly ClothesShopDbContext _context;
        public AddressRepository(ClothesShopDbContext context)
        {
            _context = context;
        }
        public async Task<List<District>> GetDistrictListByProvince(int provinceId)
        {
            return await _context.Districts.Where(d => d.ProvinceId == provinceId)
                .ToListAsync();
        }

        public async Task<List<Province>> GetProvinceList()
        {
            return await _context.Provinces.ToListAsync();
        }

        public async Task<List<Ward>> GetWardListByDistrict(int districtId)
        {
            return await _context.Wards.Where(d => d.DistrictId == districtId)
                .ToListAsync();
        }
    }
}
