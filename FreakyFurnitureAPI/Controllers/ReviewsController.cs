using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FreakyFurnitureAPI.Data;
using FreakyFurnitureAPI.Models;

namespace FreakyFurnitureAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly FurnitureDbContext _context;
        private readonly ILogger<ReviewsController> _logger;

        public ReviewsController(FurnitureDbContext context, ILogger<ReviewsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("{productId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetReviews(int productId)
        {
            try
            {
                var reviews = await _context.Reviews
                    .Where(r => r.ProductId == productId)
                    .Select(r => new
                    {
                        id = r.Id,
                        productId = r.ProductId,
                        rating = r.Rating,
                        reviewText = r.ReviewText,
                        reviewerName = r.ReviewerName,
                        createdAt = r.CreatedAt
                    })
                    .ToListAsync();

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting reviews for product {productId}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{productId}/average")]
        public async Task<ActionResult<object>> GetAverageRating(int productId)
        {
            try
            {
                var reviews = await _context.Reviews
                    .Where(r => r.ProductId == productId)
                    .ToListAsync();

                if (!reviews.Any())
                {
                    return Ok(new { averageRating = 0.0, reviewCount = 0 });
                }

                var averageRating = reviews.Average(r => r.Rating);
                return Ok(new { 
                    averageRating = Math.Round(averageRating, 1), 
                    reviewCount = reviews.Count 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting average rating for product {productId}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}