import  {GETAPIURL,FILLCOMBO}  from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js";



// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var Id = '';
var end_point='';

var led_datefrom = $('#led_datefrom');  
var led_dateto = $('#led_dateto');   

var led_monthfrom = $('#led_monthfrom');  
var led_monthto = $('#led_monthto');   

// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var menuId = '';
if (url.has('M')) {
    menuId = window.atob(url.get('M'));
}

// jQuery CONSTRUCTOR
$(document).ready(function () { 
    render_dates() 
    render_month()
    ComponentsDropdowns.init();
    end_point = '/api/v1/AccountsLovService';
    // Onload(Id)
  });


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

// TAB 1 WORKING START

function render_dates() {
    var currentDate = new Date();
    led_datefrom.val(moment(currentDate).format("YYYY-MM-DD"));
    led_dateto.val(moment(currentDate).format("YYYY-MM-DD"));
}


$("#btn_ledger_report").on('click', function () {
    datewise_ledger()
})

// VALIDATION FUNCTION
function ledger_datewiseckvalidation() {
    var ck = 0, _Error = '', _cre = '' ,id='';
    if (led_datefrom.val() == '') {
        ck = 1;
        _Error = 'Select Start Date';
        led_datefrom.focus();
    }
    if (led_dateto.val() == '') {
        ck = 1;
        _Error = 'Select End Date';
        led_dateto.focus();
    }
    
    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
    }

    else if (!Boolean(ck)) {
        _cre = {
            "dateFrom": moment(led_datefrom.val()).format("YYYY-MM-DD hh:mm:ss") ,
            "dateTo": moment( led_dateto.val()).format("YYYY-MM-DD hh:mm:ss"),
        };
    }
    return { ckval: ck, creteria: _cre };
}

// LEDGER DATE WISE FUNCTION
function datewise_ledger(_Id) {
    var ck = ledger_datewiseckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    var url = "/Accounts/Report/Ledger?Id="+btoa(menuId)+ "&dateFrom=" + encodeURIComponent(_cre.dateFrom) + "&dateTo=" + encodeURIComponent(_cre.dateTo)
    window.open(url, '_blank')
}

// TAB 1 WORKING END

// TAB 2 WORKING END

function render_month() {
    var currentDate = new Date();
    led_monthfrom.val(moment(currentDate).format("yyyy-MM"));
    led_monthto.val(moment(currentDate).format("yyyy-MM"));
}

$("#btn_month_ledger_report").on('click', function () {
    monthwise_ledger()
})


// VALIDATION FUNCTION
function ledger_monthwiseckvalidation() {
    var ck = 0, _Error = '', _cre = '' ,id='';
    if (led_monthfrom.val() == '') {
        ck = 1;
        _Error = 'Select Start Month';
        led_monthfrom.focus();
    }
    if (led_monthto.val() == '') {
        ck = 1;
        _Error = 'Select End Month';
        led_monthto.focus();
    }
    
    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
    }

    else if (!Boolean(ck)) {
        _cre = {
            "monthFrom": moment(led_monthfrom.val()).format("YYYY-MM-DD hh:mm:ss") ,
            "monthTo": moment( led_monthto.val()).format("YYYY-MM-DD hh:mm:ss"),
        };
    }
    return { ckval: ck, creteria: _cre };
}



// LEDGER DATE WISE FUNCTION
function monthwise_ledger(_Id) {
    var ck = ledger_monthwiseckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    var url = "/Accounts/Report/Ledger?Id="+btoa(menuId)+ "&monthFrom=" + encodeURIComponent(_cre.monthFrom) + "&monthTo=" + encodeURIComponent(_cre.monthTo)
    window.open(url, '_blank')
}

// TAB 2 WORKING END



// TAB 6 WORKING START

// LOAD STUDENT LOV
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

$("#sel_student").on("select2:clear", function (e) {
    document.getElementById('voucher_data_table_tbody').innerHTML = ("");
});

$("#sel_student").on('change', function (e) {
    if (e.target.value === '-1' || e.target.value === ' ' || e.target.value === "" || e.target.value === null || e.target.value === undefined) {
        return
    }else{
        var selectedStudent = e.target.value
        fill_payment_table(selectedStudent)
        
    }
})

function fill_payment_table(student) {
    $.ajax({
        url: GETAPIURL(end_point + "/GetPaymentDetailByStudentId"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('_studentId', student);
        },
        success: function (response) {
            var action_button = ' ';
            if (response != null) {
               
                let htmlContent = ''; 
                    for (const item of response.data) {
                        htmlContent += `
                            <tr>
                                <td hidden>${item.id}</td>
                                <td>${item.code}</td>
                                <td>${item.voucher}</td>
                                <td>${item.courses}</td>
                                <td>${item.total}</td>
                                <td> <a href='#' class='btn-receipt fas fa-print' data-toggle='tooltip' style='color:#03588C' title='Update'></a> </td>
                            </tr>`;
                    }

                    document.getElementById('voucher_data_table_tbody').innerHTML = (htmlContent);
                
                
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
}

// PRINT BUTTON EVENT
$('table').on('click', '.btn-receipt', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var _id = currentRow.find("td:first").text();
    var url = "../Report/Receipt?Id="+btoa(_id);
    window.open(url, '_blank')
});





