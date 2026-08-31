using IMS.Data;
using IMS.DTOs;
using IMS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/products (All Products with Category, Brand & Supplier names)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductReadDto>>> GetProducts()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Supplier)
                .Select(p => new ProductReadDto
                {
                    PID = p.PID,
                    Name = p.Name,
                    Price = p.Price,
                    QtyInStock = p.QtyInStock,
                    ReOrderThreshold = p.ReOrderThreshold,
                    CategoryName = p.Category != null ? p.Category.CatName : string.Empty,
                    BrandName = p.Brand != null ? p.Brand.Name : string.Empty,
                    SupplierName = p.Supplier != null ? p.Supplier.Name : string.Empty
                })
                .ToListAsync();

            return Ok(products);
        }

        // 2. GET: api/products/5 (Get Single Product by ID)
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductReadDto>> GetProductById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Supplier)
                .Where(p => p.PID == id)
                .Select(p => new ProductReadDto
                {
                    PID = p.PID,
                    Name = p.Name,
                    Price = p.Price,
                    QtyInStock = p.QtyInStock,
                    ReOrderThreshold = p.ReOrderThreshold,
                    CategoryName = p.Category != null ? p.Category.CatName : string.Empty,
                    BrandName = p.Brand != null ? p.Brand.Name : string.Empty,
                    SupplierName = p.Supplier != null ? p.Supplier.Name : string.Empty
                })
                .FirstOrDefaultAsync();

            if (product == null) return NotFound(new { message = $"Product with ID {id} not found." });

            return Ok(product);
        }

        // 3. POST: api/products (Add New Product)
        [HttpPost]
        public async Task<ActionResult> CreateProduct(CreateProductDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price,
                QtyInStock = dto.QtyInStock,
                ReOrderThreshold = dto.ReOrderThreshold,
                CatID = dto.CatID,
                BrandID = dto.BrandID,
                SupplierID = dto.SupplierID
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductById), new { id = product.PID }, new { message = "Product added successfully!", productId = product.PID });
        }

        // 4. PUT: api/products/5 (Update Product)
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProduct(int id, CreateProductDto dto)
        {
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null) return NotFound(new { message = $"Product with ID {id} not found." });

            existingProduct.Name = dto.Name;
            existingProduct.Price = dto.Price;
            existingProduct.QtyInStock = dto.QtyInStock;
            existingProduct.ReOrderThreshold = dto.ReOrderThreshold;
            existingProduct.CatID = dto.CatID;
            existingProduct.BrandID = dto.BrandID;
            existingProduct.SupplierID = dto.SupplierID;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Product updated successfully!", product = existingProduct });
        }

        // 5. DELETE: api/products/5 (Delete Product)
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound(new { message = $"Product with ID {id} not found." });

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"Product with ID {id} deleted successfully." });
        }

        // 6. GET: api/products/low-stock (Get Products below ReOrderThreshold)
        [HttpGet("low-stock")]
        public async Task<ActionResult<IEnumerable<ProductReadDto>>> GetLowStockProducts()
        {
            var lowStockProducts = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Supplier)
                .Where(p => p.QtyInStock <= p.ReOrderThreshold)
                .Select(p => new ProductReadDto
                {
                    PID = p.PID,
                    Name = p.Name,
                    Price = p.Price,
                    QtyInStock = p.QtyInStock,
                    ReOrderThreshold = p.ReOrderThreshold,
                    CategoryName = p.Category != null ? p.Category.CatName : string.Empty,
                    BrandName = p.Brand != null ? p.Brand.Name : string.Empty,
                    SupplierName = p.Supplier != null ? p.Supplier.Name : string.Empty
                })
                .ToListAsync();

            return Ok(lowStockProducts);
        }
    }
}