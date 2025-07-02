using System;
using System.Runtime.InteropServices;
using API.Layers.ContextLayer;
using Microsoft.EntityFrameworkCore;

namespace API.Environment.Register{
    public static class ConfigureConnection
    {
        public static void ConnectionConfigure(this IServiceCollection services)
        {
            var configuration = new ConfigurationBuilder ()
                .SetBasePath (Directory.GetCurrentDirectory ())
                .AddJsonFile ("appsettings.json", false)
                .Build ();
            var connection = String.Empty;
            connection = configuration.GetConnectionString ("Local").ToString ();
            if(connection != string.Empty) 
                services.AddDbContext<AppDBContext>(Options => Options.UseSqlServer(connection));
        }
    }
}