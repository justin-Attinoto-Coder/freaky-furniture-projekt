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

        // Seed products if none exist
        if (!await context.Products.AnyAsync())
        {
            var products = new List<Product>
            {
                // Möbler (Furniture) - Category ID 1
                new Product
                {
                    Name = "Psychedelic Lounge Chair",
                    Description = "A vibrant and comfortable lounge chair perfect for modern living spaces",
                    Price = 1299.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-1.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "psychedelic-lounge-chair",
                    CategoryId = 1,
                    Sku = "MOB001"
                },
                new Product
                {
                    Name = "Cosmic Dining Table",
                    Description = "Stunning dining table with otherworldly design elements",
                    Price = 899.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-2.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "cosmic-dining-table",
                    CategoryId = 1,
                    Sku = "MOB002"
                },
                new Product
                {
                    Name = "Surreal Office Chair",
                    Description = "Ergonomic chair with mind-bending artistic flair",
                    Price = 549.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-3.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "surreal-office-chair",
                    CategoryId = 1,
                    Sku = "MOB003"
                },
                new Product
                {
                    Name = "Abstract Coffee Table",
                    Description = "Unique coffee table that doubles as a conversation piece",
                    Price = 699.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-4.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "abstract-coffee-table",
                    CategoryId = 1,
                    Sku = "MOB004"
                },
                new Product
                {
                    Name = "Dreamscape Bed Frame",
                    Description = "Sleep in style with this fantastical bed frame design",
                    Price = 1199.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-5.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "dreamscape-bed-frame",
                    CategoryId = 1,
                    Sku = "MOB005"
                },
                new Product
                {
                    Name = "Whimsical Armchair",
                    Description = "Comfortable armchair with playful, artistic design",
                    Price = 799.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-6.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "whimsical-armchair",
                    CategoryId = 1,
                    Sku = "MOB006"
                },
                new Product
                {
                    Name = "Artistic TV Stand",
                    Description = "Media center that's a work of art in itself",
                    Price = 429.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-7.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "artistic-tv-stand",
                    CategoryId = 1,
                    Sku = "MOB007"
                },
                new Product
                {
                    Name = "Fantasy Sofa Set",
                    Description = "Three-piece sofa set with imaginative design elements",
                    Price = 1899.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-8.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "fantasy-sofa-set",
                    CategoryId = 1,
                    Sku = "MOB008"
                },
                new Product
                {
                    Name = "Mystical Bookshelf",
                    Description = "Bookshelf that seems to defy gravity and logic",
                    Price = 649.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-9.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "mystical-bookshelf",
                    CategoryId = 1,
                    Sku = "MOB009"
                },
                new Product
                {
                    Name = "Surreal Side Table",
                    Description = "Side table with impossible geometries and vibrant colors",
                    Price = 299.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-10.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "surreal-side-table",
                    CategoryId = 1,
                    Sku = "MOB010"
                },
                new Product
                {
                    Name = "Trippy Dining Chairs",
                    Description = "Set of 4 dining chairs with kaleidoscopic patterns",
                    Price = 999.99m,
                    Image = "/images/products/mobler/freaky-furniture-ai-cs-11.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "trippy-dining-chairs",
                    CategoryId = 1,
                    Sku = "MOB011"
                },

                // Förvaring (Storage) - Category ID 2
                new Product
                {
                    Name = "Dimensional Storage Cabinet",
                    Description = "Storage cabinet that seems to exist in multiple dimensions",
                    Price = 749.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-1.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "dimensional-storage-cabinet",
                    CategoryId = 2,
                    Sku = "FOR001"
                },
                new Product
                {
                    Name = "Psychedelic Wardrobe",
                    Description = "Wardrobe with mind-bending patterns and ample storage",
                    Price = 1299.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-2.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "psychedelic-wardrobe",
                    CategoryId = 2,
                    Sku = "FOR002"
                },
                new Product
                {
                    Name = "Cosmic Storage Chest",
                    Description = "Storage chest with galaxy-inspired design elements",
                    Price = 459.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-3.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "cosmic-storage-chest",
                    CategoryId = 2,
                    Sku = "FOR003"
                },
                new Product
                {
                    Name = "Abstract Bookshelf Unit",
                    Description = "Modular bookshelf with abstract architectural forms",
                    Price = 599.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-4.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "abstract-bookshelf-unit",
                    CategoryId = 2,
                    Sku = "FOR004"
                },
                new Product
                {
                    Name = "Surreal Storage Ottoman",
                    Description = "Multi-functional ottoman with hidden compartments",
                    Price = 249.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-5.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "surreal-storage-ottoman",
                    CategoryId = 2,
                    Sku = "FOR005"
                },
                new Product
                {
                    Name = "Trippy Display Cabinet",
                    Description = "Glass display cabinet with kaleidoscopic frame",
                    Price = 899.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-6.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "trippy-display-cabinet",
                    CategoryId = 2,
                    Sku = "FOR006"
                },
                new Product
                {
                    Name = "Whimsical Toy Chest",
                    Description = "Perfect for children's rooms with playful design",
                    Price = 349.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-7.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "whimsical-toy-chest",
                    CategoryId = 2,
                    Sku = "FOR007"
                },
                new Product
                {
                    Name = "Artistic Storage Bench",
                    Description = "Bench with built-in storage and artistic flair",
                    Price = 399.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-8.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "artistic-storage-bench",
                    CategoryId = 2,
                    Sku = "FOR008"
                },
                new Product
                {
                    Name = "Fantasy Closet System",
                    Description = "Complete closet organization system with magical appeal",
                    Price = 1599.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-9.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "fantasy-closet-system",
                    CategoryId = 2,
                    Sku = "FOR009"
                },
                new Product
                {
                    Name = "Mystical Media Cabinet",
                    Description = "Media storage with mysterious and enchanting design",
                    Price = 679.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-10.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "mystical-media-cabinet",
                    CategoryId = 2,
                    Sku = "FOR010"
                },
                new Product
                {
                    Name = "Dreamlike Dresser",
                    Description = "Multi-drawer dresser with dreamy, surreal aesthetics",
                    Price = 799.99m,
                    Image = "/images/products/forvaring/freaky-furniture-ai-cs-11.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "dreamlike-dresser",
                    CategoryId = 2,
                    Sku = "FOR011"
                },

                // Textilier (Textiles) - Category ID 4
                new Product
                {
                    Name = "Psychedelic Throw Pillows",
                    Description = "Set of 4 vibrant throw pillows with mind-bending patterns",
                    Price = 89.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-1.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "psychedelic-throw-pillows",
                    CategoryId = 4,
                    Sku = "TEX001"
                },
                new Product
                {
                    Name = "Cosmic Area Rug",
                    Description = "Large area rug featuring galactic designs and colors",
                    Price = 459.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-2.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "cosmic-area-rug",
                    CategoryId = 4,
                    Sku = "TEX002"
                },
                new Product
                {
                    Name = "Surreal Curtain Set",
                    Description = "Window curtains with abstract, dreamlike patterns",
                    Price = 129.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-3.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "surreal-curtain-set",
                    CategoryId = 4,
                    Sku = "TEX003"
                },
                new Product
                {
                    Name = "Abstract Tapestry",
                    Description = "Large wall tapestry with bold, artistic design",
                    Price = 199.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-4.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "abstract-tapestry",
                    CategoryId = 4,
                    Sku = "TEX004"
                },
                new Product
                {
                    Name = "Whimsical Bed Sheets",
                    Description = "Queen size bed sheet set with playful patterns",
                    Price = 79.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-5.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "whimsical-bed-sheets",
                    CategoryId = 4,
                    Sku = "TEX005"
                },
                new Product
                {
                    Name = "Trippy Table Runner",
                    Description = "Dining table runner with kaleidoscopic design",
                    Price = 39.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-6.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "trippy-table-runner",
                    CategoryId = 4,
                    Sku = "TEX006"
                },
                new Product
                {
                    Name = "Fantasy Blanket Throw",
                    Description = "Cozy throw blanket with magical, otherworldly design",
                    Price = 69.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-7.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "fantasy-blanket-throw",
                    CategoryId = 4,
                    Sku = "TEX007"
                },
                new Product
                {
                    Name = "Artistic Floor Cushions",
                    Description = "Set of 6 floor cushions for bohemian seating",
                    Price = 149.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-8.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "artistic-floor-cushions",
                    CategoryId = 4,
                    Sku = "TEX008"
                },
                new Product
                {
                    Name = "Mystical Window Valance",
                    Description = "Decorative window valance with enchanting patterns",
                    Price = 49.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-9.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "mystical-window-valance",
                    CategoryId = 4,
                    Sku = "TEX009"
                },
                new Product
                {
                    Name = "Dreamscape Duvet Cover",
                    Description = "King size duvet cover with dreamy, surreal artwork",
                    Price = 119.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-10.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "dreamscape-duvet-cover",
                    CategoryId = 4,
                    Sku = "TEX010"
                },
                new Product
                {
                    Name = "Surreal Bath Towel Set",
                    Description = "Luxury bath towel set with abstract artistic design",
                    Price = 89.99m,
                    Image = "/images/products/textil/freaky-furniture-ai-cs-11.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "surreal-bath-towel-set",
                    CategoryId = 4,
                    Sku = "TEX011"
                },

                // Dekoration (Decoration) - Category ID 5 - Using detaljer folder
                new Product
                {
                    Name = "Psychedelic Wall Art",
                    Description = "Large canvas print with vibrant, mind-bending artwork",
                    Price = 199.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-1.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "psychedelic-wall-art",
                    CategoryId = 5,
                    Sku = "DEK001"
                },
                new Product
                {
                    Name = "Cosmic Mirror Set",
                    Description = "Set of 3 decorative mirrors with galaxy-themed frames",
                    Price = 149.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-2.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "cosmic-mirror-set",
                    CategoryId = 5,
                    Sku = "DEK002"
                },
                new Product
                {
                    Name = "Abstract Sculpture",
                    Description = "Table-top sculpture with impossible geometric forms",
                    Price = 299.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-3.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "abstract-sculpture",
                    CategoryId = 5,
                    Sku = "DEK003"
                },
                new Product
                {
                    Name = "Whimsical Vase Collection",
                    Description = "Set of 5 vases with playful, artistic designs",
                    Price = 129.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-4.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "whimsical-vase-collection",
                    CategoryId = 5,
                    Sku = "DEK004"
                },
                new Product
                {
                    Name = "Surreal Clock Art",
                    Description = "Functional wall clock that's also a work of art",
                    Price = 179.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-5.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "surreal-clock-art",
                    CategoryId = 5,
                    Sku = "DEK005"
                },
                new Product
                {
                    Name = "Fantasy Candle Holders",
                    Description = "Set of decorative candle holders with magical appeal",
                    Price = 79.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-6.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "fantasy-candle-holders",
                    CategoryId = 5,
                    Sku = "DEK006"
                },
                new Product
                {
                    Name = "Trippy Photo Frames",
                    Description = "Collection of 8 photo frames with kaleidoscopic borders",
                    Price = 99.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-7.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "trippy-photo-frames",
                    CategoryId = 5,
                    Sku = "DEK007"
                },
                new Product
                {
                    Name = "Artistic Plant Stands",
                    Description = "Set of 3 plant stands with abstract, sculptural design",
                    Price = 189.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-8.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "artistic-plant-stands",
                    CategoryId = 5,
                    Sku = "DEK008"
                },
                new Product
                {
                    Name = "Mystical Wind Chimes",
                    Description = "Beautiful wind chimes with enchanting, otherworldly tones",
                    Price = 59.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-9.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "mystical-wind-chimes",
                    CategoryId = 5,
                    Sku = "DEK009"
                },
                new Product
                {
                    Name = "Dreamlike Bookends",
                    Description = "Pair of decorative bookends with surreal design elements",
                    Price = 89.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-10.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "dreamlike-bookends",
                    CategoryId = 5,
                    Sku = "DEK010"
                },
                new Product
                {
                    Name = "Psychedelic Lamp Base",
                    Description = "Unique lamp base with mind-bending patterns and colors",
                    Price = 149.99m,
                    Image = "/images/products/detaljer/freaky-furniture-ai-cs-11.jpg",
                    Brand = "Freaky Furniture",
                    UrlSlug = "psychedelic-lamp-base",
                    CategoryId = 5,
                    Sku = "DEK011"
                }
            };

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
            logger.LogInformation($"✅ Seeded {products.Count} Freaky Furniture products with correct image paths");
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
