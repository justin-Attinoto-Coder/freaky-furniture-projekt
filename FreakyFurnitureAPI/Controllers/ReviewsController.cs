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

        // GET: api/reviews/product/{productId}
        [HttpGet("product/{productId}")]
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
                        createdAt = r.CreatedAt,
                        isSeeded = r.IsSeeded
                    })
                    .OrderByDescending(r => r.createdAt)
                    .ToListAsync();

                _logger.LogInformation($"Found {reviews.Count} reviews for product {productId}");
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting reviews for product {productId}");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/reviews/product/{productId}/average
        [HttpGet("product/{productId}/average")]
        public async Task<ActionResult<object>> GetAverageRating(int productId)
        {
            try
            {
                var reviews = await _context.Reviews
                    .Where(r => r.ProductId == productId)
                    .ToListAsync();

                if (!reviews.Any())
                {
                    return Ok(new { 
                        averageRating = 0.0, 
                        totalReviews = 0 
                    });
                }

                var averageRating = reviews.Average(r => r.Rating);
                
                _logger.LogInformation($"Product {productId}: Average rating {averageRating:F1} from {reviews.Count} reviews");
                
                return Ok(new { 
                    averageRating = Math.Round(averageRating, 1), 
                    totalReviews = reviews.Count 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting average rating for product {productId}");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/reviews
        [HttpPost]
        public async Task<ActionResult<object>> CreateReview([FromBody] CreateReviewRequest request)
        {
            try
            {
                // Verify product exists
                var productExists = await _context.Products.AnyAsync(p => p.Id == request.ProductId);
                if (!productExists)
                {
                    return BadRequest("Product not found");
                }

                var review = new Review
                {
                    ProductId = request.ProductId,
                    Rating = request.Rating,
                    ReviewText = request.ReviewText,
                    ReviewerName = request.ReviewerName,
                    CreatedAt = DateTime.UtcNow,
                    IsSeeded = false
                };

                _context.Reviews.Add(review);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Created review {review.Id} for product {request.ProductId}");
                
                return CreatedAtAction(
                    nameof(GetReviews), 
                    new { productId = review.ProductId }, 
                    new {
                        id = review.Id,
                        productId = review.ProductId,
                        rating = review.Rating,
                        reviewText = review.ReviewText,
                        reviewerName = review.ReviewerName,
                        createdAt = review.CreatedAt,
                        isSeeded = review.IsSeeded
                    });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating review");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}