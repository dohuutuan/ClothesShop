using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Models;

namespace ClothesShop.Repositories.Interfaces
{
    public interface ICartItemRepository : IRepository<CartItem>
    {
        Task<CartItem?> GetCartItemByVariantId(int variantId, int cartId);
        Task<int> GetCartQuantity(string guestToken);
        Task<List<UserCartResponseDTO>> GetUserCart(string guestToken);
        Task DeleteAllCartItem(int cartId);
    }
}
