namespace ClothesShop.DTOs.ResponseDTO
{
    public class CreateOrderRequest
    {
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public int Province { get; set; }
        public int District { get; set; }
        public int Ward { get; set; }
        public string PaymentMethod { get; set; }
        public List<int> Products { get; set; } // List of CartItemIDs
    }

}
