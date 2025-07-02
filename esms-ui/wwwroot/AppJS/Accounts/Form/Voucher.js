import  {GETAPIURL,GETBYID,POST,PUT,DELETE,CLEAR,FILLCOMBO}  from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js";

// INITIALIZING VARIBALES
var end_point;
var btn_save = $('#btn_sav')
var btn_update = $('#btn_upd')
var btn_add = $('#openmodal')
var fromShortName = "VCH"


var table_loading_image = $('#table_loading_image')

// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var menuId = '';
if (url.has('M')) {
    menuId = window.atob(url.get('M'));
}

// jQuery CONSTRUCTOR
$(document).ready(function () {  
    end_point = '/api/v1/FeeVoucher';
    ComponentsDropdowns.init();
    discon();
  });

// DISCONNECTION FUNCTION
function discon(){
    table_loading_image.hide();
    Onload(); 
    CLEAR(); 
    btn_update.hide();
    btn_save.show()
    $('#sel_student').val("-1").trigger('change');
}

// --- Fill Select 2 of Module ---
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        LoadStudents();
    }
    return {
        init: function () {
            handleSelect2();
        }
    };
}();

// // LOAD STUDENT LOV
// function LoadStudents() {
//     var $element = $('#sel_student').select2(); 
//     FILLCOMBO('/api/v1/AccountsLovService/GetStudentLov',$element,"Student")
// }

// // LOAD STUDENT LOV
function LoadStudents() {
    $("#sel_student").empty()
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



// $("#sel_student").on('select2:select', function (e) {
//     console.log("sel")
//     var data = e.params.data;
//     $selectStudent.val(data.id).trigger('change'); // Set selected option in select2
// });

// PETHING DATA FUNCTION
function petchdata(response){
    console.log(response)
    $('#txt_id').val(response.id);
    $('#txt_code').val(response.code);
    
    $('#txt_totalAmount').val(response.total);
    $('#txt_narr').val(response.narration);
    $('#txt_inword').val(response.words);

    var $searchInput = $('#sel_student').data('select2').$dropdown.find('.select2-search__field');
    $searchInput.val(response.studentName).trigger('input');

   

    setTimeout(() => {
        console.log($('#sel_student').find('option'))
        $('#sel_student').val(response.studentId).trigger('change');
    }, 5000);

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
    var txt_totalAmount = $('#txt_totalAmount');   
    var txt_narr = $('#txt_narr');   
    var txt_inword = $('#txt_inword');   
    var ck_req = $('#ck_req'); 
    var ck_due = $('#ck_due'); 
    var sel_comp = $('#sel_comp'); 
    var student_course_record = [];
    var allData =  $('#course_data_table').DataTable().rows().data().toArray();
  
    if (allData == null || allData.length == 0) {
        ck = 1;
        _Error = 'No Course Available for Generating Voucher';
        
    }else{
        for (const item of allData) {
            student_course_record.push(item.id)
        }
    }

    if (txt_totalAmount.val() == '' || txt_totalAmount.val() == 0) {
        ck = 1;
        _Error = 'Total Amount is 0';
        txt_totalAmount.focus();
    }

    // if (txt_narr.val() == '') {
    //     ck = 1;
    //     _Error = 'Enter Some Narration Regards Vouchers';
    //     txt_narr.focus();
    // }

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
            "total": txt_totalAmount.val(),
            "discount": 0,
            "discountAmount": 0,
            "words": txt_inword.val(),
            "narration": txt_narr.val(),
            "status": ck_req[0].checked ? "RP" : "",
            "type": "U",
            "active": true,
            "request": ck_req[0].checked,
            "due": ck_due[0].checked,
            "company":  sel_comp.val(),
            "courcesIds": student_course_record,
        });
    }
    return { ckval: ck, creteria: _cre };
}

// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;
    
    table_loading_image.show()
    $.ajax({
        url: GETAPIURL(end_point + "/GetFeeVoucher"),
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
                    //action_button += "<a href='#' class='btn-edit fas fa-edit' data-toggle='tooltip' style='color:#03588C' title='Update'></a> ";
                }
                if (response.permissions.delete_Permission) {
                    action_button += " <a href='#' class='btn-delete fas  fa-trash' data-toggle='tooltip' style='color:#03588C' title='Delete()'></a> ";
                }
                if (response.data != null) {
                    // const totalRecords = response.data.length;
                    // const approvedRecords = response.data.filter(record => record.status == "A");
                    // const unapprovedRecords = Number(totalRecords) - Number(approvedRecords.length);
                    // document.getElementById("txt_totalrecord").innerHTML = totalRecords
                    // document.getElementById("txt_approved").innerHTML = approvedRecords.length
                    // document.getElementById("txt_notapproved").innerHTML = unapprovedRecords

                    $('#data_table').DataTable().clear().destroy();
                    var datatablesButtons = $("#data_table").DataTable({
                        data: response.data,
                        destroy: true,
                        retrieve: true,
                        processing: true,
                        lengthChange:!1,
                        buttons: ["pdf","copy", "print","csv"],
                        columns: [
                            {
                                data: 'status',
                                "render": function (data, type, full, meta) {
                                    if (data === "A") {
                                        //return '<a href="#" class="btn-delete fas fa-trash" data-toggle="tooltip" style="color:#03588C" title="Delete()"></a>';
                                        return "";
                                    } else {
                                        //var action_button_edit = '<a href="#" class="btn-edit fas fa-edit" data-toggle="tooltip" style="color:#03588C" title="Update"></a>';
                                        //var action_button_delete = '<a href="#" class="btn-delete fas fa-trash" data-toggle="tooltip" style="color:#03588C" title="Delete()"></a>';
                                        //return action_button_edit + ' ' + action_button_delete;
                                        return action_button;
                                    }
                                }
                            },
                            { data: 'code' },
                            // { data: null,"defaultContent": action_button},
                            // { "render": function (data, type, full, meta) { return tbl_row_cnt++; }},
                            {
                                data: 'date', width: '100px',
                                render: function(data, type, full, meta) {
                                    return moment(data).format("YYYY-MM-DD hh:mm A") 
                                }
                            },
                            { data: 'studentName' , width: '100px' },
                            { data: 'studentCNIC' , width: '100px' },
                            { data: 'courses' },
                            { data: 'total' },
                            {
                                data: 'discount',
                                render: function(data, type, full, meta) {
                                    return data
                                }
                            },
                            { data: 'netAmount' },
                            {
                                data: null,
                                render: function(data, type, full, meta) {
                                    var statusHTML = '';
                                    if (full.status === "A") {
                                        statusHTML = '<span class="badge badge-success p-2">APPROVED BY '+full.approvedBy.toUpperCase()+' </span>'
                                    } else if (full.status === "RP") {
                                        statusHTML = '<span class="badge badge-warning d-inline p-2">REQUEST PENDING</span>';
                                    }else if (full.status === "") {
                                        statusHTML = '<span class="badge badge-dark d-inline p-2">GENERATED</span>';
                                    } else {
                                        statusHTML = '<span class="badge badge-danger d-inline p-2">NOT APPROVED</span>';
                                    }
                                    return statusHTML 
                                }
                            },
                            {
                                data: 'due',
                                "render": function (data, type, full, meta) {
                                    if (data) {
                                        return "<strong style='color:red;'>YES</strong>";
                                    } else {
                                        return "<strong>NO</strong>";
                                    }
                                }
                            },
                            { data: 'company' },
                        ],
                        "order": [[2, "desc"]],
                        // "pageLength": 10,
                    });
                    datatablesButtons.buttons().container().appendTo("#data_table_wrapper .col-md-6:eq(0)")
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

// OPEN MODAL BUTTON EVENT
$('form').on('change', '#sel_student', function (e) {
    if (e.target.value == null || e.target.value == '' || e.target.value == -1 || e.target.value == 0) {
        return
    }
    $.ajax({
        url: GETAPIURL("/api/v1/AccountsLovService/GetCourcesByStudentLov"),
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
                    const totalAmount = response.data.reduce((accumulator, currentItem) => {
                        return accumulator + currentItem.netFees;
                      }, 0);
                      $('#txt_totalAmount').val(totalAmount)
                      if (totalAmount != null && (totalAmount != "" || totalAmount != 0)) {
                          $('#txt_inword').val(numberToWords(totalAmount))
                      }
                    $('#course_data_table').DataTable().clear().destroy();
                    console.log(response.data)
                    var datatablesButtons = $("#course_data_table").DataTable({
                        data: response.data,
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
    CLEAR();btn_update.hide();btn_save.show()
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
    POST(end_point + "/AddFeeVoucher",_cre,function () {
        discon();
    });
});

// UPDATE BUTTON EVENT
$('form').on('click', '#btn_upd', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    PUT(end_point + "/UpdateFeeVoucher",_cre,function () {
        discon();
        setTimeout(() => {
            Onload();
        }, 1000);
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
    await GETBYID(end_point + "/GetFeeVoucherById", _id,_name, function (response) {
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
    DELETE(end_point + "/DeleteFeeVoucher",_Id,_name,function () {
        setTimeout(() => {
            Onload();
        }, 1000);
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
  



