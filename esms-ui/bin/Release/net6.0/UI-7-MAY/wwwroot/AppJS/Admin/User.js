import  {GETAPIURL,FILLCOMBO, GETBYID,POST,PUT,DELETE,CLEAR}  from "../Service/ApiService.js";
import { Roles } from "../Service/Security.js";

// INITIALIZING VARIBALES
var end_point;
var btn_save = $('#btn_sav')
var btn_update = $('#btn_upd')



var url = new URLSearchParams(window.location.search);
var Id = '';
if (url.has('M')) {
    Id = window.atob(url.get('M'));
}

// jQuery CONSTRUCTOR
$(document).ready(function () {  
    var _Id =  localStorage.getItem("Id")
    var _Role =  localStorage.getItem("Role")
    if (_Id != null && Id == _Id && _Role == Roles.Admin) {
        end_point = '/Users';
        ComponentsDropdowns.init();
        discon();
    }else{
        window.location.href='/Auth/SignIn';
    }
  });


// --- Fill Select 2 of Module ---
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        LoadDepartments();   //
        LoadMaritalStatus();
        LoadUserRoles();
    }
    return {
        init: function () {
            handleSelect2();
        }
    };
}();

function LoadDepartments() {
    var $element = $('#sel_department').select2(); 
    FILLCOMBO('/AdminLovService/GetDepartmentLov',$element)
}

function LoadUserRoles() {
    var $element = $('#sel_role').select2(); 
    FILLCOMBO('/AdminLovService/GetUserRoleLov',$element)
}

function LoadMaritalStatus() {
    var $element = $('#sel_meritalstatus').select2(); 
}

// DISCONNECTION FUNCTION
function discon(){
    Onload(); CLEAR(); btn_update.hide();btn_save.show()
}

// OPEN MODAL BUTTON EVENT
$('div').on('click', '#openmodal', function (e) {
    CLEAR();btn_update.hide();btn_save.show()
});


// PETHING DATA FUNCTION
function petchdata(response){
    
    $('#txt_id').val(response.id);
    $('#txt_code').val(response.code);
    $('#txt_firstname').val(response.firstName);
    $('#txt_lastname').val(response.lastName);
    $('#txt_contact').val(response.contact);
    $('#txt_einstituteLogo').val(response.einstituteLogo);
    $('#sel_department').val(response.departmentId).trigger('change');
    $('#txt_cnic').val(response.cnic);
    $('#txt_email').val(response.email);
    $('#sel_role').val(response.roleId).trigger('change');
    var date = moment(response.permitTo).format('YYYY-MM-DD')
    $('#txt_permissionfrom').val(moment(response.permitForm).format('YYYY-MM-DD'));
    $('#txt_permissionto').val(moment(response.permitTo).format('YYYY-MM-DD'));
    $('#txt_password').val(response.hashPassword);
    $('#txt_confirmpassword').val(response.hashPassword);
    if (!response.active) {
        $("#ck_act").prop("checked", false);
    } else { $("#ck_act").prop("checked", true); }
    $('#data_Model').modal();
}

// VALIDATION FUNCTION
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '' ,id='';
    var txt_id = $('#txt_id');  
    var txt_code = $('#txt_code');   
    var txt_firstname = $('#txt_firstname');   
    var txt_lastname = $('#txt_lastname');   
    var txt_einstituteLogo = $('#txt_einstituteLogo');     
    var txt_contact = $('#txt_contact');     
    var sel_department = $('#sel_department');     
    var txt_cnic = $('#txt_cnic');     
    var txt_email = $('#txt_email');     
    var sel_role = $('#sel_role');   
    var txt_permissionfrom = $('#txt_permissionfrom');   
    var txt_permissionto = $('#txt_permissionto');   
    var txt_password = $('#txt_password');   
    var txt_confirmpassword = $('#txt_confirmpassword');   
    var ck_act = $('#ck_act'); 
    
    if (txt_confirmpassword.val() == '') {
        ck = 1;
        _Error = 'Re - Enter Password';
        txt_confirmpassword.focus();
    }

    if (txt_confirmpassword.val() != txt_password.val()) {
        ck = 1;
        _Error = 'Password Mis-Matched, Enter Valid Password';
        txt_confirmpassword.focus();
    }

    if (txt_password.val() != '') {
        var passwordformate=  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        if(!txt_password.val().match(passwordformate)) 
        { 
            ck = 1;
            _Error = 'Check your password between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character';
            txt_password.focus();
        }  
    }

    if (txt_password.val() == '') {
        ck = 1;
        _Error = 'Enter Password it is required';
        txt_password.focus();
    }

    if (txt_permissionto.val() == '') {
        ck = 1;
        _Error = 'Enter Permission End Date';
        txt_permissionto.focus();
    }

    if (txt_permissionfrom.val() == '') {
        ck = 1;
        _Error = 'Enter Permission Start Date';
        txt_permissionfrom.focus();
    }

    if (sel_role.val() == '' || sel_role.val() == 0 ) {
        ck = 1;
        _Error = 'Please Select Role';
        sel_role.focus();
    }

    if (txt_email.val() != '') {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!txt_email.val().match(mailformat))
        {
            ck = 1;
            _Error = 'Please Enter Your Valid Email Patteren like abc@gmail.com';
            txt_email.focus();
        }
    }else{
        ck = 1;
        _Error = 'Enter Your Email';
        txt_email.focus();
    }
    

    if (txt_cnic.val() != '') {
        var cnicformat = /^[0-9]{5}[0-9]{7}[0-9]$/;
        if(!txt_cnic.val().match(cnicformat))
        {
            ck = 1;
            _Error = 'Citizen Number should be follow this (XXXXXXXXXXXXX) format!';
            txt_cnic.focus();
        }
    }else{
        
        ck = 1;
        _Error = 'Enter Citizen Number';
        txt_cnic.focus();
    }

    

    if (sel_department.val() == '' || sel_department.val() == 0) {
        ck = 1;
        _Error = 'Select Department';
        sel_department.focus();
    }

    if (txt_contact.val() != '') {

        var ptcl = /^\+?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/; // XXX-XXX-XXXX
        var phone = /^([0-9]{4})\)?[-. ]?([0-9]{7})$/;
        var phonewithCode = /^\+([0-9]{4})\)?[-. ]?([0-9]{8})$/;
        var ALL = /[\+\d]?(\d{2,3}[-\.\s]??\d{2,3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4}|\d{3}[-\.\s]??\d{4})/
        if((txt_contact.val().match(ptcl))){}
        else if((txt_contact.val().match(ALL))){}
        else if((txt_contact.val().match(phonewithCode))  ){}
        else{
            ck = 1;
            _Error = 'Please Enter Valid Phone Number like XXX-XXX-XXXX, +XX-XXXX-XXXX, +923123456789, 03123456789';
            txt_contact.focus();
        }
    }

    if (txt_contact.val() == '') {
        ck = 1;
        _Error = 'Enter Contact Number';
        txt_contact.focus();
    }

    if (txt_einstituteLogo.val() == '') {
        ck = 1;
        _Error = 'Enter Residential einstituteLogo';
        txt_einstituteLogo.focus();
    }

    if (txt_lastname.val() == '') {
        ck = 1;
        _Error = 'Enter Last Name';
        txt_lastname.focus();
    }

    if (txt_firstname.val() == '') {
        ck = 1;
        _Error = 'Enter First Name';
        txt_firstname.focus();
    }

    // if (txt_code.val() == '') {
    //     ck = 1;
    //     _Error = 'Please Enter Code ';
    //     txt_code.focus();
    // }
    
    if (txt_id.val() == '') {
        id= '00000000-0000-0000-0000-000000000000'
    }
    else{
        id = txt_id.val()
    }

    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
    }

    else if (!Boolean(ck)) {
        _cre = JSON.stringify({
            "id": id,
            "code": txt_code.val(),
            "firstName": txt_firstname.val(),
            "lastName": txt_lastname.val(),
            "einstituteLogo": txt_einstituteLogo.val(),
            "contact": txt_contact.val(),
            "departmentId": sel_department.val(),
            "cnic": txt_cnic.val(),
            "email": txt_email.val(),
            "hashPassword": txt_password.val(),
            "roleId": sel_role.val(),
            "permitForm": txt_permissionfrom.val(),
            "permitTo": txt_permissionto.val(),
            "active": ck_act[0].checked,
            "user": localStorage.getItem("Id")
        });
    }
    return { ckval: ck, creteria: _cre };
}


// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;
    $.ajax({
        url: GETAPIURL(end_point + "/GetUser"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            var action_button = ' ';
            action_button += "<a href='#' class='btn-edit fas fa-edit'  data-toggle='tooltip' style='color:#03588C' title='Update'></a> ";
            action_button += " <a href='#' class='btn-delete fas  fa-trash' data-toggle='tooltip' style='color:#03588C' title='Delete()'></a> ";
            if (response != null) {
                $('#data_table').DataTable().clear().destroy();
                $("#data_table").dataTable({
                    data: response.data,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        { data: null,"defaultContent": action_button},
                        { "render": function (data, type, full, meta) { return tbl_row_cnt++; }},
                        { data: 'normalizedName' },
                        { data: 'departmentName' },
                        { data: 'role' },
                        { data: 'contact' },
                        { data: 'email' },
                        { data: 'active','render': function (data, type, full, meta) {if (data) {return '✔'; }else { return '✘'; }  }},
                    ],
                    "order": [[0, "asc"]],
                    "pageLength": 10,
                });
                if ($("#txt_code")) {
                    if (response.data != null) {
                        $("#txt_code").val(Number(response.data[0].lastCode + 1))
                    }else{
                        $("#txt_code").val(Number(1))
                    }
                }
            }
        },
        error: function (xhr, status, err) {
            Swal.fire({
                title: xhr.status.toString() + ' #'+ status + '\n' + xhr.responseText,
                width:800,
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
    return true;
}

// ADD BUTTON EVENT
$('form').on('click', '#btn_sav', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    POST(end_point + "/AddUser",_cre,function () {
        discon();
    });
});

// UPDATE BUTTON EVENT
$('form').on('click', '#btn_upd', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    PUT(end_point + "/UpdateUser",_cre,function () {
        discon();
    });
});

// EDIT BUTTON EVENT 
$('table').on('click', '.btn-edit', async function (e) { //Edit Start
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _name = data['normalizedName'];
    btn_update.show();btn_save.hide()
    await GETBYID(end_point + "/GetUserById", _id,_name, function (response) {
        petchdata(response)
    })
   
});

// DELETE BUTTON EVENT 
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _Id = data['id'];
    var _name = data['name'];
    DELETE(end_point + "/DeleteUsers",_Id,_name,function () {
        Onload();
    })
});

