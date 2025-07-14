// ✅ STEP 5: CONTROLLER (StudentController.cs)
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using API.Views.Shared;
using API.Processor;
using API.Models;

namespace API.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    [Authorize]
    public class StudentController : ControllerBase
    {
        private readonly IProcessor<StudentBaseModel> _IProcessor;

        public StudentController(IProcessor<StudentBaseModel> IProcessor)
        {
            _IProcessor = IProcessor;
        }

        [HttpGet]
        [Route("GetStudent")]
        public async Task<IActionResult> GetStudent([FromHeader] Guid _MenuId)
        {
            try
            {
                var result = await _IProcessor.ProcessGet(_MenuId, User);
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message + (e.InnerException != null ? " Inner Error: " + e.InnerException : ""));
            }
        }

        [HttpGet]
        [Route("GetStudentById")]
        public async Task<IActionResult> GetStudentById(Guid _MenuId, [FromHeader] Guid _Id)
        {
            try
            {
                var result = await _IProcessor.ProcessGetById(_Id, _MenuId, User);
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message + (e.InnerException != null ? " Inner Error: " + e.InnerException : ""));
            }
        }

        [HttpPost]
        [Route("AddStudent")]
        public async Task<IActionResult> AddStudent(StudentAddModel Student)
        {
            try
            {
                var result = await _IProcessor.ProcessPost(Student, User);
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message + (e.InnerException != null ? " Inner Error: " + e.InnerException : ""));
            }
        }

        [HttpPut]
        [Route("UpdateStudent")]
        public async Task<IActionResult> UpdateStudent(StudentUpdateModel Student)
        {
            try
            {
                var result = await _IProcessor.ProcessPut(Student, User);
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message + (e.InnerException != null ? " Inner Error: " + e.InnerException : ""));
            }
        }

        [HttpDelete]
        [Route("DeleteStudent")]
        public async Task<IActionResult> DeleteStudent([FromHeader] Guid Id)
        {
            try
            {
                var result = await _IProcessor.ProcessDelete(Id, User);
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message + (e.InnerException != null ? " Inner Error: " + e.InnerException : ""));
            }
        }
    }
}
