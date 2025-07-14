using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using API.Layers.ContextLayer;
using API.Manager;
using API.Manager.Payroll.Setup;
using API.Models;
using API.Views.Shared;
using Microsoft.EntityFrameworkCore;

namespace API.Shared
{
    public static class SecurityHelper
    {
        public static string GetRandomKey (int length) {
            Random random = new Random ();
            var chars = "0123456789012345678901234567890123456789";
            return new string (chars.Select (c => chars[random.Next (chars.Length)]).Take (length).ToArray ());
        }

        public static string EncryptString (string key, string plainText) {
            byte[] iv = new byte[16];
            //byte[] iv = new byte[key.Length];
            byte[] array;

            using (Aes aes = Aes.Create ()) {
                aes.Key = Encoding.UTF8.GetBytes (key);
                aes.IV = iv;

                ICryptoTransform encryptor = aes.CreateEncryptor (aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream ()) {
                    using (CryptoStream cryptoStream = new CryptoStream ((Stream) memoryStream, encryptor, CryptoStreamMode.Write)) {
                        using (StreamWriter streamWriter = new StreamWriter ((Stream) cryptoStream)) {
                            streamWriter.Write (plainText);
                        }

                        array = memoryStream.ToArray ();
                    }
                }
            }
            return Convert.ToBase64String (array);
        }

        public static string DecryptString (string key, string cipherText) {
            byte[] iv = new byte[16];
            //byte[] iv = new byte[key.Length];
            byte[] buffer = Convert.FromBase64String (cipherText);

            using (Aes aes = Aes.Create ()) {
                aes.Key = Encoding.UTF8.GetBytes (key);
                aes.IV = iv;
                ICryptoTransform decryptor = aes.CreateDecryptor (aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream (buffer)) {
                    using (CryptoStream cryptoStream = new CryptoStream ((Stream) memoryStream, decryptor, CryptoStreamMode.Read)) {
                        using (StreamReader streamReader = new StreamReader ((Stream) cryptoStream)) {
                            return streamReader.ReadToEnd ();
                        }
                    }
                }
            }
        }

        public async static Task<ApiResponse> KeyValidation(string _Key)
        {
            ApiResponse apiResponse = new ApiResponse();
            if (_Key == null)
            {
                apiResponse.statusCode = StatusCodes.Status403Forbidden.ToString();
                apiResponse.message = "Invalid Key";
                return apiResponse;
            }

            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", false)
                .Build();

            string _connectionString = configuration.GetConnectionString("Local").ToString();
            var options = new DbContextOptionsBuilder<AppDBContext>()
                .UseSqlServer(_connectionString)
                .Options;

            var httpContextAccessor = new HttpContextAccessor();
            AppDBContext _context = new AppDBContext(options, httpContextAccessor);

           
            var _UserKey = await _context.UserLoginAudits.Include(x => x.Companies).Include(x => x.Branches).Where(x => x.Key == _Key && x.Status == true).FirstOrDefaultAsync();
            if (_UserKey == null)
            {
                apiResponse.statusCode = StatusCodes.Status403Forbidden.ToString();
                apiResponse.message = "Invalid Key";
                return apiResponse;
            }
            
            UserLoginInfoViewModel _UserLoginInfoViewModel = new UserLoginInfoViewModel();
            _UserLoginInfoViewModel.BranchId = _UserKey.BranchId;
            _UserLoginInfoViewModel.CompanyId = _UserKey.CompanyId;
            _UserLoginInfoViewModel.CompanyName = _UserKey.Companies.Name;
            _UserLoginInfoViewModel.BranchName = _UserKey.Branches.Name;

            apiResponse.statusCode = StatusCodes.Status200OK.ToString();
            apiResponse.data = _UserLoginInfoViewModel;
            return apiResponse;
        }

        public static string security(string UserInfo)
        {
            string secpwd = "";
            SHA1CryptoServiceProvider sha = new SHA1CryptoServiceProvider();
            Byte[] data = System.Text.ASCIIEncoding.Default.GetBytes(UserInfo.ToString().Trim());
            secpwd = BitConverter.ToString(sha.ComputeHash(data));
            return secpwd.Substring(0, 50);
        }


        public static async Task<ApiResponse> UserMenuPermissionAsync(Guid _MenuId, ClaimsPrincipal _User)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", false)
                .Build();

            string _connectionString = configuration.GetConnectionString("Local").ToString();
            var options = new DbContextOptionsBuilder<AppDBContext>()
                .UseSqlServer(_connectionString)
                .Options;

            var httpContextAccessor = new HttpContextAccessor();
            AppDBContext _context = new AppDBContext(options, httpContextAccessor);

            ApiResponse apiResponse = new ApiResponse();
            foreach (var claim in _User.Claims)
            {
                Console.WriteLine($"{claim.Type}: {claim.Value}");
            }
            string _Key = _User.Claims.FirstOrDefault(c => c.Type == Enums.Misc.Key.ToString())?.Value ?? "";
             var _Permission = await (from _UserKey in _context.UserLoginAudits
                                     join _Users in _context.Users on _UserKey.UserId equals _Users.Id
                                     join _UserRolePermission in _context.UsersPermissions on _Users.Id equals _UserRolePermission.UserId
                                     join _UserMenu in _context.MenuSubCategories on _UserRolePermission.MenuId equals _UserMenu.Id
                                     join _Company in _context.Companies on _UserKey.CompanyId equals _Company.Id
                                     join _Branch in _context.Branches on _UserKey.BranchId equals _Branch.Id
                                     where _UserKey.Key == _Key && _UserRolePermission.MenuId == _MenuId
                                     && (_UserRolePermission.Show_Permission == true || _UserRolePermission.Insert_Permission == true || _UserRolePermission.Update_Permission == true || _UserRolePermission.Delete_Permission == true || _UserRolePermission.Print_Permission == true || _UserRolePermission.Check_Permission == true || _UserRolePermission.Approve_Permission == true)
                                     select new GetUserPermissionViewModel
                                     {
                                         MenuId = _UserRolePermission.MenuId,
                                         MenuName = _UserMenu.Name,
                                         MenuAlias = _UserMenu.Alias,
                                         CompanyId = _UserKey.CompanyId,
                                         BranchId = _UserKey.BranchId,
                                         PermissionDateFrom = _Users.PermitForm,
                                         PermissionDateTo = _Users.PermitTo,
                                         View_Permission = _UserRolePermission.Show_Permission,
                                         Insert_Permission = _UserRolePermission.Insert_Permission,
                                         Update_Permission = _UserRolePermission.Update_Permission,
                                         Delete_Permission = _UserRolePermission.Delete_Permission,
                                         Check_Permission = _UserRolePermission.Check_Permission,
                                         Approve_Permission = _UserRolePermission.Approve_Permission,
                                         Print_permission = _UserRolePermission.Print_Permission,
                                         CompanyName = _Company.Name,
                                     }).FirstOrDefaultAsync();
            if (_Permission == null)
            {
                apiResponse.statusCode = StatusCodes.Status403Forbidden.ToString();
                apiResponse.message = "Invalid Permission";
                return apiResponse;
            }


            apiResponse.statusCode = StatusCodes.Status200OK.ToString();
            apiResponse.data = _Permission;
            return apiResponse;
        }
    }
}