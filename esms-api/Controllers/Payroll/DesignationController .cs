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
public class DesignationController : ControllerBase
{
    private readonly IProcessor<DesignationBaseModel> _IProcessor;

    public DesignationController(IProcessor<DesignationBaseModel> IProcessor)
    {
        _IProcessor = IProcessor;
    }

    [HttpGet]
    [Route("GetDesignation")]
    public async Task<IActionResult> GetDesignation([FromHeader] Guid _MenuId)
    {
        try
        {
            var result = await _IProcessor.ProcessGet(_MenuId, User);
            return Ok(result);
        }
        catch (Exception e)
        {
            string innerexp = e.InnerException != null ? " Inner Error : " + e.InnerException.ToString() : "";
            return BadRequest(e.Message + innerexp);
        }
    }

    [HttpGet]
    [Route("GetDesignationById")]
    public async Task<ActionResult> GetDesignationById(Guid _MenuId, [FromHeader] Guid _Id)
    {
        try
        {
            var result = await _IProcessor.ProcessGetById(_Id, _MenuId, User);
            return Ok(result);
        }
        catch (Exception e)
        {
            string innerexp = e.InnerException != null ? " Inner Error : " + e.InnerException.ToString() : "";
            return BadRequest(e.Message + innerexp);
        }
    }

    [HttpPost]
    [Route("AddDesignation")]
    public async Task<ActionResult> AddDesignation([FromBody] DesignationAddModel Designation) // ✅ FIXED LINE
    {
        try
        {
            var result = await _IProcessor.ProcessPost(Designation, User);
            return Ok(result);
        }
        catch (Exception e)
        {
            string innerexp = e.InnerException != null ? " Inner Error : " + e.InnerException.ToString() : "";
            return BadRequest(e.Message + innerexp);
        }
    }

    [HttpPut]
    [Route("UpdateDesignation")]
    public async Task<ActionResult> UpdateDesignation(DesignationUpdateModel Designation)
    {
        try
        {
            var result = await _IProcessor.ProcessPut(Designation, User);
            return Ok(result);
        }
        catch (Exception e)
        {
            string innerexp = e.InnerException != null ? " Inner Error : " + e.InnerException.ToString() : "";
            return BadRequest(e.Message + innerexp);
        }
    }

    [HttpDelete]
    [Route("DeleteDesignation")]
    public async Task<ActionResult> DeleteDesignation([FromHeader] Guid Id)
    {
        try
        {
            var result = await _IProcessor.ProcessDelete(Id, User);
            return Ok(result);
        }
        catch (Exception e)
        {
            string innerexp = e.InnerException != null ? " Inner Error : " + e.InnerException.ToString() : "";
            return BadRequest(e.Message + innerexp);
        }
    }
}
