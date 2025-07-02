import { Roles } from "../Service/Security.js";

// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var Id = '';
if (url.has('M')) {
    Id = window.atob(url.get('M'));
}

// jQuery CONSTRUCTOR
$(document).ready(function () {  
    var _Id =  localStorage.getItem("Id")
    if (_Id != null && Id == _Id) {
        Onload()
        startTime()
    }else{
        window.location.href='/Auth/SignIn';
    }
    
  });

function Onload(){
    var sidebar = document.getElementById("sideMenu")
    sidebar.innerHTML=""
    var RoleId = localStorage.getItem("RoleId")
    var Role = localStorage.getItem("Role")
    var Id = btoa(localStorage.getItem("Id"))
    if (RoleId!=null && Role==Roles.Admin) {
        sidebar.innerHTML =  AdminMenu(Id);
    }if (RoleId!=null && Role==Roles.Manager) {
        sidebar.innerHTML =  ManagerMenu(Id);
    }if (RoleId!=null && Role==Roles.Requester) {
        sidebar.innerHTML = RequesterMenu(Id);
    }if (RoleId!=null && Role==Roles.Crew) {
        sidebar.innerHTML = CrewMenu(Id);
    }
}

function AdminMenu(Id) {
    var AdminMenu = '<li class="sidebar-item">'
                AdminMenu+= '<a href="/Dashboards/Analytics?M='+ Id +'""  class="sidebar-link collapsed">'
                    AdminMenu+=	'<i class="align-middle mr-2 fas fa-fw fa-home"></i> <span class="align-middle">Dashboard</span>'
                    AdminMenu+='</a>'
                    
                AdminMenu+= '<a href="#Admin" data-toggle="collapse" class="sidebar-link collapsed">'
                    AdminMenu+=	'<i class="align-middle mr-2 fas fa-fw fa-user-cog"></i> <span class="align-middle">Admin</span>'
                    AdminMenu+='</a>'
                AdminMenu+= '<ul id="Admin" class="sidebar-dropdown list-unstyled collapse " data-parent="#sidebar">'
                    AdminMenu+='<li class="sidebar-item"><a class="sidebar-link" href="/Admin/Departments?M='+ Id +'">Department</a></li>'
                    AdminMenu+='<li class="sidebar-item"><a class="sidebar-link" href="/Admin/User?M='+ Id +'">User</a></li>'
                    AdminMenu += '<li class="sidebar-item"><a class="sidebar-link" href="/Requester/ComplainType?M='+ Id +'">Complain Type</a></li>'
                AdminMenu+='</ul>'
                AdminMenu+= '<a href="#asset" data-toggle="collapse" class="sidebar-link collapsed">'
                    AdminMenu+=	'<i class="align-middle mr-2 fas fa-fw fa-dolly"></i> <span class="align-middle">Asset Management</span>'
                    AdminMenu+='</a>'
                AdminMenu+= '<ul id="asset" class="sidebar-dropdown list-unstyled collapse " data-parent="#sidebar">'
                    AdminMenu+='<li class="sidebar-item"><a class="sidebar-link" href="/Admin/Assets?M='+ Id +'">Assets</a></li>'
                    AdminMenu+='<li class="sidebar-item"><a class="sidebar-link" href="/Admin/AssetType?M='+ Id +'">Assets Type</a></li>'
                    AdminMenu+='<li class="sidebar-item"><a class="sidebar-link" href="/Admin/Location?M='+ Id +'">Location</a></li>'
                    //AdminMenu+='<li class="sidebar-item"><a class="sidebar-link" href="/Admin/UserRole?M='+ Id +'">Role</a></li>'
                AdminMenu+='</ul>'
            AdminMenu+=	'</li>'
        return AdminMenu;
}

function ManagerMenu(Id) {
    var ManagerMenu = '<li class="sidebar-item">'
            ManagerMenu += '<a href="#manager" data-toggle="collapse" class="sidebar-link collapsed">'
                ManagerMenu += '<i class="align-middle mr-2 fas fa-fw fa-user"></i> <span class="align-middle">Manager</span>'
            ManagerMenu += '</a>'
            ManagerMenu += '<ul id="manager" class="sidebar-dropdown list-unstyled collapse " data-parent="#sidebar">'
                ManagerMenu += '<li class="sidebar-item"><a class="sidebar-link" href="/Manager/Manager?M='+ Id +'">Manager</a></li>'
                // ManagerMenu += '<li class="sidebar-item"><a class="sidebar-link" href="/Manager/AssignRequests?M='+ Id +'">Assign Requests</a></li>'
            ManagerMenu += '</ul>'
        ManagerMenu += '</li>'

    return ManagerMenu
}

function RequesterMenu(Id) {
    var requesterMenu = '<li class="sidebar-item">'
            requesterMenu += '<a href="#requester" data-toggle="collapse" class="sidebar-link collapsed">'
                requesterMenu += '<i class="align-middle mr-2 fas fa-fw fa-user"></i> <span class="align-middle">Requester</span>'
            requesterMenu += '</a>'
            requesterMenu += '<ul id="requester" class="sidebar-dropdown list-unstyled collapse " data-parent="#sidebar">'
                requesterMenu += '<li class="sidebar-item"><a class="sidebar-link" href="/Requester/Requester?M='+ Id +'">Complain</a></li>'
            requesterMenu += '</ul>'
        requesterMenu += '</li>'
    
    return requesterMenu;
}

function CrewMenu(Id) {
    var requesterMenu = '<li class="sidebar-item">'
            requesterMenu += '<a href="#crew" data-toggle="collapse" class="sidebar-link collapsed">'
                requesterMenu += '<i class="align-middle mr-2 fas fa-fw fa-user"></i> <span class="align-middle">Crew</span>'
            requesterMenu += '</a>'
            requesterMenu += '<ul id="crew" class="sidebar-dropdown list-unstyled collapse " data-parent="#sidebar">'
                requesterMenu += '<li class="sidebar-item"><a class="sidebar-link" href="/Crew/Crew?M='+ Id +'">Quries</a></li>'
                requesterMenu += '<li class="sidebar-item"><a class="sidebar-link" href="/Crew/CheckInOut?M='+ Id +'">CheckInOut</a></li>'
            requesterMenu += '</ul>'
        requesterMenu += '</li>'
    return requesterMenu;
}


//Timing Start
function startTime() {
    var today = new Date();
    $("#ClockTime").html(
        //        "Date: " + moment(today).format("DD-MMM-YYYY") + "<br/> Time : " + moment(today).format("HH:mm:ss"));
        moment(today).format("DD - MMMM - YYYY") + " " +
        moment(today).format("HH : mm : ss"))
    var t = setTimeout(startTime, 500);
}
//Time End



// txt_total_visitor
// txt_total_active_user
// txt_total_users
// txt_total_inactive_user
// txt_total_assets
// txt_total_active_assets
// txt_total_inactive_assets