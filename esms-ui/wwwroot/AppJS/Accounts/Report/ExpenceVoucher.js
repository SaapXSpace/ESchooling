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
        url: apiUrl + end_point + "/GetExpenceVoucherByLedgerId",
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(api_signature));
            xhr.setRequestHeader('_ledgerId', _Id);
        },
        success: function (response) {
            var action_button = ' ';
            if (response != null) {
                if (response.data != null) {
                    createCashLedger(response.data)
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

function createCashLedger(data) {
    console.log(data)
    var htmlContent = `
    <div class="pdf-container">
        <!-- Your content goes here -->
        <div class="container-fluid p-5">
            <div class="row">
                <div class="col-sm-6 col-md-4 col-lg-4 text-left" style="align-items: start;">
                    <img style="align-items: center;" src=${"data:image/jpg;base64,"+ data.imageLogo} width="300px" alt="">
                    
                </div>
                
                <div class="col-sm-1 col-md-4 col-lg-4 text-start mt-5" style="align-items: start;">
                   
                </div>
                <div class="col-sm-5 col-md-4 col-lg-4 ">
                    <div class="row text-right">
                        <b><h1 style="font-size: 30px;font-weight: bold;justify-content: right;"> <u> Cash Payment Voucher </u> </h1></b>
                    </div>
                    <div class="row text-center">
                        <h4 style=""> Print Date:  ${moment(new Date()).format("DD-MMMM-YYYY") } </h4>
                    </div>
                </div>
            </div>
            <hr>
            <br>
            <div class="row p-1 pt-3">
                <div class="col-sm-4 col-lg-3 col-md-3" style="text-align: start;">
                    <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> CV No. &nbsp&nbsp <span style="font-weight:normal;"> ${data.code} </span></h3>
                </div>
                <div class="col-sm-3 col-lg-3 col-md-3" style="text-align: center;">
                    <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> Date: <span style="font-weight:normal;"> ${moment(new Date()).format("DD-MMMM-YYYY") } </span></h3>
                </div>
                <div class="col-sm-5 col-lg-4 col-md-4" style="text-align: end;">
                    <h4 style="font-family: Arial, sans-serif;font-weight:bold;"> Payer : <span style="font-weight: normal;"> ${data.payer} </span>  &nbsp&nbsp  Recipient  : <span style="font-weight: normal;"> ${data.recipient} </span></h3>
                </div>
                <div class="col-sm-1 col-lg-2 col-md-2" style="text-align: end;">
                </div>
            </div>
            <div class="row p-1 table-responsive">
                <table id="data_table" class="table  table-striped " style="width:100%;color:black" >
                    <thead>
                        <tr>
                            <th>A/C HEAD</th>
                            <th>DESCRIPTION </th>
                            <th>REF NO</th>
                            <th>DEBIT</th>
                            <th>CREDIT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td> ${data.headName} </td>
                            <td>${data.narration}</td>
                            <td>${data.companyShortName}</td>
                            <td> ${ data.transaction === "D" ? data.amount : " - "}</td>
                            <td> ${ data.transaction === "C" ? data.amount : " - "} </td>
                        </tr>
                        <tr>
                            <td> CASH </td>
                            <td> </td>
                            <td>  </td>
                            <td> ${ data.transaction === "C" ? data.amount : " - "}</td>
                            <td> ${ data.transaction === "D" ? data.amount : " - "} </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="row p-1">
                <div class="col-sm-6 col-md-6 col-lg-6" style="text-align: start;">
                </div>
                <div class="col-sm-6 col-md-6 col-lg-6" style="text-align: center;border-top:4px solid black;border-bottom:4px solid black">
                    <div class="row p-1" >
                        <div class="col-sm-3 col-md-3 col-lg-3" style="text-align: start;">
                        <h4 style="font-family: Arial, sans-serif;font-weight:bold"> Total: </h4>
                        </div>
                        <div class="col-sm-4 col-md-4 col-lg-4" style="text-align: start;">
                            
                        </div>
                        <div class="col-sm-3 col-md-3 col-lg-3" >
                            <h4 style="font-family: Arial, sans-serif;"> ${ data.amount } </h4>
                        </div>
                        <div class="col-sm-2 col-md-2 col-lg-2">
                            <h4 style="font-family: Arial, sans-serif;"> ${ data.amount } </h4>
                        </div>
                    </div>
                    <div class="row p-1" style="text-align: center;border-top:3px solid black" >
                    </div>
                </div>
            </div>
            <br><br><br><br>
            <div class="row" style="text-align: center;">
                <div class="col-sm-2 col-md-2 col-lg-2" style="text-align: left;border-bottom:4px solid black">
                    <h5 style="font-family: Arial, sans-serif;"> ${data.createdBy.toUpperCase()} </h5>
                </div>
                <div class="col-sm-1 col-md-1 col-lg-1" >
                </div>
                <div class="col-sm-2 col-md-2 col-lg-2" style="text-align: center;border-bottom:4px solid black">
                </div>
                <div class="col-sm-1 col-md-1 col-lg-1" >
                </div>
                <div class="col-sm-2 col-md-2 col-lg-2" style="text-align: center;border-bottom:4px solid black">
                </div>
                <div class="col-sm-1 col-md-1 col-lg-1" >
                </div>
                <div class="col-sm-2 col-md-2 col-lg-2" style="text-align: left;border-bottom:4px solid black">
                    <h5 style="font-family: Arial, sans-serif;"> ${data.recipient.toUpperCase()} </h5>
                </div>
            </div>
            <div class="row" style="text-align: center;">
                <div class="col-sm-2 col-md-2 col-lg-2" style="text-align: center;">
                    <h5 style="font-family: Arial, sans-serif;font-weight:bold"> Prepared By </h5>
                </div>
                <div class="col-sm-1 col-md-1 col-lg-1" >
                </div>
                <div class="col-sm-2 col-md-2 col-lg-2" style="text-align: center;">
                    <h5 style="font-family: Arial, sans-serif;font-weight:bold"> Checked By </h5>
                </div>
                <div class="col-sm-1 col-md-1 col-lg-1" >
                </div>
                <div class="col-sm-2 col-md-2 col-lg-2" style="text-align: center;">
                    <h5 style="font-family: Arial, sans-serif;font-weight:bold"> Approved By </h5>
                </div>
                <div class="col-sm-1 col-md-1 col-lg-1" >
                </div>
                <div class="col-sm-2 col-md-2 col-lg-2" style="text-align: center;">
                    <h5 style="font-family: Arial, sans-serif;font-weight:bold"> Recieved By </h5>
                </div>
            </div>
        </div>
    </div>
    `;

    // Assuming you have an HTML element with the ID "container_receipt"
    var containerDiv = document.getElementById("container_receipt");

    // Set the innerHTML property of the container div to the HTML content
    containerDiv.innerHTML = htmlContent;

}