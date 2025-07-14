using API.Environment.Register;
using API.Layers.ContextLayer;
using API.Manager.Payroll;
using API.Manager;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using API.Processor.Payroll;
using API.Processor;
using API.Views.Payroll;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("mycors", builder =>
    {
        builder.WithOrigins("https://localhost:7088")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials(); // Only needed if you're using cookies or Authorization headers
    });
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
builder.Services.AddSwaggerGen();

//builder.Services.ConfigureCoresPolicy();
builder.Services.ConfigureProcessor();
builder.Services.AddScoped<IManager, TeacherManager>();
builder.Services.AddScoped<IProcessor<TeacherBaseModel>, TeacherProcessor>();

builder.Services.ConfigureSwaggerGeneration();

var app = builder.Build();

// Swagger
app.UseSwagger();
app.UseSwaggerUI();
app.UseStaticFiles(); 
app.UseRouting();
// CORS
app.UseCors("mycors");

// Static files (e.g. for serving uploaded teacher images)

// HTTPS & Auth
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// Controller Mapping
app.MapControllers();

// Final endpoint execution
app.Run();
