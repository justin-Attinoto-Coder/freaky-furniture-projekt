using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FreakyFurnitureAPI.Data;
using FreakyFurnitureAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<FurnitureDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is missing");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });

builder.Services.AddAuthorization();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// IMPORTANT: Add this to serve static files from wwwroot
app.UseStaticFiles();

app.UseCors();
app.UseAuthorization();
app.MapControllers();

// Create database and seed users
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<FurnitureDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        // Force recreate database to ensure all tables exist
        Console.WriteLine("🔄 Recreating database...");
        context.Database.EnsureDeleted(); // Delete existing database
        context.Database.EnsureCreated(); // Create fresh database with all tables
        Console.WriteLine("✅ Database recreated successfully");
        
        // Now seed the data...
        // Seed admin user if none exists
        if (!context.Users.Any())
        {
            var adminUser = new User
            {
                Username = "admin",
                Password = BCrypt.Net.BCrypt.HashPassword("admin", 10),
                Role = "admin",
                CreatedAt = DateTime.UtcNow
            };
            
            var testUser = new User
            {
                Username = "user",
                Password = BCrypt.Net.BCrypt.HashPassword("password", 10),
                Role = "user",
                CreatedAt = DateTime.UtcNow
            };
            
            context.Users.AddRange(adminUser, testUser);
            context.SaveChanges();
            
            Console.WriteLine("✅ Seed users created successfully:");
            Console.WriteLine("   Admin: admin/admin");
            Console.WriteLine("   User: user/password");
        }
        else
        {
            Console.WriteLine("ℹ️  Users already exist in database");
        }

        // Seed categories if none exist
        if (!context.Categories.Any())
        {
            var categories = new List<Category>
            {
                new Category { Name = "Möbler", UrlSlug = "mobler", Image = "/images/categories/mobler.jpg" },
                new Category { Name = "Förvaring", UrlSlug = "forvaring", Image = "/images/categories/forvaring.jpg" },
                new Category { Name = "Belysning", UrlSlug = "belysning", Image = "/images/categories/belysning.jpg" },
                new Category { Name = "Textilier", UrlSlug = "textilier", Image = "/images/categories/textilier.jpg" },
                new Category { Name = "Dekoration", UrlSlug = "dekoration", Image = "/images/categories/dekoration.jpg" }
            };
            
            context.Categories.AddRange(categories);
            context.SaveChanges();
            Console.WriteLine($"✅ {categories.Count} categories created successfully");
        }

        // Seed products if they don't exist
        if (!await context.Products.AnyAsync())
        {
            var random = new Random();
            var materials = new[] { "Solid Oak Wood", "Mahogany", "Pine", "Metal Frame", "Tempered Glass", "Premium Leather", "Microfiber", "Cotton Blend", "Linen", "Bamboo", "Teak", "Walnut" };
            var colors = new[] { "Natural Wood", "Black", "White", "Brown", "Gray", "Blue", "Red", "Green", "Purple", "Orange", "Beige", "Cream" };
            var countries = new[] { "Sweden", "Denmark", "Norway", "Finland", "Germany", "Italy", "China", "Malaysia", "Vietnam", "Poland" };

            // Helper function to generate random publishing date
            DateTime GetRandomPublishingDate()
            {
                var now = DateTime.Now;
                var daysRange = random.Next(-365, 14); // Past year to next 14 days
                
                // Ensure we have at least 5 in past 7 days and 5 in next 7 days as requested
                if (random.Next(1, 11) <= 2) // 20% chance for past 7 days
                    daysRange = random.Next(-7, 0);
                else if (random.Next(1, 11) <= 2) // 20% chance for next 7 days
                    daysRange = random.Next(1, 7);
                
                return now.AddDays(daysRange);
            }

            var products = new List<Product>
            {
                // Möbler (Furniture) - Category ID 1
                new Product
                {
                    Name = "Psychedelic Lounge Chair",
                    Description = "A vibrant and comfortable lounge chair perfect for modern living spaces with mind-bending patterns",
                    Price = 1299.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-1.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "psychedelic-lounge-chair",
                    CategoryId = 1,
                    Sku = "MOB001",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "85x90x95 cm",
                    Dimensions = "Width: 85cm, Depth: 90cm, Height: 95cm, Seat Height: 45cm",
                    Weight = "28.5 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[0]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 3 years, Made in: {countries[random.Next(countries.Length)]}, Load capacity: 120kg, Fire retardant: Yes"
                },
                new Product
                {
                    Name = "Cosmic Dining Table",
                    Description = "Stunning dining table with otherworldly design elements that seats 6 people comfortably",
                    Price = 899.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-2.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "cosmic-dining-table",
                    CategoryId = 1,
                    Sku = "MOB002",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "180x90x75 cm",
                    Dimensions = "Length: 180cm, Width: 90cm, Height: 75cm, Leg clearance: 65cm",
                    Weight = "45.2 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[1]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 5 years, Made in: {countries[random.Next(countries.Length)]}, Seating capacity: 6 people, Surface treatment: UV lacquered"
                },
                new Product
                {
                    Name = "Surreal Office Chair",
                    Description = "Ergonomic chair with mind-bending artistic flair and premium comfort features",
                    Price = 549.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-3.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "surreal-office-chair",
                    CategoryId = 1,
                    Sku = "MOB003",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "65x65x110 cm",
                    Dimensions = "Width: 65cm, Depth: 65cm, Height: 110cm, Seat Height: 42-52cm (adjustable)",
                    Weight = "18.7 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[2]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 2 years, Made in: {countries[random.Next(countries.Length)]}, Adjustable height: Yes, Lumbar support: Yes, Armrests: Adjustable"
                },
                new Product
                {
                    Name = "Abstract Coffee Table",
                    Description = "Unique coffee table that doubles as a conversation piece with artistic glass top",
                    Price = 699.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-4.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "abstract-coffee-table",
                    CategoryId = 1,
                    Sku = "MOB004",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "120x70x40 cm",
                    Dimensions = "Length: 120cm, Width: 70cm, Height: 40cm, Glass thickness: 12mm",
                    Weight = "35.8 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[3]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Minimal, Warranty: 3 years, Made in: {countries[random.Next(countries.Length)]}, Glass type: Tempered safety glass, Base material: Steel frame"
                },
                new Product
                {
                    Name = "Dreamscape Bed Frame",
                    Description = "Sleep in style with this fantastical bed frame design featuring upholstered headboard",
                    Price = 1199.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-5.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "dreamscape-bed-frame",
                    CategoryId = 1,
                    Sku = "MOB005",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "160x200x120 cm",
                    Dimensions = "Width: 160cm, Length: 200cm, Headboard Height: 120cm, Mattress size: Queen (160x200cm)",
                    Weight = "52.3 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[4]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 5 years, Made in: {countries[random.Next(countries.Length)]}, Mattress support: Slatted base included, Storage: Under-bed clearance 25cm"
                },
                new Product
                {
                    Name = "Whimsical Armchair",
                    Description = "Comfortable armchair with playful, artistic design and premium upholstery",
                    Price = 799.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-6.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "whimsical-armchair",
                    CategoryId = 1,
                    Sku = "MOB006",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "78x85x92 cm",
                    Dimensions = "Width: 78cm, Depth: 85cm, Height: 92cm, Seat Height: 43cm, Arm Height: 65cm",
                    Weight = "24.1 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[5]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Minimal, Warranty: 3 years, Made in: {countries[random.Next(countries.Length)]}, Upholstery: Premium fabric, Foam density: High-resilience"
                },
                new Product
                {
                    Name = "Artistic TV Stand",
                    Description = "Media center that's a work of art in itself with integrated cable management",
                    Price = 429.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-7.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "artistic-tv-stand",
                    CategoryId = 1,
                    Sku = "MOB007",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "150x40x55 cm",
                    Dimensions = "Width: 150cm, Depth: 40cm, Height: 55cm, Shelf space: 145x35cm",
                    Weight = "31.7 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[6]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 2 years, Made in: {countries[random.Next(countries.Length)]}, TV size support: Up to 65 inches, Cable management: Integrated, Storage compartments: 2"
                },
                new Product
                {
                    Name = "Fantasy Sofa Set",
                    Description = "Three-piece sofa set with imaginative design elements and premium comfort",
                    Price = 1899.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-8.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "fantasy-sofa-set",
                    CategoryId = 1,
                    Sku = "MOB008",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "220x90x85 cm",
                    Dimensions = "Length: 220cm, Width: 90cm, Height: 85cm, Seat Depth: 60cm, Seat Height: 45cm",
                    Weight = "89.4 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[7]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 5 years, Made in: {countries[random.Next(countries.Length)]}, Seating capacity: 3-4 people, Cushions: Removable covers, Frame: Hardwood"
                },
                new Product
                {
                    Name = "Mystical Bookshelf",
                    Description = "Bookshelf that seems to defy gravity and logic with floating shelves design",
                    Price = 649.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-9.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "mystical-bookshelf",
                    CategoryId = 1,
                    Sku = "MOB009",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "80x30x180 cm",
                    Dimensions = "Width: 80cm, Depth: 30cm, Height: 180cm, Shelf thickness: 3cm, 5 shelves",
                    Weight = "28.9 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[8]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 3 years, Made in: {countries[random.Next(countries.Length)]}, Load capacity per shelf: 15kg, Wall mounting: Optional wall anchor included"
                },
                new Product
                {
                    Name = "Surreal Side Table",
                    Description = "Side table with impossible geometries and vibrant colors that challenge perception",
                    Price = 299.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-10.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "surreal-side-table",
                    CategoryId = 1,
                    Sku = "MOB010",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "45x45x60 cm",
                    Dimensions = "Width: 45cm, Depth: 45cm, Height: 60cm, Top surface: 40x40cm",
                    Weight = "12.3 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[9]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 2 years, Made in: {countries[random.Next(countries.Length)]}, Surface finish: High-gloss lacquer, Legs: Solid wood"
                },
                new Product
                {
                    Name = "Trippy Dining Chairs",
                    Description = "Set of 4 dining chairs with kaleidoscopic patterns and ergonomic design",
                    Price = 999.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-11.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "trippy-dining-chairs",
                    CategoryId = 1,
                    Sku = "MOB011",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "45x50x85 cm each",
                    Dimensions = "Width: 45cm, Depth: 50cm, Height: 85cm, Seat Height: 46cm (per chair)",
                    Weight = "48.8 kg (set of 4)",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[10]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 3 years, Made in: {countries[random.Next(countries.Length)]}, Set includes: 4 chairs, Upholstery: Stain-resistant fabric, Stackable: No"
                },

                // Förvaring (Storage) - Category ID 2
                new Product
                {
                    Name = "Dimensional Storage Cabinet",
                    Description = "Storage cabinet that seems to exist in multiple dimensions with hidden compartments",
                    Price = 749.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-1.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "dimensional-storage-cabinet",
                    CategoryId = 2,
                    Sku = "FOR001",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "90x45x120 cm",
                    Dimensions = "Width: 90cm, Depth: 45cm, Height: 120cm, Internal space: 85x40x115cm",
                    Weight = "42.6 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[0]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 3 years, Made in: {countries[random.Next(countries.Length)]}, Compartments: 3 adjustable shelves, Doors: 2 hinged doors, Hardware: Soft-close hinges"
                },
                new Product
                {
                    Name = "Psychedelic Wardrobe",
                    Description = "Wardrobe with mind-bending patterns and ample storage for clothes and accessories",
                    Price = 1299.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-2.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "psychedelic-wardrobe",
                    CategoryId = 2,
                    Sku = "FOR002",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "120x60x200 cm",
                    Dimensions = "Width: 120cm, Depth: 60cm, Height: 200cm, Hanging space: 115cm, Drawers: 3x 115x50cm",
                    Weight = "78.4 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[1]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 5 years, Made in: {countries[random.Next(countries.Length)]}, Features: 1 hanging rail, 3 drawers, 2 fixed shelves, Mirror: Full-length inside door"
                },
                new Product
                {
                    Name = "Cosmic Storage Chest",
                    Description = "Storage chest with galaxy-inspired design elements and ample interior space",
                    Price = 459.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-3.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "cosmic-storage-chest",
                    CategoryId = 2,
                    Sku = "FOR003",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "80x40x40 cm",
                    Dimensions = "Width: 80cm, Depth: 40cm, Height: 40cm, Interior dimensions: 75x35x35cm",
                    Weight = "22.5 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[2]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 2 years, Made in: {countries[random.Next(countries.Length)]}, Features: Lift-top lid, Safety hinge, Interior lining: Yes"
                },
                new Product
                {
                    Name = "Abstract Bookshelf Unit",
                    Description = "Modular bookshelf with abstract architectural forms and customizable configuration",
                    Price = 599.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-4.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "abstract-bookshelf-unit",
                    CategoryId = 2,
                    Sku = "FOR004",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "100x30x180 cm",
                    Dimensions = "Width: 100cm, Depth: 30cm, Height: 180cm, Module size: 50x30x30cm",
                    Weight = "34.7 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[3]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 3 years, Made in: {countries[random.Next(countries.Length)]}, Features: Modular design, Wall-mounted or freestanding, Includes: Assembly hardware"
                },
                new Product
                {
                    Name = "Surreal Storage Ottoman",
                    Description = "Multi-functional ottoman with hidden compartments and surreal design",
                    Price = 249.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-5.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "surreal-storage-ottoman",
                    CategoryId = 2,
                    Sku = "FOR005",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "60x60x45 cm",
                    Dimensions = "Width: 60cm, Depth: 60cm, Height: 45cm, Internal compartment: 55x55x40cm",
                    Weight = "15.3 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[4]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: No, Warranty: 2 years, Made in: {countries[random.Next(countries.Length)]}, Features: Hidden storage, Soft-close lid, Upholstered top"
                },
                new Product
                {
                    Name = "Trippy Display Cabinet",
                    Description = "Glass display cabinet with kaleidoscopic frame and LED lighting",
                    Price = 899.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-6.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "trippy-display-cabinet",
                    CategoryId = 2,
                    Sku = "FOR006",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "120x40x180 cm",
                    Dimensions = "Width: 120cm, Depth: 40cm, Height: 180cm, Glass shelf: 115x35cm",
                    Weight = "50.2 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[5]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 3 years, Made in: {countries[random.Next(countries.Length)]}, Features: Tempered glass doors, Adjustable shelves, LED lighting: Yes"
                },
                new Product
                {
                    Name = "Whimsical Toy Chest",
                    Description = "Perfect for children's rooms with playful design and ample storage space",
                    Price = 349.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-7.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "whimsical-toy-chest",
                    CategoryId = 2,
                    Sku = "FOR007",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "80x40x50 cm",
                    Dimensions = "Width: 80cm, Depth: 40cm, Height: 50cm, Internal space: 75x35x45cm",
                    Weight = "18.9 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[6]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 2 years, Made in: {countries[random.Next(countries.Length)]}, Features: Safety hinge, Rounded edges, Interior divider: Yes"
                },
                new Product
                {
                    Name = "Artistic Storage Bench",
                    Description = "Bench with built-in storage and artistic flair, perfect for entryways",
                    Price = 399.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-8.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "artistic-storage-bench",
                    CategoryId = 2,
                    Sku = "FOR008",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "100x40x45 cm",
                    Dimensions = "Width: 100cm, Depth: 40cm, Height: 45cm, Storage compartment: 95x35x40cm",
                    Weight = "25.4 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[7]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 3 years, Made in: {countries[random.Next(countries.Length)]}, Features: Lift-up seat, Padded top, Storage divider: Removable"
                },
                new Product
                {
                    Name = "Fantasy Closet System",
                    Description = "Complete closet organization system with magical appeal and flexible configuration",
                    Price = 1599.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-9.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "fantasy-closet-system",
                    CategoryId = 2,
                    Sku = "FOR009",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "200x60x220 cm",
                    Dimensions = "Width: 200cm, Depth: 60cm, Height: 220cm, Module size: 100x60x220cm",
                    Weight = "95.8 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[8]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 5 years, Made in: {countries[random.Next(countries.Length)]}, Features: Modular system, Wall-mounted or freestanding, Includes: Assembly hardware, Hooks and rails"
                },
                new Product
                {
                    Name = "Mystical Media Cabinet",
                    Description = "Media storage with mysterious and enchanting design, featuring sliding doors",
                    Price = 679.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-10.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "mystical-media-cabinet",
                    CategoryId = 2,
                    Sku = "FOR010",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "150x45x60 cm",
                    Dimensions = "Width: 150cm, Depth: 45cm, Height: 60cm, Shelf space: 145x40cm",
                    Weight = "33.1 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[9]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 2 years, Made in: {countries[random.Next(countries.Length)]}, Features: Sliding doors, Adjustable shelves, Cable management: Yes"
                },
                new Product
                {
                    Name = "Dreamlike Dresser",
                    Description = "Multi-drawer dresser with dreamy, surreal aesthetics and ample storage",
                    Price = 799.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-11.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "dreamlike-dresser",
                    CategoryId = 2,
                    Sku = "FOR011",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "90x45x120 cm",
                    Dimensions = "Width: 90cm, Depth: 45cm, Height: 120cm, Drawer size: 85x40x15cm",
                    Weight = "40.2 kg",
                    Material = materials[random.Next(materials.Length)],
                    Specifications = $"Material: {materials[10]}, Color: {colors[random.Next(colors.Length)]}, Assembly required: Yes, Warranty: 3 years, Made in: {countries[random.Next(countries.Length)]}, Features: 6 drawers, Soft-close mechanism, Anti-tip kit included"
                },

                // Textilier (Textiles) - Category ID 4
                new Product
                {
                    Name = "Psychedelic Throw Pillows",
                    Description = "Set of 4 vibrant throw pillows with mind-bending patterns and premium filling",
                    Price = 89.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-1.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "psychedelic-throw-pillows",
                    CategoryId = 4,
                    Sku = "TEX001",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "45x45 cm each",
                    Dimensions = "Width: 45cm, Height: 45cm, Thickness: 15cm (per pillow)",
                    Weight = "2.8 kg (set of 4)",
                    Material = "100% Cotton Cover, Polyester Fill",
                    Specifications = $"Material: Cotton blend, Color: {colors[random.Next(colors.Length)]}, Set includes: 4 pillows, Warranty: 1 year, Made in: {countries[random.Next(countries.Length)]}, Care: Machine washable at 30°C, Filling: Hypoallergenic polyester, Zipper: Hidden zipper closure"
                },
                new Product
                {
                    Name = "Cosmic Area Rug",
                    Description = "Large area rug featuring galactic designs and colors, non-slip backing",
                    Price = 459.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-2.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "cosmic-area-rug",
                    CategoryId = 4,
                    Sku = "TEX002",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "200x300 cm",
                    Dimensions = "Length: 200cm, Width: 300cm, Pile height: 10mm",
                    Weight = "18.5 kg",
                    Material = "Polypropylene, Jute backing",
                    Specifications = $"Material: Polypropylene, Color: {colors[random.Next(colors.Length)]}, Shape: Rectangular, Warranty: 2 years, Made in: {countries[random.Next(countries.Length)]}, Features: Non-slip, Stain-resistant, Easy to clean"
                },
                new Product
                {
                    Name = "Surreal Curtain Set",
                    Description = "Window curtains with abstract, dreamlike patterns and light-filtering fabric",
                    Price = 129.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-3.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "surreal-curtain-set",
                    CategoryId = 4,
                    Sku = "TEX003",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "140x250 cm each",
                    Dimensions = "Width: 140cm, Height: 250cm, Header tape: 4cm",
                    Weight = "1.2 kg (set of 2)",
                    Material = "Polyester, Metal grommets",
                    Specifications = $"Material: Polyester, Color: {colors[random.Next(colors.Length)]}, Set includes: 2 curtains, Care: Machine washable, Features: Light-filtering, Grommet top for easy hanging"
                },
                new Product
                {
                    Name = "Abstract Tapestry",
                    Description = "Large wall tapestry with bold, artistic design and hanging rod included",
                    Price = 199.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-4.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "abstract-tapestry",
                    CategoryId = 4,
                    Sku = "TEX004",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "150x200 cm",
                    Dimensions = "Width: 150cm, Height: 200cm",
                    Weight = "0.8 kg",
                    Material = "Polyester, Wooden rod",
                    Specifications = $"Material: Polyester, Color: {colors[random.Next(colors.Length)]}, Hanging method: Rod pocket, Warranty: 1 year, Made in: {countries[random.Next(countries.Length)]}, Features: Lightweight, Durable, Easy to hang"
                },
                new Product
                {
                    Name = "Whimsical Bed Sheets",
                    Description = "Queen size bed sheet set with playful patterns and soft, breathable fabric",
                    Price = 79.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-5.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "whimsical-bed-sheets",
                    CategoryId = 4,
                    Sku = "TEX005",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "160x200 cm",
                    Dimensions = "Width: 160cm, Length: 200cm, Pillowcase: 50x60cm",
                    Weight = "1.5 kg",
                    Material = "100% Cotton",
                    Specifications = $"Material: Cotton, Color: {colors[random.Next(colors.Length)]}, Set includes: 1 flat sheet, 1 fitted sheet, 2 pillowcases, Care: Machine washable, Features: Hypoallergenic, Soft, Durable"
                },
                new Product
                {
                    Name = "Trippy Table Runner",
                    Description = "Dining table runner with kaleidoscopic design and stain-resistant coating",
                    Price = 39.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-6.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "trippy-table-runner",
                    CategoryId = 4,
                    Sku = "TEX006",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "35x150 cm",
                    Dimensions = "Width: 35cm, Length: 150cm",
                    Weight = "0.4 kg",
                    Material = "Polyester, PVC backing",
                    Specifications = $"Material: Polyester, Color: {colors[random.Next(colors.Length)]}, Features: Stain-resistant, Non-slip, Easy to clean"
                },
                new Product
                {
                    Name = "Fantasy Blanket Throw",
                    Description = "Cozy throw blanket with magical, otherworldly design and soft texture",
                    Price = 69.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-7.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "fantasy-blanket-throw",
                    CategoryId = 4,
                    Sku = "TEX007",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "130x170 cm",
                    Dimensions = "Width: 130cm, Length: 170cm",
                    Weight = "1.2 kg",
                    Material = "100% Polyester",
                    Specifications = $"Material: Polyester, Color: {colors[random.Next(colors.Length)]}, Features: Soft, Warm, Lightweight, Easy to pack"
                },
                new Product
                {
                    Name = "Artistic Floor Cushions",
                    Description = "Set of 6 floor cushions for bohemian seating, filled with eco-friendly materials",
                    Price = 149.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-8.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "artistic-floor-cushions",
                    CategoryId = 4,
                    Sku = "TEX008",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "40x40x10 cm each",
                    Dimensions = "Width: 40cm, Depth: 40cm, Height: 10cm (per cushion)",
                    Weight = "3.6 kg (set of 6)",
                    Material = "Cotton cover, Recycled polyester fill",
                    Specifications = $"Material: Cotton, Color: {colors[random.Next(colors.Length)]}, Set includes: 6 cushions, Care: Spot clean only, Filling: Eco-friendly recycled polyester, Zipper: Hidden zipper closure"
                },
                new Product
                {
                    Name = "Mystical Window Valance",
                    Description = "Decorative window valance with enchanting patterns and easy installation",
                    Price = 49.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-9.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "mystical-window-valance",
                    CategoryId = 4,
                    Sku = "TEX009",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "140x30 cm",
                    Dimensions = "Width: 140cm, Height: 30cm",
                    Weight = "0.5 kg",
                    Material = "Polyester, Plastic clips",
                    Specifications = $"Material: Polyester, Color: {colors[random.Next(colors.Length)]}, Features: Easy to install, Lightweight, Durable"
                },
                new Product
                {
                    Name = "Dreamscape Duvet Cover",
                    Description = "King size duvet cover with dreamy, surreal artwork and hidden button closure",
                    Price = 119.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-10.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "dreamscape-duvet-cover",
                    CategoryId = 4,
                    Sku = "TEX010",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "220x240 cm",
                    Dimensions = "Width: 220cm, Length: 240cm",
                    Weight = "1.8 kg",
                    Material = "100% Cotton",
                    Specifications = $"Material: Cotton, Color: {colors[random.Next(colors.Length)]}, Features: Soft, Breathable, Machine washable, Button closure: Hidden"
                },
                new Product
                {
                    Name = "Surreal Bath Towel Set",
                    Description = "Luxury bath towel set with abstract artistic design and high absorbency",
                    Price = 89.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-11.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "surreal-bath-towel-set",
                    CategoryId = 4,
                    Sku = "TEX011",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "70x140 cm each",
                    Dimensions = "Width: 70cm, Length: 140cm",
                    Weight = "1.0 kg (set of 2)",
                    Material = "100% Cotton",
                    Specifications = $"Material: Cotton, Color: {colors[random.Next(colors.Length)]}, Set includes: 2 towels, Care: Machine washable, Features: High absorbency, Quick drying"
                },

                // Dekoration (Decoration) - Category ID 5 - Using detaljer folder
                new Product
                {
                    Name = "Psychedelic Wall Art",
                    Description = "Large canvas print with vibrant, mind-bending artwork that transforms any space",
                    Price = 199.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-1.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "psychedelic-wall-art",
                    CategoryId = 5,
                    Sku = "DEK001",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "80x60 cm",
                    Dimensions = "Width: 80cm, Height: 60cm, Depth: 3cm, Frame thickness: 2cm",
                    Weight = "1.8 kg",
                    Material = "Canvas Print, Wooden Frame",
                    Specifications = $"Material: Premium canvas, Color: {colors[random.Next(colors.Length)]}, Frame: Solid wood, Warranty: 2 years, Made in: {countries[random.Next(countries.Length)]}, Print quality: Fade-resistant inks, Mounting: Ready to hang, UV protection: Yes"
                },
                new Product
                {
                    Name = "Cosmic Mirror Set",
                    Description = "Set of 3 decorative mirrors with galaxy-themed frames and high-quality reflection",
                    Price = 149.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-2.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "cosmic-mirror-set",
                    CategoryId = 5,
                    Sku = "DEK002",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "30x30 cm each",
                    Dimensions = "Width: 30cm, Height: 30cm, Depth: 2cm",
                    Weight = "1.2 kg (set of 3)",
                    Material = "Glass, Plastic frame",
                    Specifications = $"Material: Glass, Color: {colors[random.Next(colors.Length)]}, Set includes: 3 mirrors, Features: High-quality reflection, Easy to hang, Lightweight"
                },
                new Product
                {
                    Name = "Abstract Sculpture",
                    Description = "Table-top sculpture with impossible geometric forms and premium finish",
                    Price = 299.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-3.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "abstract-sculpture",
                    CategoryId = 5,
                    Sku = "DEK003",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "25x25x50 cm",
                    Dimensions = "Width: 25cm, Depth: 25cm, Height: 50cm",
                    Weight = "3.5 kg",
                    Material = "Resin, Metal",
                    Specifications = $"Material: Resin, Color: {colors[random.Next(colors.Length)]}, Features: Hand-painted, Unique design, Warranty: 1 year"
                },
                new Product
                {
                    Name = "Whimsical Vase Collection",
                    Description = "Set of 5 vases with playful, artistic designs and various sizes",
                    Price = 129.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-4.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "whimsical-vase-collection",
                    CategoryId = 5,
                    Sku = "DEK004",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "15-30 cm height",
                    Dimensions = "Width: 15-30cm, Height: 15-30cm",
                    Weight = "2.0 kg (set of 5)",
                    Material = "Ceramic",
                    Specifications = $"Material: Ceramic, Color: {colors[random.Next(colors.Length)]}, Set includes: 5 vases, Features: Assorted sizes, Handcrafted, Indoor use only"
                },
                new Product
                {
                    Name = "Surreal Clock Art",
                    Description = "Functional wall clock that's also a work of art, with silent quartz movement",
                    Price = 179.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-5.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "surreal-clock-art",
                    CategoryId = 5,
                    Sku = "DEK005",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "40x40 cm",
                    Dimensions = "Width: 40cm, Height: 40cm, Depth: 5cm",
                    Weight = "1.5 kg",
                    Material = "MDF, Glass",
                    Specifications = $"Material: MDF, Color: {colors[random.Next(colors.Length)]}, Features: Silent quartz movement, Easy to hang, Battery operated (not included)"
                },
                new Product
                {
                    Name = "Fantasy Candle Holders",
                    Description = "Set of decorative candle holders with magical appeal and various heights",
                    Price = 79.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-6.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "fantasy-candle-holders",
                    CategoryId = 5,
                    Sku = "DEK006",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "10-20 cm height",
                    Dimensions = "Width: 10-20cm, Height: 10-20cm",
                    Weight = "1.0 kg (set of 3)",
                    Material = "Glass, Metal",
                    Specifications = $"Material: Glass, Color: {colors[random.Next(colors.Length)]}, Set includes: 3 candle holders, Features: Assorted heights, Decorative use only"
                },
                new Product
                {
                    Name = "Trippy Photo Frames",
                    Description = "Collection of 8 photo frames with kaleidoscopic borders and high-quality glass",
                    Price = 99.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-7.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "trippy-photo-frames",
                    CategoryId = 5,
                    Sku = "DEK007",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "10x15 cm each",
                    Dimensions = "Width: 10cm, Height: 15cm, Depth: 2cm",
                    Weight = "1.5 kg (set of 8)",
                    Material = "Glass, Plastic frame",
                    Specifications = $"Material: Glass, Color: {colors[random.Next(colors.Length)]}, Set includes: 8 frames, Features: High-quality glass, Easy to hang, Lightweight"
                },
                new Product
                {
                    Name = "Artistic Plant Stands",
                    Description = "Set of 3 plant stands with abstract, sculptural design and durable construction",
                    Price = 189.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-8.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "artistic-plant-stands",
                    CategoryId = 5,
                    Sku = "DEK008",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "30-50 cm height",
                    Dimensions = "Width: 30-50cm, Height: 30-50cm",
                    Weight = "2.5 kg (set of 3)",
                    Material = "Metal, Wood",
                    Specifications = $"Material: Metal, Color: {colors[random.Next(colors.Length)]}, Set includes: 3 plant stands, Features: Durable construction, Indoor/outdoor use, Easy to assemble"
                },
                new Product
                {
                    Name = "Mystical Wind Chimes",
                    Description = "Beautiful wind chimes with enchanting, otherworldly tones and adjustable length",
                    Price = 59.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-9.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "mystical-wind-chimes",
                    CategoryId = 5,
                    Sku = "DEK009",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "60 cm length",
                    Dimensions = "Width: 10cm, Height: 60cm",
                    Weight = "0.8 kg",
                    Material = "Bamboo, Metal",
                    Specifications = $"Material: Bamboo, Color: {colors[random.Next(colors.Length)]}, Features: Adjustable length, Indoor/outdoor use, Handcrafted"
                },
                new Product
                {
                    Name = "Dreamlike Bookends",
                    Description = "Pair of decorative bookends with surreal design elements and premium finish",
                    Price = 89.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-10.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "dreamlike-bookends",
                    CategoryId = 5,
                    Sku = "DEK010",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "15x20 cm each",
                    Dimensions = "Width: 15cm, Height: 20cm, Depth: 10cm",
                    Weight = "1.0 kg (set of 2)",
                    Material = "Resin, Wood",
                    Specifications = $"Material: Resin, Color: {colors[random.Next(colors.Length)]}, Set includes: 2 bookends, Features: Hand-painted, Non-slip base, Warranty: 1 year"
                },
                new Product
                {
                    Name = "Psychedelic Lamp Base",
                    Description = "Unique lamp base with mind-bending patterns and colors, fits standard lampshades",
                    Price = 149.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-11.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "psychedelic-lamp-base",
                    CategoryId = 5,
                    Sku = "DEK011",
                    PublishingDate = GetRandomPublishingDate(),
                    Size = "20x20x30 cm",
                    Dimensions = "Width: 20cm, Height: 30cm, Base diameter: 15cm",
                    Weight = "1.2 kg",
                    Material = "Ceramic, Metal",
                    Specifications = $"Material: Ceramic, Color: {colors[random.Next(colors.Length)]}, Features: Fits standard lampshades, Easy to clean, Indoor use only"
                }
            };

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
            logger.LogInformation($"✅ Seeded {products.Count} Freaky Furniture products with detailed specifications");
        }
        else
        {
            Console.WriteLine("ℹ️  Products already exist in database");
        }

        // Seed recommended products if they don't exist
        if (!await context.Recommended.AnyAsync() && await context.Products.AnyAsync())
        {
            var allProducts = await context.Products.Take(4).ToListAsync();
            var recommendedItems = allProducts.Select(p => new Recommended 
            { 
                ProductId = p.Id 
            }).ToList();
            
            await context.Recommended.AddRangeAsync(recommendedItems);
            await context.SaveChangesAsync();
            
            logger.LogInformation($"✅ Created {recommendedItems.Count} recommended products");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error seeding database: {ex.Message}");
    }
}

Console.WriteLine("🚀 API Server starting...");
app.Run();
