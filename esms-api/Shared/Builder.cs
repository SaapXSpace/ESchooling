using API.Layers.ContextLayer;
using API.Manager;
using API.Manager.Payroll.Setup;
using API.Repository;

namespace API.Shared
{
    public static class Builder
    {
        public static IManager? MakeManagerClass(Enums.ModuleClassName ClassName, AppDBContext _context){
            switch (ClassName)
            {
                case Enums.ModuleClassName.Company:{
                    return new CompanyManager(_context);
                }
                case Enums.ModuleClassName.Branch:{
                    return new BranchManager(_context);
                }
                case Enums.ModuleClassName.MenuModule:{
                    return new MenuModuleManager(_context);
                }
                case Enums.ModuleClassName.MenuCategory:{
                    return new MenuCategoryManager(_context);
                }
                case Enums.ModuleClassName.MenuSubCategory:{
                    return new MenuSubCategoryManager(_context);
                }
                case Enums.ModuleClassName.Department:{
                    return new DepartmentManager(_context);
                }
                case Enums.ModuleClassName.UserRole:{
                    return new UserRoleManager(_context);
                }
                case Enums.ModuleClassName.User:{
                    return new UserManager(_context);
                }

                default:
                    return null;
            }
        }
    }
}