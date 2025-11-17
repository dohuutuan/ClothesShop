namespace ClothesShop.Repositories.Interfaces
{
    public interface IOrderDetailRepository
    {
        Task<List<int>> GetTopSellingProductIdsAsync(int quantity);
    }
}
