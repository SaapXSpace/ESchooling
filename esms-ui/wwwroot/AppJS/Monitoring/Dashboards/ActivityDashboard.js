
import  {GETAPIURL,FILLCOMBO, GETBYID,POST,PUT,DELETE,CLEAR}  from "../../Service/ApiService.js";
import { Roles,Status } from "../../Service/Security.js";

// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var Id = '';
if (url.has('M')) {
    Id = window.atob(url.get('M'));
}

var txt_from = $("#txt_from")

// jQuery CONSTRUCTOR
$(document).ready(function () { 
    var currentDate = new Date();
    txt_from.val(moment(currentDate).format("yyyy-MM-DD"));
    LoginAuditStatisticsOnload(moment(currentDate).format("yyyy-MM-DD"))
    DailyRecordTransactionOnload(moment(currentDate).format("yyyy-MM-DD"))
});

txt_from.on('change',function (e) {
    if (txt_from.val() != null && txt_from.val() != "" && txt_from.val() != undefined ) {
        LoginAuditStatisticsOnload(moment( txt_from.val()).format("yyyy-MM-DD"))
        DailyRecordTransactionOnload(moment( txt_from.val()).format("yyyy-MM-DD"))
    }else{
        Swal.fire({
            title: "Select date for filteration",
            icon: 'warning',
        });
    }
})

//============================
//      ONLOAD FUNCTION
//============================
function LoginAuditStatisticsOnload(_date) {
    $.ajax({
        url: GETAPIURL("/api/v1/DashboardService/GetLoginAuditStatistics"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('_date',_date);
        },
        success: function (response) {
            console.log(response)
            if (response != null && response.data != null) {
                $('#login_datatable').DataTable().clear().destroy();
                var datatablesButtons = $("#login_datatable").DataTable({
                    data: response.data,
                    destroy: true,
                    retrieve: true,
                    processing: true,
                    lengthChange:!1,
                    columns: [
                        { data: 'name' },
                        { data: 'loginCount' },
                        { data: 'loginPercentage','render': function (data, type, full, meta) {if (data != null) {
                            return ` <td class="d-none d-xl-table-cell">
                                        <div class="progress">
                                            <div class="progress-bar bg-primary-dark" role="progressbar" style="width: ${data}%;" aria-valuenow="${data}"
                                                aria-valuemin="0" aria-valuemax="100">${data}%</div>
                                        </div>
                                    </td>`; 
                        }else {
                             return ` <td class="d-none d-xl-table-cell">
                                    <div class="progress">
                                        <div class="progress-bar bg-primary-dark" role="progressbar" style="width: ${0}%;" aria-valuenow="${0}"
                                            aria-valuemin="0" aria-valuemax="100">${0}%</div>
                                    </div>
                                </td>`;  
                            }  
                        }},
                    ],
                    "order": [[1, "desc"]],
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

//============================
//      ONLOAD FUNCTION
//============================
function DailyRecordTransactionOnload(_date) {
    console.log(_date)
    $.ajax({
        url: GETAPIURL("/api/v1/DashboardService/GetDailyRecordActivity"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('_date',_date);
        },
        success: function (response) {
            console.log(response)
            if (response != null && response.data != null) {
                $('#record_datatable').DataTable().clear().destroy();
                var datatablesButtons = $("#record_datatable").DataTable({
                    data: response.data,
                    destroy: true,
                    retrieve: true,
                    processing: true,
                    lengthChange:!1,
                    columns: [
                        { data: 'table' },
                        {
                            data: 'action',
                            render: function(data, type, full, meta) {
                                var statusHTML = '';
                                if (data === "Add") {
                                    statusHTML = '<span class="badge badge-success d-inline">' + data + ' Record </span>'
                                } else if (data === "Update") {
                                    statusHTML = '<span class="badge badge-dark d-inline">' +data+' Record </span>';
                                } else {
                                    statusHTML = '<span class="badge badge-danger d-inline">'+data+' Record </span>';
                                }
                                return statusHTML 
                            }
                        },
                        { data: 'user' },
                        { data: 'date' },
                        
                    ],
                    // "order": [[1, "desc"]],
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

//============================
//     MONTHLY ACCOUNTS
//============================
function MonthlyAccountSummaryOnload(month) {
    $.ajax({
        url: GETAPIURL("/api/v1/DashboardService/GetAdminDashboardMonthlyAccountSummary"),
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('month', month);
        },
        success: function (response) {
            if (response != null && response.data != null) {
                MonthlyExpenceIncomeChart(response.data) 
            }
        },
        error: function (xhr, status, err) {
            Swal.fire({
                title: xhr.status.toString() + ' #' + status + '\n' + xhr.responseText,
                width: 800,
                icon: 'error',
                showConfirmButton: true,
                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });
        }
    });
    return true;
}

//============================
//      COURSE COVERED
//============================
function CourseCoveredSummaryOnload() {
    $.ajax({
        url: GETAPIURL("/api/v1/DashboardService/GetAdminDashboardCourseSummary"),
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
        },
        success: function (response) {
            if (response != null && response.data != null) {
                CourseCoveredPieChart(response.data)

                
            }
        },
        error: function (xhr, status, err) {
            Swal.fire({
                title: xhr.status.toString() + ' #' + status + '\n' + xhr.responseText,
                width: 800,
                icon: 'error',
                showConfirmButton: true,
                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });
        }
    });
    return true;
}

//============================
//    YEARLY CERTIFICATES
//============================
function YearlyCertificatesSummaryOnload(year) {
    $.ajax({
        url: GETAPIURL("/api/v1/DashboardService/GetAdminDashboardYearlyCertificatesSummary"),
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('year', year);
        },
        success: function (response) {
            if (response != null && response.data != null) {
                YearlyCertificatesChart(response.data)
            }
        },
        error: function (xhr, status, err) {
            Swal.fire({
                title: xhr.status.toString() + ' #' + status + '\n' + xhr.responseText,
                width: 800,
                icon: 'error',
                showConfirmButton: true,
                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });
        }
    });
    return true;
}

//============================
//  MONTHLY ACCOUNT CHART
//============================
function MonthlyExpenceIncomeChart(data) {
    if (!data || !data.net || !data.income || !data.expence || !data.dates) {
        Swal.fire({
            title: "Invalid data provided.",
            icon: 'warning',
        });
        return;
    }

    var options = {
        chart: {
            height: 350,
            type: "bar",
        },
        plotOptions: {
            bar: {
                horizontal: false,
                endingShape: "rounded",
                columnWidth: "80%",
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ["transparent"]
        },
        series: [{
            name: "NET",
            data: data.net != null ? data.net : [] 
        }, {
            name: "INCOME",
            data: data.income != null ? data.income : []
        }, {
            name: "EXPENCE",
            data: data.expence != null ? data.expence : []
        }],
        xaxis: {
            categories: data.dates != null ? data.dates : [],
        },
        yaxis: {
            title: {
                text: "AMOUNT"
            }
        },
        fill: {
            opacity: 1
        },
        colors: [ "#2C5F2D", "#203a45", "#FEB019"], 
        tooltip: {
            y: {
                formatter: function(val) {
                    return "💸 " + val + " PKR "
                }
            }
        }
    }

    var existingChart = document.querySelector("#apexcharts-column");
    if (existingChart) {
        existingChart.innerHTML = ''; 
    }

    setTimeout(() => {
        var chart = new ApexCharts(
            document.querySelector("#apexcharts-column"),
            options
        );
        chart.render();
    }, 100);

    
}

//============================
//  MONTHLY ACCOUNT CHART
//============================
function CourseCoveredPieChart(data) {
   
    var series = data.map(function(item) {
        return item.coursePercentage.toFixed(2);
    });
    
    var labels = data.map(function(item) {
        return item.categoryName;
    });

    new Chart(document.getElementById("apexcharts-department"), {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: series,
                backgroundColor: [
                    "#203a45",
                    "#97BC62FF",
                    "#2C5F2D",
                    "#00203FFF",
                    "#229e9f",
                    "#ADEFD1FF"
                ],
                borderColor: "transparent"
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var currentValue = dataset.data[tooltipItem.index];
                        var label = data.labels[tooltipItem.datasetIndex];
                        return label + ': ' + currentValue + '%';
                    }
                }
            }
        }
    });

    
}

//=============================
//  YEARLY CERTIFICATE CHART
//=============================
function YearlyCertificatesChart(data) {
    var options = {
        series: [{
        name: 'Certificate',
        data: data.certificatesCount
      }],
        chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val;
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },
      
      xaxis: {
        categories: data.months,
        position: 'top',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        }
      },
      colors: [ "#203a45"], 
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val ;
          }
        }
      
      },
    //   title: {
    //     // text: 'Monthly Inflation in Argentina, 2002',
    //     floating: true,
    //     offsetY: 330,
    //     align: 'center',
    //     style: {
    //       color: '#444'
    //     }
    //   }
    };

    var existingChart = document.querySelector("#apexcharts-certificates");
    if (existingChart) {
        existingChart.innerHTML = ''; 
    }

    var chart = new ApexCharts(document.querySelector("#apexcharts-certificates"), options);
    chart.render();
}

// var card_total = document.getElementById("card_total")
// card_total.addEventListener("click", function() {
//     var searchBox = document.getElementsByClassName("dataTables_filter")[0].getElementsByTagName("input")[0];
//     searchBox.value = ""
//     var event = new Event('keyup');
//     searchBox.dispatchEvent(event);
// });

// var card_pending = document.getElementById("card_pending")
// card_pending.addEventListener("click", function() {
//     var searchBox = document.getElementsByClassName("dataTables_filter")[0].getElementsByTagName("input")[0];
//     searchBox.value = Status.Pending.toString()
//     var event = new Event('keyup');
//     searchBox.dispatchEvent(event);
// });

// var card_Assigned = document.getElementById("card_Assigned")
// card_Assigned.addEventListener("click", function() {
//     var searchBox = document.getElementsByClassName("dataTables_filter")[0].getElementsByTagName("input")[0];
//     searchBox.value = Status.Assigned.toString()
//     var event = new Event('keyup');
//     searchBox.dispatchEvent(event);
// });

// var card_Completed = document.getElementById("card_Completed")
// card_Completed.addEventListener("click", function() {
//     var searchBox = document.getElementsByClassName("dataTables_filter")[0].getElementsByTagName("input")[0];
//     searchBox.value = Status.Completed.toString()
//     var event = new Event('keyup');
//     searchBox.dispatchEvent(event);
// });


