using API.Layers.ContextLayer;
using API.Models;
using API.Processor;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using API.Views.Shared;

namespace API.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
[Authorize]

public class MenuModuleController : ControllerBase
{
    private readonly IProcessor<MenuModuleBaseModel> _IProcessor;
    public MenuModuleController(IProcessor<MenuModuleBaseModel> IProcessor)
    {
        _IProcessor = IProcessor;
    }

    [HttpGet]
    [Route("GetMenuModule")]
    public async Task<IActionResult> GetMenuModule([FromHeader] Guid _MenuId){
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
    [Route("GetMenuModuleById")]
    public async Task<ActionResult> GetMenuModuleById(Guid _MenuId,[FromHeader] Guid _Id){
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
    [Route("AddMenuModule")]
    public async Task<ActionResult> AddMenuModule(MenuModuleAddModel MenuModule){
        try {
                var result = await _IProcessor.ProcessPost (MenuModule,User);
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
    [Route("UpdateMenuModule")]
    public async Task<ActionResult> UpdateMenuModule(MenuModuleUpdateModel MenuModule){
        try {
                var result = await _IProcessor.ProcessPut (MenuModule,User);
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
    [Route("DeleteMenuModule")]
    public async Task<ActionResult> DeleteMenuModule([FromHeader] Guid Id){
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
