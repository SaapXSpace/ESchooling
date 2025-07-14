import { GETAPIURL, GETBYID, POST, PUT, DELETE, CLEAR } from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js";

// INITIALIZING VARIABLES
var end_point;
var btn_save = $('#btn_save');
var btn_update = $('#btn_update');
var btn_add = $('#openmodal');
var table_loading_image = $('#table_loading_image');

// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var menuId = '';
if (url.has('M')) {
    menuId = window.atob(url.get('M'));
}

// jQuery CONSTRUCTOR
$(document).ready(function () {
    end_point = '/api/v1/Designation';
    discon();
});

// DISCONNECTION FUNCTION
function discon() {
    table_loading_image.hide();
    Onload(); CLEAR(); btn_update.hide(); btn_save.show();
}

// FETCHING DATA FUNCTION
function petchdata(response) {
    $('#designation_id').val(response.designationId);
    $('#designation_name').val(response.designationName);
    $('#designation_description').val(response.description);
    $("#designation_active").prop("checked", response.active == 1);
    $('#data_Model').modal();
}

// VALIDATION FUNCTION
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '', id = '';
    var designation_id = $('#designation_id');
    var designation_name = $('#designation_name');
    var designation_description = $('#designation_description');
    var designation_active = $('#designation_active');

    if (designation_name.val() == '') {
        ck = 1;
        _Error = 'Designation Name is required';
        designation_name.focus();
    }

    if (designation_id.val() == '') {
        id = '00000000-0000-0000-0000-000000000000';
    } else {
        id = designation_id.val();
    }

    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        });
    } else {
        _cre = JSON.stringify({
            "designationId": id,
            "designationName": designation_name.val(),
            "description": designation_description.val(),
            "active": designation_active[0].checked ? 1 : 0,
            "type": "U"
        });
    }
    return { ckval: ck, creteria: _cre };
}

// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;

    table_loading_image.show();
    $.ajax({
        url: GETAPIURL(end_point + "/GetDesignation"),
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('_menuId', menuId);
        },
        success: function (response) {
            var action_button = '';
            if (response != null) {
                if (!response.permissions.insert_Permission) {
                    btn_add.hide();
                }
                if (response.permissions.update_Permission) {
                    action_button += "<a href='#' class='btn-edit fas fa-edit' data-toggle='tooltip' style='color:#03588C' title='Update'></a> ";
                }
                if (response.permissions.delete_Permission) {
                    action_button += "<a href='#' class='btn-delete fas fa-trash' data-toggle='tooltip' style='color:#03588C' title='Delete'></a>";
                }
                if (response.data != null) {
                    $('#designation_table').DataTable().clear().destroy();
                    var datatablesButtons = $("#designation_table").DataTable({
                        data: response.data,
                        destroy: true,
                        retrieve: true,
                        processing: true,
                        lengthChange: !1,
                        buttons: ["pdf", "copy", "print", "csv"],
                        columns: [
                            { data: null, "defaultContent": action_button },
                            { "render": function (data, type, full, meta) { return tbl_row_cnt++; } },
                            { data: 'designationName' },
                            { data: 'description' },
                            { data: 'active', 'render': function (data, type, full, meta) { return data == 1 ? '✔' : '✘'; } },
                        ],
                        "order": [[0, "asc"]],
                        "pageLength": 5,
                    });
                    datatablesButtons.buttons().container().appendTo("#designation_table_wrapper .col-md-6:eq(0)");
                } else {
                    $("#designation_table").DataTable();
                }
            }
            table_loading_image.hide();
        },
        error: function (xhr, status, err) {
            Swal.fire({
                title: xhr.status.toString() + ' #' + status + '\n' + xhr.responseText,
                width: 800,
                icon: 'error',
                showConfirmButton: true,
                showClass: { popup: 'animated fadeInDown faster' },
                hideClass: { popup: 'animated fadeOutUp faster' }
            });
        }
    });
    return true;
}

// OPEN MODAL BUTTON EVENT
$('div').on('click', '#openmodal', function (e) {
    CLEAR(); btn_update.hide(); btn_save.show();
});

// ADD BUTTON EVENT
$('form').on('click', '#btn_save', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    POST(end_point + "/AddDesignation", _cre, function () {
        discon();
    });
});

// UPDATE BUTTON EVENT
$('form').on('click', '#btn_update', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    PUT(end_point + "/UpdateDesignation", _cre, function () {
        discon();
    });
});

// EDIT BUTTON EVENT 
$('table').on('click', '.btn-edit', async function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#designation_table').DataTable().row(currentRow).data();
    var _id = data['designationId'];
    btn_update.show(); btn_save.hide();
    await GETBYID(end_point + "/GetDesignationById", _id, data['designationName'], function (response) {
        petchdata(response);
    });
});

// DELETE BUTTON EVENT 
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#designation_table').DataTable().row(currentRow).data();
    var _Id = data['designationId'];
    var _name = data['designationName'];
    DELETE(end_point + "/DeleteDesignation", _Id, _name, function () {
        Onload();
    });
});
// JavaScript source code
