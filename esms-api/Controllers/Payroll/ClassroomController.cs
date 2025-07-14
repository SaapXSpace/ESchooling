using API.Layers.ContextLayer;
using API.Models;
using API.Processor;
using API.Processor.Admin;
using API.Views.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    [Authorize]
    public class ClassroomController : ControllerBase
    {
        private readonly IProcessor<ClassroomBaseModel> _IProcessor;

        public ClassroomController(IProcessor<ClassroomBaseModel> IProcessor)
        {
            _IProcessor = IProcessor;
        }

        [HttpGet]
        [Route("GetClassrooms")]
        public async Task<IActionResult> GetClassrooms([FromHeader] Guid _MenuId)
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
        [Route("GetClassroomById")]
        public async Task<ActionResult> GetClassroomById(Guid _MenuId, [FromHeader] Guid _Id)
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
        [Route("AddClassroom")]
        public async Task<ActionResult> AddClassroom(ClassroomAddModel Classroom)
        {
            try
            {
                var result = await _IProcessor.ProcessPost(Classroom, User);
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
        [Route("UpdateClassroom")]
        public async Task<ActionResult> UpdateClassroom(ClassroomUpdateModel Classroom)
        {
            try
            {
                var result = await _IProcessor.ProcessPut(Classroom, User);
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
        [Route("DeleteClassroom")]
        public async Task<ActionResult> DeleteClassroom([FromHeader] Guid Id)
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
}