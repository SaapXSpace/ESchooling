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

public class MenuSubCategoryController : ControllerBase
{
    private readonly IProcessor<MenuSubCategoryBaseModel> _IProcessor;
    public MenuSubCategoryController(IProcessor<MenuSubCategoryBaseModel> IProcessor)
    {
        _IProcessor = IProcessor;
    }

    [HttpGet]
    [Route("GetMenuSubCategory")]
    public async Task<IActionResult> GetMenuSubCategory([FromHeader] Guid _MenuId){
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
    [Route("GetMenuSubCategoryById")]
    public async Task<ActionResult> GetMenuSubCategoryById(Guid _MenuId,[FromHeader] Guid _Id){
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
    [Route("AddMenuSubCategory")]
    public async Task<ActionResult> AddMenuSubCategory(MenuSubCategoryAddModel MenuSubCategory){
        try {
                var result = await _IProcessor.ProcessPost (MenuSubCategory, User);
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
    [Route("UpdateMenuSubCategory")]
    public async Task<ActionResult> UpdateMenuSubCategory(MenuSubCategoryUpdateModel MenuSubCategory){
        try {
                var result = await _IProcessor.ProcessPut (MenuSubCategory,User);
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
    [Route("DeleteMenuSubCategory")]
    public async Task<ActionResult> DeleteMenuSubCategory([FromHeader] Guid Id){
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
