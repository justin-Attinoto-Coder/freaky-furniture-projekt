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
        
        public string? ReviewText { get; set; }
        
        [Required]
        public string ReviewerName { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public Product? Product { get; set; }
    }
}