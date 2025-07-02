import  {GETAPIURL,FILLCOMBO, GETBYID,POST,PUT,DELETE,CLEAR}  from "../Service/ApiService.js";
import { Roles } from "../Service/Security.js";


// INITIALIZING VARIBALES
var end_point;
var btn_save = $('#btn_sav')
var btn_update = $('#btn_upd')
var AssetList = [] 

var url = new URLSearchParams(window.location.search);
var Id = '';
if (url.has('M')) {
    Id = window.atob(url.get('M'));
}

// jQuery CONSTRUCTOR
$(document).ready(function () {  
    var _Id =  localStorage.getItem("Id")
    var _Role =  localStorage.getItem("Role")
    if (_Id != null && Id == _Id && _Role == Roles.Crew) {
        end_point = '/Inventory';
        ComponentsDropdowns.init();
        discon();
    }else{
        window.location.href='/Auth/SignIn';
    }
  });


// --- Fill Select 2 of Module ---
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        LoadAssests();  
    }
    return {
        init: function () {
            handleSelect2();
        }
    };
}();

function LoadAssests() {
    var $element = $('#txt_assets').select2(); 
    FILLCOMBO('/AdminLovService/GetAssetsLov',$element)
}

// DISCONNECTION FUNCTION
function discon(){
    //Onload();
     CLEAR(); btn_update.hide();btn_save.show()
}

// OPEN MODAL BUTTON EVENT
$('div').on('click', '#openmodal', function (e) {
    CLEAR();btn_update.hide();btn_save.show()
});


// PETHING DATA FUNCTION
function petchdata(response){
    
    $('#txt_id').val(response.id);
    $('#txt_code').val(response.code);
    $('#txt_assets').val(response.item).trigger('change');;
    $('#txt_supplier').val(response.supplier);
    $('#txt_location').val(response.location);
    $('#txt_status').val(response.status);
    $('#txt_price').val(response.price);
    $('#txt_qty').val(response.qty);
    $('#txt_totalprice').val(response.total);
    $('#txt_description').val(response.description);
    var date = moment(response.permitTo).format('YYYY-MM-DD')
    $('#txt_purchasedate').val(moment(response.purchaseDate).format('YYYY-MM-DD'));
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
    var txt_item = $('#txt_assets');   
    var txt_supplier = $('#txt_supplier');   
    var txt_location = $('#txt_location');     
    var txt_status = $('#txt_status');     
    var txt_price = $('#txt_price');     
    var txt_qty = $('#txt_qty');      
    var txt_totalprice = $('#txt_totalprice');      
    var txt_purchasedate = $('#txt_purchasedate');  
    var txt_description = $('#txt_description');     
    var ck_act = $('#ck_act'); 


    if (txt_price.val() == '') {
        ck = 1;
        _Error = 'Please Enter Item Price';
        txt_price.focus();
    }

    if (txt_qty.val() == '') {
        ck = 1;
        _Error = 'Please Enter Item Quantity';
        txt_qty.focus();
    }


    if (txt_purchasedate.val() == '') {
        ck = 1;
        _Error = 'Please Enter Inventory Purchase Date';
        txt_purchasedate.focus();
    }

    if (txt_status.val() == '') {
        ck = 1;
        _Error = 'Please Enter Inventory Current Status';
        txt_status.focus();
    }

    if (txt_location.val() == '') {
        ck = 1;
        _Error = 'Please Enter Inventory Current Location';
        txt_location.focus();
    }

    if (txt_description.val() == '') {
        ck = 1;
        _Error = 'Please Enter Inventory Description';
        txt_description.focus();
    }


    if (txt_supplier.val() == '') {
        ck = 1;
        _Error = 'Please Enter Supplier Name';
        txt_supplier.focus();
    }

    if (txt_item.val() == '') {
        ck = 1;
        _Error = 'Please Enter Inventory Name';
        txt_item.focus();
    }

    if (txt_code.val() == '') {
        ck = 1;
        _Error = 'Please Enter Code ';
        txt_code.focus();
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
            "item": txt_item.val(),
            "supplier": txt_supplier.val(),
            "location": txt_location.val(),
            "status": txt_status.val(),
            "price": txt_price.val(),
            "qty": txt_qty.val(),
            "total": txt_totalprice.val(),
            "purchaseDate": txt_purchasedate.val(),
            "description": txt_description.val(),
            "active": ck_act[0].checked,
            "user": localStorage.getItem("Id")
        });
    }
    return { ckval: ck, creteria: _cre };
}

$('form').on('click', '#btn_scan', function (e) {
    // function onScanSuccess(qrCodeMessage) {
    //     $('#txt_assets').val(qrCodeMessage).trigger('change');
    //     $("#QrScanModal").modal('hide')
    //     //document.getElementById('result').innerHTML = '<span class="result">'+qrCodeMessage+'</span>';
    // }
    // function onScanError(errorMessage) {
    //   //handle scan error
    // }
    // var html5QrcodeScanner = new Html5QrcodeScanner(
    //     "reader", { fps: 10, qrbox: 250 });
    // html5QrcodeScanner.render(onScanSuccess, onScanError);
    function onScanSuccess(qrCodeMessage) {
        $('#txt_assets').val(qrCodeMessage).trigger('change');
        $("#QrScanModal").modal('hide')
        //document.getElementById('result').innerHTML = '<span class="result">'+qrCodeMessage+'</span>';
    }
    function onScanError(errorMessage) {
        // Swal.fire({
        //     title: errorMessage.toString() ,
        //     icon: 'warning',
        //     showConfirmButton: true,
        //     showClass: {
        //         popup: 'animated fadeInDown faster'
        //     },
        //     hideClass: {
        //         popup: 'animated fadeOutUp faster'
        //     }
        // })
    }
    var html5QrcodeScanner = new Html5QrcodeScanner(
        "reader", { fps: 10, qrbox: 250 },
        /* verbose= */ false);
    html5QrcodeScanner.render(onScanSuccess, onScanError);
});

// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;
    $.ajax({
        url: GETAPIURL(end_point + "/GetInventory"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            var action_button = ' ';
            action_button += "<a href='#' class='btn-edit fas fa-edit' data-toggle='tooltip' title='Update'></a> ";
            action_button += " <a href='#' class='btn-delete fas  fa-trash' data-toggle='tooltip' title='Delete()'></a> ";
            if (response != null) {
                $('#data_table').DataTable().clear().destroy();
                $("#data_table").dataTable({
                    data: response.data,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        { data: null,"defaultContent": action_button},
                        { "render": function (data, type, full, meta) { return tbl_row_cnt++; }},
                        { data: 'code' },
                        { data: 'itemName' },
                        { data: 'supplier' },
                        { data: 'description' },
                        { data: 'location' },
                        { data: 'status' },
                        { data: 'price' },
                        { data: 'qty' },
                        { data: 'total' },
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

// ADD BUTTON EVENT
$('form').on('click', '#btn_sav', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    POST(end_point + "/AddInventory",_cre,function () {
        discon();
    });
});

// UPDATE BUTTON EVENT
$('form').on('click', '#btn_upd', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    PUT(end_point + "/UpdateInventory",_cre,function () {
        discon();
    });
});

// EDIT BUTTON EVENT 
$('table').on('click', '.btn-edit', async function (e) { //Edit Start
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _name = data['itemName'];
    btn_update.show();btn_save.hide()
    await GETBYID(end_point + "/GetInventoryById", _id,_name, function (response) {
        petchdata(response)
    })
   
});

// DELETE BUTTON EVENT 
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _Id = data['id'];
    var _name = data['itemName'];
    DELETE(end_point + "/DeleteInventory",_Id,_name,function () {
        Onload();
    })
});



// UPDATE TOTAL
$('form').on('blur', '#txt_price', function (e) {
    var qty,Amount=0
    Amount = e.target.value
    qty =  $('#txt_qty').val()
    $('#txt_totalprice').val(Number(qty)*Number(Amount))
   
});

// UPDATE TOTAL
$('form').on('blur', '#txt_qty', function (e) {
    var qty,Amount=0
    Amount = $('#txt_price').val()
    qty =  e.target.value
    $('#txt_totalprice').val(Number(qty)*Number(Amount))
});

// GET ASSETS TOTAL
$('form').on('change', '#txt_assets', function (e) {
    
    var selectedItem =  e.target.value
    if (selectedItem != 0 || selectedItem != "0") {
        $.ajax({
            url: GETAPIURL("/Assets/GetAssetById"),
            type: "Get",
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("_Id", selectedItem);
            },
            success: function (response) {
                if (response.statusCode == '200') {
                    FillAssetTable(selectedItem,response.data)
                    // $('#txt_location').val(response.data.location);
                    // $('#txt_status').val(response.data.status);
                    // $('#txt_price').val(response.data.price);
                    // $('#txt_purchasedate').val(moment(response.data.purchaseDate).format('YYYY-MM-DD'));
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
    
});



// for filling image table 
function FillAssetTable(selectedItem,response) {
    if (!findValueInRow(response.name)) {
        var row = '<tr>'
        row += '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>'
        row += '<td>'+ response.name +'</td>'
        row += '<td>'+ response.description+'</td>'
        row += '<td>'+ moment(response.procurementDate).format('YYYY-MM-DD') +'</td>'
        row += '<td>'+ response.price+'</td>'
        row += '</tr>'
        $('#asset_table tbody').append(row);
    }else{
       Swal.fire({
            title: "This asset has been added" ,
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
}

function findValueInRow(name) {
    var table = document.getElementById("asset_table");
    var rows = table.rows;
    for (var i = 1; i < rows.length; i++) {
      var cols = rows[i].cells;
      for (var c = 0; c < cols.length; c++) {
        if (cols[c].innerText === name.toString()) {
          return true;
        }
      }
    }
    return false;
  }

// After Add A New Order In The List, If You Want, You Can Remove It.
$(document).on('click', 'a.deleteItem', function (e) {
    Swal.fire({
        title: "Are sure wants to delete",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.value) {
            e.preventDefault();
            var $self = $(this);
            if ($(this).attr('data-itemId') == "0") {
                $(this).parents('tr').css("background-color", "#ff6347").fadeOut(800, function () {
                    $(this).remove();
                });
            }
        }
    })
});


