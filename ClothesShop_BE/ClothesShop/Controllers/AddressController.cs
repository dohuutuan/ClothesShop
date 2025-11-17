using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Models;
using ClothesShop.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClothesShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressController : ControllerBase
    {
        private readonly IAddressService _addressService;
        public AddressController(IAddressService addressService)
        {
            _addressService = addressService;
        }
        /// <summary>
        /// Get list of provinces
        /// </summary>
        /// <returns></returns>
        [HttpGet("province")]
        public async Task<IActionResult> GetProvinceList()
        {
            return Ok(new ApiResponse<List<AddressResponseDTO>>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Get province list successfully",
                Data = await _addressService.GetProvinceList()
            });
        }
        /// <summary>
        /// Get list of districts by province ID
        /// </summary>
        /// <param name="provinceId"></param>
        /// <returns></returns>
        [HttpGet("district/{provinceId}")]
        public async Task<IActionResult> GetDistrictListByProvince([FromRoute]int provinceId)
        {
            return Ok(new ApiResponse<List<AddressResponseDTO>>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Get district list successfully",
                Data = await _addressService.GetDistrictListByProvince(provinceId)
            });
        }
        /// <summary>
        /// Get list of wards by district ID
        /// </summary>
        /// <param name="districtId"></param>
        /// <returns></returns>
        [HttpGet("ward/{districtId}")]
        public async Task<IActionResult> GetWardListByDistrict([FromRoute] int districtId)
        {
            return Ok(new ApiResponse<List<AddressResponseDTO>>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Get ward list successfully",
                Data = await _addressService.GetWardListByDistrict(districtId)
            });
        }

    }
}
