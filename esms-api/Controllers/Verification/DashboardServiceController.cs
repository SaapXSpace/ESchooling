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
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
[Authorize]

public class DashboardServiceController : ControllerBase
{
    private readonly IDashboardServiceRepository IDashboardServiceRepository;
    
    private readonly IConfiguration _configuration;

    
    public DashboardServiceController(IDashboardServiceRepository _IDashboardServiceRepository, IConfiguration configuration)
    {
        IDashboardServiceRepository = _IDashboardServiceRepository;
        _configuration = configuration;

    }

    [HttpGet]
    [Route("GetAdminDashboardCardsCounts")]
    public async Task<IActionResult> GetAdminDashboardCardsCounts([FromHeader] Guid _MenuId){
        try {
            var result = await IDashboardServiceRepository.GetAdminDashboardCardsCountsAsync (_MenuId,User);
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

    [HttpGet]
    [Route("GetAdminDashboardMonthlyAccountSummary")]
    
    public async Task<IActionResult> GetAdminDashboardMonthlyAccountSummary([FromHeader] DateTime month){
        try {
            var result = await IDashboardServiceRepository.GetAdminDashboardMonthlyAccountSummaryAsync (month);
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

    [HttpGet]
    [Route("GetAdminDashboardCourseSummary")]
    
    public async Task<IActionResult> GetAdminDashboardCourseSummary(){
        try {
            var result = await IDashboardServiceRepository.GetAdminDashboardCourseSummaryAsync ();
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

    [HttpGet]
    [Route("GetAdminDashboardYearlyCertificatesSummary")]
    public async Task<IActionResult> GetAdminDashboardYearlyCertificatesSummary([FromHeader] DateTime  year ){
        try {
            var result = await IDashboardServiceRepository.GetAdminDashboardYearlyCertificatesSummaryAsync (year);
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

    [HttpGet]
    [Route("GetLoginAuditStatistics")]
    public async Task<IActionResult> GetLoginAuditStatistics([FromHeader] DateTime  _date ){
        try {
            var result = await IDashboardServiceRepository.GetLoginAuditStatisticsAsync (_date);
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

    [HttpGet]
    [Route("GetDailyRecordActivity")]
    public async Task<IActionResult> GetDailyRecordActivity([FromHeader] DateTime  _date ){
        try {
            var result = await IDashboardServiceRepository.GetDailyRecordActivityAsync (_date);
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
