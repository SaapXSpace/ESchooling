using System.Reflection;
using System;
using API.Layers.ContextLayer;
using API.Models;
using API.Shared;
using Microsoft.EntityFrameworkCore;
using API.Views.Shared;
using System.Net;
using System.Net.NetworkInformation;
using System.Web;
using System.Net.Sockets;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Migrations;

namespace API.Repository {
    public interface IAuthServiceRepository
    {
        
       Task<ApiResponse> LoginAsync (LoginPayloadViewModel _model);
    }

    public class   AuthServiceRepository : IAuthServiceRepository
    {
        private readonly AppDBContext _context;
        private readonly IConfiguration _configuration;

        public AuthServiceRepository (AppDBContext context, IConfiguration configuration) {
            _context = context;
            _configuration= configuration;
        }

        public async Task<ApiResponse> LoginAsync(LoginPayloadViewModel _payload)
        {
            var apiResponse = new ApiResponse ();
            try {

                var _HashPassword = SecurityHelper.EncryptString("1234567890123456",_payload.Password);
                var _User = await  _context.Users
                .Include(r => r.UserRole)
                .Include(d => d.Branches)
                .Include(d => d.Branches.Companies)
                .Where (a => a.Action != Enums.Operations.D.ToString () && 
                a.Email == _payload.Email).FirstOrDefaultAsync ();
                // select new LoginResponseViewModel {
                //     Id = User.Id,
                //     RoleId = User.RoleId,
                //     Role = User.UserRole.Role,
                //     Branch = User.Branches.Name,
                //     Email = User.Email,
                //     BranchId = User.BranchId,
                //     Phone = User.Contact,
                //     UserName = User.NormalizedName,
                // }).FirstOrDefaultAsync ();

                if (_User == null) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "There is no user with that Email address";
                    return apiResponse;
                }

                if (_User.HashPassword != _HashPassword)
                {
                    apiResponse.statusCode = StatusCodes.Status401Unauthorized.ToString();
                    apiResponse.message = "Incorrect Password";
                    return apiResponse;
                }

                if (!_User.Active)
                {
                    apiResponse.statusCode = StatusCodes.Status403Forbidden.ToString();
                    apiResponse.message = "Account is in-active.";
                    return apiResponse;
                }

                IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
                var IP = _payload.Ip;
                var PC = System.Environment.MachineName.ToString();
                var Header = _payload.Header;
            
                var TokenStr = await GetGeneratedToken(_User,IP.ToString(), PC, Header);
                
                LoginResponseViewModel _model = new LoginResponseViewModel();
                _model.FirstName = _User.FirstName;
                _model.LastName = _User.LastName;
                _model.Email = _User.Email;
                _model.BranchName = _User.Branches.Name;
                _model.Role = _User.UserRole.Role;
                _model.Id = _User.Id;
                _model.Contact = _User.Contact;                
                

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.message = TokenStr;
                apiResponse.data = _model;
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

        private async Task<string> GetGeneratedToken(object _model,string _Ip,string _PC , string _Header)
        {
            var UserTable = (API.Models.User)_model;
            string _key = SecurityHelper.security(UserTable.Id + UserTable.NormalizedName + UserTable.Email + DateTime.Now.ToString("ddMMMyyyyHHHmmss"));
            
            string key = _configuration["AuthSettings:Key"];
            var issuer = _configuration["AuthSettings:Issuer"];
            var audience = _key; //_configuration["AuthSettings:Audience"];
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var permClaims = new List<System.Security.Claims.Claim>();
            permClaims.Add(new System.Security.Claims.Claim(Enums.Misc.CompanyId.ToString(), UserTable.Branches.CompanyId.ToString()));
            permClaims.Add(new System.Security.Claims.Claim(Enums.Misc.CompanyName.ToString(), UserTable.Branches.Companies.Name));
            permClaims.Add(new System.Security.Claims.Claim(Enums.Misc.Role.ToString(), UserTable.UserRole.Role));
            permClaims.Add(new System.Security.Claims.Claim(Enums.Misc.UserId.ToString(), UserTable.Id.ToString()));
            permClaims.Add(new System.Security.Claims.Claim(Enums.Misc.UserName.ToString(), UserTable.NormalizedName));
            permClaims.Add(new System.Security.Claims.Claim(Enums.Misc.Email.ToString(), UserTable.Email));
            permClaims.Add(new System.Security.Claims.Claim(Enums.Misc.Key.ToString(), _key));

            var token = new JwtSecurityToken(issuer,
                audience,
                permClaims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials);

            var tokenAsString = new JwtSecurityTokenHandler().WriteToken(token);

            UserLoginAudit _UserLoginAudit = new UserLoginAudit();
            _UserLoginAudit.UserId = UserTable.Id;
            _UserLoginAudit.Key = _key;
            _UserLoginAudit.Header = _Header;
            _UserLoginAudit.Ip = _Ip;
            _UserLoginAudit.PC = _PC;
            _UserLoginAudit.CompanyId = UserTable.Branches.CompanyId;
            _UserLoginAudit.BranchId = UserTable.BranchId;
            _UserLoginAudit.Status = true;

            await _context.UserLoginAudits.AddAsync(_UserLoginAudit);
            await _context.SaveChangesAsync();

            return tokenAsString;
        }
    }
}