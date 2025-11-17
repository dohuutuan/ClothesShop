using Microsoft.EntityFrameworkCore;

namespace ClothesShop.Models
{
    public class ClothesShopDbContext : DbContext
    {
        public ClothesShopDbContext(DbContextOptions<ClothesShopDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ProductDescription> ProductDescriptions { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Province> Provinces { get; set; }
        public DbSet<District> Districts { get; set; }
        public DbSet<Ward> Wards { get; set; }
        public DbSet<Color> Colors { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<UserAddress> UserAddresses { get; set; }
        public DbSet<Shipping> Shippings { get; set; }
        public DbSet<Tokens> Tokens { get; set; }
        public DbSet<Size> Sizes { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //var builder = new ConfigurationBuilder()
            //    .SetBasePath(Directory.GetCurrentDirectory())
            //    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            //IConfigurationRoot configuration = builder.Build();
            //optionsBuilder.UseSqlServer(configuration.GetConnectionString("ClothesShop"));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Phone).IsUnique();
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.Status).HasConversion<string>();
            });

            modelBuilder.Entity<Order>()
        .HasOne(o => o.Province)
        .WithMany(p => p.Orders)
        .HasForeignKey(o => o.ProvinceId)
        .OnDelete(DeleteBehavior.Restrict);

            // District - Order
            modelBuilder.Entity<Order>()
                .HasOne(o => o.District)
                .WithMany(d => d.Orders)
                .HasForeignKey(o => o.DistrictId)
                .OnDelete(DeleteBehavior.Restrict);

            // Ward - Order
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Ward)
                .WithMany(w => w.Orders)
                .HasForeignKey(o => o.WardId)
                .OnDelete(DeleteBehavior.Restrict);

            // User - Order
            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>().Property(o => o.Status).HasConversion<string>();

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasOne(c => c.ParentCategory)
                .WithMany()
                .HasForeignKey(c => c.ParentId)
                .OnDelete(DeleteBehavior.Restrict);
                entity.HasIndex(e => e.Slug)
                      .IsUnique();
            });
            modelBuilder.Entity<UserAddress>(entity =>
            {
                entity.HasOne(u => u.Province)
                .WithMany(ua => ua.UserAddresses)
                .HasForeignKey(o => o.ProvinceId)
                .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(u => u.District)
                .WithMany(ua => ua.UserAddresses)
                .HasForeignKey(o => o.DistrictId)
                .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(u => u.Ward)
                .WithMany(ua => ua.UserAddresses)
                .HasForeignKey(o => o.WardId)
                .OnDelete(DeleteBehavior.Restrict);
            });
            modelBuilder.Entity<Province>()
       .Property(p => p.Id)
       .ValueGeneratedNever();

            modelBuilder.Entity<District>()
                .Property(d => d.Id)
                .ValueGeneratedNever();

            modelBuilder.Entity<Ward>()
                .Property(w => w.Id)
                .ValueGeneratedNever();
            modelBuilder.Entity<Size>(entity => 
            {
                entity.Property(s => s.SizeType).HasConversion<string>();
            });
            modelBuilder.Entity<Tokens>(entity =>
            {
                entity.Property(t => t.TokenType)
                    .HasConversion<string>();
            });
            modelBuilder.Entity<Cart>(entity =>
            {
                entity.ToTable(tb =>
                {
                    tb.HasCheckConstraint("CHK_Cart_UserOrGuest",
                        "(\"UserID\" IS NOT NULL AND \"GuestToken\" IS NULL) OR (\"UserID\" IS NULL AND \"GuestToken\" IS NOT NULL)");
                });
            });

        }
    }
}
