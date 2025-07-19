import { GETAPIURL, GETBYID, POST, PUT, DELETE, CLEAR } from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js";

// INITIALIZING VARIABLES
var end_point;
var btn_save = $('#btn_sav');
var btn_update = $('#btn_upd');
var btn_add = $('#openmodal');
var fromShortName = "STU";
var table_loading_image = $('#table_loading_image');

// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var menuId = '';
if (url.has('M')) {
    menuId = window.atob(url.get('M'));
}

// jQuery CONSTRUCTOR
$(document).ready(function () {
    end_point = '/api/v1/Student';
    discon();
});

// DISCONNECT FUNCTION
function discon() {
    table_loading_image.hide();
    Onload(); CLEAR(); btn_update.hide(); btn_save.show();
    resetImagePreview();
}

// FETCH DATA INTO FORM
function petchdata(response) {
    $('#txt_id').val(response.id);
    $('#txt_code').val(response.code);
    $('#txt_fullname').val(response.fullName);
    $('#txt_email').val(response.email);
    $('#txt_phone').val(response.phone);
    $('#txt_gender').val(response.gender);
    $('#txt_dob').val(response.dateOfBirth?.split("T")[0]);
    $('#txt_registrationnumber').val(response.registrationNumber);
    $('#txt_enrollmentdate').val(response.enrollmentDate?.split("T")[0]);
    $('#txt_enrollmentstatus').val(response.enrollmentStatus);
    $('#txt_exitdate').val(response.exitDate?.split("T")[0]);
    $('#txt_exitreason').val(response.exitReason);
    $('#ck_act').prop("checked", response.active);
    $('#ck_fresher').prop("checked", response.fresher || false);

    if (response.picture) {
        $('#img_preview').attr("src", response.picture);
        $('#delete_icon').show();
    } else {
        resetImagePreview();
    }

    $('#data_Model').modal();
}

// VALIDATION FUNCTION
function ckvalidation() {
    let ck = 0, _Error = '', _cre = '', id = $('#txt_id').val() || '00000000-0000-0000-0000-000000000000';

    if ($('#txt_fullname').val() === '') {
        ck = 1;
        _Error = 'Full Name is required';
        $('#txt_fullname').focus();
    }

    if (ck === 1) {
        Swal.fire({ title: _Error, icon: 'error' });
        return { ckval: 1 };
    }

    _cre = JSON.stringify({
        id: id,
        code: $('#txt_code').val(),
        fullName: $('#txt_fullname').val(),
        email: $('#txt_email').val(),
        phone: $('#txt_phone').val(),
        gender: $('#txt_gender').val(),
        dateOfBirth: $('#txt_dob').val(),
        registrationNumber: $('#txt_registrationnumber').val(),
        enrollmentDate: $('#txt_enrollmentdate').val(),
        enrollmentStatus: $('#txt_enrollmentstatus').val(),
        exitDate: $('#txt_exitdate').val(),
        exitReason: $('#txt_exitreason').val(),
        Picture: $('#img_preview').data('base64') || "", 
        active: $('#ck_act').prop("checked"),
        fresher: $('#ck_fresher').prop("checked"),
        type: "U"
       
    });

    return { ckval: 0, creteria: _cre };
}

// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;
    table_loading_image.show();

    $.ajax({
        url: GETAPIURL(end_point + "/GetStudent"),
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('_menuId', menuId);
        },
        success: function (response) {
            if (response != null) {
                if (!response.permissions.insert_Permission) btn_add.hide();

                let action_button = '';
                if (response.permissions.update_Permission)
                    action_button += "<a href='#' class='btn-edit fas fa-edit' title='Update'></a> ";
                if (response.permissions.delete_Permission)
                    action_button += "<a href='#' class='btn-delete fas fa-trash' title='Delete'></a> ";

                if (response.data != null) {
                    $('#data_table').DataTable().clear().destroy();
                    const dt = $("#data_table").DataTable({
                        data: response.data,
                        destroy: true,
                        retrieve: true,
                        processing: true,
                        lengthChange: false,
                        buttons: ["pdf", "copy", "print", "csv"],
                        // to add columns in GRID 
                        columns: [
                           
                            { render: () => tbl_row_cnt++ },
                            { data: 'registrationNumber' },
                            { data: 'fullName' },
                            { data: 'email' },
                            { data: 'phone' },
                            { data: 'gender' },
                            { data: 'enrollmentStatus' },
                           
                            {
                                data: 'active',
                                render: data => data ? '✔' : '✘'
                            },
                            {
                                data: 'picture',
                                render: data => `<img src="${data}" width="40" height="40" style="object-fit:cover; border-radius:8px;" />`
                            }
                             { data: null, defaultContent: action_button , title : "Action" },
                        ],
                        order: [[1, "asc"]]
                    });
                    dt.buttons().container().appendTo("#data_table_wrapper .col-md-6:eq(0)");
                } else {
                    $("#data_table").DataTable();
                }
            }
            table_loading_image.hide();
        },
        error: function (xhr, status, err) {
            if (xhr.status !== 0) { // ✅ Skip alert for status 0 (background error)
                Swal.fire({
                    title: xhr.status.toString() + ' #' + status + '\n' + (xhr.responseText || 'Unexpected error'),
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
            } else {
                console.warn("Silent ignored error:", status, err); // ✅ Optional for debugging
            }
        }

    });
}

// OPEN MODAL
$('#openmodal').on('click', function () {
    CLEAR(); btn_update.hide(); btn_save.show(); setCode(); resetImagePreview();
});

// CODE GENERATION
$('#btn_codegenerate').click(setCode);
function setCode() {
    $("#txt_code").val(fromShortName + "-" + GenerateCode());
}
function GenerateCode() {
    return `${rand()}${rand()}${rand()}`;
}
function rand() {
    return Math.floor(Math.random() * 90 + 10);
}

// IMAGE PREVIEW
window.showPreview = function (event) {
    const file = event.target.files[0];

    if (file && file.type === "image/jpeg") {
        const reader = new FileReader();

        reader.onload = function (e) {
            $('#img_preview').attr("src", e.target.result);        
            $('#img_preview').data('base64', e.target.result);       // ✅ store base64
            $('#delete_icon').show();                              
        };

        reader.readAsDataURL(file);  // ✅ convert to base64
    } else {
        Swal.fire("Only JPG images allowed", "", "error");
        $('#txt_picture').val("");
        $('#img_preview').attr('src', '~/img/icons/upload-photo.png'); 
        $('#img_preview').removeData('base64');  // ✅ remove previous data if any
        $('#delete_icon').hide(); 
    }
};


// RESET IMAGE
function resetImagePreview() {
    $('#img_preview').attr("src", "/img/icons/upload-photo.png");
    $('#txt_picture').val('');
    $('#delete_icon').hide();
}

window.clearPreview = function () {
    if ($('#img_preview').attr("src") !== "/img/icons/upload-photo.png") {
        resetImagePreview();
    }
}

// SAVE BUTTON
$('#btn_sav').click(function () {
    var ck = ckvalidation();
    if (ck.ckval === 1) return;
    POST(end_point + "/AddStudent", ck.creteria, () => discon());
});

// UPDATE BUTTON
$('#btn_upd').click(function () {
    var ck = ckvalidation();
    if (ck.ckval === 1) return;
    PUT(end_point + "/UpdateStudent", ck.creteria, () => discon());
});

// EDIT BUTTON
$('table').on('click', '.btn-edit', async function (e) {
    e.preventDefault();
    var data = $('#data_table').DataTable().row($(this).closest("tr")).data();
    btn_update.show(); btn_save.hide();
    await GETBYID(end_point + "/GetStudentById", data.id, data.fullName, res => petchdata(res));
});

// DELETE BUTTON
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var data = $('#data_table').DataTable().row($(this).closest("tr")).data();
    DELETE(end_point + "/DeleteStudent", data.id, data.fullName, () => Onload());
});

window.Onload = Onload;


