using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FreakyFurnitureAPI.Data;
using FreakyFurnitureAPI.Models;

namespace FreakyFurnitureAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecommendedController : ControllerBase
    {
        private readonly FurnitureDbContext _context;
        private readonly ILogger<RecommendedController> _logger;

        public RecommendedController(FurnitureDbContext context, ILogger<RecommendedController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetRecommended()
        {
            try
            {
                // Check if recommended products exist
                var recommendedExists = await _context.Recommended.AnyAsync();
                
                if (!recommendedExists)
                {
                    _logger.LogInformation("No recommended products found, returning top products");
                    
                    var topProducts = await _context.Products
                        .Include(p => p.Category)
                        .Take(4)
                        .Where(p => p.Name != null) // Ensure non-null products
                        .Select(p => new
                        {
                            id = p.Id,
                            name = p.Name,
                            brand = p.Brand ?? "Unknown Brand",
                            price = p.Price,
                            urlSlug = p.UrlSlug ?? string.Empty,
                            image = p.Image ?? "/images/default.jpg",
                            categoryName = p.Category != null ? p.Category.Name : "Unknown Category"
                        })
                        .ToListAsync();

                    return Ok(topProducts);
                }

                var recommended = await _context.Recommended
                    .Include(r => r.Product)
                    .ThenInclude(p => p!.Category)
                    .Where(r => r.Product != null && r.Product.Name != null) // Filter out null products
                    .Take(4)
                    .Select(r => new
                    {
                        id = r.Product!.Id,
                        name = r.Product.Name,
                        brand = r.Product.Brand ?? "Unknown Brand",
                        price = r.Product.Price,
                        urlSlug = r.Product.UrlSlug ?? string.Empty,
                        image = r.Product.Image ?? "/images/default.jpg",
                        categoryName = r.Product.Category != null ? r.Product.Category.Name : "Unknown Category"
                    })
                    .ToListAsync();

                return Ok(recommended);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting recommended products");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}