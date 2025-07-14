import { GETAPIURL, GETBYID, POST, PUT, DELETE, CLEAR } from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js"; 

var end_point;
var btn_save = $('#btn_sav');
var btn_update = $('#btn_upd');
var btn_add = $('#openmodal');
var table_loading_image = $('#table_loading_image');

var url = new URLSearchParams(window.location.search);
var menuId = '';
if (url.has('M')) {
    menuId = window.atob(url.get('M'));
} else {
    menuId = "d00d2040-4652-476b-9820-367c5f99866a";
}

$(document).ready(function () {
    end_point = '/api/v1/Teacher';
    discon();

    $('#file_picture').on('change', showPreview);
    $('#img_preview').on('click', () => {
        console.log("Image preview clicked, triggering file input.");
        $('#file_picture').click();
    });
});

function discon() {
    table_loading_image.hide();
    Onload();
    CLEAR(); 
    btn_update.hide();
    btn_save.show();
    resetImagePreview();
}

function petchdata(res) {
    // Populate form fields with data from the response
    $('#txt_id').val(res.teacherId);
    $('#txt_code').val(res.code); 
    $('#txt_fullname').val(res.fullName);
    $('#txt_email').val(res.email);
    $('#txt_phone').val(res.phone);
    $('#txt_cnic').val(res.cnic);
    $('#txt_gender').val(res.gender);
    $('#txt_dob').val(res.dateOfBirth ? res.dateOfBirth.split("T")[0] : '');
    $('#txt_joining').val(res.joiningDate ? res.joiningDate.split("T")[0] : '');
    $('#txt_empstatus').val(res.employmentStatus);
    $('#txt_exitdate').val(res.exitDate ? res.exitDate.split("T")[0] : ''); 
    $('#txt_exitreason').val(res.exitReason);
    $('#txt_picture_url').val(res.picture); 
    $('#img_preview').attr('src', res.picture || '/img/images/profile.jpg');
    $('#ck_act').prop("checked", res.active);
    
    $('#txt_registration_number').val(res.registrationNumber || '');
    $('#data_Model').modal('show'); // Show the modal
    btn_update.show(); // Show update button
    btn_save.hide(); // Hide save button
}

function ckvalidation() {
    let ck = 0, _Error = '', _cre = '', id = $('#txt_id').val() || '00000000-0000-0000-0000-000000000000';

    if ($('#txt_fullname').val().trim() === '') {
        ck = 1; _Error = 'Full Name is required'; $('#txt_fullname').focus();
    } else if ($('#txt_email').val().trim() === '') {
        ck = 1; _Error = 'Email is required'; $('#txt_email').focus();
    } else if ($('#txt_phone').val().trim() === '') {
        ck = 1; _Error = 'Phone is required'; $('#txt_phone').focus();
    } else if ($('#txt_cnic').val().trim() === '') {
        ck = 1; _Error = 'CNIC is required'; $('#txt_cnic').focus();
    } else if ($('#txt_gender').val().trim() === '') {
        ck = 1; _Error = 'Gender is required'; $('#txt_gender').focus();
    } else if ($('#txt_dob').val().trim() === '') {
        ck = 1; _Error = 'Date of Birth is required'; $('#txt_dob').focus();
    } else if ($('#txt_joining').val().trim() === '') {
        ck = 1; _Error = 'Joining Date is required'; $('#txt_joining').focus();
    }

    if (ck === 1) {
        Swal.fire({ title: _Error, icon: 'error' });
        return { ckval: 1 };
    }

    _cre = JSON.stringify({
        teacherId: id,
        code: $('#txt_code').val(),
        fullName: $('#txt_fullname').val(),
        email: $('#txt_email').val(),
        phone: $('#txt_phone').val(),
        cnic: $('#txt_cnic').val(),
        gender: $('#txt_gender').val(),
        dateOfBirth: $('#txt_dob').val() || null,
        joiningDate: $('#txt_joining').val() || null,
        employmentStatus: $('#txt_empstatus').val(),
        exitDate: $('#txt_exitdate').val() || null,
        exitReason: $('#txt_exitreason').val(),
        picture: $('#txt_picture_url').val(),
        active: $('#ck_act').prop("checked") // Sends true/false directly
    });

    return { ckval: 0, creteria: _cre };
}

function Onload() {
    var tbl_row_cnt = 1;
    table_loading_image.show();
    $.ajax({
        url: GETAPIURL(end_point + "/GetTeacher"),
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('_menuId', menuId);
        },
        success: function (response) {
            console.log("DataTables response:", response);
            if (response.data) {
                $('#data_table').DataTable().clear().destroy();
                const dt = $('#data_table').DataTable({
                    data: response.data,
                    destroy: true,
                    retrieve: true,
                    processing: true,
                    lengthChange: false,
                    buttons: ["pdf", "copy", "print", "csv"],
                    responsive: true, // Ensures responsiveness
                    columns: [
                        { render: () => tbl_row_cnt++ },
                        {
                            data: 'picture',
                            render: data => `<img src="${data || '/img/images/profile.jpg'}" width="40" height="40" style="object-fit:cover; border-radius:8px;" onerror="this.onerror=null;this.src='/img/images/profile.jpg';" />`
                        },
                        { data: 'code' }, // Column for 'code'
                        { data: 'fullName' },
                        { data: 'email' },
                        { data: 'phone' },
                        {
                            data: 'active',
                            render: data => data ? '✔' : '✘'
                        },
                        {
                            data: null,
                            render: function () {
                                return `
                                <button class="btn btn-sm btn-primary btn-edit" title="Edit">Edit</button>
                                <button class="btn btn-sm btn-danger btn-delete" title="Delete">Delete</button>`;
                            }
                        },
                        { data: 'teacherId', visible: false } // Hidden column for teacherId
                    ],
                    order: [[0, "asc"]],
                    pageLength: 5
                });
                dt.buttons().container().appendTo("#data_table_wrapper .col-md-6:eq(0)");
            }
            table_loading_image.hide();
        },
        error: function (xhr) {
            console.error("DataTables AJAX error:", xhr);
            Swal.fire({ title: xhr.status + ' Error', text: xhr.responseText, icon: 'error' });
            table_loading_image.hide();
        }
    });
}

$('#openmodal').on('click', function () {
    console.log("Open modal button clicked.");
    CLEAR();
    btn_update.hide();
    btn_save.show();
    resetImagePreview();
    $('#data_Model').modal('show');
});

$('#btn_sav').on('click', function () {
    const ck = ckvalidation();
    if (ck.ckval === 1) return;
    console.log('Sending payload (Save):', ck.creteria);
    POST(end_point + "/AddTeacher", ck.creteria, discon);
});

$('#btn_upd').on('click', function () {
    const ck = ckvalidation();
    if (ck.ckval === 1) return;
    console.log('Sending payload (Update):', ck.creteria);
    PUT(end_point + "/UpdateTeacher", ck.creteria, discon);
});

$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    const data = $('#data_table').DataTable().row($(this).closest("tr")).data();
    console.log("Edit button clicked, row data:", data);
    GETBYID(end_point + "/GetTeacherById?_Id=" + data.teacherId, data.teacherId, data.fullName, petchdata);
   // GETBYID(end_point + "/GetTeacherById?_Id=" + data.teacherId, menuId, petchdata);
});

$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    const data = $('#data_table').DataTable().row($(this).closest("tr")).data();
    console.log("Delete button clicked, row data:", data);
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            DELETE(end_point + "/DeleteTeacher?Id=" + data.teacherId, data.teacherId, data.fullName, discon);
        }
    });
});

window.showPreview = function (event) {
    console.log("showPreview function called.");
    if (event.target.files.length > 0) {
        let file = event.target.files[0];
        console.log("File selected:", file.name, file.size, file.type);

        if (file.type !== 'image/jpeg') {
            Swal.fire('Error', 'Only JPG images are allowed.', 'error');
            resetImagePreview();
            return;
        }

        // Read file as Base64
        const reader = new FileReader();
        reader.onload = function (e) {
            const base64String = e.target.result.split(',')[1]; // Get base64 part
            console.log("Base64 string generated (first 50 chars):", base64String.substring(0, 50) + '...');

            // Update preview image immediately
            $('#img_preview').attr('src', e.target.result);

            // Upload the image
            uploadImage(base64String);
        };
        reader.onerror = function (error) {
            console.error("FileReader error:", error);
            Swal.fire('Error', 'Failed to read file.', 'error');
        };
        reader.readAsDataURL(file);
    } else {
        console.log("No file selected for preview.");
    }
}

window.resetImagePreview = function () {
    console.log("resetImagePreview called.");
    $('#img_preview').attr('src', '/img/images/profile.jpg');
    $('#txt_picture_url').val(''); 
    $('#file_picture').val(''); 
}

// Modified to accept base64String directly
window.uploadImage = function (base64String) {
    const registrationNumber = $('#txt_registration_number').val();

    if (!registrationNumber) {
        Swal.fire('Validation Error', 'Please enter a Registration Number before uploading a picture.', 'warning');
        resetImagePreview();
        return;
    }

    console.log("uploadImage function called with Base64 string and Reg No:", registrationNumber);

    const payload = {
        base64Image: base64String,
        regNo: registrationNumber
    };

    $.ajax({
        url: GETAPIURL(end_point + "/UploadPicture"),
        type: "POST",
        data: JSON.stringify(payload), 
        processData: false, 
        contentType: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            console.log("Uploading picture... Authorization header set.");
        },
        success: function (response) {
            console.log("Picture upload success response:", response);
            if (response && response.url) {
                $('#txt_picture_url').val(response.url); 
                Swal.fire('Success', 'Picture uploaded successfully!', 'success');
            } else {
                console.error("Upload success but no URL in response:", response);
                Swal.fire('Error', 'Failed to get image URL from response.', 'error');
            }
        },
        error: function (xhr) {
            console.error("Picture upload AJAX error:", xhr);
            let errorMessage = "An unknown error occurred during upload.";
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            } else if (xhr.responseText) {
                errorMessage = xhr.responseText;
            }
            Swal.fire({ title: xhr.status + ' Error', text: errorMessage, icon: 'error' });
        }
    });
}
