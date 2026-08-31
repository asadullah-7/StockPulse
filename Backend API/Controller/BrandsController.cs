using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IMS.Data;
using IMS.Models;

namespace IMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BrandsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Brands
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.Brands.ToListAsync());
        }

        // GET: api/Brands/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null) return NotFound(new { message = $"Brand with ID {id} not found." });

            return Ok(brand);
        }

        // POST: api/Brands
        [HttpPost]
        public async Task<IActionResult> Create(Brand brand)
        {
            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = brand.BrandID }, brand);
        }

        // PUT: api/Brands/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Brand brand)
        {
            if (id != brand.BrandID) return BadRequest(new { message = "ID mismatch." });

            var existingBrand = await _context.Brands.FindAsync(id);
            if (existingBrand == null) return NotFound(new { message = $"Brand with ID {id} not found." });

            existingBrand.Name = brand.Name;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Brand updated successfully!", brand = existingBrand });
        }

        // DELETE: api/Brands/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null) return NotFound(new { message = $"Brand with ID {id} not found." });

            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"Brand with ID {id} deleted successfully." });
        }
    }
}