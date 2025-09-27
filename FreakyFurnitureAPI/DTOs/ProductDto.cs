using System.ComponentModel.DataAnnotations;

namespace FreakyFurnitureAPI.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? Image { get; set; }
        public string? Brand { get; set; }
        public string? UrlSlug { get; set; }
        public string Sku { get; set; } = string.Empty; // Make required (remove ?)
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
    }

    public class CreateProductDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
        
        public string? Image { get; set; }
        
        public string? Brand { get; set; }
        
        public string? UrlSlug { get; set; }
        
        [Required] // Make SKU required
        [StringLength(20, MinimumLength = 6)] // Enforce format length
        [RegularExpression(@"^[A-Z]{3}[0-9]{3}$", ErrorMessage = "SKU must be in format: 3 uppercase letters followed by 3 digits (e.g., ABC123)")]
        public string Sku { get; set; } = string.Empty; // Make required (remove ?)
        
        public int? CategoryId { get; set; }
    }

    public class UpdateProductDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public string? Image { get; set; }
        public string? Brand { get; set; }
        public string? UrlSlug { get; set; }
        public string? Sku { get; set; } // Keep optional for updates
        public int? CategoryId { get; set; }
    }

    public class PaginatedProductsDto
    {
        public List<ProductDto> Products { get; set; } = new();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
    }
}