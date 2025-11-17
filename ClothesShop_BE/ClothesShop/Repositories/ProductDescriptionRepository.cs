using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClothesShop.Repositories
{
    public class ProductDescriptionRepository : Repository<ProductDescription>, IProductDescriptionRepository
    {
        public ProductDescriptionRepository(ClothesShopDbContext context) : base(context)
        {
        }

    }
}
