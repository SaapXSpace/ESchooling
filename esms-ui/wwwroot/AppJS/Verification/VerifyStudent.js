import  {GETAPIURL,GETBYID,POST,PUT,DELETE,CLEAR,FILLCOMBO,FILLCOMBOBYID}  from "../Service/ApiService.js";
import { Roles } from "../Service/Security.js";

// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var Id = '';
var dateFrom = '';
var dateTo = '';
var btn_verify = $("#btn_verify")
var txt_ssb = $("#txt_ssb")


// jQuery CONSTRUCTOR
$(document).ready(function () {  
    
});

btn_verify.on('click', function (e) {
    //$("#data_Model").modal('show');
    

    // if (txt_ssb.val().trim().length >= 12) {
    //     var anothercnicformat = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
    //     if(!txt_ssb.val().trim().match(anothercnicformat))
    //     {
    //         Swal.fire({
    //             title: 'Citizen Number should be follow this (XXXXX-XXXXXXX-X) format!',
    //             icon: 'error',
    //         })
    //         txt_ssb.focus();
    //         return;
           
    //     }
    // }

    if (txt_ssb.val().trim() != '') {
        let timerInterval;
        Swal.fire({
            title: "Searching for verification !",
            timer: 5000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    if (txt_ssb.val().trim().toLowerCase() == "fresher" || txt_ssb.val().trim().includes("FRESHER") || txt_ssb.val().trim() == "FRESHER" ) {
                        Swal.fire({
                            title: "Regretted inconvenience\nPlease search your certificate with CNIC number",
                            icon: 'error',
                        })
                    }else{
                        check_student_verification(txt_ssb.val().trim())
                    }
                }
            });       
    }else{
        Swal.fire({
            title: "Enter STUDENT SSB / CDC / CNIC / PASSPORT",
            icon: 'error',
        })
    }
})

// ONLOAD FUNCTION
function check_student_verification(_ssb) {
    var tbl_row_cnt = 1;
    
    $.ajax({
        url: apiUrl + "/VerificationService/GetStudentBySSBForVerification",
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function(xhr) {
             xhr.setRequestHeader('_ssb', _ssb);
        },
        success: function (response) {
            if (response.statusCode === "200") {
                var _student = response.data.studentInfo
                var _course = response.data.courseInfo
                Swal.fire({
                    title: _student.studentName + " verified by Maritime Training Institute, Do you want to view comlete student profile with verified courses",
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No"
                  }).then((result) => {
                    if (result.isConfirmed) {

                        var _fathernameConcat = _student.fatherName != null && _student.fatherName != undefined && _student.fatherName != "" ? _student.fatherName : "N.A";
                        $("#span_ssb").text(_student.ssb);
                        $("#span_name").text(_student.studentName );
                        $("#span_father").text(_fathernameConcat);
                        $("#span_cnic").text(_student.cnic);
                        $("#span_phone").text(_student.phone);
                        // if ( _student.image.length > 10) {
                        //     $("#profile-image").attr("src", "data:image/jpg;base64,"+ _student.image);
                        // }else{
                        //     $("#profile-image").attr("src", "/img/images/profile.jpg"); 
                        // }

                        var course_data_table = $("#course_data_table tbody");
                        course_data_table.empty();
                    
                        for (let index = 0; index < _course.length; index++) {
                            var course = '<tr>' +
                                '<td>' + _course[index].certificateNo + '</td>' +
                                '<td>' + _course[index].courseName + '</td>' +
                                '<td>' +  moment(_course[index].issueDate).format("DD-MMM-YYYY") + '</td>' +
                                // '<td>' + moment(_course[index].expirtyDate).format("DD-MMM-YYYY") + '</td>' +
                            '</tr>';//
                            course_data_table.append(course);
                        }
                        $("#data_Model").modal('show');
                    }
                  });
            } else if (response.statusCode === "404") {
                Swal.fire({
                    title: "Something went wrong please contact <a href='mailto:mahmoodi@mintship.com'>mahmoodi@mintship.com</a> ",
                    icon: 'warning',
                })
            }else{
                Swal.fire({
                    title: response.message,
                    icon: 'error',
                })
            }
        },
        error: function (xhr, status, err) {
            Swal.fire({
                title: "Internal Server Error : " + err,
                icon: 'error',
            })
        }
    })
    return true;
}

// CHange Images
var isUploading = false
$("#qrimage").click(function () {
    if (!isUploading) {
        isUploading = true;
        $("#image-upload-input").click();
        isUploading = false
    }
});

$("#image-upload-input").change(function () {
    var formdata = false;
    var selectedImage = this.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var qrbase64 = e.target.result;
        const image = new Image();
        image.src = qrbase64;
        image.onload = function () {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
                if (code.data != '' ) {
                    let timerInterval;
                    Swal.fire({
                        title: "Searching for verification !",
                        timer: 5000,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                        willClose: () => {
                            clearInterval(timerInterval);
                        }
                        }).then((result) => {
                            if (result.dismiss === Swal.DismissReason.timer) {
                                if (code.data.toLowerCase() == "fresher" || code.data.includes("FRESHER") || code.data == "FRESHER" ) {
                                    Swal.fire({
                                        title: "Regretted inconvenience\nPlease search your certificate with CNIC number",
                                        icon: 'error',
                                    })
                                }else{
                                    check_student_verification(code.data)
                                }
                            
                                
                            }
                        }).catch((error) => {
                            Swal.fire({
                                title: error,
                                icon: 'error',
                            })
                        });;    
                }
            } else {
                Swal.fire({
                    title: "Your uploaded QR Code is invalid",
                    icon: 'error',
                })
            }
        };
    };
    reader.readAsDataURL(selectedImage);

});

var isScanning = false
$("#qrscanner").click(function () {
    if (!isScanning) {
        isScanning = true;
        scanQRCode();
        isScanning = false
    }
});

function scanQRCode() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(function (stream) {
            const qrView = document.getElementById('qrscanner');
            const track = stream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(track);

            const loop = setInterval(function () {
                imageCapture.grabFrame()
                    .then(function (imageBitmap) {
                        const canvas = document.createElement('canvas');
                        canvas.width = imageBitmap.width;
                        canvas.height = imageBitmap.height;
                        const context = canvas.getContext('2d');
                        context.drawImage(imageBitmap, 0, 0);
                        const dataURL = canvas.toDataURL('image/jpeg');
                        qrView.src = dataURL;
                        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height);
                        if (code) {
                            $("#qrscanner").attr("src", "/img/images/scan-qr.jpg"); 
                            playBeep();
                            clearInterval(loop);
                            handleScannedData(code.data);
                            track.stop();
                        }
                    })
                    .catch(function (err) {
                        console.error('Error grabbing frame:', err);
                    });
            }, 10);
        })
        .catch(function (err) {
            $("#qrscanner").attr("src", "/img/images/scan-qr.jpg"); 
            Swal.fire({
                title: err,
                icon: 'error',
            })
        });
}

function handleScannedData(data) {
    if (data != '' ) {
        let timerInterval;
        Swal.fire({
            title: "Searching for verification !",
            timer: 5000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    if (data.toLowerCase() == "fresher" || data.includes("FRESHER") || data == "FRESHER" ) {
                        Swal.fire({
                            title: "Regretted inconvenience\nPlease search your certificate with CNIC number",
                            icon: 'error',
                        })
                    }else{
                        check_student_verification(data)
                    }
                }
            }).catch((error) => {
                Swal.fire({
                    title: error,
                    icon: 'error',
                })
            });
    }
}

// Function to play a beep sound
function playBeep() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine'; // Set oscillator type to sine wave
    oscillator.connect(audioCtx.destination);
    oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
    }, 100);
}

// ONLOAD FUNCTION
function monthly_ledger_report(monthFrom,monthTo) {
    var tbl_row_cnt = 1;
    $.ajax({
        url: apiUrl + end_point + "/GetLedgerReportMonthWise",
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(api_signature));
             xhr.setRequestHeader('MonthFrom', monthFrom);
             xhr.setRequestHeader('MonthTo', monthTo);
        },
        success: function (response) {
            var date_section = document.getElementById("date_section")
            var heading_section = document.getElementById("heading_section")
            heading_section.innerText = "MONTHLY LEADGER REPORT"
            date_section.innerText = `FROM: ${moment(monthFrom).format("MMMM YYYY")} TO: ${moment(monthTo).format("MMMM YYYY")}`
            if (response != null && response.statusCode === '200') {
                render_monthly_ledger(response.data)
            }else if (response.statusCode === '404') {
                Swal.fire({
                    title: response.message,
                    icon: 'warning',
                })
            }
        },
        error: function (xhr, status, err) {
            alert("Internal Server Error")
        }
    })
    return true;
}

function render_daily_ledger(data) {
    // elements
    var data_section = document.getElementById("data_section")
    var uniqueDates = [...new Set(data.map(obj => obj.date))];
    // Sort unique dates in ascending order
    uniqueDates.sort((a, b) => a - b);

        
    var htmlContent = ""
    for (const date of uniqueDates) {
        htmlContent+= `
        <hr><div class="row" style="justify-content: center;">
            <h3 style="font-weight: bolder; font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;"> ${moment(date).format("DD MMM YYYY")} </h3>
        </div><hr>`
        htmlContent += `
        <div class="row table-responsive p-4">
            <table class="table table-stripped" id="">
                <thead>
                    <tr>
                        <th>PAYER</th>
                        <th>RECIPIENT</th>
                        <th>VIA</th>
                        <th>NARRATION</th>
                        <th>CREDIT/DEBIT</th>
                        <th>AMOUNT</th>
                    </tr>
                </thead>`
        
        var datewiese_data = data.filter(x => x.date === date);
        

         // calculate total
         var totalAmount = datewiese_data.reduce((total, transaction) => total + transaction.amount, 0);

         // calculate total debit
         var DebitTransactions = datewiese_data.filter(x => x.transaction === 'D');
         var DebittotalAmount = DebitTransactions.reduce((total, transaction) => total + transaction.amount, 0);
 
         // calculate total credit
         var CreditTransactions = datewiese_data.filter(x => x.transaction === 'C');
         var CredittotalAmount = CreditTransactions.reduce((total, transaction) => total + transaction.amount, 0);
        
         for (const item of datewiese_data) {
            htmlContent += `
                <tbody>
                    <tr>
                        <td>${item.payer}</td>
                        <td>${item.recipient}</td>
                        <td>${item.paymentType == "C" ? "Cash" : "Online on " + item.account}</td>
                        <td>${item.narration}</td>
                        <td>${item.transaction == "C" ? "Credit" : "Debit"}</td>
                        <td>${item.amount}</td>
                    </tr>
                </tbody>`
        }
        htmlContent += `
                <tfoot>
                    <tr>
                        <th>TOTAL DEBIT</th><th></th><th></th><th></th><th></th><th>${DebittotalAmount}</th>
                    </tr>
                    <tr>
                        <th>TOTAL CREDIT</th><th></th><th></th><th></th><th></th><th>${CredittotalAmount}</th>
                    </tr>
                    <tr>
                        <th>TOTAL AMOUNT</th><th></th><th></th><th></th><th></th><th>${totalAmount}</th>
                    </tr>
                </tfoot>
            </table>
        </div>
        `

    }

    data_section.innerHTML = htmlContent
}

function render_monthly_ledger(data) {
    // elements
    var data_section = document.getElementById("data_section")

    //var uniqueDates = [...new Set(data.map(obj => obj.date))];
    var uniqueMonths = [...new Set(data.map(obj => moment(obj.date).format("MMMM YYYY")))];
    
    // Sort unique dates in ascending order
    uniqueMonths.sort((a, b) => a - b);

        
    var htmlContent = ""
    for (const month of uniqueMonths) {
        htmlContent+= `
        <hr><div class="row" style="justify-content: center;">
            <h3 style="font-weight: bolder; font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;"> ${moment(month).format("MMMM YYYY")} </h3>
        </div><hr>`
        htmlContent += `
        <div class="row table-responsive p-4">
            <table class="table table-stripped" id="">
                <thead>
                    <tr>
                        <th>DATE</th>
                        <th>PAYER</th>
                        <th>RECIPIENT</th>
                        <th>VIA</th>
                        <th>NARRATION</th>
                        <th>CREDIT/DEBIT</th>
                        <th>AMOUNT</th>
                    </tr>
                </thead>`

        var monthwiese_data = data.filter(x => moment(x.date).format("MMMM YYYY") ===  month );

         // calculate total
         var totalAmount = monthwiese_data.reduce((total, transaction) => total + transaction.amount, 0);

         // calculate total debit
         var DebitTransactions = monthwiese_data.filter(x => x.transaction === 'D');
         var DebittotalAmount = DebitTransactions.reduce((total, transaction) => total + transaction.amount, 0);
 
         // calculate total credit
         var CreditTransactions = monthwiese_data.filter(x => x.transaction === 'C');
         var CredittotalAmount = CreditTransactions.reduce((total, transaction) => total + transaction.amount, 0);
        
         for (const item of monthwiese_data) {
            htmlContent += `
                <tbody>
                    <tr>
                        <td>${moment(item.date).format("DD-MMM-YYY") }</td>
                        <td>${item.payer}</td>
                        <td>${item.recipient}</td>
                        <td>${item.paymentType == "C" ? "Cash" : "Online on " + item.account}</td>
                        <td>${item.narration}</td>
                        <td>${item.transaction == "C" ? "Credit" : "Debit"}</td>
                        <td>${item.amount}</td>
                    </tr>
                </tbody>`
        }
        htmlContent += `
                <tfoot>
                    <tr>
                        <th>TOTAL DEBIT</th><th></th><th></th><th></th><th></th><th></th><th>${DebittotalAmount}</th>
                    </tr>
                    <tr>
                        <th>TOTAL CREDIT</th><th></th><th></th><th></th><th></th><th></th><th>${CredittotalAmount}</th>
                    </tr>
                    <tr>
                        <th>TOTAL AMOUNT</th><th></th><th></th><th></th><th></th><th></th><th>${totalAmount}</th>
                    </tr>
                </tfoot>
            </table>
        </div>
        `
    }
    data_section.innerHTML = htmlContent
}


function isGuidValid(guid) {
    const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return guidRegex.test(guid);
}

function safeAtob(encodedString) {
    if (!encodedString) {
        return null;
    }
    try {
        return atob(encodedString);
    } catch (error) {
        console.error("Error decoding base64:", error.message);
        return null;
    }
}

function createReceipt(data) {
    var htmlContent = `
        <div class="pdf-container">
            <!-- Your content goes here -->
            <div class="container-fluid p-5">
                <div class="row">
                    <div class="col-lg-12 d-flex" style="align-items: start;">
                        <img src="/img/recieipt/einstituteLogo.png" class="header_side_logo" alt="">
                        <img style="align-items: center;" src="/img/recieipt/receipt-header.jpeg" class="header_img" alt="">
                    </div>
                </div>
                <br>
                <div class="row heading_row">
                    <b><h1 style="font-size: 30px;font-weight: bold;justify-content: center;font-family: 'Times New Roman';background-color: black;color: white;padding: 10px 10px 10px 15px;letter-spacing: 8px;"><em> RECEIPT FOR STUDENT </em></h1></b>
                </div>
                <hr>
                <div class="row p-1">
                    <div class="col-md-4" style="text-align: start;">
                        <h3 style="font-family: Arial, sans-serif;font-weight:bold;"> Receipt No. <span style="font-weight: bold;"><u> ${data.code} </u></span></h3>
                    </div>
                    <div class="col-md-4" style="text-align: center;">
                    </div>
                    <div class="col-md-4" style="text-align: end;">
                        <h3 style="font-family: Arial, sans-serif;font-weight:bold;"> Date : <span style="font-weight: bold;"><u>  ${moment(new Date()).format("DD-MM-YYYY")} </u></span></h3>
                    </div>
                </div>
                <div class="row p-1 d-flex">
                    <div class="col-md-12 d-flex" style="text-align: start;">
                        <h3 style="font-family: Arial, sans-serif;font-weight:bold;"> Received with thanks from. </h3> &nbsp;&nbsp;&nbsp;
                        <h3 style="font-family: Arial, sans-serif;width: auto;border-bottom: 3px dotted black;"> <span>${data.voucher.toUpperCase()}</span> </h3>
                    </div>
                </div>
                <div class="row p-1 d-flex">
                    <div class="col-md-12 d-flex" style="text-align: start;">
                        <h3 style="font-family: Arial, sans-serif;font-weight:bold;"> the sum of Rs. </h3> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <h3 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.words === null ? "" : data.words.toUpperCase()}</span> </h3>
                    </div>
                </div>
                <div class="row p-1 d-flex">
                    <div class="col-md-12 d-flex" style="text-align: start;">
                        <h3 style="font-family: Arial, sans-serif;font-weight:bold;"> By Cash/ Cheque / Pay Order No. </h3> &nbsp;&nbsp;&nbsp;
                        <h3 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.paymentType === "C" ? "Cash" : "ONLINE ON "+data.account.toUpperCase()+"" }</span> </h3> &nbsp;&nbsp;&nbsp;
                    </div>
                </div>
                <div class="row p-1 d-flex">
                    <div class="col-md-12 d-flex" style="text-align: start;">   
                        <h3 style="font-family: Arial, sans-serif;font-weight:bold;"> On Account of. </h3> &nbsp;&nbsp;&nbsp;
                        <h3 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.courses.toUpperCase()}</span> </h3>
                    </div>
                </div>
                <div class="row p-1 d-flex">
                    <div class="col-md-12 d-flex" style="text-align: start;">
                        <h3 style="font-family: Arial, sans-serif;font-weight:bold;"> Rs. </h3> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <h3 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>  ${data.total} /- </span> </h3>
                    </div>
                </div>
                <div class="row p-1 heading_row">
                    <b><h2 style="font-size: 20px;font-weight: bold;justify-content: center;"><em> (FEES ONCE PAID NOT REFUNDABLE) </em></h2></b>
                </div>
            </div>
        </div>
        <div style="border-bottom: 5px dotted black;margin-bottom: 20px;margin-top: 20px;"></div>
         <div class="pdf-container">
            <!-- Your content goes here -->
            <div class="container-fluid p-5">
                 <div class="row" >
                    <div class="col-lg-12 d-flex" style="align-items: start;">
                       <img src="/img/recieipt/einstituteLogo.png" class="header_side_logo" alt="">    
                       <img style="align-items: center;" src="/img/recieipt/receipt-header.jpeg" class="header_img" alt="">
                    </div>
                </div>
                <br>
                <div class="row heading_row">
                     <b><h1 style="font-size: 30px;font-weight: bold;justify-content: center;font-family: 'Times New Roman';background-color: black;color: white;padding: 10px 10px 10px 15px;letter-spacing: 8px;"><em> RECEIPT FOR OFFICE </em></h1><b>
                </div>
                <hr>
                <div class="row p-1">
                    <div class="col-md-4" style="text-align: start;">
                        <h3 style="font-family: Arial, sans-serif;font-weight:bold;"> Receipt No. <span style="font-weight: bold;"><u> ${data.code} </u></span></h3>
                    </div>
                    <div class="col-md-4" style="text-align: center;">
                    </div>
                    <div class="col-md-4" style="text-align: end;">
                        <h3 style="font-family: Arial, sans-serif;font-weight:bold;"> Date : <span style="font-weight: bold;"><u>  ${moment(new Date()).format("DD-MM-YYYY")} </u></span></h3>
                    </div>
                </div>
                <div class="row p-1 d-flex">
                    <div class="col-md-12 d-flex" style="text-align: start;">
                        <h3 style="font-family: Arial, sans-serif;font-weight:bold;"> Received with thanks from. </h3> &nbsp;&nbsp;&nbsp;
                        <h3 style="font-family: Arial, sans-serif;width: auto;border-bottom: 3px dotted black;"> <span>${data.voucher.toUpperCase()}</span> </h3>
                    </div>
                </div>
                <div class="row p-1 d-flex">
                    <div class="col-md-12 d-flex" style="text-align: start;">
                        <h3 style="font-family: Arial, sans-serif;font-weight:bold;"> the sum of Rs. </h3> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <h3 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.words === null ? "" : data.words.toUpperCase()}</span> </h3>
                    </div>
                </div>
                <div class="row p-1 d-flex">
                    <div class="col-md-12 d-flex" style="text-align: start;">
                        <h3 style="font-family: Arial, sans-serif;font-weight:bold;"> By Cash/ Cheque / Pay Order No. </h3> &nbsp;&nbsp;&nbsp;
                        <h3 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.paymentType === "C" ? "CASH" : "ONLINE ON "+data.account.toUpperCase()+"" } </span> </h3> &nbsp;&nbsp;&nbsp;
                    </div>
                </div>
                <div class="row p-1 d-flex">
                    <div class="col-md-12 d-flex" style="text-align: start;">
                        <h3 style="font-family: Arial, sans-serif;font-weight:bold;"> On Account of. </h3> &nbsp;&nbsp;&nbsp;
                        <h3 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.courses.toUpperCase()}</span> </h3>
                    </div>
                </div>
                <div class="row p-1 d-flex">
                    <div class="col-md-12 d-flex" style="text-align: start;">
                        <h3 style="font-family: Arial, sans-serif;font-weight:bold;"> Rs. </h3> &nbsp;&nbsp;&nbsp;
                        <h3 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.total} /- </span> </h3>
                    </div>
                </div>
                <div class="row p-1 heading_row">
                     <b><h2 style="font-size: 20px;font-weight: bold;justify-content: center;"><em> (FEES ONCE PAID NOT REFUNDABLE) </em></h2><b>
                </div>
            </div>
        </div>
    `;

    // Assuming you have an HTML element with the ID "container_receipt"
    var containerDiv = document.getElementById("container_receipt");

    // Set the innerHTML property of the container div to the HTML content
    containerDiv.innerHTML = htmlContent;

}