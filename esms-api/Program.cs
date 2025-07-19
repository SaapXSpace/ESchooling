using API.Environment.Register;
using API.Layers.ContextLayer;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
            {
                options.AddPolicy("mycors",
                    builder => builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        );
            });
// var LocalConnection = builder.Configuration.GetConnectionString("Local");
builder.Services.AddControllers();

builder.Services.ConnectionConfigure();
builder.Services.ConfigureVersioning();
builder.Services.ConfigureAuthentication();
builder.Services.AddMemoryCache();
builder.Services.AddMvc(options =>
{
    options.CacheProfiles.Add("CustomCacheProfile", new CacheProfile
    {
        Duration = 60, // Cache for 1 minute
        Location = ResponseCacheLocation.Any,
        NoStore = false
    });
});

// Add services to the container.

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

//builder.Services.ConfigureCoresPolicy();
builder.Services.ConfigureProcessor();

builder.Services.ConfigureSwaggerGeneration();

var app = builder.Build();

// Swagger
app.UseStaticFiles(); 
app.UseRouting();
// CORS
app.UseCors("mycors");

// Static files (e.g. for serving uploaded teacher images)

// HTTPS & Auth
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseCors("mycors");  
app.UseAuthorization();

// Controller Mapping
app.MapControllers();

// Final endpoint execution
app.Run();
