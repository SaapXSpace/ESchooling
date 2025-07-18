
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
//     // Bar chart
//     new Chart(document.getElementById("chartjs-dashboard-bar"), {
//         type: 'bar',
//         data: {
//             labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//             datasets: [{
//                 label: "This year",
//                 backgroundColor: window.theme.primary,
//                 borderColor: window.theme.primary,
//                 hoverBackgroundColor: window.theme.primary,
//                 hoverBorderColor: window.theme.primary,
//                 data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79],
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

$(function() {
    var mapData = {
        "US": 298,
        "SA": 200,
        "DE": 220,
        "FR": 540,
        "CN": 120,
        "AU": 760,
        "BR": 550,
        "IN": 200,
        "GB": 120,
    };
    $('#world_map').vectorMap({
        map: 'world_mill',
        backgroundColor: "transparent",
        zoomOnScroll: false,
        regionStyle: {
            initial: {
                fill: '#e4e4e4',
                "fill-opacity": 0.9,
                stroke: 'none',
                "stroke-width": 0,
                "stroke-opacity": 0
            }
        },
        series: {
            regions: [{
                values: mapData,
                scale: [window.theme.primary],
                normalizeFunction: 'polynomial'
            }]
        },
    });
    // setTimeout(function() {
    //     $(window).trigger('resize');
    // }, 350)
})

$(function() {
    $('#datatables-dashboard-projects').DataTable({
        pageLength: 6,
        lengthChange: false,
        bFilter: false,
        autoWidth: false
    });
});

$(function() {
    $('#datetimepicker-dashboard').datetimepicker({
        inline: true,
        sideBySide: false,
        format: 'L'
    });
});
