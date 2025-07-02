import  {GETAPIURL,FILLCOMBO,FILLCOMBOBYID, GETBYID,POST,PUT,DELETE,CLEAR}  from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js";

// INITIALIZING VARIBALES
var end_point;
var masterData = '';
var _ListOfMenus = [];
var _masterData = [];
var bool = false;
var btn_add = $('#btn_sav')

var url = new URLSearchParams(window.location.search);
var menuId = '';
if (url.has('M')) {
    menuId = window.atob(url.get('M'));
}

// jQuery CONSTRUCTOR
$(document).ready(function () {  
    end_point = '/api/v1/Users';
    ComponentsDropdowns.init();
    discon()
});

// --- Fill Select 2 of Module ---
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        LoadUserRoles();
    }
    return {
        init: function () {
            handleSelect2();
            $('#sel_User').select2({data:[{ id: -1, text: "Select User of respective Role" }]}); 
        }
    };
}();

function LoadUserRoles() {
    var $element = $('#sel_role').select2(); 
    FILLCOMBO('/api/v1/ConfigurationLovService/GetUserRoleLov',$element,"Role")
}

$('#sel_role').change(function () {
    var rolId = $('#sel_role').val();
    if (rolId != '-1') {
        var $element = $('#sel_User').select2({data:[{ id: -1, text: "Select Course of respective Category" }]}); 
        $element.empty()
        FILLCOMBOBYID(rolId,'/api/v1/ConfigurationLovService/GetUserByRoleLov',$element,"User")
    }
})

// DISCONNECTION FUNCTION
function discon(){
    $("#list_module").empty();
    $("#sel_role").val('-1');
    //Onload(); CLEAR(); btn_update.hide();btn_save.show()
}

function Onload(_roleId,_userId) {
    var tbl_row_cnt = 1;
    $.ajax({
        url: GETAPIURL('/api/v1/ConfigurationLovService/GetMenuOrMenuPermissionUserWise'),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + app_token);
            xhr.setRequestHeader("_roleId", _roleId);
            xhr.setRequestHeader("_userId", _userId);
            // xhr.setRequestHeader("MenuId", _menuid);
        },
        success: function (response) {
            if (response.statusCode == 200) {
                var listmodule = $("#list_module")
                listmodule.empty();
                const module_1 = response["data"]["menuPerViews"];
                var module = [];
                for (var i = 0; i < module_1.length; i++) {
                    if (module.findIndex(x => x._id == module_1[i].moduleId) == -1) {
                        module.push({ _id: module_1[i].moduleId, _nam: module_1[i].moduleName });
                    }
                }
                module.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                var il_row = "<ul class='nav nav-tabs' id='tabUl' role='tablist'>";
                for (var module_cnt = 0; module_cnt < module.length; module_cnt++) {
                    il_row += "<li>";
                    il_row += '<a id="changebuttontab'+module_cnt+'" name="'+module[module_cnt]["_id"]+'" href="#'+module[module_cnt]["_id"]+'" class="nav-link py-4 px-6" role="tab">';
                    //il_row += "<a onClick='onClic(" + JSON.stringify(module[module_cnt]["_id"])+ ")' id='changebuttontab' href='#" + module[module_cnt]["_id"] + "'  class='nav-link py-4 px-6' data-toggle='tab'  role='tab'>";
                    il_row += module[module_cnt]["_nam"];
                    il_row += "</a>";
                    il_row += "</li>";
                }
                il_row += "</ul>";
                il_row += "<div class='tab-content'>";
                const module_1_tab = response["data"]["menuPerViews"];
                var module_tab = [];
                for (var i = 0; i < module_1_tab.length; i++) {
                    if (module_tab.findIndex(x => x._id == module_1_tab[i].moduleId) == -1) {
                        module_tab.push({ _id: module_1_tab[i].moduleId, _nam: module_1_tab[i].moduleName });
                    }
                }
                module_tab.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                $("#lbl_modulecount").text(module_tab.length);
                for (var module_cnt = 0; module_cnt < module_tab.length; module_cnt++) {
                    _masterData.push(module_tab[module_cnt]["_id"])
                    il_row += "<div class='tab-pane py-5 p-lg-0' id='div" + module_tab[module_cnt]["_id"] + "'>";
                    //il_row += '<table id="tbl' + module[module_cnt]["_id"] + '" class="table table-sm" style="font-size:smaller;">';
                    il_row += '<table id="tbl' + module_cnt + '" class="table table-sm" style="font-size:smaller;" >';
                    il_row += '<thead >';
                    
                    il_row += '<tr>' +
                        '<th style="text-align:center;font-weight:bold;">SNo.</th>' +
                        '<th style="text-align:center;font-weight:bold;">Category</th>' +
                        '<th style="text-align:center;font-weight:bold;">Menu</th>' +
                        '<th style="text-align:center;font-weight:bold;"><div ><input type="checkbox" id="ck_view_head" name="ck_view_head" onclick="viewhead(' + module_cnt + ')"><br/>View</div></th>' +
                        '<th style="text-align:center;font-weight:bold;"><div ><input type="checkbox" id="ck_new_head" name="ck_new_head" onclick="newhead(' + module_cnt + ')"><br/>New</div></th>' +
                        '<th style="text-align:center;font-weight:bold;"><div ><input type="checkbox" id="ck_update_head" name="ck_update_head" onclick="updatehead(' + module_cnt + ')"><br/>Update</div></th>' +
                        '<th style="text-align:center;font-weight:bold;"><div ><input type="checkbox" id="ck_delete_head" name="ck_delete_head" onclick="deletehead(' + module_cnt + ')"><br/>Delete</div></th>' +
                        '<th style="text-align:center;font-weight:bold;"><div ><input type="checkbox" id="ck_print_head" name="ck_print_head" onclick="printhead(' + module_cnt + ')"><br/>Print</div></th>' +
                        '<th style="text-align:center;font-weight:bold;"><div ><input type="checkbox" id="ck_check_head" name="ck_check_head" onclick="checkhead(' + module_cnt + ')"><br/>Check</div></th>' +
                        '<th style="text-align:center;font-weight:bold;"><div ><input type="checkbox" id="ck_approved_head" name="ck_approved_head" onclick="approvedhead(' + module_cnt + ')"><br/>Approved</div></th>' ;
                        if (Role === "Super Admin") 
                            il_row +='<th style="text-align:center;font-weight:bold;"><div ><input type="checkbox" id="ck_allow_head" name="ck_allow_head" onclick="allowhead(' + module_cnt + ')"><br/>Allow</div></th>';
                        else
                            il_row +='<th hidden style="text-align:center;font-weight:bold;"><div ><input type="checkbox" id="ck_allow_head" name="ck_allow_head" onclick="allowhead(' + module_cnt + ')"><br/>Allow</div></th>';
                            
                        il_row +='</tr>';
                    il_row += '</thead>';
                    il_row += '<tbody>';
                    const _menu = response["data"]["menuPerViews"].filter(d => d.moduleId == module[module_cnt]["_id"]);
                    var _menu_category = [];
                    for (var i = 0; i < _menu.length; i++) {
                        if (_menu_category.findIndex(x => x._nam == _menu[i].categoryName) == -1) {
                            _menu_category.push({ _nam: _menu[i].categoryName });
                        }
                    }
                    _menu_category.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                    for (var menucategory_row_cnt = 0; menucategory_row_cnt < _menu_category.length; menucategory_row_cnt++) {
                        //il_row += '<tr><td style="text-align:center;font-weight:bold;">' + _menu_category[menucategory_row_cnt]["_nam"] + '</td></tr>';

                        var _menu_sort = [];
                        for (var i = 0; i < _menu.length; i++) {
                            if (_menu_sort.findIndex(x => x._id == _menu[i].menuId) == -1) {
                                _menu_sort.push({ _id: _menu[i].menuId, _nam: _menu[i].menuName });
                            }
                        }
                        _menu_sort.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                        var sno = 1;
                        for (var menu_row_cnt = 0; menu_row_cnt < _menu_sort.length; menu_row_cnt++) {
                            const _transaction = response["data"]["menuPerViews"].filter(d => d.categoryName == _menu_category[menucategory_row_cnt]["_nam"] && d.menuId == _menu_sort[menu_row_cnt]["_id"]);
                            for (var row_cnt = 0; row_cnt < _transaction.length; row_cnt++) {
                                var ckview = '', cknew = '', ckupdate = '', ckdelete = '', ckprint = '', ckapproved = '', ckcheck = '', ckallow = '';
                                //New
                                if (Boolean(_transaction[row_cnt]["view_Permission"])) {
                                    ckview = 'checked';
                                }
                                //Save
                                if (Boolean(_transaction[row_cnt]["insert_Permission"])) {
                                    cknew = 'checked';
                                }
                                //Update
                                if (Boolean(_transaction[row_cnt]["update_Permission"])) {
                                    ckupdate = 'checked';
                                }
                                //Delete
                                if (Boolean(_transaction[row_cnt]["delete_Permission"])) {
                                    ckdelete = 'checked';
                                }
                                //Print
                                if (Boolean(_transaction[row_cnt]["print_Permission"])) {
                                    ckprint = 'checked';
                                }
                                //Check
                                if (Boolean(_transaction[row_cnt]["check_Permission"])) {
                                    ckcheck = 'checked';
                                }
                                //Approved
                                if (Boolean(_transaction[row_cnt]["approve_Permission"])) {
                                    ckapproved = 'checked';
                                }
                                if (Boolean(_transaction[row_cnt]["allow_Permission"])) {
                                    ckallow = 'checked';
                                }
                                il_row += '<tr>' +
                                    '<td hidden id="lbl_MenuId' + module_cnt + '' + menu_row_cnt + '" name="lbl_MenuId">' + _transaction[row_cnt]["menuId"] + '</td>' +
                                    '<td>' + sno++ + '</td>' +
                                    '<td>' + _menu_category[menucategory_row_cnt]["_nam"] + '</td>' +
                                    '<td>' + _transaction[row_cnt]["menuName"] + '</td>' +
                                    '<td style="text-align:center;">' + '<div ><input type="checkbox" id="ck_view' + module_cnt + '' + menu_row_cnt + '" name="ck_view" ' + ckview + '></div>' + '</td>' +
                                    '<td style="text-align:center;">' + '<div ><input type="checkbox" id="ck_new' + module_cnt + '' + menu_row_cnt + '" name="ck_new" ' + cknew + '></div>' + '</td>' +
                                    '<td style="text-align:center;">' + '<div ><input type="checkbox" id="ck_update' + module_cnt + '' + menu_row_cnt + '" name="ck_update" ' + ckupdate + '></div>' + '</td>' +
                                    '<td style="text-align:center;">' + '<div ><input type="checkbox" id="ck_delete' + module_cnt + '' + menu_row_cnt + '" name="ck_delete" ' + ckdelete + '></div>' + '</td>' +
                                    '<td style="text-align:center;">' + '<div ><input type="checkbox" id="ck_print' + module_cnt + '' + menu_row_cnt + '" name="ck_print" ' + ckprint + '></div>' + '</td>' +
                                    '<td style="text-align:center;">' + '<div ><input type="checkbox" id="ck_check' + module_cnt + '' + menu_row_cnt + '" name="ck_check" ' + ckcheck + '></div>' + '</td>' +
                                    '<td style="text-align:center;">' + '<div ><input type="checkbox" id="ck_approved' + module_cnt + '' + menu_row_cnt + '" name="ck_approved" ' + ckapproved + '></div>' + '</td>';
                                    if (Role === "Super Admin") 
                                        il_row += '<td style="text-align:center;">' + '<div ><input type="checkbox" id="ck_allow' + module_cnt + '' + menu_row_cnt + '" name="ck_allow" ' + ckallow + '></div>' + '</td>';                                    
                                    else 
                                        il_row += '<td hidden style="text-align:center;">' + '<div ><input type="checkbox" id="ck_allow' + module_cnt + '' + menu_row_cnt + '" name="ck_allow" ' + ckallow + '></div>' + '</td>';                                    
                                    
                                    il_row +='</tr>';


                            }
                        }
                    }
                    il_row += '</tbody>';
                    il_row += '</table>';

                    il_row += "</div>";
                }
                il_row += "</div>";
                il_row += "<div class='clearfix margin-bottom-20'>";
                il_row += "</div>";
                listmodule.append(il_row);
                setTimeout(() => {
                    const ulElement = document.getElementById("tabUl");
                    const liElements = ulElement.querySelectorAll("li");
                    const numberOfLiElements = liElements.length;
                    for (let index = 0; index < numberOfLiElements; index++) {
                        $("#changebuttontab"+index+"").on("click", function(e) {
                            e.preventDefault(); 
                            var moduleId = $(this).attr("name"); // Get the module ID from the href attribute
                            onClic(moduleId); // Call the onClic function with the module ID
                        });
                        
                    }
                }, 500);
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
                title: xhr.status.toString() + ' ' + err.toString(),
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
    })
    return true;
}

function onClic (id){
    _masterData.map((item, index) => {
        if (id === item) {
            document.getElementById(`div${item}`).className = "tab-pane py-5 p-lg-0 active"
        }
        else {
            document.getElementById(`div${item}`).className = "tab-pane py-5 p-lg-0"
        }
    })
}

// Change Usee Fill Table
$('#sel_User').change(function () {
    var _userID = $('#sel_User').val();
    var _roleID = $('#sel_role').val();
    if (_roleID == '-1') {
        Swal.fire({
            title: "Select Role",
            icon: 'error'
        })
        return
    }
    if (_userID != '-1') {
        Onload(_roleID,_userID);
    }

})

$('#ck_all').click(function () {
    if (($('#ck_all').is(":checked"))) {
        $("input[type='checkbox']").attr("checked", true);
    }
    else {
        $("input[type='checkbox']").attr("checked", false);
    }
});

function ckvalidation() {
    var txtrolename = $("#sel_role").val();
    var txtUser = $("#sel_User").val();
    var modulecount = $("#lbl_modulecount").text();
    const detail_record = [];
    var ck = 0;
    if (txtrolename == -1) {
        ck = 1;
        _Error = "Please select role";

    }

    if (txtrolename != -1) {
        if (txtUser == -1) {
            ck = 1;
            _Error = "Please select User";
        }
    }

   
    else if (modulecount == 0) {
        ck = 1;
        _Error = "Module not found";


    }
    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
    }
    else {
        for (var tcount = 0; tcount < modulecount; tcount++) {
            var rows_create = $("#tbl" + tcount + " tbody >tr");
            for (var i = 0; i < rows_create.length; i++) {
                var _MenuId = $("#lbl_MenuId" + tcount + i).html();
                if (_MenuId != 'undefined') {
                    detail_record.push({
                        "rolesId": txtrolename,
                        "userId": txtUser,
                        "menuId": $("#lbl_MenuId" + tcount + i).html(),
                        "view_Permission": document.querySelector('#ck_view' + tcount + i).checked,//$("#ck_view" + tcount + i + ':checked'),
                        "insert_Permission": document.querySelector('#ck_new' + tcount + i).checked, //$("#ck_new" + tcount + i+ ':checked'),
                        "update_Permission": document.querySelector('#ck_update' + tcount + i).checked, // $("#ck_update" + tcount + i).checked,
                        "delete_Permission": document.querySelector('#ck_delete' + tcount + i).checked, //$("#ck_delete" + tcount + i).checked,
                        "print_Permission": document.querySelector('#ck_print' + tcount + i).checked, //$("#ck_print" + tcount + i).checked,
                        "check_Permission": document.querySelector('#ck_check' + tcount + i).checked, //$("#ck_check" + tcount + i).checked,
                        "approve_Permission": document.querySelector('#ck_approved' + tcount + i).checked, // $("#ck_approved" + tcount + i).checked
                        "allow_Permission": document.querySelector('#ck_allow' + tcount + i).checked, // $("#ck_approved" + tcount + i).checked
                    });
                }
            }
        }
    }
    return { ckval: ck, detailrecord: detail_record };
}

// ADD BUTTON EVENT
$('div').on('click', '#btn_sav', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    //var _cre = ck.creteria;
    var _detailrecord = ck.detailrecord;
    var _cre = JSON.stringify({
        "userRolePermissions": _detailrecord
    })
    POST("/api/v1/ConfigurationLovService/UpdateUserPermissions",_cre,function () {
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
    var type = data['type'];
    if (type === "S") {
        Swal.fire({
            title: "This is System Generated Record",
            icon: 'warning',
        })
        return
    }
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
    var _name = data['normalizedName'];
    var type = data['type'];
    if (type === "S") {
        Swal.fire({
            title: "This is System Generated Record",
            icon: 'warning',
        })
        return
    }
    DELETE(end_point + "/DeleteUsers",_Id,_name,function () {
        Onload();
    })
});



