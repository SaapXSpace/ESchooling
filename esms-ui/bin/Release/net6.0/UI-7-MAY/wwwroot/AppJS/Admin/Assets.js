import  {GETAPIURL,FILLCOMBO, GETBYID,POST,PUT,DELETE,CLEAR}  from "../Service/ApiService.js";
import { Roles } from "../Service/Security.js";

// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var Id = '';
if (url.has('M')) {
    Id = window.atob(url.get('M'));
}

// jQuery CONSTRUCTOR
$(document).ready(function () {  
    var _Id =  localStorage.getItem("Id")
    var _Role =  localStorage.getItem("Role")
    
    if (_Id != null && Id == _Id && _Role == Roles.Admin) {
        end_point = '/Assets';
        ComponentsDropdowns.init();
        discon();
    }else{
        window.location.href='/Auth/SignIn';
    }
  });

// INITIALIZING VARIBALES
var end_point;
var btn_save = $('#btn_sav')
var btn_update = $('#btn_upd')



// --- Fill Select 2 of Module ---
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        LoadAssetType();   //
        LoadLocation();
    }
    return {
        init: function () {
            handleSelect2();
        }
    };
}();

function LoadAssetType() {
    var $element = $('#txt_type').select2(); 
    FILLCOMBO('/AdminLovService/GetAssetTypeLov',$element)
}

function LoadLocation() {
    var $element = $('#txt_location').select2(); 
    FILLCOMBO('/AdminLovService/GetLocationLov',$element)
}

function LoadMaritalStatus() {
    var $element = $('#sel_meritalstatus').select2(); 
}

// DISCONNECTION FUNCTION
function discon(){
    Onload(); CLEAR(); btn_update.hide();btn_save.show()
}

// OPEN MODAL BUTTON EVENT
$('div').on('click', '#openmodal', function (e) {
    CLEAR();btn_update.hide();btn_save.show()
});


// PETHING DATA FUNCTION
function petchdata(response){
    
    $('#txt_id').val(response.id);
    $('#txt_code').val(response.code);
    $('#txt_name').val(response.name);
    $('#txt_type').val(response.typeId).trigger('change');
    $('#txt_location').val(response.locationId).trigger('change');
    $('#txt_price').val(response.price);
    $('#txt_description').val(response.description);
    $('#txt_purchasedate').val(moment(response.procurementDate).format('YYYY-MM-DD'));
    if (!response.active) {
        $("#ck_act").prop("checked", false);
    } else { $("#ck_act").prop("checked", true); }
    $('#data_Model').modal();
}

// VALIDATION FUNCTION
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '' ,id='';
    var txt_id = $('#txt_id');  
    var txt_code = $('#txt_code');   
    var txt_name = $('#txt_name');   
    var txt_type = $('#txt_type');   
    var txt_location = $('#txt_location');     
    var txt_price = $('#txt_price');     
    var txt_purchasedate = $('#txt_purchasedate');  
    var txt_description = $('#txt_description');     
    var ck_act = $('#ck_act'); 


    if (txt_description.val() == '') {
        ck = 1;
        _Error = 'Asset Description is required';
        txt_description.focus();
    }


    if (txt_purchasedate.val() == '') {
        ck = 1;
        _Error = 'Procurement Date is required';
        txt_purchasedate.focus();
    }


    if (txt_price.val() == '') {
        ck = 1;
        _Error = 'Asset Price is required';
        txt_price.focus();
    }

    if (txt_location.val() == '' || txt_location.val() == 0) {
        ck = 1;
        _Error = 'Select Location it is required';
        txt_location.focus();
    }

    if (txt_type.val() == '' || txt_type.val() == 0) {
        ck = 1;
        _Error = 'Select Asset Type it is required';
        txt_type.focus();
    }

    if (txt_name.val() == '') {
        ck = 1;
        _Error = 'Asset Name is required';
        txt_name.focus();
    }

    // if (txt_code.val() == '') {
    //     ck = 1;
    //     _Error = 'Please Enter Code ';
    //     txt_code.focus();
    // }
    
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
            "typeId": txt_type.val(),
            "locationId": txt_location.val(),
            "price": txt_price.val(),
            "procurementDate": txt_purchasedate.val(),
            "description": txt_description.val(),
            "active": ck_act[0].checked,
            "user": localStorage.getItem("Id")
        });
    }
    return { ckval: ck, creteria: _cre };
}


// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;
    $.ajax({
        url: GETAPIURL(end_point + "/GetAsset"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            var action_button = ' ';
            action_button += "<a href='#' class='btn-edit fas fa-edit' data-toggle='tooltip' style='color:#03588C' title='Update'></a> ";
            action_button += " <a href='#' class='btn-delete fas  fa-trash' data-toggle='tooltip' style='color:#03588C' title='Delete()'></a> ";
            if (response != null) {
                $('#data_table').DataTable().clear().destroy();
                $("#data_table").dataTable({
                    data: response.data,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        { data: null,"defaultContent": action_button},
                        { "render": function (data, type, full, meta) { return tbl_row_cnt++; }},
                        { data: 'id', render: renderQrCode },
                        { data: 'name' },
                        { data: 'type' },
                        { data: 'location' },
                        { data: 'price' },
                        { data: 'active','render': function (data, type, full, meta) {if (data) {return '✔'; }else { return '✘'; }  }},
                    ],
                    "order": [[0, "asc"]],
                    "pageLength": 10,
                });
                if ($("#txt_code")) {
                    if (response.data != null) {
                        $("#txt_code").val(Number(response.data[0].lastCode + 1))
                    }else{
                        $("#txt_code").val(Number(1))
                    }
                }

                document.getElementById("txt_card_total").innerHTML = response.data.length
                document.getElementById("txt_card_active").innerHTML = response.data.filter(x => x.active == true).length
                document.getElementById("txt_card_inactive").innerHTML = response.data.filter(x => x.active == false).length
                document.getElementById("txt_card_total").innerHTML = response.data.length

                
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
    return true;
}


// Define the rendering function for the QR code column
function renderQrCode(data, type, row) {
    const targetEl = document.getElementById('qrcode-' + row.id);

    const newEl = document.createElement('div');
    newEl.id = 'qrcode-' + row.id;
    newEl.hidden = true
    document.body.appendChild(newEl);

    // Create a new QR code instance
    const qr = new QRCode('qrcode-' + row.id);
  
    // Set the text to the GUID
    qr.makeCode(data);
  
    // Get the data URL of the QR code image
    const imageDataUrl = qr._el.firstChild.toDataURL();

    return '<img src="' + imageDataUrl + '" alt="QR code" width="100" />';
  }


// ADD BUTTON EVENT
$('form').on('click', '#btn_sav', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    POST(end_point + "/AddAsset",_cre,function () {
        discon();
    });
});






// UPDATE BUTTON EVENT
$('form').on('click', '#btn_upd', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    PUT(end_point + "/UpdateAsset",_cre,function () {
        discon();
    });
});

// EDIT BUTTON EVENT 
$('table').on('click', '.btn-edit', async function (e) { //Edit Start
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _name = data['name'] + " " + data['type'];
    btn_update.show();btn_save.hide()
    await GETBYID(end_point + "/GetAssetById", _id,_name, function (response) {
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
    DELETE(end_point + "/DeleteAssets",_Id,_name,function () {
        Onload();
    })
});


var Inactivecard = document.getElementById("card_inactive")
Inactivecard.addEventListener("click", function() {
    var searchBox = document.getElementsByClassName("dataTables_filter")[0].getElementsByTagName("input")[0];
    searchBox.value = "✘"
    var event = new Event('keyup');
    searchBox.dispatchEvent(event);

});
var totalcard = document.getElementById("card_total")
totalcard.addEventListener("click", function() {
    var searchBox = document.getElementsByClassName("dataTables_filter")[0].getElementsByTagName("input")[0];
    searchBox.value = ""
    var event = new Event('keyup');
    searchBox.dispatchEvent(event);
});

var card_Active = document.getElementById("card_Active")
card_Active.addEventListener("click", function() {
    var searchBox = document.getElementsByClassName("dataTables_filter")[0].getElementsByTagName("input")[0];
    searchBox.value = "✔"
    var event = new Event('keyup');
    searchBox.dispatchEvent(event);
});


