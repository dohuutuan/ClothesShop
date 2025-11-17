using AutoMapper;
using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ClothesShop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Unauthorized(new ApiResponse<string>
                {
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "User not authenticated.",
                });
            }

            var user = await _userService.GetUserById(userId.Value);
            if (user == null)
            {
                return NotFound(new ApiResponse<string>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "User not found.",
                });
            }
            return Ok(new ApiResponse<ProfileResponseDTO>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "User profile retrieved successfully.",
                Data = user
            });
        }

    }
}
