using System.Security.Claims;
using API.Models;

namespace API.Manager
{
    public interface IManager
    {
        Task<ApiResponse> GetDataAsync(ClaimsPrincipal _User);
        Task<ApiResponse> GetDataByIdAsync(Guid _Id, ClaimsPrincipal _User);
        Task<ApiResponse> AddAsync(object model, ClaimsPrincipal _User);
        Task<ApiResponse> UpdateAsync(object model, ClaimsPrincipal _User);
        Task<ApiResponse> DeleteAsync(Guid _Id, ClaimsPrincipal _User);
    }
}