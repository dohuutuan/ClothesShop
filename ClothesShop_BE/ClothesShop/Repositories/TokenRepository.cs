using ClothesShop.Enums;
using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClothesShop.Repositories
{
    public class TokenRepository : Repository<Tokens>, ITokenRepository
    {
        public TokenRepository(ClothesShopDbContext context) : base(context)
        {
        }
        public async Task<Tokens?> FindTokenByValue(string tokenValue)
        {
            return await _context.Tokens
                .FirstOrDefaultAsync(t => t.Token == tokenValue);
        }

        public async Task<Tokens?> RevokeRefreshToken(string refreshToken)
        {
            var token = await _context.Tokens
                .FirstOrDefaultAsync(t => t.Token == refreshToken
                                       && t.TokenType == TokenType.REFRESH
                                       && !t.IsRevoke);
            if (token != null)
            {
                token.IsRevoke = true;
            }
            return token;
        }

        public void RevokeToken(int userId, TokenType type)
        {
             _context.Tokens
                .Where(t => t.UserId == userId && t.TokenType == type && !t.IsRevoke)
                .ToList()
                .ForEach(t => t.IsRevoke = true);
        }
    }
}
