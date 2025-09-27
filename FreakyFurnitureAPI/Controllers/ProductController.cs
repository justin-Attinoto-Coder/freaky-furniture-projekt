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
    public class ProductsController : ControllerBase
    {
        private readonly FurnitureDbContext _context;

        public ProductsController(FurnitureDbContext context)
        {
            _context = context;
        }

        // GET /api/products?page=1&pageSize=10
        [HttpGet]
        public async Task<ActionResult<PaginatedProductsDto>> GetProducts(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10,
            [FromQuery] string? slug = null)
        {
            var query = _context.Products.Include(p => p.Category).AsQueryable();

            // Handle slug query
            if (!string.IsNullOrEmpty(slug))
            {
                var products = await query
                    .Where(p => p.UrlSlug == slug)
                    .Select(p => new ProductDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        Price = p.Price,
                        Image = p.Image,
                        Brand = p.Brand,
                        UrlSlug = p.UrlSlug,
                        CategoryId = p.CategoryId,
                        CategoryName = p.Category != null ? p.Category.Name : null
                    })
                    .ToListAsync();

                return Ok(products);
            }

            // Handle pagination
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var paginatedProducts = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Image = p.Image,
                    Brand = p.Brand,
                    UrlSlug = p.UrlSlug,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category != null ? p.Category.Name : null
                })
                .ToListAsync();

            return Ok(new PaginatedProductsDto
            {
                Products = paginatedProducts,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPages
            });
        }

        // GET /api/products/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Image = product.Image,
                Brand = product.Brand,
                UrlSlug = product.UrlSlug,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.Name
            });
        }

        // POST /api/products
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto createProductDto)
        {
            var product = new Product
            {
                Name = createProductDto.Name,
                Description = createProductDto.Description,
                Price = createProductDto.Price,
                Image = createProductDto.Image,
                Brand = createProductDto.Brand,
                UrlSlug = createProductDto.UrlSlug,
                CategoryId = createProductDto.CategoryId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Image = product.Image,
                Brand = product.Brand,
                UrlSlug = product.UrlSlug,
                CategoryId = product.CategoryId
            };

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, productDto);
        }

        // PATCH /api/products/{id}
        [HttpPatch("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ProductDto>> UpdateProduct(int id, JsonPatchDocument<UpdateProductDto> patchDoc)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            var productToUpdate = new UpdateProductDto
            {
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Image = product.Image,
                Brand = product.Brand,
                UrlSlug = product.UrlSlug,
                CategoryId = product.CategoryId
            };

            patchDoc.ApplyTo(productToUpdate, ModelState);

            if (!TryValidateModel(productToUpdate))
            {
                return BadRequest(ModelState);
            }

            // Update the product
            if (productToUpdate.Name != null) product.Name = productToUpdate.Name;
            if (productToUpdate.Description != null) product.Description = productToUpdate.Description;
            if (productToUpdate.Price.HasValue) product.Price = productToUpdate.Price.Value;
            if (productToUpdate.Image != null) product.Image = productToUpdate.Image;
            if (productToUpdate.Brand != null) product.Brand = productToUpdate.Brand;
            if (productToUpdate.UrlSlug != null) product.UrlSlug = productToUpdate.UrlSlug;
            if (productToUpdate.CategoryId.HasValue) product.CategoryId = productToUpdate.CategoryId;

            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Image = product.Image,
                Brand = product.Brand,
                UrlSlug = product.UrlSlug,
                CategoryId = product.CategoryId
            };

            return Ok(productDto);
        }

        // DELETE /api/products/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}