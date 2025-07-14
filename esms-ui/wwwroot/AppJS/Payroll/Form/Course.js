import { GETAPIURL, GETBYID, POST, PUT, DELETE, CLEAR } from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js";

// INITIALIZING VARIABLES
var end_point;
var btn_save = $('#btn_sav');
var btn_update = $('#btn_upd');
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
    end_point = '/api/v1/Course';
    discon();
});

// DISCONNECTION FUNCTION
function discon() {
    table_loading_image.hide();
    Onload();
    CLEAR();
    btn_update.hide();
    btn_save.show();
}

// FETCHING DATA FUNCTION
function fetchdata(response) {
    $('#txt_id').val(response.courseId);
    $('#txt_name').val(response.courseName);
    $('#txt_description').val(response.description || '');
    $('#txt_credits').val(response.credits);
    if (!response.active) {
        $("#ck_act").prop("checked", false);
    } else {
        $("#ck_act").prop("checked", true);
    }
    $('#data_Model').modal();
}

// VALIDATION FUNCTION
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '', id = '';
    var txt_id = $('#txt_id');
    var txt_name = $('#txt_name');
    var txt_credits = $('#txt_credits');
    var ck_act = $('#ck_act');

    if (txt_name.val() == '') {
        ck = 1;
        _Error = 'Course Name is required';
        txt_name.focus();
    }

    if (txt_credits.val() == '' || isNaN(txt_credits.val())) {
        ck = 1;
        _Error = 'Valid Credits value is required';
        txt_credits.focus();
    }

    if (txt_id.val() == '') {
        id = '00000000-0000-0000-0000-000000000000';
    }
    else {
        id = txt_id.val();
    }

    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        });
    }
    else if (!Boolean(ck)) {
        _cre = JSON.stringify({
            "courseId": id,
            "courseName": txt_name.val(),
            "description": $('#txt_description').val() || '',
            "credits": parseInt(txt_credits.val()),
            "active": ck_act[0].checked
        });
    }
    return { ckval: ck, creteria: _cre };
}

// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;

    table_loading_image.show();
    $.ajax({
        url: GETAPIURL(end_point + "/GetCourse"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('_menuId', menuId);
        },
        success: function (response) {
            var action_button = ' ';
            if (response != null) {
                if (!response.permissions.insert_Permission) {
                    btn_add.hide();
                }
                if (response.permissions.update_Permission) {
                    action_button += "<a href='#' class='btn-edit fas fa-edit' data-toggle='tooltip' style='color:#03588C' title='Update'></a> ";
                }
                if (response.permissions.delete_Permission) {
                    action_button += " <a href='#' class='btn-delete fas fa-trash' data-toggle='tooltip' style='color:#03588C' title='Delete'></a> ";
                }
                if (response.data != null) {
                    $('#data_table').DataTable().clear().destroy();
                    var datatablesButtons = $("#data_table").DataTable({
                        data: response.data,
                        destroy: true,
                        retrieve: true,
                        processing: true,
                        lengthChange: !1,
                        buttons: ["pdf", "copy", "print", "csv"],
                        columns: [
                            
                            { "render": function (data, type, full, meta) { return tbl_row_cnt++; } },
                            { data: 'code' },
                            { data: 'courseName' },
                            { data: 'description' },
                            { data: 'credits' },
                            {
                                data: 'active',
                                render: function (data, type, full, meta) {
                                    return data ? '✔' : '✘';
                                }
                            },
                            { data: null, "defaultContent": action_button }
                        ],
                        "order": [[0, "asc"]],
                        "pageLength": 5,
                    });
                    datatablesButtons.buttons().container().appendTo("#data_table_wrapper .col-md-6:eq(0)");
                } else {
                    $("#data_table").DataTable();
                }
            }
            table_loading_image.hide();
        },
        error: function (xhr, status, err) {
            table_loading_image.hide();
            Swal.fire({
                title: xhr.status.toString() + ' #' + status + '\n' + xhr.responseText,
                width: 800,
                icon: 'error',
                showConfirmButton: true,
                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });
        }
    });
}

// OPEN MODAL BUTTON EVENT
$('div').on('click', '#openmodal', function (e) {
    CLEAR();
    btn_update.hide();
    btn_save.show();
    $('#data_Model').modal();
});

// ADD BUTTON EVENT
$('form').on('click', '#btn_sav', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    POST(end_point + "/AddCourse", _cre, function () {
        discon();
    });
});

// UPDATE BUTTON EVENT
$('form').on('click', '#btn_upd', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    PUT(end_point + "/UpdateCourse", _cre, function () {
        discon();
    });
});

// EDIT BUTTON EVENT 
$('table').on('click', '.btn-edit', async function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _id = data['courseId'];
    var _name = data['courseName'];
    btn_update.show();
    btn_save.hide();
    await GETBYID(end_point + "/GetCourseById", _id, _name, function (response) {
        fetchdata(response);
    });
});

// DELETE BUTTON EVENT 
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _Id = data['courseId'];
    var _name = data['courseName'];
    DELETE(end_point + "/DeleteCourse", _Id, _name, function () {
        Onload();
    });
});