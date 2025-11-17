using System.Text.Json.Serialization;

namespace ClothesShop.DTOs.ResponseDTO
{
    public class ApiResponse<T>
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public T? Data { get; set; }
    }
}
