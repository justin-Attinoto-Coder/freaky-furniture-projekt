using System.ComponentModel.DataAnnotations;

namespace FreakyFurnitureAPI.Models
{
    public class Product
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        public string? Brand { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
        
        public string? Description { get; set; }
        
        public string? Sku { get; set; }
        
        public DateTime? PublishingDate { get; set; }
        
        public string? UrlSlug { get; set; }
        
        public string? Image { get; set; }
        
        public string? Size { get; set; }
        
        public string? Dimensions { get; set; }
        
        public string? Weight { get; set; }
        
        public string? Material { get; set; }
        
        public string? Specifications { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public int? CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}