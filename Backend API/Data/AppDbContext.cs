using IMS.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace IMS.Data
{
    // ❌ Pehle: public class AppDbContext : DbContext
    // ✅ Fix: Direct IdentityDbContext se inherit karwayein
    public class AppDbContext : IdentityDbContext<IdentityUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Database Tables (DbSets)
        public DbSet<Category> Categories { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<StockTransaction> StockTransactions { get; set; }

        // Identity Models Configure Karne Ke Liye Important
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder); // 👈 Yeh Identity tables ki configuration ke liye ZAROORI hai!
        }

        // Automatic Audit Date & User Tracking
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<BaseEntity>();

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.created_at = DateTime.UtcNow;
                    if (string.IsNullOrEmpty(entry.Entity.created_by))
                    {
                        entry.Entity.created_by = "System";
                    }
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.updated_at = DateTime.UtcNow;
                    if (string.IsNullOrEmpty(entry.Entity.updated_by))
                    {
                        entry.Entity.updated_by = "System";
                    }
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}