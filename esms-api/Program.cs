using API.Environment.Register;
using API.Layers.ContextLayer;
using API.Processor.Payroll;
using API.Processor;
using Microsoft.AspNetCore.Mvc;
using API.Views.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using API.Manager.Payroll.Setup;
using API.Processor.Admin;
using API.Manager.Payroll;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("mycors", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

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
builder.Services.AddScoped<StudentManager>();
builder.Services.AddScoped<IProcessor<StudentBaseModel>, StudentProcessor>();
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
builder.Services.ConfigureSwaggerGeneration();

var app = builder.Build();

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
    
// }
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("mycors");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseCors("mycors");  
app.UseAuthorization();
app.MapControllers();
app.Run();
