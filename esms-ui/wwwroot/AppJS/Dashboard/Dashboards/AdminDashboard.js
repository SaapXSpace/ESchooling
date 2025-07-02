
import  {GETAPIURL,FILLCOMBO, GETBYID,POST,PUT,DELETE,CLEAR}  from "../../Service/ApiService.js";
import { Roles,Status } from "../../Service/Security.js";

// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var Id = '';
if (url.has('M')) {
    Id = window.atob(url.get('M'));
}

var txt_monthlyAccoutSummaryMonth = $("#txt_monthlyAccoutSummaryMonth")
var txt_YearlyCertificatesSummaryYear = $("#txt_YearlyCertificatesSummaryYear")

// jQuery CONSTRUCTOR
$(document).ready(function () { 
    var _name = document.getElementById("name")
    _name.innerText ="WELCOME " + LoginUser.toUpperCase();
   
    CardsOnload();
    var currentDate = new Date().toISOString();
    txt_monthlyAccoutSummaryMonth.val(moment(currentDate).format("yyyy-MM"));
    txt_YearlyCertificatesSummaryYear.val(moment(currentDate).format("yyyy-MM"));
    YearlyCertificatesSummaryOnload(currentDate);
    MonthlyAccountSummaryOnload(currentDate);
    CourseCoveredSummaryOnload();
});

txt_monthlyAccoutSummaryMonth.on('change',function (e) {
    if (txt_monthlyAccoutSummaryMonth.val() != null && txt_monthlyAccoutSummaryMonth.val() != "" && txt_monthlyAccoutSummaryMonth.val() != undefined ) {
        MonthlyAccountSummaryOnload(txt_monthlyAccoutSummaryMonth.val())
    }else{
        Swal.fire({
            title: "Select month for filteration",
            icon: 'warning',
        });
    }
})

txt_YearlyCertificatesSummaryYear.on('change',function (e) {
    console.log(txt_YearlyCertificatesSummaryYear.val())
    if (txt_YearlyCertificatesSummaryYear.val() != null && txt_YearlyCertificatesSummaryYear.val() != "" && txt_YearlyCertificatesSummaryYear.val() != undefined ) {
        YearlyCertificatesSummaryOnload(txt_YearlyCertificatesSummaryYear.val())
    }else{
        Swal.fire({
            title: "Select year for filteration",
            icon: 'warning',
        });
    }
})

//============================
//      ONLOAD FUNCTION
//============================
function CardsOnload() {
    if (Id == null || Id == undefined || Id == "" || Id == '') {
            window.location.href='/Dashboard/Dashboards/IndexDashboard';
        }
    $.ajax({
        url: GETAPIURL("/api/v1/DashboardService/GetAdminDashboardCardsCounts"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('_MenuId', Id.toString());
        },
        success: function (response) {
            console.log(response)
            if (response.statusCode === "401" || response.statusCode === "403") {
                window.location.href='/Dashboard/Dashboards/IndexDashboard';
            }
            if (response != null && response.data != null) {

                document.getElementById("txt_total_user").innerHTML = response.data.totalUser;
                document.getElementById("txt_active_user").innerHTML = response.data.totalActiveUser;
                document.getElementById("txt_total_student").innerHTML = response.data.totalStudent;
                document.getElementById("txt_active_student").innerHTML = response.data.totalActiveStudent;
                document.getElementById("txt_total_course").innerHTML = response.data.totalCourses;
                document.getElementById("txt_total_certificate").innerHTML = response.data.totalCertificates;
                document.getElementById("txt_income").innerHTML = response.data.todayIncome;
                document.getElementById("txt_expence").innerHTML = response.data.todayExpence;

                //certificate

                
                document.getElementById("current_day_count").innerHTML = response.data.certificateCardDetail.currentDateValue;
                document.getElementById("current_day_date").innerHTML = moment(response.data.certificateCardDetail.currentDate).format("DD-MMM-YYYY") ;
                document.getElementById("second_day_count").innerHTML = response.data.certificateCardDetail.secondDateValue;
                document.getElementById("second_day_date").innerHTML = moment(response.data.certificateCardDetail.secondDate).format("DD-MMM-YYYY") ;
                document.getElementById("third_day_count").innerHTML = response.data.certificateCardDetail.thirdDateValue;
                document.getElementById("third_day_date").innerHTML = moment(response.data.certificateCardDetail.thirdDate).format("DD-MMM-YYYY") ;
                document.getElementById("forth_day_count").innerHTML = response.data.certificateCardDetail.forthDateValue;
                document.getElementById("forth_day_date").innerHTML = moment(response.data.certificateCardDetail.forthDate).format("DD-MMM-YYYY") ;
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

    var maxDataValue = Math.max.apply(Math, data.certificatesCount);
var maxYAxisValue = Math.ceil(maxDataValue / 100) * 100 + 20; // Round up to the nearest 100 and add 100

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
            formatter: function(val) {
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
        colors: ["#203a45"],
        yaxis: {
            max: maxYAxisValue, // Set the maximum value of the y-axis
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
                formatter: function(val) {
                    return val;
                }
            }

        }
    }
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


