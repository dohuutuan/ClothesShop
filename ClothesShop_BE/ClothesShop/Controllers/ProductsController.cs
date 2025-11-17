using ClothesShop.DTOs.RequestDTO;
using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using ClothesShop.Services;
using ClothesShop.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using X.PagedList;

namespace ClothesShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly IProductService _productService;
        private readonly ILogger<ProductsController> _logger;
        public ProductsController(ICategoryService categoryService, IProductService productService, ILogger<ProductsController> logger)
        {
            _categoryService = categoryService;
            _productService = productService;
            _logger = logger;
        }
        [HttpGet("by-category")]
        public async Task<IActionResult> GetProductByCategory([FromQuery] string slug,
            [FromQuery] int pageNumber,
            [FromQuery] int pageSize,
            [FromQuery] string sort)
        {
            return Ok(new ApiResponse<PagedResult<ProductCardDTO>>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Products retrieved successfully",
                Data = await _productService.GetProductsByCategorySlugPaged(slug, pageNumber, pageSize, sort)
            });
        }

        /// <summary>
        /// get sub categories by gender
        /// </summary>
        /// <returns></returns>
        [HttpGet("sub-categories")]
        public async Task<IActionResult> GetGenderSubCategories()
        {
            var list1 = await _categoryService.GetSubCategoriesBySlug("ao-nam", 3);
            var list2 = await _categoryService.GetSubCategoriesBySlug("quan-nam", 3);
            var list3 = await _categoryService.GetSubCategoriesBySlug("ao-nu", 3);
            var list4 = await _categoryService.GetSubCategoriesBySlug("quan-nu", 3);
            var list5 = list1.Concat(list2).ToList();
            return Ok(new ApiResponse<GenderCategoryDTO>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Subcategories retrieved successfully.",
                Data = new GenderCategoryDTO
                {
                    Male = list1.Concat(list2).ToList(),
                    Female = list3.Concat(list4).ToList()
                }
            });
        }
        /// <summary>
        /// Get best selling products
        /// </summary>
        /// <param name="quantity"></param>
        /// <returns></returns>
        [HttpGet("best-seller")]
        public async Task<IActionResult> GetBestSeller([FromQuery] int quantity)
        {
            var products = await _productService.GetBestSellersAsync(quantity);
            return Ok(new ApiResponse<List<ProductCardDTO>>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Best selling products retrieved successfully.",
                Data = products
            });
        }
        /// <summary>
        /// Get latest products
        /// </summary>
        /// <param name="quantity"></param>
        /// <returns></returns>
        [HttpGet("latest-products")]
        public async Task<IActionResult> GetLatestProducts([FromQuery] int quantity)
        {
            var products = await _productService.GetLatestProductsAsync(quantity);
            return Ok(new ApiResponse<List<ProductCardDTO>>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Best selling products retrieved successfully.",
                Data = products
            });
        }
        /// <summary>
        /// Get product detail by productId
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpGet("{productId}")]
        public async Task<IActionResult> GetProductDetail(int productId)
        {
            var product = await _productService.GetProductDetail(productId);
            if (product == null)
            {
                return NotFound(new ApiResponse<ProductCardDTO>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Product not found."
                });
            }
            return Ok(new ApiResponse<ProductCardDTO>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Product detail retrieved successfully.",
                Data = product
            });
        }
        /// <summary>
        /// Get product description by productId
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpGet("description/{productId}")]
        public async Task<IActionResult> GetProductDescription(int productId)
        {
            var description = await _productService.GetProductDescription(productId);
            if (description == null)
            {
                return NotFound(new ApiResponse<string>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Product description not found."
                });
            }
            return Ok(new ApiResponse<ProductDescriptionDTO>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Product description retrieved successfully.",
                Data = description
            });
        }
        /// <summary>
        /// Add new item to cart
        /// </summary>
        /// <param name="cartItem"></param>
        /// <returns></returns>
        [HttpPost("cart")]
        public async Task<IActionResult> AddToCart([FromBody] AddCartRequestDTO cartItem)
        {
            if (string.IsNullOrEmpty(cartItem.GuestToken))
            {
                var userId = User.GetUserId();
                if (userId == null)
                {
                    return Unauthorized(new ApiResponse<string>
                    {
                        StatusCode = StatusCodes.Status401Unauthorized,
                        Message = "User not authenticated."
                    });
                }
                cartItem.GuestToken = userId.ToString();
                await _productService.AddToCartByUserId(cartItem);
            }
            await _productService.AddToCartByToken(cartItem);
            return Ok(new ApiResponse<string>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Item added to cart successfully."
            });
        }
        /// <summary>
        /// Get user cart by guest token or user id
        /// </summary>
        /// <param name="guestToken"></param>
        /// <returns></returns>
        [HttpGet("cart")]
        public async Task<IActionResult> GetUserCart([FromQuery] string? guestToken)
        {
            if (string.IsNullOrEmpty(guestToken))
            {
                var userId = User.GetUserId();
                _logger.LogError($"UserId: {userId}");
                if (userId == null)
                {
                    return Unauthorized(new ApiResponse<string>
                    {
                        StatusCode = StatusCodes.Status401Unauthorized,
                        Message = "User not authenticated."
                    });
                }
                var userCart = await _productService.GetUserCart(userId.ToString() is not null ? userId.ToString() : "0");
                return Ok(new ApiResponse<List<UserCartResponseDTO>>
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Cart quantity retrieved successfully.",
                    Data = userCart
                });
            }
            return Ok(new ApiResponse<List<UserCartResponseDTO>>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Cart quantity retrieved successfully.",
                Data = await _productService.GetUserCart(guestToken)
            });
        }
        /// <summary>
        /// Get quantity of products in cart by guest token or user id
        /// </summary>
        /// <param name="guestToken"></param>
        /// <returns></returns>
        [HttpGet("cart/quantity")]
        public async Task<IActionResult> GetCartQuantity([FromQuery] string? guestToken)
        {
            if (string.IsNullOrEmpty(guestToken))
            {
                var userId = User.GetUserId();
                _logger.LogError($"UserId: {userId}");
                if (userId == null)
                {
                    return Unauthorized(new ApiResponse<string>
                    {
                        StatusCode = StatusCodes.Status401Unauthorized,
                        Message = "User not authenticated."
                    });
                }
                return Ok(new ApiResponse<object>
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Cart quantity retrieved successfully.",
                    Data = new { Quantity = await _productService.GetCartQuantity(userId.ToString() is not null ? userId.ToString() : "0") }
                });
            }
            return Ok(new ApiResponse<object>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Cart quantity retrieved successfully.",
                Data = new { Quantity = await _productService.GetCartQuantity(guestToken) }
            });

        }
        /// <summary>
        /// Get product feedback by productId with pagination and sorting options
        /// </summary>
        /// <param name="productId"></param>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="sort">Format: column:direction, where 'column' is the name of the field to sort by (e.g., 'date', 'rating') and 'direction' is either 'asc' for ascending or 'desc' for descending order.</param>
        /// <param name="starRating"></param>
        /// <returns></returns>
        [HttpGet("feedback")]
        public async Task<IActionResult> GetProductFeedback
            ([FromQuery] int productId, [FromQuery] int page, [FromQuery] int limit,
            [FromQuery] string? sort, [FromQuery] int? starRating)
        {
            return Ok(new ApiResponse<FeedbackPagedResponseDTO>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Product feedback retrieved successfully.",
                Data = await _productService.GetFeedbackByProductId(productId, page, limit, sort, starRating)
            });
        }
        [HttpDelete("cart/{cartItemId}")]
        public async Task<IActionResult> DeleteCartItem([FromRoute] int cartItemId)
        {
            if (cartItemId == 0)
            {
                return BadRequest(new ApiResponse<string>
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Invalid cart item ID."
                });
            }
            await _productService.DeleteCartItem(cartItemId);
            return Ok(new ApiResponse<string>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Cart item deleted successfully."
            });
        }
        [HttpDelete("cart")]
        public async Task<IActionResult> DeleteAllCartItems([FromQuery] string guestToken)
        {
            if (guestToken == null)
            {
                var userId = User.GetUserId();
                if (userId == null)
                {
                    return Unauthorized(new ApiResponse<string>
                    {
                        StatusCode = StatusCodes.Status401Unauthorized,
                        Message = "User not authenticated."
                    });
                }
                await _productService.DeleteAllCartItem(userId.ToString() is not null ? userId.ToString() : "0");
                return Ok(new ApiResponse<string>
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "All cart items deleted successfully."
                });
            }
            await _productService.DeleteAllCartItem(guestToken);
            return Ok(new ApiResponse<string>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "All cart items deleted successfully."
            });
        }
        [HttpPost("order")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            var userId = User.GetUserId();
            try
            {
                var order = await _productService.CreateOrderAsync(request, null);
                return Ok(new ApiResponse<OrderResponseDTO>
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Order created successfully.",
                    Data = order
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("search")]
        public async Task<IActionResult> SearchProductsByName([FromQuery] string keyword, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 8)
        {
            var products = await _productService.SearchProductCardAsync(keyword, pageNumber, pageSize);

            var pagedResult = new PagedResult<ProductCardDTO>
            {
                Items = products.ToList(),
                CurrentPage = products.PageNumber,
                PageSize = products.PageSize,
                TotalItems = products.TotalItemCount,
                TotalPages = products.PageCount
            };

            return Ok(new ApiResponse<PagedResult<ProductCardDTO>>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Products retrieved successfully.",
                Data = pagedResult
            });
        }

    }
}
