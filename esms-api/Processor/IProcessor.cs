using System;
using System.Security.Claims;
using API.Models;

namespace API.Processor {
    public interface IProcessor<T>
    {
        Task<ApiResponse> ProcessGet (Guid _MenuId, ClaimsPrincipal _User);
        Task<ApiResponse> ProcessGetById (Guid _Id, Guid _MenuId, ClaimsPrincipal _User);
        Task<ApiResponse> ProcessPost(object model,ClaimsPrincipal _User);
        Task<ApiResponse> ProcessPut (object model,ClaimsPrincipal _User);
        Task<ApiResponse> ProcessDelete (Guid _Id, ClaimsPrincipal _User);
    } 
}