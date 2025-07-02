import  {GETAPIURL,GETBYID,POST,PUT,DELETE,CLEAR,FILLCOMBO}  from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js";

// INITIALIZING VARIBALES
var end_point;
var btn_save = $('#btn_sav')
var btn_update = $('#btn_upd')
var btn_add = $('#openmodal')
var fromShortName = "MENSUB"

// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var menuId = '';
if (url.has('M')) {
    menuId = window.atob(url.get('M'));
}

// jQuery CONSTRUCTOR
$(document).ready(function () {  
    end_point = '/api/v1/MenuSubCategory';
    ComponentsDropdowns.init();
    discon();
});

// DISCONNECTION FUNCTION
function discon(){
    Onload(); CLEAR(); btn_update.hide();btn_save.show()
    $('#sel_module').val("-1").trigger('change');
    $('#sel_menucat').val("-1").trigger('change');
}

// --- Fill Select 2 of Module ---
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        LoadMenuModule();  
        LoadMenuCategory(); 
    }
    return {
        init: function () {
            handleSelect2();
        }
    };
}();

// LOAD MENUMODULE LOV

function LoadMenuModule() {
    var $element = $('#sel_module').select2(); 
    FILLCOMBO('/api/v1/ConfigurationLovService/GetMenuModuleLov',$element,"Menu Module")
}

// LOAD MENUCATEGORY LOV

function LoadMenuCategory() {
    var $element = $('#sel_menucat').select2(); 
    FILLCOMBO('/api/v1/ConfigurationLovService/GetMenuCategoryLov',$element,"Menu Category")
}


// PETHING DATA FUNCTION
function petchdata(response){
    $('#txt_id').val(response.id);
    $('#txt_code').val(response.code);
    $('#txt_name').val(response.name);
    $('#txt_icon').val(response.icon);
    $('#txt_alias').val(response.alias);
    $('#sel_module').val(response.menuModuleId).trigger('change');
    $('#sel_menucat').val(response.menuCategoryId).trigger('change');
    
    if (!response.active) {
        $("#ck_act").prop("checked", false);
    } else { $("#ck_act").prop("checked", true); }

    if (!response.view) {
        $("#ck_view").prop("checked", false);
    } else { $("#ck_view").prop("checked", true); }

    $('#data_Model').modal();
}

// VALIDATION FUNCTION
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '' ,id='';
    var txt_id = $('#txt_id');  
    var txt_code = $('#txt_code');   
    var txt_name = $('#txt_name');   
    var txt_icon = $('#txt_icon'); 
    var txt_alias = $('#txt_alias');   
    var sel_module = $('#sel_module');   
    var sel_menucat = $('#sel_menucat');   
      
    var ck_act = $('#ck_act'); 
    var ck_view = $('#ck_view'); 
    
    if (sel_module.val() == '' || sel_module.val() == '-1') {
        ck = 1;
        _Error = 'Select Module, it is required';
        sel_module.focus();
    }

    if (sel_menucat.val() == '' || sel_menucat.val() == '-1') {
        ck = 1;
        _Error = 'Select Menu Category, it is required';
        sel_menucat.focus();
    }

    if (txt_name.val() == '') {
        ck = 1;
        _Error = 'Menu Name is required';
        txt_name.focus();
    }

    if (txt_alias.val() == '') {
        ck = 1;
        _Error = 'Alias  is required';
        txt_alias.focus();
    }

    if (txt_icon.val() == '') {
        ck = 1;
        _Error = 'Icon Name is required';
        txt_icon.focus();
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
            "alias": txt_alias.val(),
            "icon": txt_icon.val(),
            "menuModuleId": sel_module.val(),
            "menuCategoryId": sel_menucat.val(),
            "type": "U",
            "active": ck_act[0].checked,
            "view": ck_view[0].checked,
        });
    }
    return { ckval: ck, creteria: _cre };
}


// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;
    $.ajax({
        url: GETAPIURL(end_point + "/GetMenuSubCategory"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('_menuId', menuId);
        },
        success: function (response) {
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
                        retrieve: true,
                        processing: true,
                        lengthChange:!1,
                        buttons: ["pdf","copy", "print","csv"],
                        columns: [
                            { data: null,"defaultContent": action_button},
                            { "render": function (data, type, full, meta) { return tbl_row_cnt++; }},
                            { data: 'code' },
                            { data: 'menuModuleName' },
                            { data: 'menuCategoryName' },
                            { data: 'name' },
                            { data: 'alias' },
                            { data: 'icon' },
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
    CLEAR();btn_update.hide();btn_save.show()
    $('#sel_module').val("-1").trigger('change');
    $('#sel_menucat').val("-1").trigger('change');
    setCode()
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
    POST(end_point + "/AddMenuSubCategory",_cre,function () {
        discon();
    });
});

// UPDATE BUTTON EVENT
$('form').on('click', '#btn_upd', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    PUT(end_point + "/UpdateMenuSubCategory",_cre,function () {
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
    await GETBYID(end_point + "/GetMenuSubCategoryById", _id,_name, function (response) {
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
    DELETE(end_point + "/DeleteMenuSubCategory",_Id,_name,function () {
        Onload();
    })
});

