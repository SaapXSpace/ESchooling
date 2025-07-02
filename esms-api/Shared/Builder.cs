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
                //case Enums.ModuleClassName.CourseCategory:{
                //    return new CourseCategoryManager(_context);
                //}
                //case Enums.ModuleClassName.Course:{
                //    return new CourseManager(_context);
                //}
                //case Enums.ModuleClassName.BankType:{
                //    return new BankTypeManager(_context);
                //}
                //case Enums.ModuleClassName.AccountHead:{
                //    return new AccountHeadManager(_context);
                //}
                //case Enums.ModuleClassName.Currency:{
                //    return new CurrencyManager(_context);
                //}
                //case Enums.ModuleClassName.BankAccount:{
                //    return new BankAccountManager(_context);
                //}
                // case Enums.ModuleClassName.DocumentType:{
                //    return new DocumentTypeManager(_context);
                //}
                //case Enums.ModuleClassName.StudentProfile:{
                //    return new StudentProfileManager(_context);
                //} 
                //case Enums.ModuleClassName.FeeVoucher:{
                //    return new FeeVoucherManager(_context);
                //} 
                //case Enums.ModuleClassName.Payment:{
                //    return new PaymentManager(_context);
                //}
                // case Enums.ModuleClassName.Ledger:{
                //    return new LedgerManager(_context);
                //}
                //case Enums.ModuleClassName.Certificate:{
                //    return new CertificateManager(_context);
                //}
                
                default:
                    return null;
            }
        }
    }
}