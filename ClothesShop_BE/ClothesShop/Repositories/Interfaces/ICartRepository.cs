using ClothesShop.Models;

namespace ClothesShop.Repositories.Interfaces
{
    public interface ICartRepository : IRepository<Cart>
    {
        Task<Cart?> GetCartByTokenOrId(string guestToken);
    }
}
