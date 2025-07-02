using System.Text;
using API.Layers.ContextLayer;
using API.Manager;
using API.Manager.Payroll.Setup;
using API.Models;
using API.Views.Shared;
using Microsoft.EntityFrameworkCore;

namespace API.Shared
{
    public static class DirectoryHelper
    {
        public static void CreateStudentFolder(string folderName)
        {

            var webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "API", "wwwroot");
            var folderPath = Path.Combine(webRootPath, folderName);
            try
            {
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static string SaveFile(string folderName,string studentCode, string fileName, string base64Data, string CurrentImageName)
        {
            try
            {
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(),"wwwroot","Students", studentCode, folderName);
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                string fileExtension = Path.GetExtension(CurrentImageName);
                var filePath = Path.Combine(folderPath, fileName+fileExtension);
                if (base64Data.Contains(","))
                {
                    base64Data = base64Data.Split(',')[1];
                }
                var fileBytes = Convert.FromBase64String(base64Data);
                File.WriteAllBytes(filePath, fileBytes);
                var relativePath = Path.Combine("wwwroot","Students", studentCode, folderName, fileName);

                return relativePath+fileExtension;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static string ExtractFile(string imagePath)
        {
            try
            {
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(),imagePath);
                if (File.Exists(imagePath))
                {
                    byte[] imageBytes = File.ReadAllBytes(imagePath);
                    string base64String = Convert.ToBase64String(imageBytes);
                    return base64String;
                }
                else
                {
                    return "Image not Exists";
                }
            }
            catch (Exception ex)
            {
                return "Error converting image to Base64: " + ex.Message;
            }
        }
    }
}