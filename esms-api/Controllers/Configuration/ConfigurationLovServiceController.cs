using API.Repository;
using API.Views.Service;
using API.Views.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
[Authorize]
public class ConfigurationLovServiceController : ControllerBase
{
   
    private readonly IConfigurationServiceRepository IConfigurationServiceRepository;
    public ConfigurationLovServiceController(IConfigurationServiceRepository _IConfigurationServiceRepository)
    {
        IConfigurationServiceRepository = _IConfigurationServiceRepository;
    }

    
    [HttpGet]
    [Route("GetDepartmentLov")]
    public async Task<IActionResult> GetDepartmentLov(string? Search){
        try {
            var result = await IConfigurationServiceRepository.GetDepartmentsLovAsync (Search);
             if (result == null) {
                return NotFound ();
            }
            return Ok (result);
        } 
        catch (Exception e) {
            string innerexp = "";
            if (e.InnerException != null) {
                innerexp = " Inner Error : " + e.InnerException.ToString ();
            }
            return BadRequest (e.Message.ToString () + innerexp);
        }
    }

    [HttpGet]
    [Route("GetMenuInitializer")]
    public async Task<IActionResult> GetMenuInitializer(){
        try {
            var result = await IConfigurationServiceRepository.GetMenuInitializerAsync (User);
             if (result == null) {
                return NotFound ();
            }
            return Ok (result);
        } 
        catch (Exception e) {
            string innerexp = "";
            if (e.InnerException != null) {
                innerexp = " Inner Error : " + e.InnerException.ToString ();
            }
            return BadRequest (e.Message.ToString () + innerexp);
        }
    }

    [HttpGet]
    [Route("GetUserRoleLov")]
    public async Task<IActionResult> GetUserRoleLov(string? Search){
        try {
            var result = await IConfigurationServiceRepository.GetUserRolesLovAsync (Search, User);
             if (result == null) {
                return NotFound ();
            }
            return Ok (result);
        } 
        catch (Exception e) {
            string innerexp = "";
            if (e.InnerException != null) {
                innerexp = " Inner Error : " + e.InnerException.ToString ();
            }
            return BadRequest (e.Message.ToString () + innerexp);
        }
    }

    [HttpGet]
    [Route("GetCompanyLov")]
    public async Task<IActionResult> GetCompanyLov(string? Search){
        try {
            var result = await IConfigurationServiceRepository.GetCompanyLovAsync (Search);
             if (result == null) {
                return NotFound ();
            }
            return Ok (result);
        } 
        catch (Exception e) {
            string innerexp = "";
            if (e.InnerException != null) {
                innerexp = " Inner Error : " + e.InnerException.ToString ();
            }
            return BadRequest (e.Message.ToString () + innerexp);
        }
    }

    [HttpGet]
    [Route("GetBranchLov")]
    public async Task<IActionResult> GetBranchLov(string? Search){
        try {
            var result = await IConfigurationServiceRepository.GetBranchLovAsync (Search);
             if (result == null) {
                return NotFound ();
            }
            return Ok (result);
        } 
        catch (Exception e) {
            string innerexp = "";
            if (e.InnerException != null) {
                innerexp = " Inner Error : " + e.InnerException.ToString ();
            }
            return BadRequest (e.Message.ToString () + innerexp);
        }
    }

    [HttpGet]
    [Route("GetMenuModuleLov")]
    public async Task<IActionResult> GetMenuModuleLov(string? Search){
        try {
            var result = await IConfigurationServiceRepository.GetMenuModuleLovAsync (Search);
             if (result == null) {
                return NotFound ();
            }
            return Ok (result);
        } 
        catch (Exception e) {
            string innerexp = "";
            if (e.InnerException != null) {
                innerexp = " Inner Error : " + e.InnerException.ToString ();
            }
            return BadRequest (e.Message.ToString () + innerexp);
        }
    }

    [HttpGet]
    [Route("GetMenuCategoryLov")]
    public async Task<IActionResult> GetMenuCategoryLov(string? Search){
        try {
            var result = await IConfigurationServiceRepository.GetMenuCategoryLovAsync (Search);
             if (result == null) {
                return NotFound ();
            }
            return Ok (result);
        } 
        catch (Exception e) {
            string innerexp = "";
            if (e.InnerException != null) {
                innerexp = " Inner Error : " + e.InnerException.ToString ();
            }
            return BadRequest (e.Message.ToString () + innerexp);
        }
    }

    [HttpGet]
    [Route("GetUserLoginLov")]
    public async Task<IActionResult> GetUserLoginLov(string? Search){
        try {
            var result = await IConfigurationServiceRepository.GetUserLoginLovAsync (Search);
             if (result == null) {
                return NotFound ();
            }
            return Ok (result);
        } 
        catch (Exception e) {
            string innerexp = "";
            if (e.InnerException != null) {
                innerexp = " Inner Error : " + e.InnerException.ToString ();
            }
            return BadRequest (e.Message.ToString () + innerexp);
        }
    }

    [HttpGet]
    [Route("GetUserByRoleLov")]
    public async Task<IActionResult> GetUserByRoleLov([FromHeader] Guid _Id, string? Search){
        try {
            var result = await IConfigurationServiceRepository.GetUserByRoleLovAsync (_Id,Search);
             if (result == null) {
                return NotFound ();
            }
            return Ok (result);
        } 
        catch (Exception e) {
            string innerexp = "";
            if (e.InnerException != null) {
                innerexp = " Inner Error : " + e.InnerException.ToString ();
            }
            return BadRequest (e.Message.ToString () + innerexp);
        }
    }

    

    [HttpGet]
    [Route("GetMenuOrMenuPermissionUserWise")]
    public async Task<IActionResult> GetMenuOrMenuPermissionUserWise([FromHeader] Guid _roleId,[FromHeader] Guid _userId ){
        try {

            MenuPermissionPayLoadServicesModel _model= new MenuPermissionPayLoadServicesModel();
            _model.RoleId = _roleId;
            _model.UserId = _userId;
            var result = await IConfigurationServiceRepository.GetMenuOrMenuPermissionUserWiseAsync (_model,User);
             if (result == null) {
                return NotFound ();
            }
            return Ok (result);
        } 
        catch (Exception e) {
            string innerexp = "";
            if (e.InnerException != null) {
                innerexp = " Inner Error : " + e.InnerException.ToString ();
            }
            return BadRequest (e.Message.ToString () + innerexp);
        }
    }

    [HttpPost]
    [Route("UpdateUserPermissions")]
    public async Task<IActionResult> UpdateUserPermissions(UserRolePermissionAddModel model){
        try {

            var result = await IConfigurationServiceRepository.UpdateUserRolePermissionAsync (model,User);
             if (result == null) {
                return NotFound ();
            }
            return Ok (result);
        } 
        catch (Exception e) {
            string innerexp = "";
            if (e.InnerException != null) {
                innerexp = " Inner Error : " + e.InnerException.ToString ();
            }
            return BadRequest (e.Message.ToString () + innerexp);
        }
    }
}
