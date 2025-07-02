import  {GETAPIURL,FILLCOMBO,FILLCOMBOFILTER, GETBYID,POST,PUT,DELETE,CLEAR}  from "../Service/ApiService.js";

// INITIALIZING VARIBALES
var end_point;
var btn_save = $('#btn_sav')
var btn_update = $('#btn_upd')

// jQuery CONSTRUCTOR
$(document).ready(function () {    
    
});

import { Roles,Status } from "../Service/Security.js";

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
    
    if (_Id != null && Id == _Id && _Role == Roles.Requester) {
        var _name = document.getElementById("name")
        var detail = document.getElementById("detail")
 
         _name.innerText ="Welcome Back " + localStorage.getItem("UserName")
        end_point = '/Requests';
        ComponentsDropdowns.init();
        discon()
    }else{
        window.location.href='/Auth/SignIn';
    }
  });


// --- Fill Select 2 of Module ---
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        LoadAssests();  
        LoadUser();
        LoadComplainType();
        LoadDepartment();
    }
    return {
        init: function () {
            handleSelect2();
        }
    };
}();

function LoadComplainType() {
    var $element = $('#txt_comtype').select2(); 
    FILLCOMBO('/RequesterLovService/GetRequestTypeLov',$element)
}

function LoadDepartment() {
    var $element = $('#txt_department').select2(); 
    FILLCOMBO('/RequesterLovService/GetDepartmentLov',$element)
}


function LoadAssests() {
    $('#txt_asset').select2()
    var $element = $('#txt_asset').select2(); 
    FILLCOMBO('/RequesterLovService/GetAssetsLov',$element)
}

function LoadUser() {
   
}

// DISCONNECTION FUNCTION
function discon(){
    Onload(); CLEAR(); btn_update.hide();btn_save.show()
}

$('#txt_department').on('change', function(event) {
    $('#txt_user').select2().empty();
    var $element = $('#txt_user').select2();
    //var Id = event.params.data.id;
    var Id = event.target.value;
    
    if (Id != 0) {
        FILLCOMBOFILTER('/RequesterLovService/GetManagerLov',$element,Id)
    } 
    
});

// OPEN MODAL BUTTON EVENT
$('div').on('click', '#openmodal', function (e) {
    CLEAR();btn_update.hide();btn_save.show()
    $('#txt_asset').val(0).trigger('change');
    $('#txt_comtype').val(0).trigger('change');
    $('#txt_department').val(0).trigger('change');
    $('#txt_user').val(0).trigger('change');
    var current_date = moment(new Date()).format('YYYY-MM-DD')
    $('#txt_date').val(current_date);   
});



// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;
    $.ajax({
        url: GETAPIURL(end_point + "/GetRequest"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("_User", localStorage.getItem("Id"));
        },
        success: function (response) {
            
            
            if (response.data != null) {
                $("#txt_code").val(Number(response.data[0].lastCode + 1))
            }else{
                $("#txt_code").val(1)
            }

            var action_edit = ' ';
            var action_delete = ''
            
            action_edit = "<a href='#' class='btn-edit fas fa-edit' data-toggle='tooltip' title='Changes'></a> ";
            action_delete = " <a href='#' class='btn-delete fas  fa-times' data-toggle='tooltip' title='Cencel Request'></a> ";
            if (response != null) {
                $('#data_table').DataTable().clear().destroy();
                $("#data_table").dataTable({
                    data: response.data,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        { data: 'approved','render': function (data, type, full, meta) {if (!data) {return action_edit + " " + action_delete; }else { return ""; }  }},
                        //{ data: null,"defaultContent":  action_button},
                        { "render": function (data, type, full, meta) { return tbl_row_cnt++; }},
                        // { data: 'code' },
                        { data: 'assetName' },
                        { data: 'userName' },
                        { data: 'date','render': function (data, type, full, meta) {return moment(data).format('DD - MMMM - YYYY')}},
                        { data: 'approved','render': function (data, type, full, meta) {if (data) {return '✔'; }else { return '✘'; }  }},
                        { data: 'approvedByName' },
                        { data: 'status' }
                        //{ data: 'active','render': function (data, type, full, meta) {if (data) {return '✔'; }else { return '✘'; }  }},
                    ],
                    "order": [[0, "asc"]],
                    "pageLength": 10,
                });

                document.getElementById('txt_total').innerHTML = response.data == null ? 0 :response.data.length  ;
                document.getElementById('txt_pending').innerHTML = response.data == null ? 0 : response.data.filter(s => s.status == Status.Pending).length;
                document.getElementById('txt_assign').innerHTML = response.data == null ? 0 :  response.data.filter(s => s.status == Status.Assigned).length;
                document.getElementById('txt_completed').innerHTML = response.data == null ? 0 :   response.data.filter(s => s.status == Status.Completed).length;
                
                
            
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

// VALIDATION FUNCTION
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '' ,id='';
    var txt_id = $('#txt_id');  
    var txt_code = $('#txt_code');   
    var txt_asset = $('#txt_asset');   
    var txt_user = $('#txt_user');   
    var txt_comtype = $('#txt_comtype');   
    var txt_department = $('#txt_department');   
    var txt_remark = $('#txt_remark');   
    var txt_date = $('#txt_date');   
 
    var ck_act = $('#ck_act'); 


    

    if (txt_user.val() == '' || txt_user.val() == 0) {
        ck = 1;
        _Error = 'Select User ';
        txt_user.focus();
    }

    if (txt_asset.val() == '' ||  txt_asset.val() == 0) {
        ck = 1;
        _Error = 'Select Asset';
        txt_asset.focus();
    }

    if (txt_comtype.val() == '' || txt_comtype.val() == 0) {
        ck = 1;
        _Error = '= Select Complain Type ';
        txt_asset.focus();
    }

    
    if (txt_department.val() == '' || txt_department.val() == 0) {
        ck = 1;
        _Error = 'Select Department  ';
        txt_asset.focus();
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
            "id": id,    //GUID
            "code": txt_code.val(), //Int
            "assetId": txt_asset.val(), // GUID FK_ASSET
            "requestTypeId": txt_comtype.val(), // GUID FK_ASSET
            "remarks": txt_remark.val(), // GUID FK_ASSET
            "userId": txt_user.val(), // GUID FK_USER
            "date": txt_date.val(), // DATE
            "active": true,        // BOOL
            "user": localStorage.getItem("Id")
        });
    }
    return { ckval: ck, creteria: _cre };
}

// UPDATE BUTTON EVENT
$('form').on('click', '#btn_upd', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    PUT(end_point + "/UpdateRequest",_cre,function () {
        discon();
    });
});

// ADD BUTTON EVENT
$('form').on('click', '#btn_sav', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    POST(end_point + "/AddRequest",_cre,function () {
        discon();
    });
});

// EDIT BUTTON EVENT 
$('table').on('click', '.btn-edit', async function (e) { //Edit Start
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _name = "the Request of "+ data['code'] +" - "+ data['assetName'] ;
    btn_update.show();btn_save.hide()
    await GETBYID(end_point + "/GetRequestById", _id,_name, function (response) {
        petchdata(response)
    })
   
});

// PETHING DATA FUNCTION
function petchdata(response){
    btn_update.show()
    $('#txt_id').val(response.id);
    $('#txt_code').val(response.code);
    $('#txt_remark').val(response.remarks);
    $('#txt_asset').val(response.assetId).trigger('change');
    $('#txt_department').val(response.departmentId).trigger('change');
    setTimeout(() => {
        $('#txt_user').val(response.userId).trigger('change');
    }, 500);
    
    $('#txt_comtype').val(response.requestTypeId).trigger('change');
    $('#txt_date').val(moment(response.date).format('YYYY-MM-DD'));
    
    $('#data_Model').modal();
}

// CANCEL BUTTON EVENT 
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _Id = data['id'];
    var _name = "the Request of "+ data['code'] +" - "+ data['assetName'] ;
    DELETE(end_point + "/DeleteRequest",_Id,_name,function () {
        Onload();
    })
});


var card_total = document.getElementById("card_total")
card_total.addEventListener("click", function() {
    var searchBox = document.getElementsByClassName("dataTables_filter")[0].getElementsByTagName("input")[0];
    searchBox.value = ""
    var event = new Event('keyup');
    searchBox.dispatchEvent(event);
});

var card_pending = document.getElementById("card_pending")
card_pending.addEventListener("click", function() {
    var searchBox = document.getElementsByClassName("dataTables_filter")[0].getElementsByTagName("input")[0];
    searchBox.value = Status.Pending.toString()
    var event = new Event('keyup');
    searchBox.dispatchEvent(event);
});

var card_Assigned = document.getElementById("card_Assigned")
card_Assigned.addEventListener("click", function() {
    var searchBox = document.getElementsByClassName("dataTables_filter")[0].getElementsByTagName("input")[0];
    searchBox.value = Status.Assigned.toString()
    var event = new Event('keyup');
    searchBox.dispatchEvent(event);
});

var card_Completed = document.getElementById("card_Completed")
card_Completed.addEventListener("click", function() {
    var searchBox = document.getElementsByClassName("dataTables_filter")[0].getElementsByTagName("input")[0];
    searchBox.value = Status.Completed.toString()
    var event = new Event('keyup');
    searchBox.dispatchEvent(event);
});












// $(function() {
//     $('#datatables-dashboard-products').DataTable({
//         pageLength: 6,
//         lengthChange: false,
//         bFilter: false,
//         autoWidth: false
//     });
// });
// $(function() {
//     $("#usa_map").vectorMap({
//         map: "us_aea",
//         backgroundColor: "transparent",
//         zoomOnScroll: false,
//         normalizeFunction: "polynomial",
//         hoverOpacity: .7,
//         hoverColor: false,
//         regionStyle: {
//             initial: {
//                 fill: "#DCE3E8"
//             }
//         },
//         markerStyle: {
//             initial: {
//                 "r": 9,
//                 "fill": window.theme.primary,
//                 "fill-opacity": .9,
//                 "stroke": "#fff",
//                 "stroke-width": 7,
//                 "stroke-opacity": .4
//             },
//             hover: {
//                 "stroke": "#fff",
//                 "fill-opacity": 1,
//                 "stroke-width": 1.5
//             }
//         },
//         markers: [{
//             latLng: [37.77, -122.41],
//             name: "San Francisco: 375"
//         }, {
//             latLng: [40.71, -74.00],
//             name: "New York: 350"
//         }, {
//             latLng: [39.09, -94.57],
//             name: "Kansas City: 250"
//         }, {
//             latLng: [36.16, -115.13],
//             name: "Las Vegas: 275"
//         }, {
//             latLng: [32.77, -96.79],
//             name: "Dallas: 225"
//         }]
//     });
//     setTimeout(function() {
//         $(window).trigger('resize');
//     }, 350)
// })
// $(function() {
//     // Bar chart
//     new Chart(document.getElementById("chartjs-dashboard-bar-alt"), {
//         type: "bar",
//         data: {
//             labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//             datasets: [{
//                 label: "Last year",
//                 backgroundColor: window.theme.primary,
//                 borderColor: window.theme.primary,
//                 hoverBackgroundColor: window.theme.primary,
//                 hoverBorderColor: window.theme.primary,
//                 data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79],
//                 barPercentage: .75,
//                 categoryPercentage: .5
//             }, {
//                 label: "This year",
//                 backgroundColor: "#E8EAED",
//                 borderColor: "#E8EAED",
//                 hoverBackgroundColor: "#E8EAED",
//                 hoverBorderColor: "#E8EAED",
//                 data: [69, 66, 24, 48, 52, 51, 44, 53, 62, 79, 51, 68],
//                 barPercentage: .75,
//                 categoryPercentage: .5
//             }]
//         },
//         options: {
//             maintainAspectRatio: false,
//             legend: {
//                 display: false
//             },
//             scales: {
//                 yAxes: [{
//                     gridLines: {
//                         display: false
//                     },
//                     stacked: false,
//                     ticks: {
//                         stepSize: 20
//                     }
//                 }],
//                 xAxes: [{
//                     stacked: false,
//                     gridLines: {
//                         color: "transparent"
//                     }
//                 }]
//             }
//         }
//     });
// });
// $(function() {
//     // Line chart
//     new Chart(document.getElementById("chartjs-dashboard-line"), {
//         type: 'line',
//         data: {
//             labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//             datasets: [{
//                     label: "Orders",
//                     fill: true,
//                     backgroundColor: window.theme.primary,
//                     borderColor: window.theme.primary,
//                     borderWidth: 2,
//                     data: [3, 2, 3, 5, 6, 5, 4, 6, 9, 10, 8, 9]
//                 },
//                 {
//                     label: "Sales ($)",
//                     fill: true,
//                     backgroundColor: "rgba(0, 0, 0, 0.05)",
//                     borderColor: "rgba(0, 0, 0, 0.05)",
//                     borderWidth: 2,
//                     data: [5, 4, 10, 15, 16, 12, 10, 13, 20, 22, 18, 20]
//                 }
//             ]
//         },
//         options: {
//             maintainAspectRatio: false,
//             legend: {
//                 display: false
//             },
//             tooltips: {
//                 intersect: false
//             },
//             hover: {
//                 intersect: true
//             },
//             plugins: {
//                 filler: {
//                     propagate: false
//                 }
//             },
//             elements: {
//                 point: {
//                     radius: 0
//                 }
//             },
//             scales: {
//                 xAxes: [{
//                     reverse: true,
//                     gridLines: {
//                         color: "rgba(0,0,0,0.0)"
//                     }
//                 }],
//                 yAxes: [{
//                     ticks: {
//                         stepSize: 5
//                     },
//                     display: true,
//                     gridLines: {
//                         color: "rgba(0,0,0,0)",
//                         fontColor: "#fff"
//                     }
//                 }]
//             }
//         }
//     });
// });
