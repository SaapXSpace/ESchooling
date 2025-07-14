using System.Reflection;
using System;
using API.Layers.ContextLayer;
using API.Models;
using API.Shared;
using Microsoft.EntityFrameworkCore;
using API.Views.Shared;
using API.Views.Service;
using System.Security.Claims;

namespace API.Repository {
    public interface IConfigurationServiceRepository
    {
        //LOV's
       Task<ApiResponse> GetDepartmentsLovAsync (string? _Search);
        Task<ApiResponse> GetClassroomLovAsync(string? _Search);
        Task<ApiResponse> GetMenuInitializerAsync (ClaimsPrincipal _User);
       Task<ApiResponse> GetUserRolesLovAsync (string? _Search, ClaimsPrincipal User);
       Task<ApiResponse> GetCompanyLovAsync (string? _Search);
       Task<ApiResponse> GetBranchLovAsync (string? _Search);
       Task<ApiResponse> GetUserLoginLovAsync (string? _Search);
       Task<ApiResponse> GetMenuModuleLovAsync (string? _Search);
       Task<ApiResponse> GetMenuCategoryLovAsync (string? _Search);  
       Task<ApiResponse>  GetUserByRoleLovAsync(Guid _role,string? _Search);
       Task<ApiResponse> GetMenuOrMenuPermissionUserWiseAsync(object model ,ClaimsPrincipal _User);  
       Task<ApiResponse> UpdateUserRolePermissionAsync(object model ,ClaimsPrincipal _User);  

       
    }

    public class ConfigurationServiceRepository : IConfigurationServiceRepository
    {
        private readonly AppDBContext _context;

        public ConfigurationServiceRepository (AppDBContext context) {
            _context = context;
        }

        public async Task<ApiResponse> GetMenuInitializerAsync(ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse ();
            try {

                var _UserId = _User.Claims.FirstOrDefault(c => c.Type == Enums.Misc.UserId.ToString())?.Value.ToString();
                var _menus = await (
                from users in _context.Users
                join userPermissions in _context.UsersPermissions on users.Id equals userPermissions.UserId
                join menus in _context.MenuSubCategories on userPermissions.MenuId equals menus.Id
                join menuCategory in _context.MenuCategories on menus.MenuCategoryId equals menuCategory.Id
                join menuModule in _context.MenuModules on menus.MenuModuleId equals menuModule.Id
                where menus.Action != Enums.Operations.D.ToString() && menus.Active == true && menus.View == true && userPermissions.Show_Permission== true
                && menuCategory.Active == true && menuModule.Active == true && users.Id == Guid.Parse(_UserId)
                orderby menus.Name
                select new MenuInitializerServicesViewModel
                {
                    MenuId = menus.Id,
                    MenuName = menus.Name,
                    MenuAlias = menus.Alias,
                    MenuIcon = menus.Icon,
                    MenuURL = "/" + menuModule.Name + "/" + menuCategory.Name + "/" + menus.Name ,
                    MenuView = menus.View,
                    MenuCategoryId = menus.MenuCategoryId,
                    MenuCategoryName = menuCategory.Name,
                    MenuCategoryIcon = menuCategory.Icon,
                    ModuleId = menus.MenuModuleId,
                    ModuleName = menuModule.Name,
                    ModuleIcon = menuModule.Icon,
                }
            ).ToListAsync();
                
                // var _menus = await (from menus in _context.MenuSubCategories
                // .Include(x => x.MenuCategory)
                // .Include(x => x.MenuModule)
                // .Where (a => a.Action != Enums.Operations.D.ToString () && a.Active == true && a.View == true && a.MenuCategory.Active == true && a.MenuModule.Active == true )
                // select new MenuInitializerServicesViewModel {
                //         MenuId = menus.Id,
                //         MenuName = menus.Name,
                //         MenuAlias = menus.Alias,
                //         MenuIcon = menus.Icon,
                //         MenuURL = "/" +menus.MenuModule.Name+"/"+menus.MenuCategory.Name+"/"+menus.Name,
                //         MenuView = menus.View,
                //         MenuCategoryId = menus.MenuCategoryId,
                //         MenuCategoryName = menus.MenuCategory.Name,
                //         MenuCategoryIcon = menus.MenuCategory.Icon,
                //         ModuleId = menus.MenuModuleId,
                //         ModuleName = menus.MenuModule.Name,
                //         ModuleIcon = menus.MenuModule.Icon,
                       
                // }).OrderBy (o => o.MenuName).ToListAsync ();

                if (_menus == null) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }
                if (_menus.Count == 0) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.data = _menus;
                return apiResponse;

            } catch (Exception e) {

                string innerexp = "";
                if (e.InnerException != null) {
                    innerexp = " Inner Error : " + e.InnerException.ToString ();
                }
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = e.Message.ToString () + innerexp;
                return apiResponse;
            }
        }


        public async Task<ApiResponse> GetDepartmentsLovAsync(string? _Search)
        {
            var apiResponse = new ApiResponse ();
            try {

                var _departments = await (from departments in _context.Departments
                .Where (a => a.Action != Enums.Operations.D.ToString () && a.Active == true && string.IsNullOrEmpty (_Search) ? true : a.Name.Contains (_Search))
                select new ListOfViewServicesModel {
                        Id = departments.Id,
                        Name = departments.Name
                }).OrderBy (o => o.Name).ToListAsync ();

                if (_departments == null) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }
                if (_departments.Count == 0) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.data = _departments;
                return apiResponse;

            } catch (Exception e) {

                string innerexp = "";
                if (e.InnerException != null) {
                    innerexp = " Inner Error : " + e.InnerException.ToString ();
                }
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = e.Message.ToString () + innerexp;
                return apiResponse;
            }
        }

        public async Task<ApiResponse> GetClassroomLovAsync(string? _Search)
        {
            var apiResponse = new ApiResponse();
            try
            {
                var _classrooms = await (from classroom in _context.Classrooms
                                         where classroom.DeletedAt == null &&
                                               classroom.Active == true &&
                                               (string.IsNullOrEmpty(_Search) ||
                                               classroom.RoomNumber.Contains(_Search) ||
                                               classroom.RoomType.Contains(_Search) ||
                                               classroom.Location.Contains(_Search))
                                         select new ListOfViewServicesModel
                                         {
                                             Id = classroom.Id,
                                             Name = $"{classroom.RoomNumber} - {classroom.RoomType}",
                                             
                                         })
                                        .OrderBy(o => o.Name)
                                        .ToListAsync();

                if (_classrooms == null)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "No classrooms found";
                    return apiResponse;
                }
                if (_classrooms.Count == 0)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "No classrooms match the search criteria";
                    return apiResponse;
                }

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.data = _classrooms;
                return apiResponse;
            }
            catch (Exception e)
            {
                string innerexp = "";
                if (e.InnerException != null)
                {
                    innerexp = " Inner Error: " + e.InnerException.ToString();
                }
                apiResponse.statusCode = StatusCodes.Status500InternalServerError.ToString();
                apiResponse.message = "Error retrieving classrooms: " + e.Message + innerexp;
                return apiResponse;
            }
        }
        public async Task<ApiResponse> GetUserRolesLovAsync(string? _Search, ClaimsPrincipal User)
        {
            var apiResponse = new ApiResponse ();
            try {

                var _Role = User.Claims.FirstOrDefault (c => c.Type == Enums.Misc.Role.ToString ())?.Value.ToString ();
                
                var _userroles = new List<ListOfViewServicesModel>();
                if (_Role == "Super Admin")
                {
                    _userroles = await (from userroles in _context.UserRoles
                    .Where (a => a.Action != Enums.Operations.D.ToString () && a.Active == true && string.IsNullOrEmpty (_Search) ? true : a.Role.Contains (_Search))
                    select new ListOfViewServicesModel {
                            Id = userroles.Id,
                            Name = userroles.Role
                    }).OrderBy (o => o.Name).ToListAsync ();
                }else{
                    _userroles = await (from userroles in _context.UserRoles
                    .Where (a => a.Action != Enums.Operations.D.ToString () && a.Active == true && a.Role != "Super Admin" && string.IsNullOrEmpty (_Search) ? true : a.Role.Contains (_Search))
                    select new ListOfViewServicesModel {
                            Id = userroles.Id,
                            Name = userroles.Role
                    }).OrderBy (o => o.Name).ToListAsync ();
                }

                if (_userroles == null) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }
                if (_userroles.Count == 0) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.data = _userroles;
                return apiResponse;

            } catch (Exception e) {

                string innerexp = "";
                if (e.InnerException != null) {
                    innerexp = " Inner Error : " + e.InnerException.ToString ();
                }
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = e.Message.ToString () + innerexp;
                return apiResponse;
            }
        }

        public async Task<ApiResponse> GetCompanyLovAsync(string? _Search)
        {
            var apiResponse = new ApiResponse ();
            try {

                var _Company = await (from company in _context.Companies
                .Where (a => a.Action != Enums.Operations.D.ToString () && a.Active == true && string.IsNullOrEmpty (_Search) ? true : a.Name.Contains (_Search))
                select new ListOfViewServicesModel {
                        Id = company.Id,
                        Name = company.Name
                }).OrderBy (o => o.Name).ToListAsync ();

                if (_Company == null) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }
                if (_Company.Count == 0) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.data = _Company;
                return apiResponse;

            } catch (Exception e) {

                string innerexp = "";
                if (e.InnerException != null) {
                    innerexp = " Inner Error : " + e.InnerException.ToString ();
                }
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = e.Message.ToString () + innerexp;
                return apiResponse;
            }
        }

        public async Task<ApiResponse> GetBranchLovAsync(string? _Search)
        {
            var apiResponse = new ApiResponse ();
            try {

                var _Branch = await (from branch in _context.Branches
                .Where (a => a.Action != Enums.Operations.D.ToString () && a.Active == true && string.IsNullOrEmpty (_Search) ? true : a.Name.Contains (_Search))
                select new ListOfViewServicesModel {
                        Id = branch.Id,
                        Name = branch.Name
                }).OrderBy (o => o.Name).ToListAsync ();

                if (_Branch == null) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }
                if (_Branch.Count == 0) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.data = _Branch;
                return apiResponse;

            } catch (Exception e) {

                string innerexp = "";
                if (e.InnerException != null) {
                    innerexp = " Inner Error : " + e.InnerException.ToString ();
                }
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = e.Message.ToString () + innerexp;
                return apiResponse;
            }
        }


        public async Task<ApiResponse> GetUserLoginLovAsync(string? _Search)
        {
            var apiResponse = new ApiResponse ();
            try {

                var _userlogin = await (from userlogin in _context.UserLoginAudits
                .Include(u => u.Users)
                .Include(u => u.Users.UserRole)
                //.Include(u => u.Users.Departments)
                select new UserLoginViewModel {
                        User = userlogin.Users.NormalizedName,
                        Role = userlogin.Users.UserRole.Role,
                        //Department = userlogin.Users.Departments.Name,
                        IP = userlogin.Ip,
                        //Mac = userlogin.Mac,
                        PC = userlogin.PC ,
                        //Date = userlogin.Date,
                }).OrderBy (o => o.Date).ToListAsync ();

                if (_userlogin == null) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }
                if (_userlogin.Count == 0) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.data = _userlogin;
                return apiResponse;

            } catch (Exception e) {

                string innerexp = "";
                if (e.InnerException != null) {
                    innerexp = " Inner Error : " + e.InnerException.ToString ();
                }
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = e.Message.ToString () + innerexp;
                return apiResponse;
            }
        }

        public async Task<ApiResponse> GetMenuModuleLovAsync(string? _Search)
        {
            var apiResponse = new ApiResponse ();
            try {

                var _MenuModule = await (from menumodule in _context.MenuModules
                .Where (a => a.Action != Enums.Operations.D.ToString () && a.Active == true && string.IsNullOrEmpty (_Search) ? true : a.Name.Contains (_Search))
                select new ListOfViewServicesModel {
                        Id = menumodule.Id,
                        Name = menumodule.Name
                }).OrderBy (o => o.Name).ToListAsync ();

                if (_MenuModule == null) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }
                if (_MenuModule.Count == 0) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.data = _MenuModule;
                return apiResponse;

            } catch (Exception e) {

                string innerexp = "";
                if (e.InnerException != null) {
                    innerexp = " Inner Error : " + e.InnerException.ToString ();
                }
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = e.Message.ToString () + innerexp;
                return apiResponse;
            }
        }

        public async Task<ApiResponse> GetMenuCategoryLovAsync(string? _Search)
        {
            var apiResponse = new ApiResponse ();
            try {

                var _MenuCategory = await (from menucategory in _context.MenuCategories
                .Where (a => a.Action != Enums.Operations.D.ToString () && a.Active == true && string.IsNullOrEmpty (_Search) ? true : a.Name.Contains (_Search))
                select new ListOfViewServicesModel {
                        Id = menucategory.Id,
                        Name = menucategory.Name
                }).OrderBy (o => o.Name).ToListAsync ();

                if (_MenuCategory == null) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }
                if (_MenuCategory.Count == 0) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.data = _MenuCategory;
                return apiResponse;

            } catch (Exception e) {

                string innerexp = "";
                if (e.InnerException != null) {
                    innerexp = " Inner Error : " + e.InnerException.ToString ();
                }
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = e.Message.ToString () + innerexp;
                return apiResponse;
            }
        }   

        public async Task<ApiResponse> GetUserByRoleLovAsync(Guid _role,string? _Search)
        {
            var apiResponse = new ApiResponse ();
            try {

                var _User = await (from user in _context.Users
                .Where (a => a.RoleId == _role && a.Action != Enums.Operations.D.ToString () && a.Active == true && string.IsNullOrEmpty (_Search) ? true : a.NormalizedName.Contains (_Search))
                select new ListOfViewServicesModel {
                        Id = user.Id,
                        Name = "["+ user.Code +"] - " + user.NormalizedName
                }).OrderBy (o => o.Name).ToListAsync ();

                if (_User == null) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }
                if (_User.Count == 0) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.data = _User;
                return apiResponse;

            } catch (Exception e) {

                string innerexp = "";
                if (e.InnerException != null) {
                    innerexp = " Inner Error : " + e.InnerException.ToString ();
                }
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = e.Message.ToString () + innerexp;
                return apiResponse;
            }
        }   


        public async Task<ApiResponse> GetMenuOrMenuPermissionUserWiseAsync(object model ,ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse ();
            try {
                
                var _model = (MenuPermissionPayLoadServicesModel) model;
                var _Role = _User.Claims.FirstOrDefault (c => c.Type == Enums.Misc.Role.ToString ())?.Value.ToString ();

                 var _Table = await _context.UserRoles.Where (a => a.Id == _model.RoleId).FirstOrDefaultAsync ();
                if (_Table == null) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Role not found";
                    return apiResponse;
                }
                
                List<UsersPermissions> _TableRolePermission = (List<UsersPermissions>) await _context.UsersPermissions.Where (x => x.RoleId == _model.RoleId && x.UserId == _model.UserId).ToListAsync ();
                List<UsersPermissions> _TableSuperAdminRolePermission = (List<UsersPermissions>) await _context.UsersPermissions.Where (x => x.UserRoles.Role == "Super Admin").ToListAsync ();
                
                List<MenuPermissionViewModel> _MenuPerView = new List<MenuPermissionViewModel> ();

                var _Menu = await _context.MenuSubCategories.Include (s => s.MenuCategory).Include (c => c.MenuModule).Where (x => x.Active == true  && x.MenuModule.Active == true && x.MenuCategory.Active == true && x.Action != Enums.Operations.D.ToString ()).ToListAsync ();
                foreach (var item in _Menu) {

                    var _Permission = _TableRolePermission.Where (x => x.MenuId == item.Id).FirstOrDefault ();
                    var _AdminPermission = _TableSuperAdminRolePermission.Where (x => x.MenuId == item.Id).FirstOrDefault ();
                    bool _View = false, _Insert = false, _Update = false, _Delete = false, _Print = false, _Check = false, _Approve = false, _Allow = false;
                    if (_Permission != null) {
                        _View = _Permission.Show_Permission;
                        _Insert = _Permission.Insert_Permission;
                        _Update = _Permission.Update_Permission;
                        _Delete = _Permission.Delete_Permission;
                        _Print = _Permission.Print_Permission;
                        _Check = _Permission.Check_Permission;
                        _Approve = _Permission.Approve_Permission;
                        _Allow = _Permission.Allow_Permission;

                    }
                    if (_Role == "Super Admin")
                    {
                        _MenuPerView.Add (new MenuPermissionViewModel { ModuleId = item.MenuModuleId, ModuleName = item.MenuModule.Name, CategoryName = item.MenuCategory.Name, MenuId = item.Id, MenuName = item.Name.Trim (), MenuAlias = item.Alias.Trim (), Insert_Permission = _Insert, View_Permission = _View, Update_Permission = _Update, Delete_Permission = _Delete, Print_Permission = _Print, Check_Permission = _Check, Approve_Permission = _Approve, Allow_Permission = _Allow });
                    }else{
                        if (_Allow == _AdminPermission.Allow_Permission)
                        {
                            _MenuPerView.Add (new MenuPermissionViewModel { ModuleId = item.MenuModuleId, ModuleName = item.MenuModule.Name, CategoryName = item.MenuCategory.Name, MenuId = item.Id, MenuName = item.Name.Trim (), MenuAlias = item.Alias.Trim (), Insert_Permission = _Insert, View_Permission = _View, Update_Permission = _Update, Delete_Permission = _Delete, Print_Permission = _Print, Check_Permission = _Check, Approve_Permission = _Approve, Allow_Permission = _Allow });
                        }
                    }
                 }
                var _ViewModel = new MenuPermissionViewRoleModel {
                    Id = _Table.Id,
                    Name = _Table.Role,
                    menuPerViews = _MenuPerView,
                };
                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.data = _ViewModel;
                return apiResponse;


            } catch (Exception e) {

                string innerexp = "";
                if (e.InnerException != null) {
                    innerexp = " Inner Error : " + e.InnerException.ToString ();
                }
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = e.Message.ToString () + innerexp;
                return apiResponse;
            }
        }

         public async Task<ApiResponse> UpdateUserRolePermissionAsync(object model ,ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse ();
            try {

                var _request = (UserRolePermissionAddModel) model;

                var UserRolePermissions = new List<UsersPermissions> ();

                foreach (var item in _request.UserRolePermissions) {
                    var _Role = _User.Claims.FirstOrDefault (c => c.Type == Enums.Misc.Role.ToString ())?.Value.ToString ();
                    if (_Role != "Super Admin")
                    {
                        var _Table = new UsersPermissions {
                            Show_Permission = item.View_Permission,
                            Insert_Permission = item.Insert_Permission,
                            Update_Permission = item.Update_Permission,
                            Delete_Permission = item.Delete_Permission,
                            Print_Permission = item.Print_Permission,
                            Check_Permission = item.Check_Permission,
                            Approve_Permission = item.Approved_Permission,
                            RoleId = item.RolesId,
                            MenuId = item.MenuId,
                            UserId = item.UserId
                        };
                        UserRolePermissions.Add (_Table);
                    }else{
                        var _Table = new UsersPermissions {
                            Show_Permission = item.View_Permission,
                            Insert_Permission = item.Insert_Permission,
                            Update_Permission = item.Update_Permission,
                            Delete_Permission = item.Delete_Permission,
                            Print_Permission = item.Print_Permission,
                            Check_Permission = item.Check_Permission,
                            Approve_Permission = item.Approved_Permission,
                            Allow_Permission = item.Allow_Permission,
                            RoleId = item.RolesId,
                            MenuId = item.MenuId,
                            UserId = item.UserId
                        };
                        UserRolePermissions.Add (_Table);
                    }
                }
                    
                var _UserId = _User.Claims.FirstOrDefault (c => c.Type == Enums.Misc.UserId.ToString ())?.Value.ToString ();
                
                var _model = (List<UsersPermissions>) UserRolePermissions;

                var user = await _context.Users.Where(x => x.Id == _model[0].UserId && x.RoleId == _model[0].RoleId ).FirstOrDefaultAsync();
                var _modelDetails = _context.UsersPermissions.Where (a => a.RoleId == _model[0].RoleId && a.UserId == _model[0].UserId).ToList ();
                if (_modelDetails != null) {
                    foreach (var item in _modelDetails) {
                        _context.UsersPermissions.Remove (item);
                    }
                    _context.SaveChanges();
                }
                foreach (var item in _model) {
                    item.UserIdUpdate = Guid.Parse(_UserId);
                    item.UpdateDate = DateTime.Now;
                    item.Action = Enums.Operations.E.ToString ();
                    item.Type = Enums.Operations.S.ToString ();
                    await _context.UsersPermissions.AddAsync (item);
                }
                await _context.SaveChangesAsync ();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.message = "Permissions Saved for User " + user.NormalizedName;
                return apiResponse;

            } catch (Exception e) {

                string innerexp = "";
                if (e.InnerException != null) {
                    innerexp = " Inner Error : " + e.InnerException.ToString ();
                }
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = e.Message.ToString () + innerexp;
                return apiResponse;
            }
        }    

    }
}