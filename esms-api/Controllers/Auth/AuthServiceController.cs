using API.Layers.ContextLayer;
using API.Models;
using API.Processor;
using API.Repository;
using API.Views.Shared;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthServiceController : ControllerBase
{
    private readonly IAuthServiceRepository IAuthServiceRepository;
    
    private readonly IConfiguration _configuration;

    
    public AuthServiceController(IAuthServiceRepository _IAuthServiceRepository, IConfiguration configuration)
    {
        IAuthServiceRepository = _IAuthServiceRepository;
        _configuration = configuration;

    }

    [HttpPost]
    [Route("UserLogin")]
    [AllowAnonymous]
    public async Task<IActionResult> UserLoginAsync(LoginPayloadViewModel _loginPayloadViewModel){
        try {
            
            var result = await IAuthServiceRepository.LoginAsync (_loginPayloadViewModel);
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
