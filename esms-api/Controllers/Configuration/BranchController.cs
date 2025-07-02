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

public class BranchController : ControllerBase
{
    private readonly IProcessor<BranchBaseModel> _IProcessor;
    public BranchController(IProcessor<BranchBaseModel> IProcessor)
    {
        _IProcessor = IProcessor;
    }

    [HttpGet]
    [Route("GetBranch")]
    public async Task<IActionResult> GetBranch([FromHeader] Guid _MenuId){
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
    [Route("GetBranchById")]
    public async Task<ActionResult> GetBranchById(Guid _MenuId,[FromHeader] Guid _Id){
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
    [Route("AddBranch")]
    public async Task<ActionResult> AddBranch(BranchAddModel Branch){
        try {
                var result = await _IProcessor.ProcessPost (Branch, User);
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
    [Route("UpdateBranch")]
    public async Task<ActionResult> UpdateBranch(BranchUpdateModel Branch){
        try {
                var result = await _IProcessor.ProcessPut (Branch, User);
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
    [Route("DeleteBranch")]
    public async Task<ActionResult> DeleteBranch([FromHeader] Guid Id){
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
