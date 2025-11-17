using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClothesShop.Repositories
{
    public class CartRepository : Repository<Cart>, ICartRepository
    {
        public CartRepository(ClothesShopDbContext context) : base(context)
        {
        }

        public async Task<Cart?> GetCartByTokenOrId(string guestToken)
        {
            if (int.TryParse(guestToken, out int userId))
            {
                return await _context.Carts.FirstOrDefaultAsync(c => c.UserID == userId);
            }

            return await _context.Carts.FirstOrDefaultAsync(c =>
                c.GuestToken == guestToken);
        }
    }
}
