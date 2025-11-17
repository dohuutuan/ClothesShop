using Azure.Core;
using ClothesShop.DTOs.RequestDTO;
using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Enums;
using ClothesShop.Exceptions;
using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using ClothesShop.Services.Interfaces;
using ClothesShop.Utils;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace ClothesShop.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly TokenService _tokenService;
        private readonly EmailService _emailService;
        private readonly ILogger<AuthService> _logger;
        public AuthService(TokenService tokenService,
            ILogger<AuthService> logger,
            EmailService emailService,
            IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _tokenService = tokenService;
            _logger = logger;
            _emailService = emailService;
        }
        // activate account with token
        public async Task ActivateAccount(string token)
        {
            var tokenFound = await _unitOfWork.TokenRepository.FindTokenByValue(token);
            if (tokenFound == null || tokenFound.TokenType != TokenType.ACTIVE_ACCOUNT || tokenFound.IsRevoke)
            {
                throw new InvalidTokenException("Invalid activation token");
            }
            if (tokenFound.ExpireAt < DateTime.UtcNow)
            {
                throw new InvalidTokenException("Đã quá thời gian kích hoạt.");
            }
            var user = await _unitOfWork.UserRepository.GetByIdAsync(tokenFound.UserId);
            if (user == null)
            {
                throw new Exception("User not found for the provided token");
            }
            user.Status = UserStatus.Active;
            _unitOfWork.TokenRepository.RevokeToken(tokenFound.UserId, TokenType.ACTIVE_ACCOUNT);
            await _unitOfWork.SaveChangesAsync();
        }
        // Login method to authenticate user and return JWT tokens
        public async Task<LoginResponseDTO> Login(LoginDTO login)
        {
            var user = await _unitOfWork.UserRepository.FindUserByAccount(login.Account);
            if (user == null || !PasswordHasher.VerifyPassword(login.Password, user.Password))
            {
                throw new UnauthorizedAccessException("Tài khoản hoặc mật khẩu không chính xác.");
            }
            if (user.Status == UserStatus.Inactive)
            {
                throw new AccountInactiveException("Tài khoản của bạn chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản.");
            }
            var tokens = await _tokenService.GenerateToken(user.Id);
            return tokens;
        }
        // resend email when login with inactive account
        public async Task ResendActiveMail(string account)
        {
            var user = await _unitOfWork.UserRepository.FindUserByAccount(account);
            if (user == null)
            {
                throw new AccountInactiveException();
            }
            if (user.Status == UserStatus.Active)
            {
                throw new InvalidTokenException("Tài khoản của bạn đã được kích hoạt trước đó.");
            }
            _unitOfWork.TokenRepository.RevokeToken(user.Id, TokenType.ACTIVE_ACCOUNT);
            var newToken = await _tokenService.GenerateOtherTokens(user.Id, TokenType.ACTIVE_ACCOUNT);
            await _unitOfWork.SaveChangesAsync();
            var encodedToken = WebUtility.UrlEncode(newToken);
            string subject = "Welcome to ClothesShop";
            string htmlBody = $@"
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;'>
        <h2 style='color: #333;'>Welcome, {user.Fullname}!</h2>
        <p style='font-size: 16px; color: #555;'>
            Your account has been created successfully. To activate your account, please click the button below:
        </p>
        <div style='margin: 20px 0; text-align: center;'>
            <a href='http://localhost:5173/account/activate?token={encodedToken}' style='padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 6px; font-size: 16px;'>
                Activate Account
            </a>
        </div>
        <p style='font-size: 14px; color: #888;'>
            If you did not request this, you can ignore this email.
        </p>
        <p style='font-size: 14px; color: #888; text-align: right;'>— ClothesShop Team</p>
    </div>
";
            await _emailService.SendEmailAsync(
                user.Email,
                subject,
                htmlBody
            );
        }
        // resend email when activate fail through email
        public async Task ReactivateAccount(string oldToken)
        {
            var token = await _unitOfWork.TokenRepository.FindTokenByValue(oldToken);
            if (token == null || token.TokenType != TokenType.ACTIVE_ACCOUNT)
            {
                throw new InvalidTokenException("Invalid token for reactivation");
            }
            var user = await _unitOfWork.UserRepository.GetByIdAsync(token.UserId);
            if (user == null)
            {
                throw new Exception("User not found for the provided token");
            }
            if (user.Status == UserStatus.Active)
            {
                throw new InvalidTokenException("Tài khoản của bạn đã được kích hoạt trước đó.");
            }
            _unitOfWork.TokenRepository.RevokeToken(token.UserId, TokenType.ACTIVE_ACCOUNT);
            var newToken = await _tokenService.GenerateOtherTokens(user.Id, TokenType.ACTIVE_ACCOUNT);
            await _unitOfWork.SaveChangesAsync();
            var encodedToken = WebUtility.UrlEncode(newToken);
            string subject = "Welcome to ClothesShop";
            string htmlBody = $@"
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;'>
        <h2 style='color: #333;'>Welcome, {user.Fullname}!</h2>
        <p style='font-size: 16px; color: #555;'>
            Your account has been created successfully. To activate your account, please click the button below:
        </p>
        <div style='margin: 20px 0; text-align: center;'>
            <a href='http://localhost:5173/account/activate?token={encodedToken}' style='padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 6px; font-size: 16px;'>
                Activate Account
            </a>
        </div>
        <p style='font-size: 14px; color: #888;'>
            If you did not request this, you can ignore this email.
        </p>
        <p style='font-size: 14px; color: #888; text-align: right;'>— ClothesShop Team</p>
    </div>
";
            await _emailService.SendEmailAsync(
                user.Email,
                subject,
                htmlBody
            );
        }
        // Register method to create a new user account
        public async Task<string> Register(RegisterRequestDTO register)
        {
            var existedPhone = await _unitOfWork.UserRepository.FindUserByAccount(register.Phone);
            var existedEmail = await _unitOfWork.UserRepository.FindUserByAccount(register.Email);
            if (existedPhone != null)
            {
                throw new UniqueFieldExistedException("Số điện thoại này đã được sử dụng");
            }
            if (existedEmail != null)
            {
                throw new UniqueFieldExistedException("Email này đã được sử dụng");
            }
            var newUser = new User
            {
                Phone = register.Phone,
                Fullname = register.FullName,
                Email = register.Email,
                Password = PasswordHasher.HashPassword(register.Password),
                Role = "Customer",
                Status = UserStatus.Inactive
            };
            try
            {
                await _unitOfWork.UserRepository.AddAsync(newUser);
                await _unitOfWork.SaveChangesAsync();
                var token = await _tokenService.GenerateOtherTokens(newUser.Id, TokenType.ACTIVE_ACCOUNT);
                await _unitOfWork.SaveChangesAsync();
                var encodedToken = WebUtility.UrlEncode(token);
                string subject = "Welcome to ClothesShop";
                string htmlBody = $@"
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;'>
        <h2 style='color: #333;'>Welcome, {newUser.Fullname}!</h2>
        <p style='font-size: 16px; color: #555;'>
            Your account has been created successfully. To activate your account, please click the button below:
        </p>
        <div style='margin: 20px 0; text-align: center;'>
            <a href='http://localhost:5173/account/activate?token={encodedToken}' style='padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 6px; font-size: 16px;'>
                Activate Account
            </a>
        </div>
        <p style='font-size: 14px; color: #888;'>
            If you did not request this, you can ignore this email.
        </p>
        <p style='font-size: 14px; color: #888; text-align: right;'>— ClothesShop Team</p>
    </div>
";
                await _emailService.SendEmailAsync(
                    newUser.Email,
                    subject,
                    htmlBody
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while registering user");
                return "An unexpected error occurred. Please try again later.";
            }
            return "User registered successfully, email sent";
        }
        // refresh token method to generate new access and refresh tokens
        public async Task<LoginResponseDTO> RefreshToken(string refreshToken)
        {
            var token = await _unitOfWork.TokenRepository.FindTokenByValue(refreshToken);
            if (token == null || token.TokenType != TokenType.REFRESH
                || token.IsRevoke || token.ExpireAt < DateTime.UtcNow)
            {
                throw new InvalidTokenException("Invalid refresh token");
            }
            await _unitOfWork.TokenRepository.RevokeRefreshToken(token.Token);
            var newTokens = await _tokenService.GenerateToken(token.UserId);
            return newTokens;
        }

        public async Task RevokeRefreshToken(string refreshToken)
        {
            var token = await _unitOfWork.TokenRepository.RevokeRefreshToken(refreshToken);
            if (token != null)
            {
                await _unitOfWork.SaveChangesAsync();
            }
        }
        [HttpPost("forgot-password")]
        public async Task ForgotPassword(ForgotPassRequestDTO account)
        {
            var user = await _unitOfWork.UserRepository.FindUserByAccount(account.Account);
            if (user != null)
            {
                _unitOfWork.TokenRepository.RevokeToken(user.Id, TokenType.FORGOT_PASSWORD);
                var token = await _tokenService.GenerateOtherTokens(user.Id, TokenType.FORGOT_PASSWORD);
                var encodedToken = WebUtility.UrlEncode(token);
                string subject = "Reset password";
                string htmlBody = $@"
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;'>
        <h2 style='color: #333;'>Hello, {user.Fullname}</h2>
        <p style='font-size: 16px; color: #555;'>
            We received a request to reset your password. To proceed, please click the button below:
        </p>
        <div style='margin: 20px 0; text-align: center;'>
            <a href='http://localhost:5173/reset-password?token={encodedToken}' style='padding: 12px 24px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 6px; font-size: 16px;'>
                Reset Password
            </a>
        </div>
        <p style='font-size: 14px; color: #888;'>
            If you didn’t request a password reset, please ignore this email. Your password will remain unchanged.
        </p>
        <p style='font-size: 14px; color: #888; text-align: right;'>— ClothesShop Team</p>
    </div>
";
                await _emailService.SendEmailAsync(
                    user.Email,
                    subject,
                    htmlBody
                );
                await _unitOfWork.SaveChangesAsync();
            }
        }
        [HttpPost("reset-password")]
        public async Task ResetPassword(ResetPasswordRequestDTO request)
        {
            var tokenFound = await _unitOfWork.TokenRepository.FindTokenByValue(request.Token);
            if (string.IsNullOrEmpty(request.Token) || tokenFound.TokenType != TokenType.FORGOT_PASSWORD || tokenFound.IsRevoke)
            {
                throw new InvalidTokenException("Invalid reset password token");
            }
            if (tokenFound.ExpireAt < DateTime.UtcNow)
            {
                throw new InvalidTokenException("Đã quá thời gian đặt lại mật khẩu.");
            }
            var user = await _unitOfWork.UserRepository.GetByIdAsync(tokenFound.UserId);
            if (user == null)
            {
                throw new Exception("User not found for the provided token");
            }
            user.Password = PasswordHasher.HashPassword(request.NewPassword);
            await _unitOfWork.UserRepository.UpdateAsync(user);
            _unitOfWork.TokenRepository.RevokeToken(tokenFound.UserId, TokenType.FORGOT_PASSWORD);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
