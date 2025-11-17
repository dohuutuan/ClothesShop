using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClothesShop.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        private readonly ClothesShopDbContext _context;
        public UserRepository(ClothesShopDbContext context) : base(context)
        {
            _context = context;
        }
        public async Task<User> FindUserByAccount(string account)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Phone == account || u.Email == account);
        }
    }
}
