
$(function() {
    $('#datatables-dashboard-products').DataTable({
        pageLength: 6,
        lengthChange: false,
        bFilter: false,
        autoWidth: false
    });
});
$(function() {
    $("#usa_map").vectorMap({
        map: "us_aea",
        backgroundColor: "transparent",
        zoomOnScroll: false,
        normalizeFunction: "polynomial",
        hoverOpacity: .7,
        hoverColor: false,
        regionStyle: {
            initial: {
                fill: "#DCE3E8"
            }
        },
        markerStyle: {
            initial: {
                "r": 9,
                "fill": window.theme.primary,
                "fill-opacity": .9,
                "stroke": "#fff",
                "stroke-width": 7,
                "stroke-opacity": .4
            },
            hover: {
                "stroke": "#fff",
                "fill-opacity": 1,
                "stroke-width": 1.5
            }
        },
        markers: [{
            latLng: [37.77, -122.41],
            name: "San Francisco: 375"
        }, {
            latLng: [40.71, -74.00],
            name: "New York: 350"
        }, {
            latLng: [39.09, -94.57],
            name: "Kansas City: 250"
        }, {
            latLng: [36.16, -115.13],
            name: "Las Vegas: 275"
        }, {
            latLng: [32.77, -96.79],
            name: "Dallas: 225"
        }]
    });
    setTimeout(function() {
        $(window).trigger('resize');
    }, 350)
})
$(function() {
    // Bar chart
    new Chart(document.getElementById("chartjs-dashboard-bar-alt"), {
        type: "bar",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                label: "Last year",
                backgroundColor: window.theme.primary,
                borderColor: window.theme.primary,
                hoverBackgroundColor: window.theme.primary,
                hoverBorderColor: window.theme.primary,
                data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79],
                barPercentage: .75,
                categoryPercentage: .5
            }, {
                label: "This year",
                backgroundColor: "#E8EAED",
                borderColor: "#E8EAED",
                hoverBackgroundColor: "#E8EAED",
                hoverBorderColor: "#E8EAED",
                data: [69, 66, 24, 48, 52, 51, 44, 53, 62, 79, 51, 68],
                barPercentage: .75,
                categoryPercentage: .5
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        display: false
                    },
                    stacked: false,
                    ticks: {
                        stepSize: 20
                    }
                }],
                xAxes: [{
                    stacked: false,
                    gridLines: {
                        color: "transparent"
                    }
                }]
            }
        }
    });
});
$(function() {
    // Line chart
    new Chart(document.getElementById("chartjs-dashboard-line"), {
        type: 'line',
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                    label: "Orders",
                    fill: true,
                    backgroundColor: window.theme.primary,
                    borderColor: window.theme.primary,
                    borderWidth: 2,
                    data: [3, 2, 3, 5, 6, 5, 4, 6, 9, 10, 8, 9]
                },
                {
                    label: "Sales ($)",
                    fill: true,
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    borderColor: "rgba(0, 0, 0, 0.05)",
                    borderWidth: 2,
                    data: [5, 4, 10, 15, 16, 12, 10, 13, 20, 22, 18, 20]
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            tooltips: {
                intersect: false
            },
            hover: {
                intersect: true
            },
            plugins: {
                filler: {
                    propagate: false
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            scales: {
                xAxes: [{
                    reverse: true,
                    gridLines: {
                        color: "rgba(0,0,0,0.0)"
                    }
                }],
                yAxes: [{
                    ticks: {
                        stepSize: 5
                    },
                    display: true,
                    gridLines: {
                        color: "rgba(0,0,0,0)",
                        fontColor: "#fff"
                    }
                }]
            }
        }
    });
});
