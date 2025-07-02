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
    end_point = '/api/v1/PayrollLovService';
    $("#table_loading_image").hide() 
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

$("#sel_student").on("select2:clear", function (e) {
    document.getElementById('course_data_table_tbody').innerHTML = ("");
});

$("#sel_student").on('change', function (e) {
    if (e.target.value === '-1' || e.target.value === ' ' || e.target.value === "" || e.target.value === null || e.target.value === undefined) {
        return
    }else{
        var selectedStudent = e.target.value
        fill_certificate_table(selectedStudent)
    }
})

function fill_certificate_table(student) {
    document.getElementById('course_data_table_tbody').innerHTML = ""
    $("#table_loading_image").show() 
    $.ajax({
        url: GETAPIURL(end_point + "/GetAssignCertificateCourcesByStudentLov"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('Id', student);
        },
        success: function (response) {
            var action_button = ' ';
            if (response != null) {
                let htmlContent = ''; 
                var count = 0
                if (response.data != null && response.data.length != 0) {
                    for (const item of response.data) {
                        htmlContent += `
                            <tr>
                                <td><input type="checkbox" class="checkbox" /></td>
                                <td hidden>${item.id}</td>
                                <td>${item.courseName} <br> <span class="badge badge-primary"> FROM: ${moment(item.startDate).format("DD-MMMM-YYYY") } </span> <br> <span class="badge badge-primary"> TO: ${moment(item.endDate).format("DD-MMMM-YYYY")} </span> <br> <span class="badge badge-success"> Approved By: ${item.printApprovedBy} </span> </td>
                                <td>${item.status}</td>
                                <td style="width: 50%;"> <select class="did-floating-select sel_type" id="sel_type${count}">
                                        <option value="0"> SELECT TYPE </option>
                                        <option value="L|CFOS-B"> BASIC [CFOS] Basic Course  </option>
                                        <option value="L|CYB-B"> BASIC [CYB] Basic Course  </option>
                                        <option value="L|NF-B"> BASIC [NF] Basic Course  </option>
                                        <option value="L|CC-A"> BASIC [CC] Advance Course  </option>
                                        <option value="L|AI-A"> BASIC [AI] Advance Course  </option>
                                        <option value="L|DS-A"> BASIC [DS] Advance Course  </option>
                                    </select> 
                                </td>
                            </tr>`;
                            count = count+1

                            //<option value="L|GPIII-C"> [GP-III] CERTIFICATE </option>
                            //<option value="L|ECDIS-C"> [ECDIS] OPER CERTIFICATE </option>
                            //<option value="L|ECDISMANG-C"> [ECDIS] MANG CERTIFICATE </option>
                            //<option value="IB|ATT-C"> [GMDSS-ATTENDANCE] CERTIFICATE </option>
                            //<option value="IB|ISM-C"> [ISM-FAMILIARIZATION] CERTIFICATE </option>
                            //<option value="IB|BTSOPW-C"> [BTSOPW] CERTIFICATE OF PROFICIENCY </option>
                            //<option value="IB|ADVBTSOPW-C"> ADV [BTSOPW] CERTIFICATE OF PROFICIENCY </option>
                            //<option value="IB|LICOSC-C"> ADV [LICOS-CHEMICAL] CERTIFICATE </option>
                            //<option value="IB|ICE-C"> ADV [ICE-NAVIGATION] CERTIFICATE </option>
                            //<option value="IB|LICOS-C"> [LICOS] CERTIFICATE </option>
                            //<option value="IB|SHST-C"> [SHST] CERTIFICATE </option>  
                            //<option value="IB|HVSTM-C"> [HVST-M] CERTIFICATE </option>     
                            //<option value="IB|HVSTO-C"> [HVST-O] CERTIFICATE </option>     
                            //<option value="L|HVSTOAPP-C"> [HVST-O APPROVED] CERTIFICATE </option>     
                            //<option value="L|ARPAO-C"> [ARPA-O] CERTIFICATE </option>  
                            //<option value="IB|CRISISMC-C"> [CRISIS MANAGEMENT] CERTIFICATE </option> 
                            //<option value="IB|FOODHC-C"> [FOOD HANDLING] CERTIFICATE </option>     
                            //<option value="IB|CPSSA-C"> [CPSSA] CERTIFICATE </option>    
                    }
                    document.getElementById('course_data_table_tbody').innerHTML = (htmlContent);
                    $("#table_loading_image").hide()
                }else{
                    document.getElementById('course_data_table_tbody').innerHTML = "<tr><td></td><td></td><td><div ><h3 class='text-center p-3'><strong>No data found</strong></h3></div></td><td></td><td></td></tr>";
                    $("#table_loading_image").hide()
                }
            }else{
                document.getElementById('course_data_table_tbody').innerHTML = "<tr><td></td><td></td><td><div ><h3 class='text-center p-3'><strong>No data found</strong></h3></div></td><td></td><td></td></tr>";
                $("#table_loading_image").hide()
            }
            $('table select').each(function(e) {
                $("#sel_type"+e).select2({

                });
            });
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
            $("#table_loading_image").hide()
        }
    })
}


// PRINT BUTTON EVENT
$('form').on('click', '#btn_view_certificate', function (e) {
    e.preventDefault();
    const table = document.getElementById('course_data_table');
    const checkboxes = table.querySelectorAll('.checkbox');
    const checkedIDs = {};
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            const row = checkbox.closest('tr');
            const idCell = row.querySelector('td:nth-child(2)'); 
            const NameCell = row.querySelector('td:nth-child(3)'); 
            const selectCell = row.querySelector('td:nth-child(5) select');// Assuming ID is in the second column
            if (selectCell.value != 0) {
                if (idCell) {
                    const id = idCell.textContent;
                    checkedIDs[idCell.textContent] = selectCell.value 
                }
            }else{
                Swal.fire({
                    title: "Select Certificate type of course " + NameCell.textContent,
                    icon: 'error'
                })
                return;
            }
            
        }
    });
    const serializedData = JSON.stringify(checkedIDs);
    sessionStorage.setItem('$serializedDict$', serializedData)
    var url = "../../Certificate/Report/Certificate?Id="+btoa(menuId);
    window.open(url, '_blank')
});

// // PRINT BUTTON EVENT
// $('table').on('click', '.btn-receipt', function (e) {
//     e.preventDefault();
//     var currentRow = $(this).closest("tr");
//     var _id = currentRow.find("td:first").text();
//     console.log(_id)
//     var url = "../Report/Receipt?Id="+btoa(_id);
//     window.open(url, '_blank')
// });





