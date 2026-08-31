using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IMS.Data;
using IMS.Models;

namespace IMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.Categories.ToListAsync());
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound(new { message = $"Category with ID {id} not found." });

            return Ok(category);
        }

        // POST: api/Categories
        [HttpPost]
        public async Task<IActionResult> Create(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = category.CatID }, category);
        }

        // PUT: api/Categories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Category category)
        {
            if (id != category.CatID) return BadRequest(new { message = "ID mismatch." });

            var existingCategory = await _context.Categories.FindAsync(id);
            if (existingCategory == null) return NotFound(new { message = $"Category with ID {id} not found." });

            existingCategory.CatName = category.CatName;
            existingCategory.CatDescription = category.CatDescription;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Category updated successfully!", category = existingCategory });
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound(new { message = $"Category with ID {id} not found." });

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"Category with ID {id} deleted successfully." });
        }
    }
}