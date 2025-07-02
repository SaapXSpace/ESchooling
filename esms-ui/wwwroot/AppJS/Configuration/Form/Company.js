import  {GETAPIURL,GETBYID,POST,PUT,DELETE,CLEAR}  from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js";

// INITIALIZING VARIBALES
var end_point;
var btn_save = $('#btn_sav')
var btn_update = $('#btn_upd')
var btn_add = $('#openmodal')
var fromShortName = "COMP"

var profileBase64 = ""
var profileImageName = ""

// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var menuId = '';
if (url.has('M')) {
    menuId = window.atob(url.get('M'));
}

// jQuery CONSTRUCTOR
$(document).ready(function () {  
    end_point = '/api/v1/Company';
    discon();
    
  });

// DISCONNECTION FUNCTION
function discon(){
    Onload(); CLEAR(); btn_update.hide();btn_save.show()
    profileBase64 = ""
    profileImageName = ""
}


// PETHING DATA FUNCTION
function petchdata(response){
    $('#txt_id').val(response.id);
    $('#txt_code').val(response.code);
    $('#txt_name').val(response.name);
    $('#txt_sname').val(response.shortName);
    $('#txt_ntn').val(response.ntn);
    $('#txt_stn').val(response.stn);
    if (!response.active) {
        $("#ck_act").prop("checked", false);
    } else { $("#ck_act").prop("checked", true); }

    if ( response.logoImage.length > 10) {
        profileBase64 = "data:image/jpg;base64,"+ response.logoImage
        $("#logo-image").attr("src", "data:image/jpg;base64,"+ response.logoImage);
    }else{
        $("#logo-image").attr("src", "/img/images/profile.jpg"); 
    }

    $('#data_Model').modal();
}

// VALIDATION FUNCTION
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '' ,id='';
    var txt_id = $('#txt_id');  
    var txt_code = $('#txt_code');   
    var txt_name = $('#txt_name');   
    var txt_sname = $('#txt_sname');   
    var txt_ntn = $('#txt_ntn');   
    var txt_stn = $('#txt_stn');   
    var ck_act = $('#ck_act'); 
    
    if (profileBase64 == "") {
        ck = 1;
        _Error = 'Company Logo is required';
    }

    if (txt_name.val() == '') {
        ck = 1;
        _Error = 'Company Name is required';
        txt_name.focus();
    }

    if (txt_sname.val() == '') {
        ck = 1;
        _Error = 'Short Name is required';
        txt_sname.focus();
    }
    
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
            "name": txt_name.val(),
            "shortName": txt_sname.val(),
            "nTN": txt_ntn.val(),
            "sTN": txt_stn.val(),
            "logoImage": profileBase64,
            "type": "U",
            "active": ck_act[0].checked,
        });
    }
    return { ckval: ck, creteria: _cre };
}


// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;
    $.ajax({
        url: GETAPIURL(end_point + "/GetCompany"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('_menuId', menuId);
        },
        success: function (response) {
            console.log(response)
            var action_button = ' ';
            if (response != null) {
                if (!response.permissions.insert_Permission) {
                    btn_add.hide()
                }
                if (response.permissions.update_Permission) {
                    action_button += "<a href='#' class='btn-edit fas fa-edit' data-toggle='tooltip' style='color:#03588C' title='Update'></a> ";
                }
                if (response.permissions.delete_Permission) {
                    action_button += " <a href='#' class='btn-delete fas  fa-trash' data-toggle='tooltip' style='color:#03588C' title='Delete()'></a> ";
                }
                if (response.data != null) {
                    $('#data_table').DataTable().clear().destroy();
                    var datatablesButtons = $("#data_table").DataTable({
                        data: response.data,
                        destroy: true,
                        processing: true,
                        retrieve: true,
                        lengthChange:!1,
                        buttons: ["pdf","copy", "print","csv"],
                        columns: [
                            { data: null,"defaultContent": action_button},
                            { "render": function (data, type, full, meta) { return tbl_row_cnt++; }},
                            { data: 'logoImage','render': function (data, type, full, meta) { return '<img src="data:image/jpg;base64,'+ data +'" width="150" height="100" alt="" >'; }},
                            { data: 'code' },
                            { data: 'name' },
                            { data: 'shortName' },
                            { data: 'ntn' },
                            { data: 'stn' },
                            { data: 'active','render': function (data, type, full, meta) {if (data) {return '✔'; }else { return '✘'; }  }},
                        ],
                        "order": [[0, "asc"]],
                        // "pageLength": 10,
                    });
                    datatablesButtons.buttons().container().appendTo("#data_table_wrapper .col-md-6:eq(0)")
                }else{
                    $("#data_table").DataTable()
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

// OPEN MODAL BUTTON EVENT
$('div').on('click', '#openmodal', function (e) {
    profileBase64 = ""
    profileImageName = ""

    CLEAR();btn_update.hide();btn_save.show()
    setCode()
    $("#logo-image").attr("src", "/img/images/profile.jpg"); 
});

$($(document)).on('click', '#btn_codegenerate', function (e) {
    setCode()
});

function setCode(){
    $("#txt_code").val(fromShortName+"-"+ GenerateCode())
}

function GenerateCode() {
    const min = 10;
    const max = 99;
    var preficxCode = Math.round(Math.random() * (max - min) + min);
    var midexCode =  Math.round(Math.random() * (max - min) + min);
    var postfixCode = Math.round(Math.random() * (max - min) + min);
    return preficxCode +""+ midexCode +""+ postfixCode;
}

// ADD BUTTON EVENT
$('form').on('click', '#btn_sav', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    POST(end_point + "/AddCompany",_cre,function () {
        discon();
    });
});

// UPDATE BUTTON EVENT
$('form').on('click', '#btn_upd', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    PUT(end_point + "/UpdateCompany",_cre,function () {
        discon();
    });
});

// EDIT BUTTON EVENT 
$('table').on('click', '.btn-edit', async function (e) { //Edit Start
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _name = data['name'];
    var type = data['type'];
    if (type === "S") {
        Swal.fire({
            title: "This is System Generated Record",
            icon: 'warning',
        })
        return
    }
    btn_update.show();btn_save.hide()
    await GETBYID(end_point + "/GetCompanyById", _id,_name, function (response) {
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
    var type = data['type'];
    if (type === "S") {
        Swal.fire({
            title: "This is System Generated Record",
            icon: 'warning',
        })
        return
    }
    DELETE(end_point + "/DeleteCompany",_Id,_name,function () {
        Onload();
    })
});

// CHange Images
var isUploading = false
$("#logo-image").click(function () {
    if (!isUploading) {
        isUploading = true;
        $("#image-upload-input").click();
        isUploading = false
    }
});

$("#image-upload-input").change(function () {
    var formdata = false;
    var selectedImage = this.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        profileBase64 = e.target.result;
        profileImageName = selectedImage.name;
        $("#logo-image").attr("src", e.target.result);

    };
    reader.readAsDataURL(selectedImage);

});

$("#set_default_image").click(function () {
    $("#logo-image").attr("src", "/img/images/profile.jpg"); // Replace with the path to your default image
});