using System.ComponentModel.DataAnnotations;

namespace FreakyFurnitureAPI.DTOs
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Image { get; set; }
        public string? UrlSlug { get; set; }
        public List<ProductDto> Products { get; set; } = new();
    }

    public class CreateCategoryDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        public string? Image { get; set; }
        
        public string? UrlSlug { get; set; }
    }
}