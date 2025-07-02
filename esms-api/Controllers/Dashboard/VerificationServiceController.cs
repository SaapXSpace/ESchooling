using API.Layers.ContextLayer;
using API.Models;
using API.Processor;
using API.Repository;
using API.Views.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class VerificationServiceController : ControllerBase
{
    private readonly IVerificationServiceRepository IVerificationServiceRepository;
    
    private readonly IConfiguration _configuration;

    
    public VerificationServiceController(IVerificationServiceRepository _IVerificationServiceRepository, IConfiguration configuration)
    {
        IVerificationServiceRepository = _IVerificationServiceRepository;
        _configuration = configuration;

    }

    [HttpGet]
    [Route("GetStudentBySSBForVerification")]
    [AllowAnonymous]
    public async Task<IActionResult> GetStudentBySSBForVerification([FromHeader] string _ssb){
        try {
            var result = await IVerificationServiceRepository.GetStudentBySSBForVerification (_ssb);
             if (result == null) {
                return NotFound ();
            }
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
