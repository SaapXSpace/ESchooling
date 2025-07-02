using API.Layers.ContextLayer;
using API.Models;
using API.Processor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Views.Shared;

namespace API.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
[Authorize]

public class UsersController : ControllerBase
{
    private readonly IProcessor<UsersBaseModel> _IProcessor;
    public UsersController(IProcessor<UsersBaseModel> IProcessor)
    {
        _IProcessor = IProcessor;
    }

    [HttpGet]
    [Route("GetUser")]
    public async Task<IActionResult> GetUser([FromHeader] Guid _MenuId){
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
    [Route("GetUserById")]
    public async Task<ActionResult> GetUserById(Guid _MenuId,[FromHeader] Guid _Id){
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
    [Route("AddUser")]
    public async Task<ActionResult> AddUser(UsersAddModel _usermodel){
        try {
                var result = await _IProcessor.ProcessPost (_usermodel,User);
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
    [Route("UpdateUser")]
    public async Task<ActionResult> UpdateUser(UsersUpdateModel _usermodel){
        try {
                var result = await _IProcessor.ProcessPut (_usermodel, User);
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
    [Route("DeleteUser")]
    public async Task<ActionResult> DeleteUser([FromHeader] Guid Id){
        try {
            var result = await _IProcessor.ProcessDelete (Id, User);
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
