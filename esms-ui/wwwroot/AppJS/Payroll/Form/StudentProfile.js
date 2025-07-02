import  {GETAPIURL,FILLCOMBO, GETBYID,POST,PUT,DELETE,CLEAR, FILLCOMBOBYID}  from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js";

// INITIALIZING VARIBALES
var end_point;
var btn_save = $('#btn_sav')
var btn_exp_sav = $("#btn_exp_sav")
var btn_update = $('#btn_upd')
var btn_add = $('#openmodal')
var openuploadmodal = $('#openuploadmodal')
var fromShortName = "STU"
var base64 = "";
var ImageName = "";
var profileBase64 = ""
var profileImageName = ""

var loader_export_save = $('#loader_export_save')
var table_loading_image = $('#table_loading_image')


var txt_no = $('#txt_no')
var txt_firstname = $('#txt_name')
var txt_lastname = $('#txt_lastname')
var txt_fathername = $('#txt_fathername')
var txt_address = $('#txt_address')
var txt_email = $('#txt_email')
var txt_contact = $('#txt_contact')
var txt_cnic = $('#txt_cnic')
var txt_dob = $('#txt_dob')
var txt_dobplace = $('#txt_dobplace')
var txt_rank = $('#txt_rank')
var txt_nationallity = $('#txt_nationallity')
var txt_ssb = $('#txt_ssb')
var txt_coc = $('#txt_coc')
var txt_cocheld = $('#txt_cocheld')
var txt_passport = $('#txt_passport')

var url = new URLSearchParams(window.location.search);
var menuId = '';
if (url.has('M')) {
    menuId = window.atob(url.get('M'));
}

// jQuery CONSTRUCTOR
$(document).ready(function () {  
    btn_add.hide()
    openuploadmodal.hide()
    end_point = '/api/v1/StudentProfile';
    ComponentsDropdowns.init();
    discon();
    ConfigureDate()

    document.getElementById('printButton').addEventListener('click', function() {
        var printButton = document.getElementById('printButton');
        
        printButton.style.display = 'none';  // Hide the print button

        var content = document.querySelector('#student_info_Model .modal-content').innerHTML;

        var printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Student Information</title>');
        
        printWindow.document.write('<style>');
        printWindow.document.write('body{font-family: Arial, sans-serif; padding: 20px;}');
        
        printWindow.document.write('.modal-content{display: flex; flex-wrap: wrap; align-items: flex-start; padding: 0;}');
        printWindow.document.write('.image-container{flex: 1; padding: 20px;}');
        printWindow.document.write('.info-section{flex: 2; padding: 20px;}');
        
        printWindow.document.write('.table{width: 100%; border-collapse: collapse;}');
        printWindow.document.write('.table th, .table td{padding: 8px; text-align: left; border: 1px solid #ddd;}');
        
        printWindow.document.write('h5{margin-bottom: 10px;}');
        printWindow.document.write('.row { display: flex; flex-wrap: wrap; align-items: flex-start;}');
        printWindow.document.write('.col-lg-3, .col-sm-7 { flex: 1; }');
        printWindow.document.write('</style>');
        
        printWindow.document.write('</head><body>');
        printWindow.document.write(content);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
    
        printWindow.print();

        printWindow.onafterprint = function() {
            printWindow.close(); 
        };
    

        printButton.style.display = 'block';
    });
});

function ConfigureDate() {
    var currentDate = new Date();
    var dateFromInput = document.getElementById("txt_dob");
    var formattedCurrentDate = currentDate.toISOString().split("T")[0];
    dateFromInput.value = formattedCurrentDate;

    
}

// --- Fill Select 2 of Module ---
var ComponentsDropdowns = function () {
    
    var handleSelect2 = function () {
        LoadCourseCategory();
        LoadExpCourseCategory();
        LoadDocumentType()
    }
    return {
        init: function () {
            handleSelect2();
            $('#sel_course').select2({data:[{ id: -1, text: "Select Course of respective Category" }]}); 
        }
    };
}();




// LOAD Course LOV
function LoadDocumentType() {
    var $element = $('#sel_doctype').select2(); 
    FILLCOMBO('/api/v1/PayrollLovService/GetDocumentTypeLov',$element,"Course Document Type")
}

// LOAD Course LOV
function LoadCourseCategory() {
    var $element = $('#sel_coursecat').select2(); 
    FILLCOMBO('/api/v1/PayrollLovService/GetCourseCategoryLov',$element,"Course Category")
}

function LoadCourse() {
    var $element = $('#sel_course').select2({data:[{ id: -1, text: "Select Course of respective Category" }]}); 
    var Id =  $('#sel_coursecat').val()
    if (Id != "-1") {
        FILLCOMBOBYID(Id,'/api/v1/PayrollLovService/GetCourseByCourseCategoryLov',$element,"Course of respective Category")
    }
}

// LOAD Export Course LOV
function LoadExpCourseCategory() {
    var $element = $('#sel_exp_coursecat').select2(); 
    FILLCOMBO('/api/v1/PayrollLovService/GetCourseCategoryLov',$element,"Course Category")
}

function LoadExpCourse() {
    var $element = $('#sel_exp_course').select2({data:[{ id: -1, text: "Select Course of respective Category" }]}); 
    var Id =  $('#sel_exp_coursecat').val()
    if (Id != "-1") {
        FILLCOMBOBYID(Id,'/api/v1/PayrollLovService/GetCourseByCourseCategoryLov',$element,"Course of respective Category")
    }
}

$('form').on('change', '#sel_coursecat', function (e) {
    LoadCourse()
});

$('form').on('change', '#sel_exp_coursecat', function (e) {
    LoadExpCourse()
});

$('form').on('change', '#sel_course', function (e) {
    if ($('#sel_course').val() != "-1") {
        let Obj = $('#sel_course').select2('data')
        Obj != null ? $('#txt_fees').val(Obj[0].fees) : $('#txt_fees').val(0)
        $('#txt_amt').val(Obj[0].fees)
        $('#txt_dis').val(0)
        $('#txt_disamt').val(0)
    }
});

$('form').on('click', '#btn_add_course', function (e) {
    AddCourse()
});

$('form').on('click', '#btn_add_attch', function (e) {
    AddAttechment();
});

$('form').on('click', '#btn_exp_sav', function (e) {
    var ck = SaveCSVFile();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    loader_export_save.show();
    POST("/api/v1/PayrollLovService/SaveExportedStudentData",_cre,function () {
        discon();
        window.location.reload();
    });
});

$('form').on('keyup', '#txt_dis', function (e) {
    let discount = e.target.value
    if (discount >= 0 && discount <= 100) {
        let Fees = $('#txt_fees').val()
        let feediscount =  parseFloat(Fees) * parseFloat(discount) / 100
        let netamount = parseFloat(Fees) - parseFloat(feediscount)
        $('#txt_amt').val(netamount)
        $('#txt_disamt').val(feediscount)
        
    }
});

$('form').on('keyup', '#txt_disamt', function (e) {
    let discountamount = e.target.value
    let Fees = $('#txt_fees').val()
    if (Fees == null) {
        return
    }
    if (discountamount <= Fees) {
        let feediscount =  ( parseFloat(discountamount)/ parseFloat(Fees) ) * 100
        let netamount = parseFloat(Fees) - parseFloat(discountamount)
        $('#txt_amt').val(netamount)
        $('#txt_dis').val(feediscount)
    }
});

// DISCONNECTION FUNCTION
function discon(){
    loader_export_save.hide();
    table_loading_image.hide();
    Onload(); CLEAR(); btn_update.hide();btn_save.show()
    $('#sel_branch').val("-1").trigger('change');
    $('#sel_role').val("-1").trigger('change');

    var student_course_table = $("#student_course_table tbody");
    student_course_table.empty();

    var student_attach_table = $("#student_attach_table tbody");
    student_attach_table.empty();

}

// OPEN MODAL BUTTON EVENT
$('div').on('click', '#openmodal', function (e) {
    CLEAR();btn_update.hide();btn_save.show()
    $('#sel_branch').val("-1").trigger('change');
    $('#sel_role').val("-1").trigger('change');
    setCode();
    ConfigureDate();
    var student_course_table = $("#student_course_table tbody");
    student_course_table.empty();

    var student_attach_table = $("#student_attach_table tbody");
    student_attach_table.empty();
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

$('#ck_fres').change(function() {
    if ($(this).is(':checked')) {
        $('#txt_ssb').val("FRESHER").prop('disabled', true);
    } else {
        $('#txt_ssb').val('').prop('disabled', false);
    }
});

// CNIC MASKING
// txt_cnic.on('input', function() {
//     var cnic = $(this).val().replace(/[^0-9]/g, ''); // Remove non-numeric characters
//     var formattedCnic = '';
//     cnic = cnic.substring(0, 13);
//     for (var i = 0; i < cnic.length; i++) {
//         if (i === 5 || i === 12) {
//             formattedCnic += '-';
//         }
//         formattedCnic += cnic.charAt(i);
//     }
//     $(this).val(formattedCnic);
// });

txt_ssb.on('input', function() {
    var text = $(this).val();
    $(this).val(text.toUpperCase());
});

// PETHING DATA FUNCTION
function petchdata(response){
    $('#txt_id').val(response.id);
    $('#txt_code').val(response.code);
    $('#txt_no').val(response.no);
    txt_firstname.val(response.firstName)
    txt_lastname.val(response.lastName)
    txt_fathername.val(response.fatherName)
    txt_address.val(response.postalAddress)
    txt_email.val(response.email)
    txt_contact.val(response.phone)
    txt_cnic.val(response.cnic)
    txt_dob.val(moment(response.dateOfBirth).format('YYYY-MM-DD'))
    txt_dobplace.val(response.placeOfBirth)
    txt_rank.val(response.rank)
    txt_nationallity.val(response.nationality)
    txt_ssb.val(response.ssb)
    txt_coc.val(response.coc)
    txt_cocheld.val(response.cocHeld)
    txt_passport.val(response.passport)

    if (!response.active) {
        $("#ck_act").prop("checked", false);
    } else { $("#ck_act").prop("checked", true); }

    if ( response.profileImage.length > 10) {
        $("#profile-image").attr("src", "data:image/jpg;base64,"+ response.profileImage);
    }else{
        $("#profile-image").attr("src", "/img/images/profile.jpg"); 
    }

    
    profileBase64 = response.profileImage
    profileImageName = response.firstName +".jpg"

    var student_course_table = $("#student_course_table tbody");
    student_course_table.empty();

    for (let index = 0; index < response.studentCoursesViewByIdModel.length; index++) {
        var action_button = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='deleteItem_Detail bi bi-trash3-fill' viewBox='0 0 16 16' style='cursor: pointer;color:#3699FF' title='delete'>" +
        "<path d='M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z' />" +
        "</svg>";

        var Course = '<tr>' +
            '<td >' + "O" + '</td>' +// <a data-itemId="0" href="#" class="deleteItem_Detail glyphicon  glyphicon-trash" style="margin-right:2px;"></a><a data-itemId="0" href="#" class="editDetail glyphicon glyphicon-pencil" title="Edit"></a><a data-itemId="0" href="#" class="cost_Detail glyphicon glyphicon-edit" title="add costCenter"></a></td>' +
            '<td>' + (index+1) + '</td>' +
            '<td hidden>' + response.studentCoursesViewByIdModel[index].courseCategoryId + '</td>' +
            '<td>' + response.studentCoursesViewByIdModel[index].courseCategoryName + '</td>' +
            '<td hidden>' + response.studentCoursesViewByIdModel[index].courseId + '</td>' +
            '<td>' + response.studentCoursesViewByIdModel[index].courseName + '</td>' +
            '<td>' + moment(response.studentCoursesViewByIdModel[index].startDate).format('DD-MMM-YYYY')  + '</td>' +
            '<td>' + moment(response.studentCoursesViewByIdModel[index].endDate).format('DD-MMM-YYYY') + '</td>' +
            '<td>' + response.studentCoursesViewByIdModel[index].fees + '</td>' +
            '<td>' + response.studentCoursesViewByIdModel[index].discount + '</td>' +
            '<td >' + response.studentCoursesViewByIdModel[index].discountAmount + '</td>' +
            '<td >' + response.studentCoursesViewByIdModel[index].netFees + '</td>' +
        '</tr>';//
        student_course_table.append(Course);
    }


    var student_attach_table = $("#student_attach_table tbody");
    student_attach_table.empty();

    for (let index = 0; index < response.studentDocumentsViewByIdModel.length; index++) {
        var action_button = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='deleteItem_Detail bi bi-trash3-fill' viewBox='0 0 16 16' style='cursor: pointer;color:#3699FF' title='delete'>" +
        "<path d='M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z' />" +
        "</svg>";

        var Attachment = '<tr>' +
            '<td >' + action_button + '</td>' +// <a data-itemId="0" href="#" class="deleteItem_Detail glyphicon  glyphicon-trash" style="margin-right:2px;"></a><a data-itemId="0" href="#" class="editDetail glyphicon glyphicon-pencil" title="Edit"></a><a data-itemId="0" href="#" class="cost_Detail glyphicon glyphicon-edit" title="add costCenter"></a></td>' +
            '<td>' + (index+1) + '</td>' +
            '<td hidden>' + response.studentDocumentsViewByIdModel[index].documentTypeId + '</td>' +
            '<td>' + response.studentDocumentsViewByIdModel[index].documentName + '</td>' +
            '<td hidden >' + response.studentDocumentsViewByIdModel[index].docPath + '</td>' +
            '<td><img id="tableimg" class="mt-3" src="data:image/jpg;base64,'+ response.studentDocumentsViewByIdModel[index].docPath +'" width="150" height="120" alt="" ></td>' +
            '<td>' + response.studentDocumentsViewByIdModel[index].remarks + '</td>' +
            '<td hidden>' + (response.studentDocumentsViewByIdModel[index].documentName+".jpg") + '</td>' +
        '</tr>';//
        student_attach_table.append(Attachment);
        
    }

    $('#data_Model').modal();
}

// VALIDATION FUNCTION
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '' ,id='';
    var txt_id = $('#txt_id');  
    var txt_code = $('#txt_code');  
    var ck_act = $('#ck_act'); 

    
    if (txt_email.val() != '') {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!txt_email.val().match(mailformat))
        {
            ck = 1;
            _Error = 'Please Enter Your Valid Email Patteren like abc@gmail.com';
            txt_email.focus();
        }
    }
    // else{
    //     ck = 1;
    //     _Error = 'Enter Your Email';
    //     txt_email.focus();
    // }

    if (txt_cnic.val() != '') {
        // var anothercnicformat = /^[0-9]{5}-?[0-9]{7}-?[0-9]$/;
        // if(!txt_cnic.val().match(anothercnicformat))
        // {
        //     ck = 1;
        //     _Error = 'Citizen Number should be follow this (XXXXX-XXXXXXX-X) format!';
        //     txt_cnic.focus();
        // }
    }else{
        ck = 1;
        _Error = 'Enter Citizen Number';
        txt_cnic.focus();
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

    if (txt_firstname.val() == '') {
        ck = 1;
        _Error = 'Enter First Name';
        txt_firstname.focus();
    }

    if (txt_id.val() == '') {
        id= '00000000-0000-0000-0000-000000000000'
    }
    else{
        id = txt_id.val()
    }

    //get Courses Details table
    var courses_detail_record = [];
    var course_rows_create = $("#student_course_table tbody >tr");
    var columns;

    for (var i = 0; i < course_rows_create.length; i++) {
        columns = $(course_rows_create[i]).find('td');
        if ($(columns[0]).html() != "O") {
            courses_detail_record.push({
                "code": txt_code.val(),
                "studentId": id,
                "courseId": $(columns[4]).html(),
                "startDate": moment($(columns[6]).html()).format('YYYY-MM-DD'),
                "endDate": moment($(columns[7]).html()).format('YYYY-MM-DD'),
                "fees": parseFloat($(columns[8]).html()),
                "discount": parseFloat($(columns[9]).html()),
                "discountAmount": parseFloat($(columns[10]).html()),
                "netFees": parseFloat($(columns[11]).html()),
                "type": "U",
                "active": true,
                "status": "ADD",
            })
        }
    }


    //get Courses Details table
    var student_exported_record = [];
    var student_rows_create = $("#student_attach_table tbody >tr");
    var columns;

    for (var i = 0; i < student_rows_create.length; i++) {
        columns = $(student_rows_create[i]).find('td');
        student_exported_record.push({
            "code": txt_code.val(),
            "studentId": id,
            "documentTypeId": $(columns[2]).html(),
            "documentName": $(columns[3]).html(),
            "docPath": $(columns[4]).html(),
            "remarks": $(columns[6]).html(),
            "documentExtentionName": $(columns[7]).html(),
            "type": "U",
        })
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
            "no": txt_no.val(),
            "firstName": txt_firstname.val().toUpperCase(),
            "lastName": txt_lastname.val().toUpperCase(),
            "fatherName": txt_fathername.val().toUpperCase(),
            "phone": txt_contact.val(),
            "postalAddress": txt_address.val(),
            "cnic": txt_cnic.val(),
            "email": txt_email.val(),
            "dateOfBirth": txt_dob.val(),
            "placeOfBirth": txt_dobplace.val(),
            "rank": txt_rank.val(),
            "nationality": txt_nationallity.val(),
            "passport": txt_passport.val(),
            "ssb": txt_ssb.val(),
            "coc": txt_coc.val(),
            "cocHeld": txt_cocheld.val(),
            "profileImage": profileBase64,
            "profileImageName": profileImageName,
            "active": ck_act[0].checked,
            "studentCoursesAddModel":courses_detail_record,
            "studentDocumentsAddModel":student_exported_record,
            "menuId":menuId,
            "type": "U"
        });
    }
    return { ckval: ck, creteria: _cre };
}


// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;
    table_loading_image.show()
    $('#data_table').DataTable().clear().destroy();
    $.ajax({
        url: GETAPIURL(end_point + "/GetStudentProfile"),
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
                if (response.permissions.insert_Permission) {
                    btn_add.show()
                }
                if (response.permissions.check_Permission) {    
                    openuploadmodal.show()
                }
                if (response.permissions.view_Permission) {
                    action_button += "<a href='#' class='btn-infor fas fa-user' data-toggle='tooltip' style='color:#03588C' title='Info'></a> ";
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
                        processing: true,
                        lengthChange: false,
                        buttons: ["pdf", "copy", "print", "csv"],
                        columns: [
                            { data: null,"defaultContent": action_button},
                            { data: 'no' },
                            { data: 'ssb' },
                            // { data: 'normalizedName' },
                            {
                                data: 'normalizedName',
                                render: function (data, type, full, meta) {
                                    return data ? data.toUpperCase() : "";
                                }
                            },
                            { data: 'cnic' },
                            { data: 'phone' },
                            {
                                data: 'dateOfBirth',
                                render: function (data, type, full, meta) {
                                    return data ? moment(data).format('DD-MMM-YYYY') : "";
                                }
                            },
                            { data: 'email' },
                            {
                                data: 'active',
                                render: function (data, type, full, meta) {
                                    return data ? '✔' : '✘';
                                }
                            },
                            // { data: null, defaultContent: '' } // Action buttons column
                        ],
                        columnDefs: [
                            {
                                targets: 0,  // Targets the first column with the action button
                                width: '10%'  // Increase the width of the first column by 10%
                            }
                        ],
                        order: [[0, "asc"]]
                    });
                    datatablesButtons.clear().draw();
                    datatablesButtons.rows.add(response.data).draw();
                    datatablesButtons.buttons().container().appendTo("#data_table_wrapper .col-md-6:eq(0)");
                    
                }else{
                    $("#data_table").DataTable()
                }
            }
            table_loading_image.hide()
            
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
            table_loading_image.hide()
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
    POST(end_point + "/AddStudentProfile",_cre,function () {
        discon();
    });
});

// UPDATE BUTTON EVENT
$('form').on('click', '#btn_upd', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    PUT(end_point + "/UpdateStudentProfile",_cre,function () {
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
    await GETBYID(end_point + "/GetStudentProfileById", _id,_name, function (response) {
        petchdata(response)
    })
   
});

// EDIT BUTTON EVENT 
$('table').on('click', '.btn-infor', async function (e) { //Edit Start
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _name = data['normalizedName'];
    
    Swal.fire({
        title: 'Are sure wants to see detail information of student <br/>' + _name + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            let timerInterval;
            Swal.fire({
                title: "fething student information !", 
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            })
            $.ajax({
                url: GETAPIURL(end_point + "/GetStudentProfileById") ,
                type: "Get",
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("_Id", _id);
                    xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
                },
                success: function (response) {
                    if (response.statusCode == '200') {
                        var _student = response.data
                        var _course = response.data.studentCoursesViewByIdModel 

                        console.log(_course)
                        var _fathernameConcat = _student.fatherName != null && _student.fatherName != undefined && _student.fatherName != "" ? _student.fatherName : "N.A";
                        var _phone = _student.phone != null && _student.phone != undefined && _student.phone != "" ? _student.phone : "N.A";
                        var _rank = _student.rank != null && _student.rank != undefined && _student.rank != "" ? _student.rank : "N.A";
                        var _einstituteLogo = _student.postaleinstituteLogo != null && _student.postaleinstituteLogo != undefined && _student.postaleinstituteLogo != "" ? _student.postaleinstituteLogo : "N.A";
                        $("#span_ssb").text(_student.ssb);
                        $("#span_name").text(_student.firstName + _student.lastName  );
                        $("#span_father").text(_fathernameConcat);
                        $("#span_cnic").text(_student.cnic);
                        $("#span_phone").text(_phone);
                        $("#span_rank").text(_rank);
                        $("#span_einstituteLogo").text(_einstituteLogo);
                        if ( _student.profileImage.length > 10) {
                            $("#info_profile-image").attr("src", "data:image/jpg;base64,"+ _student.profileImage);
                        }else{
                            $("#info_profile-image").attr("src", "/img/images/profile.jpg"); 
                        }
                        var course_data_table = $("#course_data_table tbody");
                        var course_data_table_footer = $("#course_data_table tfoot");
                        course_data_table.empty();
                        course_data_table_footer.empty()
                        
                        let currentDate = moment();  // current date (today)
                        let thirtyDaysAgo = currentDate.clone().subtract(30, 'days');  // date 30 days ago
                        var totalAmount = 0;
                        var isCourseAvailable = false
                        // Loop through each course
                        for (let index = 0; index < _course.length; index++) {
                            // Parse the course's end date
                            let courseEndDate = moment(_course[index].startDate);

                            // Check if the course's end date is within the last 30 days
                            if (courseEndDate.isBetween(thirtyDaysAgo, currentDate, null, '[]')) {
                                // If within the last 30 days, append to the table
                                isCourseAvailable = true
                                totalAmount +=  _course[index].netFees
                                var course = '<tr>' +
                                    '<td>' + _course[index].courseCategoryName + '</td>' +
                                    '<td>' + _course[index].courseName + '</td>' +
                                    '<td>' + moment(_course[index].startDate).format("DD-MMM-YYYY") + '</td>' +
                                    '<td>' + moment(_course[index].endDate).format("DD-MMM-YYYY") + '</td>' +
                                    '<td>' + _course[index].netFees + '</td>' +
                                    // '<td>' + moment(_course[index].expirtyDate).format("DD-MMM-YYYY") + '</td>' +
                                '</tr>';
                                course_data_table.append(course);
                            }
                            
                        }
                        if(_course.length > 0 && isCourseAvailable){
                            var course_footer = '<tr>' +
                            '<td><strong> TOTAL </strong></td>' +
                            '<td></td>' +
                            '<td></td>' +
                            '<td></td>' +
                            '<td><strong>' + totalAmount + '</strong></td>' +
                            '</tr>';
                            course_data_table_footer.append(course_footer);

                        }
                       
                        // for (let index = 0; index < _course.length; index++) {
                        //     var course = '<tr>' +
                        //         '<td>' + _course[index].courseCategoryName + '</td>' +
                        //         '<td>' + _course[index].courseName + '</td>' +
                        //         '<td>' +  moment(_course[index].startDate).format("DD-MMM-YYYY") + '</td>' +
                        //         '<td>' +  moment(_course[index].endDate).format("DD-MMM-YYYY") + '</td>' +
                        //         // '<td>' + moment(_course[index].expirtyDate).format("DD-MMM-YYYY") + '</td>' +
                        //     '</tr>';//
                        //     course_data_table.append(course);
                        // }

                        
                        $("#student_info_Model").modal('show');
                    }
                    else {
                        Swal.fire({
                            title: response.message ,
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
                    console.log("INFO")
                        console.log(xhr)
                    Swal.fire({
                        title: xhr.status.toString() + ' #'+ status + '\n' + xhr.responseText,
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
    DELETE(end_point + "/DeleteStudentProfile",_Id,_name,function () {
        Onload();
    })
});





function AddCourse() {
    var ck = 0, _Error = '', _cre = '';
    var sel_coursecat = $("#sel_coursecat");
    var sel_course = $("#sel_course");
    var txt_fees = $("#txt_fees").val();
    var txt_dis = $("#txt_dis").val();
    var txt_amt = $("#txt_amt").val();
    var txt_startdate = $("#txt_startdate");
    var txt_enddate = $("#txt_enddate");
    
   
    if (txt_enddate.val() == '-1') {
        ck = 1;
        _Error = 'Enter End Date';
        txt_enddate.focus();
    }

    if (txt_startdate.val() == '') {
        ck = 1;
        _Error = 'Enter Start Date';
        txt_startdate.focus();
    }
    
    if (sel_course.val() == '-1') {
        ck = 1;
        _Error = 'Select Course';
        sel_course.focus();
    }

    if (sel_coursecat.val() == '-1') {
        ck = 1;
        _Error = 'Select Course Category';
        sel_coursecat.focus();
        
    }

    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
        return 1
    }

    //detail 
    var detail_record = [];
    var _sno = 0;
    var student_course_table = $("#student_course_table tbody");
    var rows_create = $("#student_course_table tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        let columns = $(rows_create[i]).find('td');
        var coursecatId = $(columns[2]).html();
        var courseId = $(columns[4]).html();
        var startDate = $(columns[6]).html();
        var endDate = $(columns[7]).html();

        _sno = parseInt($(columns[1]).html());
        if (sel_coursecat.val() === coursecatId && sel_course.val() === courseId
            && moment(startDate).format('DD-MMM-YYYY') == moment(txt_startdate.val()).format('DD-MMM-YYYY')
            && moment(endDate).format('DD-MMM-YYYY') == moment(txt_enddate.val()).format('DD-MMM-YYYY')
            ) {
            ck = 1;
            _Error = 'Course Already Added';
            Swal.fire({
                title: _Error,
                icon: 'error'
            })
            clearCourse();
            return
        }
    }
    _sno = (_sno + 1);
    var action_button = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='deleteItem_Detail bi bi-trash3-fill' viewBox='0 0 16 16' style='cursor: pointer;color:#3699FF' title='delete'>" +
        "<path d='M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z' />" +
        "</svg>";

    var Course = '<tr>' +
        '<td >' + action_button + '</td>' +// <a data-itemId="0" href="#" class="deleteItem_Detail glyphicon  glyphicon-trash" style="margin-right:2px;"></a><a data-itemId="0" href="#" class="editDetail glyphicon glyphicon-pencil" title="Edit"></a><a data-itemId="0" href="#" class="cost_Detail glyphicon glyphicon-edit" title="add costCenter"></a></td>' +
        '<td>' + _sno + '</td>' +
        '<td hidden>' + sel_coursecat.val() + '</td>' +
        '<td>' + $("#sel_coursecat option:selected").text() + '</td>' +
        '<td hidden>' + sel_course.val() + '</td>' +
        '<td>' + $("#sel_course option:selected").text() + '</td>' +
        '<td>' + moment(txt_startdate.val()).format('DD-MMM-YYYY')  + '</td>' +
        '<td>' + moment(txt_enddate.val()).format('DD-MMM-YYYY') + '</td>' +
        '<td>' + txt_fees + '</td>' +
        '<td>' + txt_dis + '</td>' +
        '<td >' + (txt_fees - txt_amt) + '</td>' +
        '<td >' + txt_amt + '</td>' +

        '</tr>';//
    student_course_table.append(Course);
    clearCourse()
}

function AddAttechment() {
    var ck = 0, _Error = '', _cre = '';
    var sel_doctype = $("#sel_doctype");
    var txt_rem = $("#txt_rem").val();

    if (sel_doctype.val() == '-1') {
        ck = 1;
        _Error = 'Select Document Type';
        sel_doctype.focus();
    }

    if (base64 == '' || base64 == undefined ) {
        ck = 1;
        _Error = 'Choose your Document';
    }
 
    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
        clearDocument()
        return 1
    }

    //detail 
    var detail_record = [];
    var _sno = 0;
    var student_attach_table = $("#student_attach_table tbody");
    var rows_create = $("#student_attach_table tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        let columns = $(rows_create[i]).find('td');
        var doctypeId = $(columns[2]).html();
        _sno = parseInt($(columns[1]).html());
        if (sel_doctype === doctypeId) {
            ck = 1;
            _Error = 'Document Already Added';
            Swal.fire({
                title: _Error,
                icon: 'error'
            })
            clearCourse();
            return
        }
    }
    _sno = (_sno + 1);
    var action_button = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='deleteItem_Detail bi bi-trash3-fill' viewBox='0 0 16 16' style='cursor: pointer;color:#3699FF' title='delete'>" +
        "<path d='M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z' />" +
        "</svg>";

    var Attachment = '<tr>' +
        '<td >' + action_button + '</td>' +// <a data-itemId="0" href="#" class="deleteItem_Detail glyphicon  glyphicon-trash" style="margin-right:2px;"></a><a data-itemId="0" href="#" class="editDetail glyphicon glyphicon-pencil" title="Edit"></a><a data-itemId="0" href="#" class="cost_Detail glyphicon glyphicon-edit" title="add costCenter"></a></td>' +
        '<td>' + _sno + '</td>' +
        '<td hidden>' + sel_doctype.val() + '</td>' +
        '<td>' + $("#sel_doctype option:selected").text() + '</td>' +
        '<td hidden >' + base64 + '</td>' +
        '<td><img id="tableimg" class="mt-3" src="data:image/jpg;base64,'+ base64 +'" width="150" height="120" alt="" ></td>' +
        '<td>' + txt_rem + '</td>' +
        '<td>' + ImageName + '</td>' +

        '</tr>';//
    student_attach_table.append(Attachment);
    clearDocument()
}



function clearCourse(){
    $("#sel_coursecat").val('-1').trigger('change');
    $("#sel_course").val('-1').trigger('change');
     $("#txt_fees").val(0);
     $("#txt_dis").val(0);
     $("#txt_amt").val(0);
}

function clearDocument(){
    $("#sel_doctype").val('-1').trigger('change');
     $("#txt_file").val("");
     $("#txt_rem").val("");
}

$(document).on('click', '.deleteItem_Detail', function (e) {
    Swal.fire({
        title: "Are you sure you want to delete?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'success',
        cancelButtonColor: 'secondary',
        confirmButtonText: 'Delete',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    }).then((result) => {
        if (result.value) {

            e.preventDefault();
            $(this).parents('tr').css("background-color", "#ff6347").fadeOut(800, function () {
                $(this).remove();
                $(this).closest('tr');
            });
            //  }
        }
    })

});
$(document).on('click', '.deleteItem_Detail_Item', function (e) {
    Swal.fire({
        title: "Are you sure you want to delete?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'success',
        cancelButtonColor: 'secondary',
        confirmButtonText: 'Delete',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    }).then((result) => {
        if (result.value) {

            e.preventDefault();
            $(this).parents('tr').css("background-color", "#ff6347").fadeOut(800, function () {
                $(this).remove();
                $(this).closest('tr');
            });
            
        }
    })
});

var inputImage = document.getElementById("txt_file")
inputImage.addEventListener('change', function(e){     
    if (inputImage.files && inputImage.files[0]) {
        for (let i = 0; i < inputImage.files.length; i++) {
            if (inputImage.files[i].size > 10240000) {
                Swal.fire({
                    title: inputImage.files[i].name + "<br/> File is too big!<br/> Max allowed file size is 10 MB ",
                    icon: 'error',
                    showConfirmButton: false,
                    // timer: 1500,
                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }

                })
                // return;
            }
            else {
                var reader = new FileReader();
                reader.onload = async function (e) {
                    var match = /^data:(.*);base64,(.*)$/.exec(e.target.result);          
                    if (match == null) {
                        throw 'Could not parse result'; // should not happen
                    }
                    var mimeType = match[1];
                    var content = match[2];
                    base64 = content
                    ImageName = inputImage.files[i].name
                };
                reader.readAsDataURL(inputImage.files[i]);
            }
        }
    }
});

// CHange Images
var isUploading = false
$("#profile-image").click(function () {
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
        $("#profile-image").attr("src", e.target.result);

    };
    reader.readAsDataURL(selectedImage);

});

$("#set_default_image").click(function () {
    $("#profile-image").attr("src", "/img/images/profile.jpg"); // Replace with the path to your default image
});

$('#access-file-input').on('change', function (e) {
    var fileInput = e.target;
    var file = fileInput.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var data = new Uint8Array(event.target.result);
            var workbook = XLSX.read(data, { type: 'array' });
            var sheetName = workbook.SheetNames[0]; 
            var sheet = workbook.Sheets[sheetName];
            var jsonData = XLSX.utils.sheet_to_json(sheet);

            var columnMapping = {
                'Cert No': 'No',
                'Cert Name': 'Name',
                'Rank': 'Rank',
                'CoC Class': 'COC',
                'CoC No': 'COC#',
                'SSB No': 'CDC/SSB',
                'From': 'From',
                'To': 'To',
                'CNIC No': 'CNIC',
                'DOB': 'DOB',
                'Father Name': 'Father Name',
                'D Issue': 'Issue Date',
                'Passport No': 'Passport'
            };


            var col = [
                'Cert No',
                'Cert Name',
                'Rank',
                'CoC Class',
                'CoC No',
                'SSB No',
                'From',
                'To',
                'CNIC No',
                'DOB',
                'Father Name',
                'D Issue',
                'Passport No'
            ];
            var filteredData = jsonData.map(function (row) {
                var newRow = {};
                col.forEach(function (column) {
                    var alias = columnMapping[column] || column;
                    newRow[alias] = row[column]
                
                });
                return newRow;
            });

        
           var tableHtml = '';
           tableHtml += '<thead><tr><th>SN#</th>';
           col.forEach(function (column) {
               var alias = columnMapping[column] || column; 
               tableHtml += '<th>' + alias + '</th>';
           });
           tableHtml += '</tr></thead><tbody>';
           var count = 0
           filteredData.forEach(function (row) {
                count+=1
                // if (row['No'].split('/')[1] >= 2019) {
                    tableHtml += '<tr><td>'+ (count) +'</td>';
                    col.forEach(function (column) {
                        var alias = columnMapping[column] || column; 
                        var Value = row[alias] != undefined ? row[alias] : ""
                        tableHtml += '<td>' + Value + '</td>';
                    });
                    tableHtml += '</tr>';
                // }
            });
           
           tableHtml += '</tbody>';
            $('#student_data_table').html(tableHtml);
            // $('#student_data_table').DataTable();
           
           
        };
        reader.readAsArrayBuffer(file);
    }
});

function formatDate(numericDate) {
    var date = new Date((numericDate - 25569) * 86400 * 1000);
    return date.toLocaleDateString(); 
}

function isValidDate(dateString) {
    var date = new Date(dateString);
    return !isNaN(date.getTime()) && date.toString() !== 'Invalid Date';
}

var dateFormats = [
    'Do MMMM, YYYY',        // 27th March, 2017
    'Do MMMM,YYYY',        // 27th March, 2017
    'Do MMM-YYYY',        // 27th Mar-2017
    'YYYY-MM-DD',           // 2017-03-27
    'DD/MM/YYYY',           // 27/03/2017
    'MM/DD/YYYY',           // 03/27/2017
    'DD MMMM, YYYY',        // 27 March, 2017
    'DD-MMM-YYYY',          // 27-Mar-2017
    'DD-MMMM-YYYY',          // 27-March-2017
    'Do MMM, YYYY',         // 27th Mar, 2017
    'MMMM DD, YYYY',        // March 27, 2017
    'MMM DD, YYYY',         // Mar 27, 2017
    'YYYY/MM/DD',           // 2017/03/27
    'DD-MM-YYYY',           // 27-03-2017
    'MMM DD YYYY',          // Mar 27 2017
    'Do [of] MMMM YYYY',    // 27th of March 2017
    'YYYY MM DD',           // 2017 03 27
    'MMM DD, YY',           // Mar 27, 17
    'MMM D, YYYY',          // Mar 27, 2017 (without leading zero)
    'MMMM D, YYYY',         // March 27, 2017 (without leading zero)
    'Do MMMM YYYY',         // 27th March 2017 (without comma)
    'YYYY.MM.DD',           // 2017.03.27
    'DD.MM.YYYY',           // 27.03.2017
    'MMMM D YYYY',          // March 27 2017 (without leading zero)
    'DD-MMM-YYYY',          // 27-Mar-2017
    'MMM DD, YYYY',         // Mar 27, 2017 (repeated, can be removed)
    'Do MMMM YYYY',         // 27th March 2017 (without comma)
    'MMMM D, YYYY',         // March 27 2017 (without leading zero)
    'D MMM, YYYY',          // 27 Mar, 2017 (without leading zero)
    'D MMMM, YYYY',         // 27 March, 2017 (without leading zero)
    'MMM DD YYYY',          // Mar 27 2017 (repeated, can be removed)
    'DD-MMM-YYYY',          // 27-Mar-2017 (repeated, can be removed)
    'DD MMM YYYY',          // 27 Mar 2017
    'DD MMM, YYYY',         // 27 Mar, 2017
    'D MMM YYYY',           // 27 Mar 2017 (without leading zero)
    'D MMM, YYYY',          // 27 Mar, 2017 (without leading zero)
    // Add more formats as needed
];


function parseDate(dateString) {
    for (var i = 0; i < dateFormats.length; i++) {
        var parsedDate = moment(dateString, dateFormats[i], true);
        if (parsedDate.isValid()) {
            return parsedDate.format('YYYY-MM-DD')
        }
    }
    return "NILL"; // Return null if none of the formats match
}

// SAVE CSV FILE
function SaveCSVFile()
{
    var ck = 0, _Error = '', _cre = '' ,id='';
    var _course = $("#sel_exp_course").val()
    var _coursecat = $("#sel_exp_coursecat").val();
    
    if (_coursecat == '-1') {
        ck = 1;
        _Error = 'Select Course Category';
        _coursecat.focus();
        
    }
    
    if (_course == '-1') {
        ck = 1;
        _Error = 'Select Course';
        _course.focus();
    }

    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
        return { ckval: ck, creteria: _cre };
    }
    
    //get Courses Details table
    var student_exported_record = [];
    var id= '00000000-0000-0000-0000-000000000000'
       
    var student_rows_create = $("#student_data_table tbody > tr");
    var columns;

    _Error = "";
    ck = 0;
    for (var i = 0; i < student_rows_create.length; i++) {
        columns = $(student_rows_create[i]).find('td');
        var _code = fromShortName+"-"+ GenerateCode();
        var student_course_exported_record = [];
        var startDate = ""
        var endDate = ""
        var DOB = ""
        var issueDate = ""

        // var _startDate = new Date($(columns[7]).html())
        // var _endDate = new Date($(columns[8]).html())
        // var _DOBDate = new Date($(columns[10]).html())
        // var _issueDate = new Date($(columns[12]).html())

        var _startDate = $(columns[7]).html();
        var _endDate = $(columns[8]).html();
        var _DOBDate = $(columns[10]).html();
        var _issueDate = $(columns[12]).html();

        startDate = parseDate(_startDate);
        endDate = parseDate(_endDate);
        DOB = parseDate(_DOBDate);
        issueDate = parseDate(_issueDate);

       
        // var parsedstartDate = moment(_startDate, 'DD-MM-YYYY', true);
        // var parsedendDate = moment(_endDate, 'DD-MM-YYYY', true);
        // var parsedDOBDate = moment(_DOBDate, 'DD-MM-YYYY', true);
        // var parsedissueDate = moment(_issueDate, 'DD-MM-YYYY', true);
        // if (parsedstartDate.isValid()) {
        //     startDate = parsedstartDate.format('YYYY-MM-DD');
        // } 
        if ($(columns[1]).html() === "") {
            ck = 1;
            _Error+= "\n NAME IS NOT DEFINED ON : " + $(columns[1]).html();
        }

        if (startDate == "NILL") {
            ck = 1;
            _Error+= "\n START DATE ISSUE ON : " + $(columns[1]).html();
        }

        if (endDate == "NILL") {
            ck = 1;
            _Error+= "\n END DATE ISSUE ON : " + $(columns[1]).html();
        }
        
        if (DOB == "NILL" && $(columns[10]).html() != "") {
            ck = 1;
            _Error+= "\n DOB DATE ISSUE ON : " + $(columns[1]).html();
        }
        
        if (issueDate == "NILL") {
            ck = 1;
            _Error+= "\n ISSUE DATE ISSUE ON : " + $(columns[1]).html();
        }

        


       
        student_course_exported_record.push({
            "code": _code,
            "studentId": id,
            "courseId": _course,
            "startDate": startDate,
            "endDate": endDate,
            "fees": 0,
            "discount": 0,
            "discountAmount": 0,
            "netFees": 0,
            "status": "ADD",
            "type": "U",
            "active": true,
        })


        student_exported_record.push({
            "id": id,
            "code": _code,
            "no": $(columns[1]).html(),
            "firstName": $(columns[2]).html(),
            "fatherName": $(columns[11]).html(),
            "cnic": $(columns[9]).html().replace(/\s/g, ''),
            "dateOfBirth": DOB,
            "rank": $(columns[3]).html(),
            "ssb": $(columns[6]).html(),
            "coc": ($(columns[5]).html()) != 'NIL' ? ($(columns[4]).html()) : "",
            "cocHeld": ($(columns[4]).html()) != 'NIL' ? ($(columns[4]).html()) : "",
            "active": true,
            "studentCoursesAddModel":student_course_exported_record,
            "studentDocumentsAddModel":[],
            "menuId":menuId,
            "lastName": "",
            "email": "",
            "phone": "",
            "placeOfBirth": "",
            "postaleinstituteLogo": "",
            "nationality": "",
            "passport": $(columns[13]).html(),
            "profileImage": "",
            "profileImageName": "",
            "type": "U",
            "issueDate" : issueDate,
        })        
    }
    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
        return { ckval: ck, creteria: _cre };
    }
    _cre = JSON.stringify({
        "studentProfileAddModel":student_exported_record
    });

    return { ckval: ck, creteria: _cre };
    
}