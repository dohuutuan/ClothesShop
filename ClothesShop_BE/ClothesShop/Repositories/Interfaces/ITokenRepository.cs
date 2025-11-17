using ClothesShop.Enums;
using ClothesShop.Models;

namespace ClothesShop.Repositories.Interfaces
{
    public interface ITokenRepository : IRepository<Tokens>
    {
        Task<Tokens?> FindTokenByValue(string tokenValue);
        void RevokeToken(int userId, TokenType type);
        Task<Tokens?> RevokeRefreshToken(string refreshToken);
        
    }
}
