import  {GETAPIURL,FILLCOMBO, GETBYID,POST,PUT,DELETE,CLEAR, FILLCOMBOUSER}  from "../Service/ApiService.js";

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
    
    if (_Id != null && Id == _Id && _Role == Roles.Manager) {
        end_point = '/AssignRequests';
        ComponentsDropdowns.init();
        discon()
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
        LoadRequest();  
        LoadCrew();
    }
    return {
        init: function () {
            handleSelect2();
        }
    };
}();

function LoadRequest() {
    var $element = $('#txt_request').select2(); 
    FILLCOMBOUSER('/ManagerLovService/GetRequestLov',$element)
}

function LoadCrew() {
    var $element = $('#txt_crew').select2(); 
    FILLCOMBO('/ManagerLovService/GetCrewLov',$element)
}

// DISCONNECTION FUNCTION
function discon(){
    Onload(); CLEAR(); btn_update.hide();btn_save.show()
}


// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;
    $.ajax({
        url: GETAPIURL(end_point + "/GetAssignRequest"),
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

            var action_button = ' ';
            action_button += "<a href='#' class='btn-assign fas fa-edit' data-toggle='tooltip' title='Changes'></a> ";
            action_button += " <a href='#' class='btn-delete fas  fa-times' data-toggle='tooltip' title='Cencel Request'></a> ";
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
                        { data: 'assetName' },
                        { data: 'requestUser' },
                        { data: 'requestDate','render': function (data, type, full, meta) {return moment(data).format('DD - MMMM - YYYY')}},
                        { data: 'approved','render': function (data, type, full, meta) {if (data) {return '✔'; }else { return '✘'; }  }},
                        { data: 'userName' },
                        { data: 'date','render': function (data, type, full, meta) {return moment(data).format('DD - MMMM - YYYY')}},
                        { data: 'status' }
                        //{ data: 'active','render': function (data, type, full, meta) {if (data) {return '✔'; }else { return '✘'; }  }},
                    ],
                    "order": [[0, "asc"]],
                    "pageLength": 10,
                });
                
                
            
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
    var txt_asset = $('#txt_request');   
    var txt_user = $('#txt_crew');   
    var txt_date = $('#txt_date');   
    var ck_approved = $('#ck_approved'); 
    
    if (txt_user.val() == '') {
        ck = 1;
        _Error = 'Please Select User';
        txt_user.focus();
    }

    if (txt_asset.val() == '') {
        ck = 1;
        _Error = 'Please Select Asset ';
        txt_asset.focus();
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
            "requestId": txt_asset.val(),
            "assignUserId": txt_user.val(),
            "date": txt_date.val(),
            "approved": ck_approved[0].checked,
            "active": true,
            "user": localStorage.getItem("Id")
        });
    }
    
    return { ckval: ck, creteria: _cre };
}



// ADD BUTTON EVENT
$('form').on('click', '#btn_sav', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    POST(end_point + "/AddAssignRequest",_cre,function () {
        discon();
    });
});

// EDIT BUTTON EVENT 
$('table').on('click', '.btn-assign', async function (e) { //Edit Start
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _name = data['assetName'];
    Swal.fire({
        title: 'Are sure wants to Assing the Request of <br/>' + _name + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Edit',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            CLEAR();btn_update.hide();btn_save.show()
            $('#txt_request').val(_id).trigger('change');
            $('#txt_crew').val(0).trigger('change');
            var current_date = moment(new Date()).format('YYYY-MM-DD')
            $('#txt_date').val(current_date); 
            $('#data_Model').modal();  
        }
        
    })
   
});

// PETHING DATA FUNCTION
function petchdata(response){
    CLEAR();btn_update.hide();btn_save.show()
    $('#txt_request').val(response.id).trigger('change');
    //$('#txt_crew').val(0).trigger('change');
    var current_date = moment(new Date()).format('YYYY-MM-DD')
    $('#txt_date').val(current_date);   
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
