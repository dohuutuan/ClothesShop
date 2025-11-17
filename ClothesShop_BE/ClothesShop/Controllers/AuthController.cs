using ClothesShop.Configurations;
using ClothesShop.DTOs.RequestDTO;
using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Models;
using ClothesShop.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ClothesShop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly JwtSettings _jwtSettings;
        public AuthController(IAuthService authService, JwtSettings jwtSettings)
        {
            _authService = authService;
            _jwtSettings = jwtSettings;
        }

        /// <summary>
        /// Login API for user authentication
        /// </summary>
        /// <param name="login">Email or phone number and password</param>
        /// <returns>
        /// returns JWT tokens if login is successful, otherwise returns an Unauthorized response
        /// </returns>
        /// /// <response code="200">Login successfully</response>
        /// <response code="401">Invalid account or password</response>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO login)
        {
            var user = await _authService.Login(login);
            Response.Cookies.Append("refreshToken", user.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(_jwtSettings.RefreshExpired)
            });
            return Ok(new ApiResponse<object>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Login successful",
                Data = new { user.AccessToken }
            });
        }
        /// <summary>
        /// Allow user to register a new account
        /// </summary>
        /// <param name="register"></param>
        /// <returns></returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO register)
        {
            var response = await _authService.Register(register);
            return Ok(new ApiResponse<string>
            {
                StatusCode = StatusCodes.Status201Created,
                Message = response,
            });

        }
        /// <summary>
        /// Activate user account using a token sent via email after registration
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        [HttpPatch("activate")]
        public async Task<IActionResult> ActivateAccount([FromQuery] string token)
        {
            await _authService.ActivateAccount(token);
            return Ok(new ApiResponse<string>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Account activated successfully"
            });
        }
        /// <summary>
        /// Resend email when login with an inactivated account
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        [HttpPost("activate")]
        public async Task<IActionResult> ActivateToLogin([FromQuery] string account)
        {
            await _authService.ResendActiveMail(account);
            return Ok(new ApiResponse<string>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Email xác thực đã được gửi. Vui lòng kiểm tra email để xác thực tài khoản."
            });
        }

        /// <summary>
        /// Re-activate an account that was previously inactive using the old token
        /// </summary>
        /// <param name="oldToken"></param>
        /// <returns></returns>
        [HttpPost("re-activate")]
        public async Task<IActionResult> ReactivateAccount([FromQuery] string oldToken)
        {
            await _authService.ReactivateAccount(oldToken);
            return Ok(new ApiResponse<string>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Email xác thực đã được gửi. Vui lòng kiểm tra email để xác thực tài khoản."
            });
        }
        /// <summary>
        /// Allow user to refresh their JWT token using a valid refresh token
        /// </summary>
        /// <returns></returns>
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var oldRefreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(oldRefreshToken))
            {
                return Unauthorized(new ApiResponse<object>
                {
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "Missing refresh token"
                });
            }
            var tokens = await _authService.RefreshToken(oldRefreshToken);
            Response.Cookies.Append("refreshToken", tokens.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });
            return Ok(new ApiResponse<object>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Token refreshed successfully",
                Data = new { tokens.AccessToken }
            });
        }
        /// <summary>
        /// logout user by revoking the refresh token and deleting it from cookies
        /// </summary>
        /// <returns></returns>
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (!string.IsNullOrEmpty(refreshToken))
            {
                await _authService.RevokeRefreshToken(refreshToken);
            }
            Response.Cookies.Delete("refreshToken", new CookieOptions
            {
                Secure = true,
                SameSite = SameSiteMode.None,
            });
            return Ok(new ApiResponse<object>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Logout successful"
            });
        }
        /// <summary>
        /// send email to user to reset password
        /// </summary>
        /// <param name="account"></param>
        /// <returns></returns>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPassRequestDTO dto)
        {
            await _authService.ForgotPassword(dto);
            return Ok(new ApiResponse<string>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Email reset password đã được gửi. Vui lòng kiểm tra email để đặt lại mật khẩu."
            });
        }
        /// <summary>
        /// reset user password using a token sent via email
        /// </summary>
        /// <param name="token"></param>
        /// <param name="newPassword"></param>
        /// <returns></returns>
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequestDTO request)
        {
            await _authService.ResetPassword(request);
            return Ok(new ApiResponse<string>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Mật khẩu đã được đặt lại thành công."
            });
        }
    }
}
