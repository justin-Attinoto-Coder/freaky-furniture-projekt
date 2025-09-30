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
                var recommended = await _context.Recommended
                    .Include(r => r.Product)
                    .ThenInclude(p => p.Category)
                    .Take(4)
                    .Select(r => new
                    {
                        id = r.Product!.Id,
                        name = r.Product.Name,
                        brand = r.Product.Brand,
                        price = r.Product.Price,
                        urlSlug = r.Product.UrlSlug,
                        image = r.Product.Image,
                        categoryName = r.Product.Category != null ? r.Product.Category.Name : null
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