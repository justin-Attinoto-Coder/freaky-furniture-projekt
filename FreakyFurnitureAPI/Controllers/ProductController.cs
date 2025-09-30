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
        public async Task<IActionResult> GetProducts(
            [FromQuery] string? query = null,
            [FromQuery] string? category = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var productsQuery = _context.Products
                    .Include(p => p.Category)
                    .AsQueryable();

                // Enhanced search - include all the detailed fields
                if (!string.IsNullOrEmpty(query))
                {
                    var searchTerm = query.ToLower();
                    productsQuery = productsQuery.Where(p =>
                        p.Name.ToLower().Contains(searchTerm) ||
                        (p.Description != null && p.Description.ToLower().Contains(searchTerm)) ||
                        (p.Brand != null && p.Brand.ToLower().Contains(searchTerm)) ||
                        (p.Material != null && p.Material.ToLower().Contains(searchTerm)) ||          // Add this
                        (p.Specifications != null && p.Specifications.ToLower().Contains(searchTerm)) || // Add this
                        (p.Sku != null && p.Sku.ToLower().Contains(searchTerm))
                    );
                }

                // Category filtering
                if (!string.IsNullOrEmpty(category))
                {
                    productsQuery = productsQuery.Where(p => 
                        p.Category != null && 
                        (p.Category.UrlSlug.ToLower() == category.ToLower() || 
                         p.Category.Name.ToLower() == category.ToLower())
                    );
                }

                var totalCount = await productsQuery.CountAsync();
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                var products = await productsQuery
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Description,
                        p.Price,
                        p.Image,
                        p.Brand,
                        p.UrlSlug,
                        p.Sku,
                        p.CategoryId,
                        CategoryName = p.Category != null ? p.Category.Name : null,
                        // Include the detailed fields in response
                        p.Size,
                        p.Dimensions,
                        p.Weight,
                        p.Material,
                        p.Specifications,
                        p.PublishingDate
                    })
                    .ToListAsync();

                return Ok(new
                {
                    products,
                    page,
                    pageSize,
                    totalCount,
                    totalPages
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving products");
                return StatusCode(500, new { error = "Failed to retrieve products" });
            }
        }

        // GET /api/products/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Category)
                    .Where(p => p.Id == id)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Description,
                        p.Price,
                        p.Image,
                        p.Brand,
                        p.UrlSlug,
                        p.Sku,
                        p.CategoryId,
                        CategoryName = p.Category != null ? p.Category.Name : null,
                        // Add all the detailed fields
                        p.Size,
                        p.Dimensions,
                        p.Weight,
                        p.Material,
                        p.Specifications,
                        p.PublishingDate,
                        p.CreatedAt,
                        p.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (product == null)
                {
                    return NotFound(new { error = "Product not found" });
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving product with ID {ProductId}", id);
                return StatusCode(500, new { error = "Failed to retrieve product" });
            }
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
                Sku = createProductDto.Sku, // Add this line
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
                Sku = product.Sku ?? "", // Add this line
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
            if (productToUpdate.Sku != null) product.Sku = productToUpdate.Sku;

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