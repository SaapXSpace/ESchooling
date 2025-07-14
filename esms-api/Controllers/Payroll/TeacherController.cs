using API.Layers.ContextLayer;
using API.Models;
using API.Processor;
using API.Views.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Views.Payroll;
using System.IO; // Required for Path, FileStream
using System; // Required for Convert.FromBase64String
using Microsoft.AspNetCore.Hosting; // Required for IWebHostEnvironment

namespace API.Controllers;

// DTO for incoming Base64 image upload request
public class ImageUploadRequest
{
    public string Base64Image { get; set; }
    public string RegNo { get; set; } // The registration number for naming the file
}

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
[Authorize]
public class TeacherController : ControllerBase
{
    private readonly IProcessor<TeacherBaseModel> _IProcessor;
    private readonly IWebHostEnvironment _hostingEnvironment; // To get wwwroot path

    public TeacherController(IProcessor<TeacherBaseModel> IProcessor, IWebHostEnvironment hostingEnvironment)
    {
        _IProcessor = IProcessor;
        _hostingEnvironment = hostingEnvironment;
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
    public async Task<ActionResult> AddTeacher([FromBody] TeacherAddModel Teacher)
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
    public async Task<ActionResult> UpdateTeacher([FromBody] TeacherUpdateModel Teacher)
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

    [HttpPost("UploadPicture")]
    public async Task<IActionResult> UploadPicture([FromBody] ImageUploadRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Base64Image) || string.IsNullOrWhiteSpace(request.RegNo))
        {
            return BadRequest(new { message = "Invalid upload request. Base64 image and registration number are required." });
        }

        // Validate RegNo format if necessary (e.g., must be numeric)
        // Example: if (!int.TryParse(request.RegNo, out _)) { return BadRequest("Invalid Registration Number format."); }

        try
        {
            // Convert Base64 string to byte array
            byte[] imageBytes = Convert.FromBase64String(request.Base64Image);

            // Define the target folder: wwwroot/img/images/Teacher_imgs/
            string uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "img", "images"); // FIXED: Updated folder path

            // Create the directory if it doesn't exist
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Define the filename: regNo.jpg
            string fileName = $"{request.RegNo}.jpg";
            string filePath = Path.Combine(uploadsFolder, fileName);

            // Basic check for JPG format (by checking first few bytes - magic number)
            // This is a more robust check than just file extension
            // JPEG magic number starts with FF D8 FF
            if (imageBytes.Length < 3 || !(imageBytes[0] == 0xFF && imageBytes[1] == 0xD8 && imageBytes[2] == 0xFF))
            {
                // If not a JPG, return an error. You could also try to convert it here
                return BadRequest(new { message = "Only JPG images are allowed." });
            }

            // Save the file to the server
            await System.IO.File.WriteAllBytesAsync(filePath, imageBytes);

            // Construct the URL that the frontend will use to access the image
            string url = $"/img/images/{fileName}"; // FIXED: Updated URL path
            return Ok(new { url });
        }
        catch (FormatException)
        {
            return BadRequest(new { message = "Invalid Base64 string." });
        }
        catch (Exception ex)
        {
            // Log the exception for debugging purposes
            Console.WriteLine($"Error uploading picture: {ex.Message}");
            return StatusCode(500, new { message = $"An error occurred while uploading the picture: {ex.Message}" });
        }
    }
}
