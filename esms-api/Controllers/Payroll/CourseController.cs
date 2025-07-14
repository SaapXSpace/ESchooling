using API.Layers.ContextLayer;
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
    public class CourseController : ControllerBase
    {
        private readonly IProcessor<CourseBaseModel> _IProcessor;

        public CourseController(IProcessor<CourseBaseModel> IProcessor)
        {
            _IProcessor = IProcessor;
        }

        [HttpGet]
        [Route("GetCourse")]
        public async Task<IActionResult> GetCourse([FromHeader] Guid _MenuId)
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
        [Route("GetCourseById")]
        public async Task<ActionResult> GetCourseById(Guid _MenuId, [FromHeader] Guid _Id)
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
        [Route("AddCourse")]
        public async Task<ActionResult> AddCourse(CourseAddModel Course)
        {
            try
            {
                var result = await _IProcessor.ProcessPost(Course, User);
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
        [Route("UpdateCourse")]
        public async Task<ActionResult> UpdateCourse(CourseUpdateModel Course)
        {
            try
            {
                var result = await _IProcessor.ProcessPut(Course, User);
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
        [Route("DeleteCourse")]
        public async Task<ActionResult> DeleteCourse([FromHeader] Guid Id)
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