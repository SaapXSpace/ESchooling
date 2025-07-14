import { GETAPIURL, GETBYID, POST, PUT, DELETE, CLEAR } from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js";

// INITIALIZING VARIABLES
var end_point;
var btn_save = $('#btn_sav');
var btn_update = $('#btn_upd');
var btn_add = $('#openmodal');
var fromShortName = "CLS"

var table_loading_image = $('#table_loading_image');

// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var menuId = '';
if (url.has('M')) {
    menuId = window.atob(url.get('M'));
}

// jQuery CONSTRUCTOR
$(document).ready(function () {
    end_point = '/api/v1/Classroom';
    discon();
});

// DISCONNECTION FUNCTION
function discon() {
    table_loading_image.hide();
    Onload();CLEAR();btn_update.hide();btn_save.show();
}

// FETCHING DATA FUNCTION
function petchdata(response) {
    $('#txt_id').val(response.id);
    $('#txt_roomNumber').val(response.roomNumber);
    $('#txt_roomType').val(response.roomType);
    $('#txt_capacity').val(response.capacity);
    $('#txt_location').val(response.location);
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
    var txt_roomNumber = $('#txt_roomNumber');
    var txt_roomType = $('#txt_roomType');
    var txt_capacity = $('#txt_capacity');
    var txt_location = $('#txt_location');
    var ck_act = $('#ck_act');

    // Validation checks
    if (txt_roomNumber.val() == '') {
        ck = 1;
        _Error = 'Room Number is required';
        txt_roomNumber.focus();
    }
    if (txt_roomType.val() == '') {
        ck = 1;
        _Error = 'Room Type is required';
        txt_roomType.focus();
    }
    if (txt_location.val() == '') {
        ck = 1;
        _Error = 'Location is required';
        txt_location.focus();
    }
    if (txt_capacity.val() == '' || isNaN(txt_capacity.val())) {
        ck = 1;
        _Error = 'Valid Capacity value is required';
        txt_capacity.focus();
    }

    if (txt_id.val() == '') {
        id = '00000000-0000-0000-0000-000000000000';
    } else {
        id = txt_id.val();
    }

    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        });
    } else {
        _cre = JSON.stringify({
            "id": id,
            "roomNumber": txt_roomNumber.val(), 
            "roomType": txt_roomType.val(),  
            "capacity": parseInt(txt_capacity.val()),
            "location": txt_location.val(), 
            "active": ck_act[0].checked,
            "Code":""
        });
    }
    return { ckval: ck, creteria: _cre };
}

// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;

    table_loading_image.show();
    $.ajax({
        url: GETAPIURL(end_point + "/GetClassrooms"),
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
                            { data: 'roomNumber' },
                            { data: 'roomType' },
                            { data: 'capacity' },
                            { data: 'location' },
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
    POST(end_point + "/AddClassroom", _cre, function () {
        discon();
    });
});

// UPDATE BUTTON EVENT
$('form').on('click', '#btn_upd', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    PUT(end_point + "/UpdateClassroom", _cre, function () {
        discon();
    });
});

// EDIT BUTTON EVENT 
// EDIT BUTTON EVENT 
$('table').on('click', '.btn-edit', async function (e) { //Edit Start
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _roomNumber = data['roomNumber'];
    btn_update.show(); btn_save.hide()
    await GETBYID(end_point + "/GetClassroomById", _id, _roomNumber, function (response) {
        petchdata(response)
    })

});

// DELETE BUTTON EVENT 
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _roomNumber = data['roomNumber'];
    DELETE(end_point + "/DeleteClassroom", _id, _roomNumber, function () {
        Onload();
    });
});

