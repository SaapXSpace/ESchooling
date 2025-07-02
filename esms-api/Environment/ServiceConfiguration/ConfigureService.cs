using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Http;
using API.Shared;
using System.Text.Json;


namespace API.Environment.Register{
    public static class ConfigureService
    {
        public static void ConfigureCoresPolicy(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        );
            });
        }

         public static void ConfigureVersioning(this IServiceCollection services)
        {
            services.AddApiVersioning(config =>
                {
                    config.DefaultApiVersion = new ApiVersion(1, 0);
                    config.AssumeDefaultVersionWhenUnspecified = true;
                    config.ReportApiVersions = true;
                });
            }

        public static void ConfigureAuthentication(this IServiceCollection services)
        {
           services.AddAuthentication(auth =>
           {
               auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
               auth.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
           })
               .AddJwtBearer(options =>
               {

                    var configuration = new ConfigurationBuilder ()
                    .SetBasePath (Directory.GetCurrentDirectory ())
                    .AddJsonFile ("appsettings.json", false)
                    .Build ();
                   options.TokenValidationParameters = new TokenValidationParameters
                   {
                       ValidateIssuer = true,
                       ValidateAudience = false,
                       ValidateIssuerSigningKey = true,
                       RequireExpirationTime = true,
                       ValidIssuer = configuration["AuthSettings:Issuer"], //some string, normally web url,
                       IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["AuthSettings:Key"]))
                   };

                   options.Events = new JwtBearerEvents
                   {
                       OnTokenValidated = context =>
                       {
                           string _TokenString = context.HttpContext.Request.Headers["Authorization"].ToString();
                           var _Token = _TokenString.Substring(7, _TokenString.Length - 7);
                           var _Handler = new JwtSecurityTokenHandler();
                           var _TokenDecode = _Handler.ReadJwtToken(_Token);
                           string _Key = _TokenDecode.Audiences.ToList()[0].ToString();
                           //SecurityHelper _SecurityHelper = new SecurityHelper();
                           var _result = SecurityHelper.KeyValidation(_Key).GetAwaiter().GetResult();
                           if (_result.statusCode != StatusCodes.Status200OK.ToString()) { 
                                context.Fail("Unauthorized User"); 
                                 context.Response.StatusCode = StatusCodes.Status403Forbidden;
                                    context.Response.Headers.Add("Content-Type", "application/json");
                                    var responseMessage = new
                                    {
                                        message = "Unauthorized User"
                                    };
                                    var responseBody = JsonSerializer.Serialize(responseMessage);
                                    context.Response.Body.Write(Encoding.UTF8.GetBytes(responseBody));
                                    context.Success(); // Mark the context as successful (no further processing)
                            }
                           return Task.CompletedTask;
                       },
                       OnAuthenticationFailed = context =>
                       {
                           if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                           {
                               context.Response.Headers.Add("Token-Expired", "true");
                           }
                           return Task.CompletedTask;
                       }
                   };
               });
        }

        public static void ConfigureSwaggerGeneration(this IServiceCollection services)
        {
           services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "SAAP✘-MTI-API", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
                });
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
                c.AddSecurityRequirement(new OpenApiSecurityRequirement {
                    {
                        new OpenApiSecurityScheme {
                            Reference = new OpenApiReference {
                                Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });
            });
        }
    }
}