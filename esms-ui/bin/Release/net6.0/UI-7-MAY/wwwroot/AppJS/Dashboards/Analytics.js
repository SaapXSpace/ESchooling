
import  {GETAPIURL,FILLCOMBO, GETBYID,POST,PUT,DELETE,CLEAR}  from "../Service/ApiService.js";
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
    
    if (_Id != null && Id == _Id && _Role == Roles.Admin) {
        //end_point = '/Assets';
        var _name = document.getElementById("name")
        var detail = document.getElementById("detail")
 
         _name.innerText ="Welcome Back " + localStorage.getItem("UserName")
        Onload();
        //CardsOnload();
    }else{
        window.location.href='/Auth/SignIn';
    }
  });

// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;
    $.ajax({
        url: GETAPIURL("/AdminLovService/GetDasboardRequests"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                $('#data_table').DataTable().clear().destroy();
                $("#data_table").dataTable({
                    data: response.data,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        { "render": function (data, type, full, meta) { return tbl_row_cnt++; }},
                        { data: 'assetName' },
                        { data: 'requestType' },
                        { data: 'requestUser' },
                        { data: 'requestDate','render': function (data, type, full, meta) {return moment(data).format('LLLL') }},
                        { data: 'requestStatus' },
                        { data: 'approved','render': function (data, type, full, meta) {if (data) {return '✔'; }else { return '✘'; }  }},
                        { data: 'approvedByName','render': function (data, type, full, meta) {if (data != null) {return data; }else { return 'N.A'; }  }},
                        { data: 'approvedDate','render': function (data, type, full, meta) {if (data) { return moment(data).format('LLLL') } else { return "N.A"}}},
                        { data: 'assignUser' },
                        { data: 'remarks' },
                       
                    ],
                    "order": [[4, "desc"]],
                    "pageLength": 5,
                });
                    if (response.data != null) {
                        $("#txt_code").val(Number(response.data[0].lastCode + 1))  
                    }else{
                        $("#txt_code").val(Number(1))
                    }

                    document.getElementById('txt_total').innerHTML = response.data == null ? 0 :response.data.length  ;
                    document.getElementById('txt_pending').innerHTML = response.data == null ? 0 : response.data.filter(s => s.requestStatus == Status.Pending).length;
                    document.getElementById('txt_assign').innerHTML = response.data == null ? 0 :  response.data.filter(s => s.requestStatus == Status.Assigned).length;
                    document.getElementById('txt_completed').innerHTML = response.data == null ? 0 :   response.data.filter(s => s.requestStatus == Status.Completed).length;
                
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



// ONLOAD FUNCTION
function CardsOnload() {
    $.ajax({
        url: GETAPIURL("/AdminLovService/GetDasboardCards"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {

           document.getElementById("txt_total_visitor").innerHTML = response.data.totalVisitor;
           document.getElementById("txt_total_active_user").innerHTML = response.data.totalActiveUser;
           document.getElementById("txt_total_users").innerHTML = response.data.totalUser;
           document.getElementById("txt_total_inactive_user").innerHTML = response.data.totalInActiveUser;
           document.getElementById("txt_total_assets").innerHTML = response.data.totalAsset;
           document.getElementById("txt_total_active_assets").innerHTML = response.data.totalActiveAsset;
           document.getElementById("txt_total_inactive_assets").innerHTML = response.data.totalInActiveAsset;
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

// var API=''
// $(function() {
//     $("#datatables-dashboard-traffic").DataTable({
//         pageLength: 7,
//         lengthChange: false,
//         bFilter: false,
//         autoWidth: false,
//         order: [
//             [1, "desc"]
//         ]
//     });
// });
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
//     // Radar chart
//     new Chart(document.getElementById("chartjs-dashboard-radar"), {
//         type: "radar",
//         data: {
//             labels: ["Technology", "Sports", "Media", "Gaming", "Arts"],
//             datasets: [{
//                 label: "Interests",
//                 backgroundColor: "rgba(0, 123, 255, 0.2)",
//                 borderColor: "#2979ff",
//                 pointBackgroundColor: "#2979ff",
//                 pointBorderColor: "#fff",
//                 pointHoverBackgroundColor: "#fff",
//                 pointHoverBorderColor: "#2979ff",
//                 data: [70, 53, 82, 60, 33]
//             }]
//         },
//         options: {
//             maintainAspectRatio: false,
//             legend: {
//                 display: false
//             }
//         }
//     });
// });
// $(function() {
//     // Pie chart
//     new Chart(document.getElementById("chartjs-dashboard-pie"), {
//         type: 'pie',
//         data: {
//             labels: ["Chrome", "Firefox", "IE", "Other"],
//             datasets: [{
//                 data: [4401, 4003, 1589],
//                 backgroundColor: [
//                     window.theme.primary,
//                     window.theme.warning,
//                     window.theme.danger,
//                     "#E8EAED"
//                 ],
//                 borderColor: "transparent"
//             }]
//         },
//         options: {
//             responsive: !window.MSInputMethodContext,
//             maintainAspectRatio: false,
//             legend: {
//                 display: false
//             },
//             cutoutPercentage: 75
//         }
//     });
// });
// $(function() {
//     var mapData = {
//         "US": 298,
//         "SA": 200,
//         "DE": 220,
//         "FR": 540,
//         "CN": 120,
//         "AU": 760,
//         "BR": 550,
//         "IN": 200,
//         "GB": 120,
//     };
//     $('#world_map').vectorMap({
//         map: 'world_mill',
//         backgroundColor: "transparent",
//         zoomOnScroll: false,
//         regionStyle: {
//             initial: {
//                 fill: '#e4e4e4',
//                 "fill-opacity": 0.9,
//                 stroke: 'none',
//                 "stroke-width": 0,
//                 "stroke-opacity": 0
//             }
//         },
//         series: {
//             regions: [{
//                 values: mapData,
//                 scale: [window.theme.primary],
//                 normalizeFunction: 'polynomial'
//             }]
//         },
//     });
//     setTimeout(function() {
//         $(window).trigger('resize');
//     }, 350)
// })