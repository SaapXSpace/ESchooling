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

// LOAD STUDENT LOV
function LoadStudents() {
    var $element = $('#sel_student').select2(); 
    FILLCOMBO('/api/v1/AccountsLovService/GetStudentLov',$element,"Student")
}

$('#ck_dec').change(function() {
    if(this.checked) {
        $("#ck_appro").prop("checked", false);
    } 
});

$('#ck_appro').change(function() {
    if(this.checked) {
        $("#ck_dec").prop("checked", false);
    } 
});

// PETHING DATA FUNCTION
function petchdata(response){
    $('#txt_id').val(response.id);
    $('#txt_code').val(response.code);
    $('#sel_student').val(response.studentId).trigger('change');
    $('#txt_totalAmount').val(response.total);
    $('#txt_narr').val(response.narration);
    $('#txt_inword').val(response.words);
    $('#txt_dis').val(response.discount);
    $('#txt_comp').val(response.company);
    $('#txt_discount').val(response.discountAmount);
    $('#txt_netamount').val(response.total - response.discountAmount);

    if (response.status == "A"){
        $("#ck_appro").prop("checked", true);
        $("#ck_dec").prop("checked", false);
    }else if (response.status == "NA") {
        $("#ck_appro").prop("checked", false);
        $("#ck_dec").prop("checked", true);
    } else { 
        $("#ck_appro").prop("checked", false); 
        $("#ck_dec").prop("checked", false); 
    }

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
                { data: 'discountAmount' },
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
    var txt_discount = $('#txt_dis');   
    var txt_discountAmount = $('#txt_discount')
    var txt_narr = $('#txt_narr');   
    var txt_inword = $('#txt_inword');   
    var ck_appro = $('#ck_appro');  
    var ck_dec = $('#ck_dec'); 
    var txt_comp = $('#txt_comp'); 


    var student_course_record = [];
    var allData =  $('#course_data_table').DataTable().rows().data().toArray();

    if (ck_appro[0].checked) {
        if (txt_discount.val() <= 0) {
            ck = 1;
            _Error = 'Enter Some Discount For Approval';
            txt_discount.focus();
        }
    }   

    if (!ck_appro[0].checked) {
        if (txt_discount.val() != 0) {
            ck = 1;
            _Error = 'Enter Discount 0 For Un-Approval';
            txt_discount.focus();
        }
    }   
    

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
            "discount": txt_discount.val(),
            "discountAmount": txt_discountAmount.val(),
            "words": txt_inword.val(),
            "narration": txt_narr.val(),
            "status": ck_appro[0].checked ? "A" : (ck_dec[0].checked ? "NA" : "RP" ) ,
            "type": "U",
            "active": true,
            "request": true,
            "company": txt_comp.val(),
            "courcesIds": student_course_record,
        });
        console.log(_cre)
    }
    return { ckval: ck, creteria: _cre };
}

$('.checkbox-toggle').change(function() {
    $('.checkbox-toggle').not(this).prop('checked', false); // Uncheck other checkboxes
});

// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;
    
    table_loading_image.show()
    $.ajax({
        url: GETAPIURL("/api/v1/AccountsLovService/GetDeiscountRequestedVoucherLov"),
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
                
                // if (!response.permissions.insert_Permission) {
                //     btn_add.hide()
                // }
                // if (response.permissions.update_Permission) {
                //     action_button += "";
                // }
                // if (response.permissions.delete_Permission) {
                //     //action_button += " <a href='#' class='btn-delete fas  fa-trash' data-toggle='tooltip' style='color:#03588C' title='Delete()'></a> ";
                // }
                if (response.data != null) {
                    const totalRecords = response.data.length;
                    const approvedRecords = response.data.filter(record => record.status == "A");
                    const unapprovedRecords = Number(totalRecords) - Number(approvedRecords.length);
                    document.getElementById("txt_totalrecord").innerHTML = totalRecords
                    document.getElementById("txt_approved").innerHTML = approvedRecords.length
                    document.getElementById("txt_notapproved").innerHTML = unapprovedRecords

                    $('#data_table').DataTable().clear().destroy();
                    var datatablesButtons = $("#data_table").DataTable({
                        data: response.data,
                        destroy: true,
                        retrieve: true,
                        processing: true,
                        lengthChange:!1,
                        buttons: ["pdf","copy", "print","csv"],
                        columns: [
                            { data: null,"defaultContent": "<a href='#' class='btn-edit fas fa-edit' data-toggle='tooltip' style='color:#03588C' title='Update'></a> "},
                            // { "render": function (data, type, full, meta) { return tbl_row_cnt++; }},
                            { data: 'code' },
                            {
                                data: 'date', width: '100px',
                                render: function(data, type, full, meta) {
                                    return moment(data).format("MMM-DD YYYY hh:mm A") 
                                }
                            },
                            { data: 'studentSSB'  },
                            { data: 'studentName'  },
                            { data: 'studentCNIC'  },
                            { data: 'courses'},
                            { data: 'total' },
                            { data: 'discount' },
                            { data: 'createdBy' },
                            { data: 'status','render': function (data, type, full, meta) {if (data == "A") {return 'APPROVED'; }else if (data == "NA"){ return 'NOT-APPROVED'; }else { return ' PENDING'; } }},
                            { data: 'due','render': function (data, type, full, meta) {if (data) {return '<strong style="color:red;"> YES </strong>'; }else { return ' <strong> NO </strong>'; } }},
                            { data: 'company','render': function (data, type, full, meta) {if (data) {return data; }else { return '-'; } }},
                        ],
                        "order": [[2, "desc"]],
                        // "pageLength": 10,
                    });
                    datatablesButtons.buttons().container().appendTo("#data_table_wrapper .col-md-6:eq(0)")
                }else{
                    $("#data_table").DataTable()
                    Swal.fire({
                        title: response.message,
                        width:800,
                        icon: 'error',
                    })
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
    
    if (type === "S") {
        Swal.fire({
            title: "This is System Generated Record",
            icon: 'warning',
        })
        return
    }
    DELETE(end_point + "/DeleteFeeVoucher",_Id,_name,function () {
        Onload();
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


$('form').on('change', '#txt_discount', function (e) {
    var discount = e.target.value;
    if (discount != null && (discount != "" || discount != 0)) {
        var total = $("#txt_totalAmount").val()
        if(Number(discount) <= Number(total)){
            // var net =  total - (total * discount/100)
            // $('#txt_netamount').val(net);
            // $('#txt_inword').val(numberToWords(net));
            var discountPercentage = (discount / total) * 100;
            var net = total - discount;
            $('#txt_netamount').val(net);
            $('#txt_dis').val(discountPercentage.toFixed(2));
            $('#txt_inword').val(numberToWords(net));
        }else{
            Swal.fire({
                title: "The discount exceeds the total amount.",
                icon: 'warning',
            })
        }
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
  



