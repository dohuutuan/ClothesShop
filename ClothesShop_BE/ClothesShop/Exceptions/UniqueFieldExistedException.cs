namespace ClothesShop.Exceptions
{
    public class UniqueFieldExistedException : Exception
    {
        public UniqueFieldExistedException(string? message = "Unique value conflict")
            : base(message)
        {
        }
    }
}


