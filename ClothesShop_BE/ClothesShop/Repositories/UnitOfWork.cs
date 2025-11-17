using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;

namespace ClothesShop.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        public IUserRepository UserRepository { get; }
        public IProductRepository ProductRepository { get; }
        public ICategoryRepository CategoryRepository { get; }
        public ITokenRepository TokenRepository { get; }
        public IOrderDetailRepository OrderDetailRepository { get; }
        public ICartRepository CartRepository { get; }
        public ICartItemRepository CartItemRepository { get; }
        public IFeedbackRepository FeedbackRepository { get; }

        public IProductDescriptionRepository ProductDescriptionRepository { get; }

        private readonly ClothesShopDbContext _context;

        public UnitOfWork(IUserRepository userRepository,
            IProductRepository productRepository,
            ICategoryRepository categoryRepository,
            ITokenRepository tokenRepository,
            IOrderDetailRepository orderDetailRepository,
            IProductDescriptionRepository productDescriptionRepository,
            ICartRepository cartRepository,
            ICartItemRepository cartItemRepository,
            IFeedbackRepository feedbackRepository,
            ClothesShopDbContext context)
        {
            UserRepository = userRepository;
            ProductRepository = productRepository;
            CategoryRepository = categoryRepository;
            TokenRepository = tokenRepository;
            OrderDetailRepository = orderDetailRepository;
            ProductDescriptionRepository = productDescriptionRepository;
            CartRepository = cartRepository;
            CartItemRepository = cartItemRepository;
            FeedbackRepository = feedbackRepository;
            _context = context;
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync(IDbContextTransaction transaction)
        {
            await transaction.CommitAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public async Task RollbackTransactionAsync(IDbContextTransaction transaction)
        {
            await transaction.RollbackAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
