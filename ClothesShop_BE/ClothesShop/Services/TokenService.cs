using ClothesShop.Configurations;
using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Enums;
using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ClothesShop.Services
{
    public class TokenService
    {
        private readonly JwtSettings _jwtSettings;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public TokenService(JwtSettings jwtSettings, IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _jwtSettings = jwtSettings;
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }
        public async Task<LoginResponseDTO> GenerateToken(int userId)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);

            var accessTokenClaims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var accessToken = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: accessTokenClaims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.AccessExpired),
                signingCredentials: creds
            );
            var refreshToken = await GenerateRefreshToken(user.Id, _jwtSettings.RefreshExpired);
            await _unitOfWork.SaveChangesAsync();
            var tokenHandler = new JwtSecurityTokenHandler();

            return new LoginResponseDTO
            {
                AccessToken = tokenHandler.WriteToken(accessToken),
                RefreshToken = refreshToken
            };
        }

        public async Task<string> GenerateRefreshToken(int userId, int expireInDay)
        {
            var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            var token = new Tokens
            {
                UserId = userId,
                Token = refreshToken,
                TokenType = TokenType.REFRESH,
                CreatedAt = DateTime.UtcNow,
                ExpireAt = DateTime.UtcNow.AddDays(expireInDay),
                IsRevoke = false,
                ReplaceByToken = null
            };
            await _unitOfWork.TokenRepository.AddAsync(token);
            return refreshToken;
        }

        public async Task<string> GenerateOtherTokens(int userId, TokenType type)
        {
            int expireInMinutes = type switch
            {
                TokenType.ACTIVE_ACCOUNT => _configuration.GetValue<int>("TokenSettings:ActiveToken"),
                TokenType.FORGOT_PASSWORD => _configuration.GetValue<int>("TokenSettings:ResetPasswordToken"),
                _ => 10 
            };
            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            var newToken = new Tokens
            {
                UserId = userId,
                Token = token,
                TokenType = type,
                CreatedAt = DateTime.UtcNow,
                ExpireAt = DateTime.UtcNow.AddMinutes(expireInMinutes),
                IsRevoke = false,
                ReplaceByToken = null
            };
            await _unitOfWork.TokenRepository.AddAsync(newToken);
            return token;
        }
    }
}

