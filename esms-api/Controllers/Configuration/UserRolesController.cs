using API.Layers.ContextLayer;
using API.Models;
using API.Processor;
using API.Views.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
[Authorize]
public class UserRolesController : ControllerBase
{
    private readonly IProcessor<UserRoleBaseModel> _IProcessor;
    public UserRolesController(IProcessor<UserRoleBaseModel> IProcessor)
    {
        _IProcessor = IProcessor;
    }

    [HttpGet]
    [Route("GetUserRole")]
    public async Task<IActionResult> GetUserRole([FromHeader] Guid _MenuId){
        try {
            var result = await _IProcessor.ProcessGet (_MenuId,User);
            return Ok(result);
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
    [Route("GetUserRoleById")]
    public async Task<ActionResult> GetUserRoleById(Guid _MenuId,[FromHeader] Guid _Id){
         try {
           var result = await _IProcessor.ProcessGetById (_Id,_MenuId,User);
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
    [Route("AddUserRole")]
    public async Task<ActionResult> AddUserRole(UserRoleAddModel UserRole){
        try {
                var result = await _IProcessor.ProcessPost (UserRole,User);
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

    [HttpPut]
    [Route("UpdateUserRole")]
    public async Task<ActionResult> UpdateUserRole(UserRoleUpdateModel UserRole){
        try {
                var result = await _IProcessor.ProcessPut (UserRole, User);
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

    [HttpDelete]
    [Route("DeleteUserRole")]
    public async Task<ActionResult> DeleteUserRole([FromHeader] Guid Id){
        try {
            var result = await _IProcessor.ProcessDelete (Id,User);
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
