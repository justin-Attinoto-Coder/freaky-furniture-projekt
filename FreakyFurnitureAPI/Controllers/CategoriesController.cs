using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.JsonPatch;
using FreakyFurnitureAPI.Data;
using FreakyFurnitureAPI.DTOs;
using FreakyFurnitureAPI.Models;

namespace FreakyFurnitureAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly FurnitureDbContext _context;

        public CategoriesController(FurnitureDbContext context)
        {
            _context = context;
        }

        // GET /api/categories
        [HttpGet]
        public async Task<ActionResult<List<CategoryDto>>> GetCategories([FromQuery] string? slug = null)
        {
            var query = _context.Categories.Include(c => c.Products).AsQueryable();

            if (!string.IsNullOrEmpty(slug))
            {
                var categories = await query
                    .Where(c => c.UrlSlug == slug)
                    .Select(c => new CategoryDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Image = c.Image,
                        UrlSlug = c.UrlSlug,
                        Products = c.Products.Select(p => new ProductDto
                        {
                            Id = p.Id,
                            Name = p.Name,
                            Description = p.Description,
                            Price = p.Price,
                            Image = p.Image,
                            Brand = p.Brand,
                            UrlSlug = p.UrlSlug,
                            CategoryId = p.CategoryId
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(categories);
            }

            var allCategories = await query
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Image = c.Image,
                    UrlSlug = c.UrlSlug,
                    Products = c.Products.Select(p => new ProductDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        Price = p.Price,
                        Image = p.Image,
                        Brand = p.Brand,
                        UrlSlug = p.UrlSlug,
                        CategoryId = p.CategoryId
                    }).ToList()
                })
                .ToListAsync();

            return Ok(allCategories);
        }

        // GET /api/categories/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            var category = await _context.Categories
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Image = category.Image,
                UrlSlug = category.UrlSlug,
                Products = category.Products.Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Image = p.Image,
                    Brand = p.Brand,
                    UrlSlug = p.UrlSlug,
                    CategoryId = p.CategoryId
                }).ToList()
            });
        }

        // POST /api/categories
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<CategoryDto>> CreateCategory(CreateCategoryDto createCategoryDto)
        {
            var category = new Category
            {
                Name = createCategoryDto.Name,
                Image = createCategoryDto.Image,
                UrlSlug = createCategoryDto.UrlSlug,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            var categoryDto = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Image = category.Image,
                UrlSlug = category.UrlSlug,
                Products = new List<ProductDto>()
            };

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, categoryDto);
        }

        // PATCH /api/categories/{id}
        [HttpPatch("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<CategoryDto>> UpdateCategory(int id, JsonPatchDocument<CreateCategoryDto> patchDoc)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            var categoryToUpdate = new CreateCategoryDto
            {
                Name = category.Name,
                Image = category.Image,
                UrlSlug = category.UrlSlug
            };

            patchDoc.ApplyTo(categoryToUpdate, ModelState);

            if (!TryValidateModel(categoryToUpdate))
            {
                return BadRequest(ModelState);
            }

            category.Name = categoryToUpdate.Name;
            category.Image = categoryToUpdate.Image;
            category.UrlSlug = categoryToUpdate.UrlSlug;
            category.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var categoryDto = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Image = category.Image,
                UrlSlug = category.UrlSlug,
                Products = new List<ProductDto>()
            };

            return Ok(categoryDto);
        }

        // DELETE /api/categories/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT /api/categories/{categoryId}/products/{productId}
        [HttpPut("{categoryId}/products/{productId}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> AddProductToCategory(int categoryId, int productId)
        {
            var category = await _context.Categories.FindAsync(categoryId);
            var product = await _context.Products.FindAsync(productId);

            if (category == null || product == null)
            {
                return NotFound();
            }

            product.CategoryId = categoryId;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE /api/categories/{categoryId}/products/{productId}
        [HttpDelete("{categoryId}/products/{productId}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> RemoveProductFromCategory(int categoryId, int productId)
        {
            var product = await _context.Products.FindAsync(productId);

            if (product == null || product.CategoryId != categoryId)
            {
                return NotFound();
            }

            product.CategoryId = null;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}