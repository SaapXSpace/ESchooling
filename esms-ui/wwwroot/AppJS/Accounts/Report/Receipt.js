import  {GETAPIURL,GETBYID,POST,PUT,DELETE,CLEAR,FILLCOMBO,FILLCOMBOBYID}  from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js";


// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var Id = '';
var end_point='';


// jQuery CONSTRUCTOR
$(document).ready(function () {  
    if (url.has('Id')) {
        if (safeAtob(url.get('Id')) != null) {
            Id = window.atob(url.get('Id'));
        }else{
            window.history.back();
        }
    }
    if (Id == null || isGuidValid(Id) != true) {
        window.history.back();
    }
    end_point = '/api/v1/AccountsLovService';
    Onload(Id)
  });

// ONLOAD FUNCTION
function Onload(_Id) {
    var tbl_row_cnt = 1;
    $.ajax({
        url: apiUrl + end_point + "/GetReciptReportByPaymentId",
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(api_signature));
            xhr.setRequestHeader('_paymentId', _Id);
        },
        success: function (response) {
            console.log(response)
            var action_button = ' ';
            if (response != null) {
                if (response.data != null) {
                    console.log(response.data)
                    createReceipt(response.data)
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
                    <div class="col-sm-12 col-md-12 col-lg-12 text-center" >
                        <img src="/img/brands/einstituteLogo.png" class="header_img" alt="">
                    </div>
                </div>
                <br>
                <hr>
                <div class="row heading_row">
                    <b><h2 style="font-size: 20px;font-weight: bold;justify-content: center;font-family: 'Times New Roman';background-color: black;color: white;padding: 10px 10px 10px 15px;letter-spacing: 8px;"><em> RECEIPT FOR STUDENT </em></h2></b>
                </div>
                <br>
                <div class="row p-1">
                    <div class="col-sm-4 col-md-4 col-lg-4" style="text-align: start;">
                        <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> Receipt No. <span style="font-weight: bold;"><u> ${data.code} </u></span></h4>
                    </div>
                    <div class="col-sm-4 col-md-4 col-lg-4" style="text-align: center;">
                    </div>
                    <div class="col-sm-4 col-md-4 col-lg-4" style="text-align: end;">
                        <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> Print Date : <span style="font-weight: bold;"><u>  ${moment(new Date()).format("DD-MM-YYYY")} </u></span></h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-10 col-md-10 col-lg-10">
                        <div class="row p-1 d-flex">
                            <div class="col-md-12 d-flex" style="text-align: start;">
                                <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> Received with thanks from. </h4> &nbsp;&nbsp;&nbsp;
                                <h4 style="font-family: Arial, sans-serif;width: auto;border-bottom: 3px dotted black;"> <span>${data.voucher.toUpperCase()}</span> </h4>
                            </div>
                        </div>
                        <div class="row p-1 d-flex">
                            <div class="col-md-12 d-flex" style="text-align: start;">
                                <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> the sum of Rs. </h4> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <h4 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.words === null ? "" : data.words.toUpperCase()}</span> </h4>
                            </div>
                        </div>
                        <div class="row p-1 d-flex">
                            <div class="col-md-12 d-flex" style="text-align: start;">
                                <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> By Cash/ Cheque / Pay Order No. </h4> &nbsp;&nbsp;&nbsp;
                                <h4 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.paymentType === "C" ? "Cash" : "ONLINE ON "+data.account.toUpperCase()+"" }</span> </h4> &nbsp;&nbsp;&nbsp;
                            </div>
                        </div>
                        <div class="row p-1 d-flex">
                            <div class="col-md-12 d-flex" style="text-align: start;">   
                                <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> On Account of. </h4> &nbsp;&nbsp;&nbsp;
                                <h4 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.courses.toUpperCase()}</span> </h4> &nbsp;&nbsp;&nbsp;
                                <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> hereby </h4> 
                                <h4 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.narration.toUpperCase()}</span> </h4>&nbsp;&nbsp;&nbsp;
                                ${
                                    data.discountAmount != 0 ? (`<h4 style="font-family: Arial, sans-serif;font-weight:bold;"> with discount of </h4> &nbsp;&nbsp;&nbsp;
                                    <h4 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.discountAmount} </span> </h4>&nbsp;&nbsp;&nbsp;
                                    <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> by </h4> &nbsp;&nbsp;&nbsp;
                                    <h4 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.approvedBy} </span> </h4>&nbsp;&nbsp;&nbsp;`) : ""
                                }
                                
                            </div>
                        </div>
                        <div class="row p-1 d-flex">
                            <div class="col-md-12 d-flex" style="text-align: start;">
                                <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> Rs. </h4> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <h4 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>  ${ parseFloat(data.total).toLocaleString(window.document.documentElement.lang)} /- </span> </h4>
                            </div>
                        </div>
                    </div>
                    ${
                        data.discountAmount == 0 ? (`<div class="col-sm-2 col-md-2 col-lg-2">
                                <table id="course_data_table" class="table table-stripped table-bordered" style="width:100% ;color:black;text-align:center;font-size:12px;font-weight:bolder;" >
                                    <thead>
                                        <tr>
                                            <th>COURSE</th>
                                            <th>DIS AMT</th>
                                        </tr>
                                    </thead>
                                <tbody style="color:black;text-align:center;font-weight:bold">
                                        ${
                                            Object.entries(data.courseWiseDiscount).map(([course, discount]) => `
                                                <tr>
                                                <td>${course}</td>
                                                <td>${discount} </td>
                                                </tr>
                                            `).join('')
                                        }
                                    </tbody>
                                </table>    
                        </div>
                    </div>`) : ""
                }
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
                <div class="row">
                    <div class="col-sm-12 col-md-12 col-lg-12 text-center" >
                        <img src="/img/brands/einstituteLogo.png" class="header_img" alt="">
                    </div>
                </div>
                <br>
                
                <hr>
                <div class="row heading_row">
                     <b><h2 style="font-size: 20px;font-weight: bold;justify-content: center;font-family: 'Times New Roman';background-color: black;color: white;padding: 10px 10px 10px 15px;letter-spacing: 8px;"><em> RECEIPT FOR OFFICE </em></h2><b>
                </div>
                <br>
                <div class="row p-1">
                    <div class="col-sm-4 col-md-4 col-lg-4" style="text-align: start;">
                        <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> Receipt No. <span style="font-weight: bold;"><u> ${data.code} </u></span></h4>
                    </div>
                    <div class="col-sm-4 col-md-4 col-lg-4" style="text-align: center;">
                        <h4 style="font-family: Arial, sans-serif;font-weight:bold;">  Voucher Date : <span style="font-weight: bold;"><u>  ${moment(new Date()).format("DD-MM-YYYY")} </u></span></h4>
                    </div>
                    <div class="col-sm-4 col-md-4 col-lg-4" style="text-align: end;">
                        <h4 style="font-family: Arial, sans-serif;font-weight:bold;">  Print Date : <span style="font-weight: bold;"><u>  ${moment(new Date()).format("DD-MM-YYYY")} </u></span></h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-10 col-md-10 col-lg-10">
                        <div class="row p-1 d-flex">
                            <div class="col-md-12 d-flex" style="text-align: start;">
                                <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> Received with thanks from. </h4> &nbsp;&nbsp;&nbsp;
                                <h4 style="font-family: Arial, sans-serif;width: auto;border-bottom: 3px dotted black;"> <span>${data.voucher.toUpperCase()}</span> </h4>
                            </div>
                        </div>
                        <div class="row p-1 d-flex">
                            <div class="col-md-12 d-flex" style="text-align: start;">
                                <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> the sum of Rs. </h4> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <h4 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.words === null ? "" : data.words.toUpperCase()}</span> </h4>
                            </div>
                        </div>
                        <div class="row p-1 d-flex">
                            <div class="col-md-12 d-flex" style="text-align: start;">
                                <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> By Cash/ Cheque / Pay Order No. </h4> &nbsp;&nbsp;&nbsp;
                                <h4 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.paymentType === "C" ? "Cash" : "ONLINE ON "+data.account.toUpperCase()+"" }</span> </h4> &nbsp;&nbsp;&nbsp;
                            </div>
                        </div>
                        <div class="row p-1 d-flex">
                            <div class="col-md-12 d-flex" style="text-align: start;">   
                                <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> On Account of. </h4> &nbsp;&nbsp;&nbsp;
                                <h4 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.courses.toUpperCase()}</span> </h4> &nbsp;&nbsp;&nbsp;
                                <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> hereby </h4>
                                <h4 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.narration.toUpperCase()}</span> </h4>&nbsp;&nbsp;&nbsp;
                                ${
                                    data.discountAmount != 0 ? (`<h4 style="font-family: Arial, sans-serif;font-weight:bold;"> with discount of </h4> &nbsp;&nbsp;&nbsp;
                                    <h4 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.discountAmount} </span> </h4>&nbsp;&nbsp;&nbsp;
                                    <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> by </h4> &nbsp;&nbsp;&nbsp;
                                    <h4 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>${data.approvedBy} </span> </h4>&nbsp;&nbsp;&nbsp;`) : ""
                                }
                                
                            </div>
                        </div>
                        <div class="row p-1 d-flex">
                            <div class="col-md-12 d-flex" style="text-align: start;">
                                <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> Rs. </h4> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <h4 style="font-family: Arial, sans-serif;font-family: 20px;width: auto;border-bottom: 3px dotted black;"> <span>  ${ parseFloat(data.total).toLocaleString(window.document.documentElement.lang)} /- </span> </h4>
                            </div>
                        </div>
                    </div>
                    ${
                        data.discountAmount == 0 ? (`<div class="col-sm-2 col-md-2 col-lg-2">
                                <table id="course_data_table" class="table table-stripped table-bordered" style="width:100% ;color:black;text-align:center;font-size:12px;font-weight:bolder;" >
                                    <thead>
                                        <tr>
                                            <th>COURSE</th>
                                            <th>DIS AMT</th>
                                        </tr>
                                    </thead>
                                <tbody style="color:black;text-align:center;font-weight:bold">
                                        ${Object.entries(data.courseWiseDiscount).map(([course, discount]) => `
                                                <tr>
                                                <td>${course}</td>
                                                <td>${discount} </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>    
                        </div>
                    </div>`) : ""
                }
                </div>
                <div class="row p-1 heading_row">
                    <b><h2 style="font-size: 20px;font-weight: bold;justify-content: center;"><em> (FEES ONCE PAID NOT REFUNDABLE) </em></h2></b>
                </div>
            </div>
        </div>
    `;

    // Assuming you have an HTML element with the ID "container_receipt"
    var containerDiv = document.getElementById("container_receipt");

    // Set the innerHTML property of the container div to the HTML content
    containerDiv.innerHTML = htmlContent;

}