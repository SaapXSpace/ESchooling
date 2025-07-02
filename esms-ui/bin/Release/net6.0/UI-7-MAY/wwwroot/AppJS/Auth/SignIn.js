import  {GETAPIURL,GETBYID,POST,PUT,DELETE,CLEAR,FILLCOMBO}  from "../Service/ApiService.js";
import { Roles } from "../Service/Security.js";

// INITIALIZING VARIBALES
var end_point; var btn_register = $('#btn_login'); 

// jQuery CONSTRUCTOR
$(document).ready(function () {    
    localStorage.clear()
    end_point = '/AuthService';
    discon();
    ComponentsDropdowns.init();
    
});

// --- Fill Select 2 of Module ---
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        FillRole();   //
    }
    return {
        init: function () {
            handleSelect2();
        }
    };
}();

// Populate Vendor Type Options in Vendor Type Dropdown 
function FillRole() {
    var $element = $('#txt_role').select2(); 
    FILLCOMBO('/AdminLovService/GetUserRoleLov',$element)
}

// DISCONNECTION FUNCTION
function discon(){
    CLEAR();
}

// // VALIDATION FUNCTION
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '' ,id='';

    var txt_role = $('#txt_role');   
    var txt_Email = $('#txt_email');
    var txt_Password = $('#txt_password');

    if (txt_Password.val() == '') {
        ck = 1;
        _Error = 'Invalid Password';
        txt_Password.focus();
    }
    if (txt_Email.val() == '') {
        ck = 1;
        _Error = 'Please Enter Email';
        txt_Email.focus();
    }
    if (txt_role.val() == '') {
        ck = 1;
        _Error = 'Please Enter Vendor Type';
        txt_role.focus();
    }
   
    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
    }

    else if (!Boolean(ck)) {
        _cre = JSON.stringify({
            // "roleId": txt_role.val(),
            "email": txt_Email.val(),
            "password": txt_Password.val(),
        });
    }
    return { ckval: ck, creteria: _cre };
}

// ADD BUTTON EVENT
$('fieldset').on('click', '#btn_login', function (e) {
    Login();
});   

// $('fieldset').on('click', '#btn_login', function (e) {
//     window.location.href='/Dashboards/Analytics';
// });
function Login(){
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;

    $.ajax({
        url: apiUrl + end_point + '/CheckVendorCredential',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data:  _cre,
        success: function (response) {
        
            if ( response.statusCode == 200) {
                localStorage.setItem("Id",response.data[0].id)
                localStorage.setItem("RoleId",response.data[0].roleId)
                localStorage.setItem("Role",response.data[0].role)
                localStorage.setItem("UserName",response.data[0].userName)
                localStorage.setItem("DepartmentId",response.data[0].departmentId)
                localStorage.setItem("Department",response.data[0].department)
                localStorage.setItem("Phone",response.data[0].phone)     
                localStorage.setItem("Email",response.data[0].email)
                
                if( response.data[0].roleId != null && response.data[0].role == Roles.Admin){
                    window.location.href='/Dashboards/Analytics?M='+ btoa(response.data[0].id) +'';
                }
                else if (response.data[0].roleId != null && response.data[0].role == Roles.Manager) {
                    window.location.href='/Manager/Manager?M='+ btoa(response.data[0].id) +'';
                }
                else if (response.data[0].roleId != null && response.data[0].role == Roles.Requester) {
                    window.location.href='/Requester/Requester?M='+ btoa(response.data[0].id) +'';
                }
                else if (response.data[0].roleId != null && response.data[0].role == Roles.Crew) {
                    window.location.href='/Crew/Crew?M='+ btoa(response.data[0].id) +'';
                }

         }
            else {
                Swal.fire({
                    title: response.message,
                    icon: 'warning',
                    showConfirmButton: true,
                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }
                })
            }
        },
        error: function (xhr, status, err) {
            Swal.fire({
                title: xhr.status.toString() + ' #'+ status + '\n' + xhr.responseText,
                width: 800,
                icon: 'error',
                showConfirmButton: true,
                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            })
        }
    })
}

var input = document.getElementById("txt_password");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        Login();
    }
});
