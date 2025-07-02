import  {GETAPIURL,GETBYID,POST,PUT,DELETE,CLEAR,FILLCOMBO}  from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js";

// INITIALIZING VARIBALES
var end_point;
var btn_save = $('#btn_sav')
var btn_update = $('#btn_upd')
var btn_add = $('#openmodal')
var fromShortName = "BNKACC"


var table_loading_image = $('#table_loading_image')

// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var menuId = '';
if (url.has('M')) {
    menuId = window.atob(url.get('M'));
}

// jQuery CONSTRUCTOR
$(document).ready(function () {  
    end_point = '/api/v1/BankAccount';
    ComponentsDropdowns.init();
    discon();
  });

// DISCONNECTION FUNCTION
function discon(){
    table_loading_image.hide();
    Onload(); CLEAR(); 
    btn_update.hide();
    btn_save.show()
    $('#sel_type').val("-1").trigger('change');
    $('#sel_currency').val("-1").trigger('change');

}

// --- Fill Select 2 of Module ---
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        LoadBankType();
        LoadCurrency();  
    }
    return {
        init: function () {
            handleSelect2();
        }
    };
}();

// LOAD BANK TYPE LOV
function LoadBankType() {
    var $element = $('#sel_type').select2(); 
    FILLCOMBO('/api/v1/AccountsLovService/GetBankTypeLov',$element,"Bank Type")
}

// LOAD CURRENCY LOV
function LoadCurrency() {
    var $element = $('#sel_currency').select2(); 
    FILLCOMBO('/api/v1/AccountsLovService/GetCurrencyLov',$element,"Currency")
}

// PETHING DATA FUNCTION
function petchdata(response){
    $('#txt_id').val(response.id);
    $('#sel_type').val(response.bankTypeId).trigger('change');
    $('#sel_currency').val(response.currencyId).trigger('change');
    $('#txt_code').val(response.code);
    $('#txt_name').val(response.name);
    $('#txt_title').val(response.title);
    $('#txt_account').val(response.account);
    $('#txt_iban').val(response.iban);
    $('#txt_address').val(response.address);
    $('#txt_email').val(response.email);
    $('#txt_contact').val(response.contact);
    $('#txt_landline').val(response.phone);
    $('#txt_fax').val(response.fax);
    if (!response.active) {
        $("#ck_act").prop("checked", false);
    } else { $("#ck_act").prop("checked", true); }
    $('#data_Model').modal();
}

// VALIDATION FUNCTION
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '' ,id='';
    var txt_id = $('#txt_id');  
    var sel_type = $('#sel_type');   
    var sel_currency = $('#sel_currency');   
    var txt_code = $('#txt_code');   
    var txt_name = $('#txt_name');   
    var txt_title = $('#txt_title');   
    var txt_account = $('#txt_account');   
    var txt_iban = $('#txt_iban');   
    var txt_account = $('#txt_account');   
    var txt_contact = $('#txt_contact');   
    var txt_email = $('#txt_email');    
    var txt_landline = $('#txt_landline');   
    var txt_fax = $('#txt_fax');   
    var txt_address = $('#txt_address');   
    var ck_act = $('#ck_act'); 
    


    if (txt_name.val() == '') {
        ck = 1;
        _Error = 'BankAccount Name is required';
        txt_name.focus();
    }

    if (txt_title.val() == '') {
        ck = 1;
        _Error = 'Title is required';
        txt_title.focus();
    }

    if (txt_account.val() == '') {
        ck = 1;
        _Error = 'Account Number is required';
        txt_account.focus();
    }

    if (txt_account.val() != '') {
        if (txt_account.length > 17) {
            ck = 1;
            _Error = 'Account Number must be greater then 17 digit';
            txt_account.focus();
        }
    }

    if (txt_iban.val() == '') {
        ck = 1;
        _Error = 'IBAN Number is required';
        txt_iban.focus();
    }

    if (txt_iban.val() != '') {
        if (txt_iban.length > 17) {
            ck = 1;
            _Error = 'IBAN Number must be greater then 17 digit';
            txt_iban.focus();
        }
    }

    if (txt_contact.val() == '') {
        ck = 1;
        _Error = 'Contact Number is required';
        txt_contact.focus();
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
            _Error = 'Please Enter Valid Contact Number like XXX-XXX-XXXX, +XX-XXXX-XXXX, +923123456789, 03123456789';
            txt_contact.focus();
        }
    }

    if (txt_email.val() != '') {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!txt_email.val().match(mailformat))
        {
            ck = 1;
            _Error = 'Please Enter Your Valid Email Patteren like abc@gmail.com';
            txt_email.focus();
        }
    }

    if (txt_landline.val() != '') {
        var ptcl = /^\+?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/; // XXX-XXX-XXXX
        var phone = /^([0-9]{4})\)?[-. ]?([0-9]{7})$/;
        var phonewithCode = /^\+([0-9]{4})\)?[-. ]?([0-9]{8})$/;
        var ALL = /[\+\d]?(\d{2,3}[-\.\s]??\d{2,3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4}|\d{3}[-\.\s]??\d{4})/
        if((txt_landline.val().match(ptcl))){}
        else if((txt_landline.val().match(ALL))){}
        else if((txt_landline.val().match(phonewithCode))  ){}
        else{
            ck = 1;
            _Error = 'Please Enter Valid LandLine/Phone# Number like XXX-XXX-XXXX, +XX-XXXX-XXXX, +923123456789, 03123456789';
            txt_landline.focus();
        }
    }

    if (sel_currency.val() == '-1') {
        ck = 1;
        _Error = 'Select Currency, its required';
        sel_currency.focus();
    }
    
    if (sel_type.val() == '-1') {
        ck = 1;
        _Error = 'Select Type, its required';
        sel_type.focus();
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
            "name": txt_name.val(),
            "title": txt_title.val(),
            "account": txt_account.val(),
            "iban": txt_iban.val(),
            "bankTypeId": sel_type.val(),
            "currencyId": sel_currency.val(),
            "phone": txt_landline.val(),
            "contact": txt_contact.val(),
            "email": txt_email.val(),
            "address": txt_address.val(),
            "fax": txt_fax.val(),
            "type": "U",
            "active": ck_act[0].checked,
        });
    }
    return { ckval: ck, creteria: _cre };
}

// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;
    
    table_loading_image.show()
    $.ajax({
        url: GETAPIURL(end_point + "/GetBankAccount"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('_menuId', menuId);
        },
        success: function (response) {
            var action_button = ' ';
            if (response != null) {
                if (!response.permissions.insert_Permission) {
                    btn_add.hide()
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
                        data: response.data,
                        destroy: true,
                        retrieve: true,
                        processing: true,
                        lengthChange:!1,
                        buttons: ["pdf","copy", "print","csv"],
                        columns: [
                            { data: null,"defaultContent": action_button},
                            { "render": function (data, type, full, meta) { return tbl_row_cnt++; }},
                            { data: 'code' },
                            { data: 'currencyName' },
                            { data: 'bankTypeName' },
                            { data: 'name' },
                            { data: 'title' },
                            { data: 'account' },
                            { data: 'active','render': function (data, type, full, meta) {if (data) {return '✔'; }else { return '✘'; }  }},
                        ],
                        "order": [[0, "asc"]],
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
    POST(end_point + "/AddBankAccount",_cre,function () {
        discon();
    });
});

// UPDATE BUTTON EVENT
$('form').on('click', '#btn_upd', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    PUT(end_point + "/UpdateBankAccount",_cre,function () {
        discon();
    });
});

// EDIT BUTTON EVENT 
$('table').on('click', '.btn-edit', async function (e) { //Edit Start
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _name = data['name'];
    var type = data['type'];
    if (type === "S") {
        Swal.fire({
            title: "This is System Generated Record",
            icon: 'warning',
        })
        return
    }
    btn_update.show();btn_save.hide()
    await GETBYID(end_point + "/GetBankAccountById", _id,_name, function (response) {
        petchdata(response)
    })
   
});

// DELETE BUTTON EVENT 
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _Id = data['id'];
    var _name = data['name'];
    var type = data['type'];
    if (type === "S") {
        Swal.fire({
            title: "This is System Generated Record",
            icon: 'warning',
        })
        return
    }
    DELETE(end_point + "/DeleteBankAccount",_Id,_name,function () {
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


// $('div').on('click', '#excel', function (e) {
//     console.log("click");
//     ExporData("excel")
// });

// $('div').on('click', '#csv', function (e) {
//     console.log("click");
//     ExporData("csv")
// });



