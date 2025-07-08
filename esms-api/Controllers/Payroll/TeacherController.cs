using API.Layers.ContextLayer;
using API.Models;
using API.Processor;
using API.Views.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Views.Payroll;

namespace API.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
[Authorize]
public class TeacherController : ControllerBase
{
    private readonly IProcessor<TeacherBaseModel> _IProcessor;
    public TeacherController(IProcessor<TeacherBaseModel> IProcessor)
    {
        _IProcessor = IProcessor;
    }

    [HttpGet]
    [Route("GetTeacher")]
    public async Task<IActionResult> GetTeacher([FromHeader] Guid _MenuId)
    {
        try
        {
            var result = await _IProcessor.ProcessGet(_MenuId, User);
            return Ok(result);
        }
        catch (Exception e)
        {
            string innerexp = "";
            if (e.InnerException != null)
            {
                innerexp = " Inner Error : " + e.InnerException.ToString();
            }
            return BadRequest(e.Message.ToString() + innerexp);
        }
    }

    [HttpGet]
    [Route("GetTeacherById")]
    public async Task<ActionResult> GetTeacherById(Guid _MenuId, [FromHeader] Guid _Id)
    {
        try
        {
            var result = await _IProcessor.ProcessGetById(_Id, _MenuId, User);
            return Ok(result);
        }
        catch (Exception e)
        {
            string innerexp = "";
            if (e.InnerException != null)
            {
                innerexp = " Inner Error : " + e.InnerException.ToString();
            }
            return BadRequest(e.Message.ToString() + innerexp);
        }
    }


    [HttpPost]
    [Route("AddTeacher")]
    public async Task<ActionResult> AddTeacher(TeacherAddModel Teacher)
    {
        try
        {
            var result = await _IProcessor.ProcessPost(Teacher, User);
            return Ok(result);
        }
        catch (Exception e)
        {
            string innerexp = "";
            if (e.InnerException != null)
            {
                innerexp = " Inner Error : " + e.InnerException.ToString();
            }
            return BadRequest(e.Message.ToString() + innerexp);
        }
    }

    [HttpPut]
    [Route("UpdateTeacher")]
    public async Task<ActionResult> UpdateTeacher(TeacherUpdateModel Teacher)
    {
        try
        {
            var result = await _IProcessor.ProcessPut(Teacher, User);
            return Ok(result);

        }
        catch (Exception e)
        {
            string innerexp = "";
            if (e.InnerException != null)
            {
                innerexp = " Inner Error : " + e.InnerException.ToString();
            }
            return BadRequest(e.Message.ToString() + innerexp);
        }
    }

    [HttpDelete]
    [Route("DeleteTeacher")]
    public async Task<ActionResult> DeleteTeacher([FromHeader] Guid Id)
    {
        try
        {
            var result = await _IProcessor.ProcessDelete(Id, User);
            return Ok(result);
        }
        catch (Exception e)
        {
            string innerexp = "";
            if (e.InnerException != null)
            {
                innerexp = " Inner Error : " + e.InnerException.ToString();
            }
            return BadRequest(e.Message.ToString() + innerexp);
        }
    }

}
