namespace ClothesShop.DTOs.ResponseDTO
{
    public class OrderResponseDTO
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal ShippingFee { get; set; }
        public string Province { get; set; }
        public string District { get; set; }
        public string Ward { get; set; }
        public string AddressDetail { get; set; }
        public List<OrderedProductDTO> Products { get; set; }
    }
}
