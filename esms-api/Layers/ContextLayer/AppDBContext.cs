using System;
using System.Linq;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Layers.ContextLayer 
{
    public class AppDBContext : DbContext
    {
        
        private readonly IHttpContextAccessor _httpContextAccessor;
        public AppDBContext(DbContextOptions<AppDBContext> option) : base(option)
        {

        }
        


        public AppDBContext(DbContextOptions<AppDBContext> options, IHttpContextAccessor httpContextAccessor) : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        #region CONFIGURATION
            
            public DbSet<Company> Companies { get; set; }
            public DbSet<Branch> Branches { get; set; }
            public DbSet<MenuModule> MenuModules { get; set; }
            public DbSet<MenuCategory> MenuCategories { get; set; }
            public DbSet<MenuSubCategory> MenuSubCategories { get; set; }
            
            public DbSet<UserRole> UserRoles { get; set; }
            public DbSet<UsersPermissions> UsersPermissions { get; set; }
            public DbSet<UserLoginAudit> UserLoginAudits { get; set; }
            public DbSet<User> Users { get; set; }
            
        #endregion

        #region PAYROLL

            public DbSet<Department> Departments { get; set; }
            public DbSet<Designation> Designations { get; set; }

        #endregion

        #region ACCOUNTS



        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                var tableName = entityType.GetTableName();
                if (tableName.StartsWith("AspNet"))
                {
                    entityType.SetTableName(tableName.Substring(6));
                }
            }

            foreach (var foreignKey in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
            }
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");
        }
    }    
}