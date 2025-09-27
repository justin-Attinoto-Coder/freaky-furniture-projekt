namespace FreakyFurnitureAPI.DTOs
{
    public class CartItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string ImageURL { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string UrlSlug { get; set; } = string.Empty;
    }

    public class AddCartItemDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string ImageURL { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string UrlSlug { get; set; } = string.Empty;
    }

    public class UpdateCartItemDto
    {
        public int Quantity { get; set; }
    }
}