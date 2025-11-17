using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Exceptions;
using System.Net;
using System.Text.Json;

namespace ClothesShop.Middlewares
{
    public class CustomExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<CustomExceptionMiddleware> _logger;

        public CustomExceptionMiddleware(RequestDelegate next, ILogger<CustomExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception caught in middleware.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            int statusCode;
            string message;

            switch (exception)
            {
                case AccountInactiveException:
                    statusCode = (int)HttpStatusCode.Forbidden; // 403
                    message = exception.Message;
                    break;
                case UnauthorizedAccessException:
                    statusCode = (int)HttpStatusCode.Unauthorized; // 401
                    message = exception.Message;
                    break;
                case UniqueFieldExistedException:
                    statusCode = (int)HttpStatusCode.Conflict; // 409
                    message = exception.Message;
                    break;
                case InvalidTokenException:
                    statusCode = (int)HttpStatusCode.Unauthorized; // 401
                    message = exception.Message;
                    break;
                default:
                    statusCode = (int)HttpStatusCode.InternalServerError; // 500
                    message = exception.Message;
                    break;
            }

            var apiResponse = new ApiResponse<object>
            {
                StatusCode = statusCode,
                Message = message,
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var json = JsonSerializer.Serialize(apiResponse, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
            await context.Response.WriteAsync(json);
        }
    }
}
