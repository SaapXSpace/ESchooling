import  {GETAPIURL,GETBYID,POST,PUT,DELETE,CLEAR,FILLCOMBO,FILLCOMBOBYID }  from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js";

// INITIALIZING VARIBALES
var end_point;
var btn_save = $('#btn_sav')
var btn_update = $('#btn_upd')
var btn_add = $('#openmodal')
var fromShortName = "CERT"

var table_loading_image = $('#table_loading_image')
var txt_startfromcertificate = $("#txt_startfromcertificate")
var txt_endfromcertificate = $("#txt_endfromcertificate")


// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var menuId = '';
if (url.has('M')) {
    menuId = window.atob(url.get('M'));
}

// jQuery CONSTRUCTOR
$(document).ready(function () {  
    end_point = '/api/v1/Certificate';
    ComponentsDropdowns.init();
    var currentDate = new Date().toISOString();
    txt_startfromcertificate.val(moment(currentDate).format("YYYY-MM-DD"));
    txt_endfromcertificate.val(moment(currentDate).format("YYYY-MM-DD"));
    discon();
  });

// DISCONNECTION FUNCTION
function discon(){
    table_loading_image.hide();
    Onload(txt_startfromcertificate.val(),txt_endfromcertificate.val()); 
    CLEAR(); 
    btn_update.hide();
    btn_save.show()
    $('#sel_student').val("-1").trigger('change');
    $('#course_data_table').DataTable().clear().destroy();
}

// --- Fill Select 2 of Module ---
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        LoadStudents();
        LoadExpCourseCategory()
    }
    return {
        init: function () {
            handleSelect2();
        }
    };
}();

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

$('form').on('change', '#sel_exp_coursecat', function (e) {
    LoadExpCourse()
});

// // LOAD STUDENT LOV
// function LoadStudents() {
//     var $element = $('#sel_student').select2(); 
//     FILLCOMBO('/api/v1/AccountsLovService/GetStudentLov',$element,"Student")
// }

// // LOAD STUDENT LOV
function LoadStudents() {
    $("#sel_student").select2({
        placeholder: "Search Student",
        minimumInputLength: 2,
        allowClear: true,
        ajax: {
            url: GETAPIURL('/api/v1/AccountsLovService/GetStudentLov'),
            type: "GET",
            dataType: 'json',
            delay: 250,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", 'Bearer ' + app_token);
            },
            data: function (params) {
                return {
                    _srch: params.term 
                };
            },
            processResults: function (data, params) {
                var myResults = [];
                if (data.statusCode === "200" && data.data) {
                    $.each(data.data, function (index, item) {
                        myResults.push({
                            id: item.id,
                            text: item.name
                        });
                    });
                } else {
                    myResults.push({
                        id: data.statusCode,
                        text: data.message
                    });
                }
                return {
                    results: myResults
                };
            },
            cache: true
        },
        escapeMarkup: function (m) {
            return m;
        }
    });
}

// PETHING DATA FUNCTION
function petchdata(response){
    $('#txt_id').val(response.id);
    $('#txt_code').val(response.code);
    $('#sel_student').val(response.studentId).trigger('change');
    $('#txt_totalAmount').val(response.total);
    $('#txt_narr').val(response.narration);
    $('#txt_inword').val(response.words);
    
    if (response.status != "NA" && response.request != true) {
        $("#ck_req").prop("checked", false);
    } else { $("#ck_req").prop("checked", true); }
    
    if (response.studentCourseBaseModels != null) {
        $('#course_data_table').DataTable().clear().destroy();
        var datatablesButtons = $("#course_data_table").DataTable({
            data: response.studentCourseBaseModels,
            destroy: true,
            retrieve: true,
            searching: false, 
            paging: false, 
            columns: [
                { data: 'courseName' },
                { data: 'startDate','render': function (data, type, full, meta) {return moment(new Date(data)).format('DD-MMM-YYYY')}},
                { data: 'endDate','render': function (data, type, full, meta) {return moment(new Date(data)).format('DD-MMM-YYYY')}},
                { data: 'fees' },
                { data: 'discount' },
                { data: 'netFees' },
                { data: 'status' },
            ],
            "order": [[0, "asc"]],
            // "pageLength": 10,
        });
    }else{
        $("#course_data_table").DataTable()
    }
    
    $('#data_Model').modal();
}

// VALIDATION FUNCTION
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '' ,id='';
    var txt_id = $('#txt_id');  
    var txt_code = $('#txt_code');  
    var sel_student = $('#sel_student');   
    var student_course_record = [];
    var allData =  $('#course_data_table').DataTable().rows().data().toArray();

    if (allData == null || allData.length == 0) {
        ck = 1;
        _Error = 'No Course Available for Generating Voucher';
        
    }else{
        allData.forEach((item, index) => {
            var checkbox = $('#course_data_table').DataTable().cell(index, 0).node().querySelector('input[type="checkbox"]');
            if (checkbox.checked) {
                student_course_record.push(item.id);
            }
        });
    }

    if (student_course_record.length <= 0) {
        ck = 1;
        _Error = 'Select Course , its required';
        sel_student.focus();
    }

    if (sel_student.val() == 0) {
        ck = 1;
        _Error = 'Select Student, its required';
        sel_student.focus();
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
            "studentId": sel_student.val(),
            "type": "U",
            "active": true,
            "courcesIds": student_course_record,
        });
    }
    return { ckval: ck, creteria: _cre };
}

$('#search_certificates').click(function(){
    $('#data_table').DataTable().clear().destroy();
    if (txt_startfromcertificate.val() != "" && txt_endfromcertificate.val() != "") {
        Onload(txt_startfromcertificate.val(),txt_endfromcertificate.val());
    }else{
        Swal.fire({
            title: "Select Date Range",
            icon: 'warning',
        })
    }
     
});

// ONLOAD FUNCTION
function Onload(startDate,endDate) {
    var tbl_row_cnt = 1;
    table_loading_image.show()
    $.ajax({
        url: GETAPIURL("/api/v1/AuthorityLovService/GetStudentCourseDetailsByDateRange"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('_menuId', menuId);
            xhr.setRequestHeader('FromDate', startDate);
            xhr.setRequestHeader('ToDate', endDate);
        },
        success: function (response) {
            console.log(response)
            var action_button = ' ';
            if (response != null) {
                if (!response.permissions.insert_Permission) {
                    btn_add.hide()
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
                            // { data: null,"defaultContent": action_button},
                            // { "render": function (data, type, full, meta) { return tbl_row_cnt++; }},
                            { data: 'code' },
                            { data: 'no' },
                            { data: 'name' },
                            { data: 'cnic' },
                            { data: 'course' },
                            { data: 'courseStatus' },
                            {
                                data: 'registerdOn', width: '100px',
                                render: function(data, type, full, meta) {
                                    return moment(data).format("YYYY-MM-DD") 
                                }
                            },
                            { data: 'registerdBy' },
                            { data: 'voucherStatus' },
                            { 
                                data: 'payStatus',
                                render: function (data, type, full, meta) {
                                    if (data === "Due") {
                                        return '<span style="font-weight: bold; color: red;">' + data + '</span>';
                                    }
                                    return data;  // Return default value for other statuses
                                }
                            },
                            { data: 'certificateStatus' },
                            { data: 'company' },
                            {
                                data: 'id',  // Assuming 'id' is the unique identifier for each row
                                render: function (data, type, full, meta) {
                                    if (full.payStatus === "Due") {
                                        return '<span style="font-weight: bold; color: red;">' + full.payStatus + '</span>'
                                    }else if (full.certificateStatus === "Not Generated") {
                                         return '<span style="font-weight: bold; color: red;"> - </span>'
                                    }else if (full.printStatus) {
                                        return '<input type="checkbox" data-item="'+ full.printStatus +'" checked id='+ data + ' />';
                                    }else{
                                        return '<input type="checkbox" data-item="'+ full.printStatus +'" id='+ data + ' />';
                                    }
                                    
                                }
                            }
                        ],
                        "order": [[2, "desc"]],
                        // "pageLength": 10,
                    });
                    datatablesButtons.buttons().container().appendTo("#data_table_wrapper .col-md-6:eq(0)")
                }else{
                    $('#data_table').DataTable().clear().destroy();
                    $("#data_table").DataTable()
                }
                table_loading_image.hide()
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
            table_loading_image.hide()
        }
    })
    return true;
}

// OPEN MODAL BUTTON EVENT
$('form').on('change', '#sel_student', function (e) {
    if (e.target.value == null || e.target.value == '' || e.target.value == -1 || e.target.value == 0) {
        return
    }
    $.ajax({
        url: GETAPIURL("/api/v1/PayrollLovService/GetUnAssignCertificateCourcesByStudentLov"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('Id', e.target.value);
        },
        success: function (response) {
            if (response != null) {
                if (response.data != null) {
                    $('#course_data_table').DataTable().clear().destroy();
                    var datatablesButtons = $("#course_data_table").DataTable({
                        data: response.data,
                        destroy: true,
                        retrieve: true,
                        searching: false, 
                        paging: false, 
                        columns: [
                            {
                                data: null,
                                render: function (data, type, row) {
                                    return '<input type="checkbox" class="checkboxClass" value="' + false + '"/>';
                                }
                            },
                            { data: 'courseName' },
                            { data: 'startDate','render': function (data, type, full, meta) {return moment(new Date(data)).format('DD-MMM-YYYY')}},
                            { data: 'endDate','render': function (data, type, full, meta) {return moment(new Date(data)).format('DD-MMM-YYYY')}},
                            { data: 'status' },
                            { data: 'payStatus' },
                            { data: 'voucheringCompany' },
                        ],
                        "order": [[0, "asc"]],
                        // "pageLength": 10,
                    });
                }else{
                    $('#course_data_table').DataTable().clear().destroy();
                    $("#course_data_table").DataTable()
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
});

// OPEN MODAL BUTTON EVENT
$('div').on('click', '#openmodal', function (e) {
    discon();
    setCode()
});

// OPEN MODAL BUTTON EVENT
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
    POST(end_point + "/AddCertificate",_cre,function () {
        discon();
    });
});

// UPDATE BUTTON EVENT
$('form').on('click', '#btn_upd', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    PUT(end_point + "/UpdateCertificate",_cre,function () {
        discon();
    });
});

// EDIT BUTTON EVENT 
$('table').on('click', '.btn-edit', async function (e) { //Edit Start
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _name = data['code'];
    var type = data['type'];
    var status = data['status'];
    
    if (status === "A") {
        Swal.fire({
            title: "This is Voucher has been Approved",
            icon: 'warning',
        })
        return
    }
    if (type === "S") {
        Swal.fire({
            title: "This is System Generated Record",
            icon: 'warning',
        })
        return
    }
    btn_update.show();btn_save.hide()
    await GETBYID(end_point + "/GetCertificateById", _id,_name, function (response) {
        petchdata(response)
    })
   
});

// DELETE BUTTON EVENT 
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _Id = data['id'];
    var _name = data['code'];
    var type = data['type'];
    var status = data['status'];
    
    if (status === "A") {
        Swal.fire({
            title: "This is Voucher has been Approved",
            icon: 'warning',
        })
        return
    }
    if (type === "S") {
        Swal.fire({
            title: "This is System Generated Record",
            icon: 'warning',
        })
        return
    }
    DELETE(end_point + "/DeleteCertificate",_Id,_name,function () {
        discon();
    })
});


$('#txt_account').keypress(function (e) {
    var charCode = (e.which) ? e.which : event.keyCode
    if (String.fromCharCode(charCode).match(/[^0-9]/g))
        return false;
    else if ((e.target.value).length >= 13) {
        if ((e.target.value).length >= 13) {
            return false
        }
    }
});

$('#txt_contact').keypress(function (e) {
    var charCode = (e.which) ? e.which : event.keyCode
    if (String.fromCharCode(charCode).match(/[^0-9+]/g) )
        return false;
    else if ((e.target.value).includes("+")) {
        if ((e.target.value).length >= 13) {
            return false
        }
    }else{
        if ((e.target.value).length >= 11) {
            return false
        }
    }
});


$('form').on('blur', '#txt_totalAmount', function (e) {
    var number = e.target.value;
    console.log(number)
    if (number != null && (number != "" || number != 0)) {
        $('#txt_inword').val(numberToWords(number))
    }
    
});

// $('form').on('change', '#txt_pay', function (e) {
//     var number = e.target.value;
//     if (number != null && (number != "" || number != 0)) {
//         $('#txt_inword').val(numberToWords(number))
//         var total = $('#txt_totalAmount').val()
//         var balance = Number(total) - Number(number)
//         $('#txt_balance').val(balance)
//     }
    
// });

// $('div').on('click', '#csv', function (e) {
//     console.log("click");
//     ExporData("csv")
// });


function numberToWords(number) {
  if (number === 0) {
    return "zero";
  }

  const units = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion"];

  const groupToWords = (num) => {
    // const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    // const teens = ["", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    // const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"].map(function(word) {
        return word.toUpperCase();
    });
    
    const teens = ["", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"].map(function(word) {
        return word.toUpperCase();
    });
    
    const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"].map(function(word) {
        return word.toUpperCase();
    });

    if (num < 10) {
      return ones[num];
    }

    if (num >= 11 && num <= 19) {
      return teens[num - 10];
    }

    if (num < 100) {
      const ten = Math.floor(num / 10);
      const one = num % 10;
      return tens[ten] + (one !== 0 ? " " + ones[one] : "");
    }

    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      return ones[hundred] + " hundred" + (remainder !== 0 ? " and " + groupToWords(remainder) : "");
    }

    return "Number too large to convert";
  };

  let result = "";
  let group = 0;
  while (number > 0) {
    const numInGroup = number % 1000;
    if (numInGroup !== 0) {
      const groupWords = groupToWords(numInGroup);
      if (groupWords) {
        result = groupWords + " " + units[group] + (result ? " " + result : "");
      }
    }
    number = Math.floor(number / 1000);
    group++;
  }
  return result.toUpperCase() + " ONLY";
}
  
var checkedIds = [];
var checkedCheckIds = [];
// EDIT BUTTON EVENT 
$('div').on('click', '#appr_certificates', async function (e) { //Edit Start
    e.preventDefault();
    var table = $('#data_table').DataTable();
    checkedIds = []
    checkedCheckIds = [];
    table.rows().every(function () {
        var row = this.node(); // Get the row node
        var checkbox = $(row).find('input[type="checkbox"]'); // Find the checkbox in the row
        if (checkbox.attr('id') != undefined) {
            var dataItem = checkbox.attr('data-item') === 'true';
            if (checkbox[0].checked !== dataItem) {
                if (!checkedIds.includes(checkbox.attr('id'))) {
                    var obj = {
                        id: checkbox.attr('id'),
                        printStatus: checkbox[0].checked
                    }
                    checkedIds.push(obj)
                    checkedCheckIds.push(checkbox.attr('id'))
                }
            }
        }
    });

    if (checkedCheckIds.length > 0) {
        var _cre = JSON.stringify({
           "studentApprovalViewModel":checkedIds
        })
        console.log(_cre)
        PUT("/api/v1/AuthorityLovService/ApprovalOfStudentCertificatePrint",_cre,function () {
            discon();
        });
    }else{
        Swal.fire({
            title: "No action found on approval",
            icon: 'warning',
        })
    }
});

// $('#select_all_student').on('change', function () {
//     var isChecked = $(this).prop('checked');
//     $('#data_table input[type="checkbox"]').prop('checked', isChecked);
// });


$('#select_all_student').on('change', function () {
    var isChecked = $(this).prop('checked');
    var table = $('#data_table').DataTable();
    table.rows().every(function () {
        var row = this.node(); // Get the row node
        var checkbox = $(row).find('input[type="checkbox"]');
        checkbox.prop('checked', isChecked);
    });
});
