using ClothesShop.DTOs.RequestDTO;
using ClothesShop.DTOs.ResponseDTO;

namespace ClothesShop.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDTO> Login(LoginDTO login);
        Task<string> Register(RegisterRequestDTO register);
        Task ActivateAccount(string token);
        Task ReactivateAccount(string oldToken);
        Task ResendActiveMail(string account);
        Task<LoginResponseDTO> RefreshToken(string refreshToken);
        Task RevokeRefreshToken(string refreshToken);
        Task ForgotPassword(ForgotPassRequestDTO account); 
        Task ResetPassword(ResetPasswordRequestDTO request);
    }
}
