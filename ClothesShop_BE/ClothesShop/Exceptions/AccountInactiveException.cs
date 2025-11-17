namespace ClothesShop.Exceptions
{
    public class AccountInactiveException : Exception
    {
        public AccountInactiveException(string? message = "Tài khoản chưa được kích hoạt.")
           : base(message)
        {
        }
    }
}
