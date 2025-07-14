
using API.Models;
using API.Processor;
using API.Processor.Admin;
using API.Processor.Payroll.Setup;
using API.Repository;
using API.Views.Shared;

namespace API.Environment.Register{
    public static class ServiceRegister
    {
        public static void ConfigureProcessor(this IServiceCollection services)
        {
            #region CONFIGURATION
                ConfigureConfigurationProcessor(services);
            #endregion

            #region ACCOUNTS
                ConfigureAccountsProcessor(services);
            #endregion

            #region PAYROLL
                ConfigurePayrollProcessor(services);
            #endregion

            #region SERVICE REPOSITORY
                ConfigureServiceRepository(services);
            #endregion
            
        }

        private static void ConfigureConfigurationProcessor(IServiceCollection services)
        {
            services.AddScoped<IProcessor<CompanyBaseModel>, CompanyProcessor>();
            services.AddScoped<IProcessor<BranchBaseModel>, BranchProcessor>();
            services.AddScoped<IProcessor<MenuModuleBaseModel>, MenuModuleProcessor>();
            services.AddScoped<IProcessor<MenuCategoryBaseModel>, MenuCategoryProcessor>();
            services.AddScoped<IProcessor<MenuSubCategoryBaseModel>, MenuSubCategoryProcessor>();
            services.AddScoped<IProcessor<UserRoleBaseModel>, UserRoleProcessor>();
            services.AddScoped<IProcessor<UsersBaseModel>, UserProcessor>();
        }

        private static void ConfigurePayrollProcessor(IServiceCollection services)
        {
             services.AddScoped<IProcessor<DepartmentBaseModel>, DepartmentProcessor>();
            services.AddScoped<IProcessor<ClassroomBaseModel>,ClassroomProcessor>();
        }

        private static void ConfigureAccountsProcessor(IServiceCollection services)
        {
             //services.AddScoped<IProcessor<BankTypeBaseModel>, BankTypeProcessor>();
             
        }

        
        public static void ConfigureServiceRepository(IServiceCollection services){

            #region ServiceRepository
            
                services.AddScoped<IConfigurationServiceRepository, ConfigurationServiceRepository>();
                services.AddScoped<IAuthServiceRepository, AuthServiceRepository>();
                services.AddScoped<IVerificationServiceRepository, VerificationServiceRepository>();
                services.AddScoped<IDashboardServiceRepository, DashboardServiceRepository>();
                
            #endregion
            
        }
        
    }
}