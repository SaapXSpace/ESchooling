using API.Layers.ContextLayer;
using API.Models;
using API.Processor;
using API.Views.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Payroll;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
[Authorize]
public class DepartmentController : ControllerBase
{
    private readonly IProcessor<DepartmentBaseModel> _IProcessor;
    public DepartmentController(IProcessor<DepartmentBaseModel> IProcessor)
    {
        _IProcessor = IProcessor;   
    }

    [HttpGet]
    [Route("GetDepartment")]
    public async Task<IActionResult> GetDepartment([FromHeader] Guid _MenuId){
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
    [Route("GetDepartmentById")]
    public async Task<ActionResult> GetDepartmentById(Guid _MenuId,[FromHeader] Guid _Id){
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
    [Route("AddDepartment")]
    public async Task<ActionResult> AddDepartment(DepartmentAddModel Department){
        try {
                var result = await _IProcessor.ProcessPost (Department,User);
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
    [Route("UpdateDepartment")]
    public async Task<ActionResult> UpdateDepartment(DepartmentUpdateModel Department){
        try {
                var result = await _IProcessor.ProcessPut (Department, User);
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
    [Route("DeleteDepartment")]
    public async Task<ActionResult> DeleteDepartment([FromHeader] Guid Id){
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
