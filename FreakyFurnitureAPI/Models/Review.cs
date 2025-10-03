using System.ComponentModel.DataAnnotations;

namespace FreakyFurnitureAPI.Models
{
    public class Review
    {
        public int Id { get; set; }
        
        [Required]
        public int ProductId { get; set; }
        
        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }
        
        [Required]
        [StringLength(1000)]
        public string ReviewText { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string ReviewerName { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public bool IsSeeded { get; set; } = false;
        
        // Navigation property
        public Product? Product { get; set; }
    }
    
    public class CreateReviewRequest
    {
        [Required]
        public int ProductId { get; set; }
        
        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }
        
        [Required]
        [StringLength(1000)]
        public string ReviewText { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string ReviewerName { get; set; } = string.Empty;
    }
}