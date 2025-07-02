import  {GETAPIURL,GETBYID,POST,PUT,DELETE,CLEAR,FILLCOMBO,FILLCOMBOBYID}  from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js";



// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var Id = '';
var dateFrom = '';
var dateTo = '';


var monthFrom = '';
var monthTo = '';

var end_point='';
var reportType = ''


// jQuery CONSTRUCTOR
$(document).ready(function () {  
    if (url.has('Id') && url.has('dateFrom') && url.has('dateTo')) {
        if (safeAtob(url.get('Id')) != null) {
            Id = window.atob(url.get('Id'));
            dateFrom = (url.get('dateFrom'));
            dateTo = (url.get('dateTo'));
            reportType = 'DL'
        }else{
            window.history.back();
        }
    }else if (url.has('Id') && url.has('monthFrom') && url.has('monthTo')) {
        if (safeAtob(url.get('Id')) != null) {
            Id = window.atob(url.get('Id'));
            monthFrom = (url.get('monthFrom'));
            monthTo = (url.get('monthTo'));
            reportType = 'ML'
        }else{
            window.history.back();
        }
    }
    if (Id == null || isGuidValid(Id) != true) {
        window.history.back();
    }
    end_point = '/api/v1/AccountsLovService';
    checkReport(reportType)
  });

function checkReport(reportType) {
    if (reportType === "DL") {
        daily_ledger_report(dateFrom,dateTo)
    }else if (reportType === "ML"){
        monthly_ledger_report(monthFrom,monthTo)
    }else{

    }
}

// ONLOAD FUNCTION
function daily_ledger_report(dateFrom,dateTo) {
    var tbl_row_cnt = 1;
    $.ajax({
        url: apiUrl + end_point + "/GetLedgerReportDateWise",
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(api_signature));
             xhr.setRequestHeader('DateFrom', dateFrom);
             xhr.setRequestHeader('DateTo', dateTo);
        },
        success: function (response) {
            var date_section = document.getElementById("date_section")
            var heading_section = document.getElementById("heading_section")
            heading_section.innerText = "DAILY LEDGER REPORT"
            date_section.innerText = `FROM: ${moment(dateFrom).format("DD MMM YYYY")} TO: ${moment(dateTo).format("DD MMM YYYY")}`
            if (response != null && response.statusCode === '200') {
                render_daily_ledger(response.data)
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
            heading_section.innerText = "MONTHLY LEDGER REPORT"
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

    var _total = 0
    var htmlContent = ""
    for (const date of uniqueDates) {
        htmlContent+= `
        <hr><div class="row" style="justify-content: center;">
            <h3 style="font-weight: bolder; font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;"> ${moment(date).format("DD MMM YYYY")} </h3>
        </div><hr>`
        htmlContent += `
        <div class="row table-responsive p-4">
            <table class="table table-stripped " id="">
                <thead>
                    <tr>
                        <th>RECIPIENT </th>
                        <th>PAYER </th>
                        <th>VIA </th>
                        <th>ACC/HEAD </th>
                        <th>NARRATION </th>
                        <th>DEBIT </th>
                        <th>CREDIT </th>
                        <th>AMOUNT </th>
                    </tr>
                </thead>`
        
        var datewiese_data = data.filter(x => x.date === date);
        

         // calculate total
         //var totalAmount = datewiese_data.reduce((total, transaction) => total + transaction.amount, 0);

         // calculate total debit
         var DebitTransactions = datewiese_data.filter(x => x.transaction === 'D');
         var DebittotalAmount = DebitTransactions.reduce((total, transaction) => total + transaction.amount, 0);
 
         // calculate total credit  
         var CreditTransactions = datewiese_data.filter(x => x.transaction === 'C');
         var CredittotalAmount = CreditTransactions.reduce((total, transaction) => total + transaction.amount, 0);
        
         var totalAmount = DebittotalAmount - CredittotalAmount 
         
       

         for (const item of datewiese_data) {
            if(item.transaction == "D") 
                _total = _total + item.amount
            else if(item.transaction == "C")
                _total = _total - item.amount

            htmlContent += `
                <tbody>
                    <tr>
                        <td>${item.recipient.toUpperCase()} </td>
                        <td>${item.payer.toUpperCase()} </td>
                        <td>${item.paymentType == "C" ? "Cash".toUpperCase() : ("Online on " + item.account).toUpperCase()} </td>
                        <td>${item.accountHead.toUpperCase()} </td>
                        <td>${item.narration.toUpperCase()} </td>
                        <td>${item.transaction == "D" ? parseFloat( item.amount).toLocaleString(window.document.documentElement.lang) : "0.00"}</td>
                        <td>${item.transaction == "C" ? parseFloat( item.amount).toLocaleString(window.document.documentElement.lang) : "0.00"}</td>
                        <td>${parseFloat(_total).toLocaleString(window.document.documentElement.lang)}</td>
                    </tr>
                </tbody>`
        }
        htmlContent += `
                <tfoot style="border:3px solid #3e4676">
                    <tr>
                        <th>TOTAL</th><th></th><th></th><th></th><th></th>
                        <th>${parseFloat((DebittotalAmount)).toLocaleString(window.document.documentElement.lang)}</th>
                        <th>${parseFloat((CredittotalAmount)).toLocaleString(window.document.documentElement.lang)}</th>
                        <th>${parseFloat((_total)).toLocaleString(window.document.documentElement.lang)}</th>
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
    var _total = 0
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
                        <th>RECIPIENT</th>
                        <th>PAYER</th>
                        <th>VIA</th>
                        <th>ACC/HEAD </th>
                        <th>NARRATION</th>
                        <th>DEBIT</th>
                        <th>CREDIT</th>
                        <th>AMOUNT</th>
                    </tr>
                </thead>`

        var monthwiese_data = data.filter(x => moment(x.date).format("MMMM YYYY") ===  month );

         // calculate total
         //var totalAmount = monthwiese_data.reduce((total, transaction) => total + transaction.amount, 0);

         // calculate total debit
         var DebitTransactions = monthwiese_data.filter(x => x.transaction === 'D');
         var DebittotalAmount = DebitTransactions.reduce((total, transaction) => total + transaction.amount, 0);
 
         // calculate total credit
         var CreditTransactions = monthwiese_data.filter(x => x.transaction === 'C');
         var CredittotalAmount = CreditTransactions.reduce((total, transaction) => total + transaction.amount, 0);
        
         var totalAmount = DebittotalAmount - CredittotalAmount 

         for (const item of monthwiese_data) {

            if(item.transaction == "D") 
                _total = _total + item.amount
            else if(item.transaction == "C")
                _total = _total - item.amount
            
            htmlContent += `
                <tbody>
                    <tr >
                        <td>${moment(item.date).format("DD-MMM-YYYY").toUpperCase() } </td>
                        <td>${item.recipient.toUpperCase()} </td>
                        <td>${item.payer.toUpperCase()} </td>
                        <td>${item.paymentType == "C" ? "Cash".toUpperCase() : ("Online on " + item.account).toUpperCase()} </td>
                        <td>${item.accountHead.toUpperCase()} </td>
                        <td>${item.narration.toUpperCase()} </td>
                        <td>${item.transaction == "D" ? parseFloat( item.amount).toLocaleString(window.document.documentElement.lang) : "0.00"}</td>
                        <td>${item.transaction == "C" ? parseFloat( item.amount).toLocaleString(window.document.documentElement.lang) : "0.00"}</td>
                        <td>${parseFloat(_total).toLocaleString(window.document.documentElement.lang)}</td>
                    </tr>
                </tbody>`
        }
        htmlContent += `
                <tfoot style="border:3px solid #3e4676">
                    <tr>
                        <th>TOTAL</th><th></th><th></th><th></th><th></th><th></th>
                        <th>${parseFloat( DebittotalAmount).toLocaleString(window.document.documentElement.lang)}</th>
                        <th>${parseFloat( CredittotalAmount).toLocaleString(window.document.documentElement.lang)}</th>
                        <th>${parseFloat( totalAmount).toLocaleString(window.document.documentElement.lang)}</th>
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