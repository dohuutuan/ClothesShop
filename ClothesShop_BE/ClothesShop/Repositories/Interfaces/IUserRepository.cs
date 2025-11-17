using ClothesShop.Models;

namespace ClothesShop.Repositories.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> FindUserByAccount(string account);
    }
}
