import  {GETAPIURL,FILLCOMBO,PUT,DELETE}  from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js";



// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var Id = '';
var end_point='';
var table_loading_image = $('#table_loading_image')

// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var menuId = '';
if (url.has('M')) {
    menuId = window.atob(url.get('M'));
}


// jQuery CONSTRUCTOR
$(document).ready(function () { 
    ComponentsDropdowns.init();
    table_loading_image.hide();
    end_point = '/api/v1/PayrollLovService';
  });


// --- Fill Select 2 of Module ---
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        LoadStudents();
    }
    return {
        init: function () {
            handleSelect2();
        }
    };
}();



// VALIDATION FUNCTION
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '' ,id='';

    var id = $("#txt_id").text()
    var course_name = $("#txt_course_name").text()
    var startdate = $("#txt_start_date")
    var enddate = $("#txt_end_date")
    var ck_ack = $("#ck_act")[0].checked;
    
    if (startdate.val() == '') {
        ck = 1;
        _Error = 'Enter Start Date';
        startdate.focus();
    }
    if (enddate.val() == '') {
        ck = 1;
        _Error = 'Enter End Date';
        enddate.focus();
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
            "startDate": (moment( startdate.val()).format("YYYY-MM-DD")).toString(),
            "endDate": (moment( enddate.val()).format("YYYY-MM-DD")).toString(),
            "active": ck_ack,
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
    console.log(_cre)
    PUT(end_point + "/UpdateStudentCourses",_cre,function () {
        $('#data_table').DataTable().clear().destroy();
        $("#data_table").DataTable()
    });
});

// TAB 2 WORKING END

// // LOAD STUDENT LOV
function LoadStudents() {
    $("#sel_student").select2({
        placeholder: "Search Student",
        minimumInputLength: 2,
        allowClear: true,
        ajax: {
            url: GETAPIURL('/api/v1/AccountsLovService/GetStudentLov'),
            type: "GET",
            dataType: 'json',
            delay: 250,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", 'Bearer ' + app_token);
            },
            data: function (params) {
                return {
                    _srch: params.term 
                };
            },
            processResults: function (data, params) {
                var myResults = [];
                if (data.statusCode === "200" && data.data) {
                    $.each(data.data, function (index, item) {
                        myResults.push({
                            id: item.id,
                            text: item.name
                        });
                    });
                } else {
                    myResults.push({
                        id: data.statusCode,
                        text: data.message
                    });
                }
                return {
                    results: myResults
                };
            },
            cache: true
        },
        escapeMarkup: function (m) {
            return m;
        }
    });
}

$("#sel_student").on("select2:clear", function (e) {
    $("#data_table").DataTable()
});

$("#sel_student").on('change', function (e) {
    if (e.target.value === '-1' || e.target.value === ' ' || e.target.value === "" || e.target.value === null || e.target.value === undefined) {
        return
    }else{
        var selectedStudent = e.target.value
        fill_course_table(selectedStudent)
    }
})

function fill_course_table(student) {
    var tbl_row_cnt=1
    table_loading_image.show()
    $.ajax({
        url: GETAPIURL(end_point + "/GetStudentCoursesByStudentLov"),
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader('Id', student);
            xhr.setRequestHeader('_menuId', menuId);
        },
        success: function (response) {
            var action_button = ' ';
            if (response != null) {
                let htmlContent = ''; 
                var count = 0
                if (response.data != null && response.data.length != 0) {
                    $('#data_table').DataTable().clear().destroy();
                    if (response.permissions == null || !response.permissions.view_Permission) {
                        Swal.fire({
                            title: "You are not autherized to access this service",
                            icon: 'warning',
                        })
                        $('#data_table').DataTable().clear().destroy();
                        $("#data_table").DataTable()
                        return
                    }
                    if (response.permissions != null && response.permissions.update_Permission) {
                        action_button += "<a href='#' class='btn-edit fas fa-edit' data-toggle='tooltip' style='color:#03588C' title='Update'></a> ";
                    }
                    if (response.permissions != null && response.permissions.delete_Permission) {
                        action_button += " <a href='#' class='btn-delete fas  fa-trash' data-toggle='tooltip' style='color:#03588C' title='Delete()'></a> ";
                    }
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
                            { data: 'courseName' },
                            { data: 'startDate' },
                            { data: 'endDate' },
                            { data: 'status' },
                            { data: 'voucher','render': function (data, type, full, meta) {if (data === "NG") {return 'Not-Generated'; }else { return 'Generated'; }  }},
                            { data: 'certificate','render': function (data, type, full, meta) {if (data) {return 'Generated'; }else { return 'Not-Generated'; }  }},
                            { data: 'active','render': function (data, type, full, meta) {if (data) {return '✔'; }else { return '✘'; }  }},
                        ],
                        "order": [[0, "asc"]],
                        //"pageLength": 10,
                        
                       
                    });
                    datatablesButtons.buttons().container().appendTo("#data_table_wrapper .col-md-6:eq(0)")
                }else{
                    $('#data_table').DataTable().clear().destroy();
                    $("#data_table").DataTable()
                }
            }else{
                $('#data_table').DataTable().clear().destroy();
                $("#data_table").DataTable()
            }
            table_loading_image.hide()       
            $('table select').each(function(e) {
                $("#sel_type"+e).select2({

                });
            });
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
}

// EDIT BUTTON EVENT 
$('table').on('click', '.btn-edit', async function (e) { //Edit Start
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    console.log(data)
    var _id = data['id'];
    var _name = data['courseName'];
    var _startDate = data['startDate'];
    var _endDate = data['endDate'];
    var _active = data['active'];
    var _certificate = data['certificate'];
    var _voucher = data['voucher'];
    var type = data['type'];
    if (_certificate) {
        Swal.fire({
            title: "You cant edit this course because certificate of this coruse is generated",
            icon: 'warning',
        })
        return
    }
    // if (_voucher != "NG") {
    //     Swal.fire({
    //         title: "You cant edit this course because voucher of this coruse is generated",
    //         icon: 'warning',
    //     })
    //     return
    // }

    $("#txt_id").text(_id)
    $("#txt_course_name").text(_name)
    $("#txt_start_date").val(moment(_startDate).format('YYYY-MM-DD'))
    $("#txt_end_date").val(moment(_endDate).format('YYYY-MM-DD'))
    if (!_active) {
        $("#ck_act").prop("checked", false);
    } else { $("#ck_act").prop("checked", true); }
    $('#data_Model').modal();
});

// DELETE BUTTON EVENT 
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#data_table').DataTable().row(currentRow).data();
    var _Id = data['id'];
    var _name = data['courseName'];
    var type = data['type'];
    var _certificate = data['certificate'];
    var _voucher = data['voucher'];
    var type = data['type'];
    if (_certificate) {
        Swal.fire({
            title: "You cant edit this course because certificate of this coruse is generated",
            icon: 'warning',
        })
        return
    }
    // if (_voucher != "NG") {
    //     Swal.fire({
    //         title: "You cant edit this course because voucher of this coruse is generated",
    //         icon: 'warning',
    //     })
    //     return
    // }
    DELETE(end_point + "/DropStudentCourses",_Id,_name,function () {
        $('#data_table').DataTable().clear().destroy();
        $("#data_table").DataTable()
    })
});





