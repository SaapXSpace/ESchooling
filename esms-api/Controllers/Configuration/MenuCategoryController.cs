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

public class MenuCategoryController : ControllerBase
{
    private readonly IProcessor<MenuCategoryBaseModel> _IProcessor;
    public MenuCategoryController(IProcessor<MenuCategoryBaseModel> IProcessor)
    {
        _IProcessor = IProcessor;
    }

    [HttpGet]
    [Route("GetMenuCategory")]
    public async Task<IActionResult> GetMenuCategory([FromHeader] Guid _MenuId){
        try {
            var result = await _IProcessor.ProcessGet (_MenuId, User);
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
    [Route("GetMenuCategoryById")]
    public async Task<ActionResult> GetMenuCategoryById(Guid _MenuId,[FromHeader] Guid _Id){
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
    [Route("AddMenuCategory")]
    public async Task<ActionResult> AddMenuCategory(MenuCategoryAddModel MenuCategory){
        try {
                var result = await _IProcessor.ProcessPost (MenuCategory,User);
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
    [Route("UpdateMenuCategory")]
    public async Task<ActionResult> UpdateMenuCategory(MenuCategoryUpdateModel MenuCategory){
        try {
                var result = await _IProcessor.ProcessPut (MenuCategory, User);
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
    [Route("DeleteMenuCategory")]
    public async Task<ActionResult> DeleteMenuCategory([FromHeader] Guid Id){
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
