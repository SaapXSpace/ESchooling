import  {GETAPIURL,GETBYID,POST,PUT,DELETE,CLEAR,FILLCOMBO,FILLCOMBOBYID}  from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js";

// INITIALIZING VARIBALES
var end_point;
var btn_save = $('#btn_sav')
var btn_update = $('#btn_upd')
var btn_add = $('#openmodal')
var fromShortName = "PAY"


var table_loading_image = $('#table_loading_image')

// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var menuId = '';
if (url.has('M')) {
    menuId = window.atob(url.get('M'));
}

// jQuery CONSTRUCTOR
$(document).ready(function () {  
    end_point = '/api/v1/Payment';
    ComponentsDropdowns.init();
    discon();
  });

// DISCONNECTION FUNCTION
function discon(){
    LoadVouchers();
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
        LoadVouchers();
        LoadAccounts();
        LoadAccountType();
    }
    return {
        init: function () {
            handleSelect2();
        }
    };
}();

// LOAD STUDENT LOV
// function LoadVouchers() {
//     var $element = $('#sel_voucher').select2(); 
//     FILLCOMBO('/api/v1/AccountsLovService/GetVoucherLov',$element,"Voucher")
// }

function LoadVouchers() {
    $("#sel_voucher").select2({
        placeholder: "Search Voucher",
        minimumInputLength: 2,
        allowClear: true,
        ajax: {
            url: GETAPIURL('/api/v1/AccountsLovService/GetVoucherLov'),
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
                console.log(data);
                console.log(params);
                var myResults = [];
                if (data.statusCode === "200" && data.data) {
                    $.each(data.data, function (index, item) {
                        myResults.push({
                            id: item.id,
                            text: item.name,
                            fees: item.fees,
                            words: item.words
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



// LOAD STUDENT LOV
function LoadAccounts() {
    $('#sel_account').select2();
}

// LOAD STUDENT LOV
function LoadAccountType() {
    var $element = $('#sel_accounttype').select2(); 
    FILLCOMBO('/api/v1/AccountsLovService/GetBankTypeLov',$element,"Account Type")
}


// OPEN MODAL BUTTON EVENT
$('form').on('change', '#sel_accounttype', function (e) {
    if (e.target.value == null || e.target.value == '' || e.target.value == -1 || e.target.value == 0) {
        return
    }
    var accountTypeId = e.target.value
    var $element = $('#sel_account').select2(); 
    FILLCOMBOBYID(accountTypeId,'/api/v1/AccountsLovService/GetBankAccountsLov',$element,"Account")
});




// PETHING DATA FUNCTION
function petchdata(response){
    console.log(response)
    $('#txt_id').val(response.id);
    $('#txt_code').val(response.code);
    $('#sel_voucher').val(response.voucherId).trigger('change');
    $('#txt_totalAmount').val(response.total);
    $('#txt_narr').val(response.narration);
    $('#txt_inword').val(response.words);
    $('#sel_paytype').val(response.paymentType).trigger('change');
    $('#sel_accounttype').val(response.accountTypeId).trigger('change');
    setTimeout(() => {
        $('#sel_account').val(response.account).trigger('change');
    }, 100);
    
    $('#data_Model').modal();
}

// VALIDATION FUNCTION
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '' ,id='';
    var txt_id = $('#txt_id');  
    var txt_code = $('#txt_code');  
    var sel_voucher = $('#sel_voucher');   
    var txt_totalAmount = $('#txt_totalAmount');   
    var sel_paytype = $('#sel_paytype');   
    var txt_inword = $('#txt_inword');   
    var txt_narr = $('#txt_narr');   
    var sel_accounttype = $('#sel_accounttype');   
    var sel_account = $('#sel_account');   
 
    var allData =  $('#course_data_table').DataTable().rows().data().toArray();

    if (sel_paytype.val() == 'O') {
        
        if (sel_account.val() == -1 || sel_account.val()==0) {
            ck = 1;
            _Error = 'Select Account because you choose to payment online';
            sel_account.focus();
        }
        if (sel_accounttype.val() == -1 || sel_accounttype.val()==0) {
            ck = 1;
            _Error = 'Select Account Type for Account because you choose to payment online';
            sel_accounttype.focus();
        }
    }

    // if (txt_narr.val() == '') {
    //     ck = 1;
    //     _Error = 'Enter Some Narration Regards Vouchers';
    //     txt_narr.focus();
    // }

    if (txt_totalAmount.val() == '' || txt_totalAmount.val() == 0) {
        ck = 1;
        _Error = 'Total Amount is 0';
        txt_totalAmount.focus();
    }

    if (sel_voucher.val() == 0 || sel_voucher.val() == -1) {
        ck = 1;
        _Error = 'Select Voucher, its required';
        sel_voucher.focus();
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
            "voucherId": sel_voucher.val(),
            "total": txt_totalAmount.val(),
            "words": txt_inword.val(),
            "narration": txt_narr.val(),
            "paymentType": sel_paytype.val(),
            "account": sel_account.val() ?? '00000000-0000-0000-0000-000000000000',
            "type": "U",
            "active": true,
        });
    }
    return { ckval: ck, creteria: _cre };
}

// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;
    
    table_loading_image.show()
    $.ajax({
        url: GETAPIURL(end_point + "/GetPayment"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('_menuId', menuId);
        },
        success: function (response) {
            var action_button = ' ';
            var voucher_button = ' ';
            if (response != null) {
                if (!response.permissions.insert_Permission) {
                    btn_add.hide()
                }
                // if (response.permissions.update_Permission) {
                //     action_button += "<a href='#' class='btn-edit fas fa-edit' data-toggle='tooltip' style='color:#03588C' title='Update'></a> ";
                // }
                if (response.permissions.delete_Permission) {
                    action_button += " <a href='#' class='btn-delete fas fa-trash' data-toggle='tooltip' style='color:#03588C' title='Delete()'></a>";
                }
                if (response.permissions.print_permission) {
                    action_button += " <a href='#' class='btn-receipt fas fa-fw fa-receipt' data-toggle='tooltip' style='color:#03588C' title='Receipt()'></a> ";
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
                            { data: null,"defaultContent": action_button , width: '30px',},
                            // { "render": function (data, type, full, meta) { return tbl_row_cnt++; }},
                            { data: 'code' },
                            {
                                data: 'date', width: '100px',
                                render: function(data, type, full, meta) {
                                    return moment(data).format("YYYY-MM-DD hh:mm A") 
                                }
                            },
                            { data: 'studentSSB' },
                            { data: 'voucher' },
                            { data: 'studentCNIC'},
                            { data: 'courses' },
                            { data: 'total','render': function (data, type, full, meta) {if (data) {return Math.round(Number(data)); } else { return data; }  }},
                            
                            { data: 'paymentType','render': function (data, type, full, meta) {if (data == "O") {return 'ONLINE'; } else { return 'CASH'; }  }},
                            { data: 'account','render': function (data, type, full, meta) {if (data == "") {return '  '; } else { return data; }  }},
                            { data: 'narration' },
                            //{ data: null,"defaultContent": voucher_button},
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
$('form').on('change', '#sel_voucher', function (e) {
    if (e.target.value == null || e.target.value == '' || e.target.value == -1 || e.target.value == 0) {
        return
    }
    var data = $('#sel_voucher').select2('data')[0]
    if (data != null) {
        $('#txt_totalAmount').val(data.fees);
        $('#txt_inword').val(data.words);

    }
    console.log(data)
});

// OPEN MODAL BUTTON EVENT
$('form').on('change', '#sel_paytype', function (e) {
    if (e.target.value == null || e.target.value == '' || e.target.value == -1 || e.target.value == 0) {
        return
    }
    var bankDiv = document.getElementById("bankdiv");
    if (e.target.value == "O") {
        bankDiv.style.display = "flex";
    }else{
        bankDiv.style.display = "none";
        $("#sel_account").val(null).trigger('change')
    }
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

// PRINT BUTTON EVENT
$('table').on('click', '.btn-receipt', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _id = data['id'];
    //location.href = "../Report/Receipt?Id="+btoa(_id);
    var url = "../Report/Receipt?Id=" + btoa(_id);
    window.open(url, '_blank'); 
});

// ADD BUTTON EVENT
$('form').on('click', '#btn_sav', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    POST(end_point + "/AddPayment",_cre,function () {
        discon();
    });
});

// UPDATE BUTTON EVENT
$('form').on('click', '#btn_upd', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    PUT(end_point + "/UpdatePayment",_cre,function () {
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
    await GETBYID(end_point + "/GetPaymentById", _id,_name, function (response) {
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
    DELETE(end_point + "/DeletePayment",_Id,_name,function () {
        console.log("Deleted")
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
  



