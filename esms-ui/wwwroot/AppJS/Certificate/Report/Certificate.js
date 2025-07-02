import  {GETAPIURL,GETBYID,POST,PUT,DELETE,CLEAR,FILLCOMBO}  from "../../Service/ApiService.js";
import { Roles } from "../../Service/Security.js";

// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var Id = '';
var end_point = '';

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
    //end_point = '/PayrollLovService';
    Onload();    
});

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
        return null;
    }
}

// DISCONNECTION FUNCTION
function Onload(){
    const storedSerializedData = sessionStorage.getItem('$serializedDict$');
    if (storedSerializedData) {
        var rpt_container = document.getElementById("container_certificate")
        const deserializedDict = JSON.parse(storedSerializedData);
        const keys = Object.keys(deserializedDict);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = deserializedDict[key];
            $.ajax({
                url: apiUrl + "/api/v1/PayrollLovService/GetCertificateDateByStudentLov",
                type: "Get",
                contentType: "application/json",
                dataType: "json",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(api_signature));
                    xhr.setRequestHeader('Id', key.toString());
                },
                success: async function (response) {
                    var action_button = ' ';
                    if (response != null) {
                        if (response.data != null) {
                            if (value === "L|CFOS-B") {
                                await render_CFOS_certificate(rpt_container,response.data[0],value)
                            }else if (value === "L|CYB-B"){
                                await render_BTLG_certificate(rpt_container,response.data[0],value)
                            }else if (value === "L|NF-B"){
                                await render_EFA_certificate(rpt_container,response.data[0],value)
                            }else if (value === "L|CC-A"){
                                await render_FPFF_certificate(rpt_container,response.data[0],value)
                            }else if (value === "L|AI-A"){
                                await render_FPFF_certificate(rpt_container,response.data[0],value)
                            }else if (value === "L|DS-A"){
                                await render_FPFF_certificate(rpt_container,response.data[0],value)
                            }
                            
                            var certNumber = response.data[0].ssb
                            var Id = response.data[0].id
                            
                            setTimeout(() => {
                                var no = certNumber === null || certNumber === "" || certNumber.toLowerCase() == "fresher" || certNumber.includes("FRESHER")  ? response.data[0].cnic : certNumber 
                                var qrCodeContainer = document.getElementById('qrcode-container'+response.data[0].id);
                                var qrCode = new QRCode(qrCodeContainer, {
                                    text: no,
                                    width: 130, 
                                    height: 130 
                                });
                            }, 1000);
                            
                        }
                    }
                }
            })
        }
    } else {
        window.history.back();
    }
    
}

//===========================
//    BASIC LINE BORDER        
//===========================


// 5 - 2.0 DONE
function render_CFOS_certificate(rpt_container,data,chapter,qrImage) {
    var htmlString = `
    <div class="container-fluid pdf-container">
        <!-- Your content goes here -->
        <div class="container-fluid p-5">
            <div class="row" style="justify-content: center;">
                <img src="/img/brands/einstituteLogo.png" class="header_img" alt="">
            </div>
            <hr>
            <br>
            <div class="row heading_row mb-2">
                <b><h1 style="font-size: 30px;font-weight: bold;justify-content: center;font-family: Arial, sans-serif"><u>CERTIFICATE</u></h1></b>
            </div>
            <div class="row">
                <div class='col-sm-12 col-md-12 col-lg-12'>
                    <h4 style="font-family: Arial, sans-serif;font-family: 15px;"> Certificate No. <span style="font-weight: bold;"> <u> ${data.certificateNo} </u> </span> </h4>
                </div>
            </div>
            <div class="row">
                <div class='col-sm-12 col-md-12 col-lg-12'>
                    <h4 style="font-family: Arial, sans-serif;font-family: 15px;">  This is to certify that Mr. <span style="font-weight: bold;"> <u> ${data.studentName} </u>  </span> </h4>
                </div>
                <div class='col-sm-3 col-md-3 col-lg-3'></div><div class='col-sm-8 col-md-8 col-lg-8'> <h4 style="font-family: Arial, sans-serif;font-family: 15px;"> <span style="font-weight: bold;"> ${data.fatherName != "" ? "S/O" : ""}  <u> ${data.fatherName} </u>  </span> </h4> </div>
            </div>
            <div class="row">
                <div class='col-sm-12 col-md-12 col-lg-12'>
                    <h4 style="font-family: Arial, sans-serif;font-family: 15px;">  Employee .No. <span style="font-weight: bold;"> <u> ${data.ssb} </u> </span> </h4>
                </div>
            </div>
            <div class="row">
                <div class='col-sm-12 col-md-12 col-lg-12'>
                    <h4 style="font-family: Arial, sans-serif;"> has successfully completed a training based on IMO model course 1.01 for </h4>
                </div>
            </div>
            <hr>
            <div class="row heading_row text-center">
                <h1 style="font-family: Arial, sans-serif;font-family: 15px;color: blue;"> Basic Certificate </h3> 
            </div>
            <hr>
            <div class="row heading_row text-center mb-2">
                <h1 style="font-family: Arial, sans-serif;font-family: 15px;color: blue;font-weight: bold;"> Computer Fundamentals, Operating Systems </h3>
            </div>
            <div class="row text-center ">
                <h4 style="font-family: Arial, sans-serif;">  held from <span style="font-weight: bold;font-size: 20px;"> <u> ${moment(data.startDate).format("DD-MMM-YYYY") } </u> </span> to <span style="font-weight: bold;font-size: 20px;"> <u> ${moment(data.endDate).format("DD-MMM-YYYY") } </u></span> and has been found duly qualified in </h4>
            </div>
            <div class="row text-center mb-1">
                <h4 style="font-family: Arial, sans-serif;">  accordance with the provisions of: </h4>
            </div>`;

       
        
        htmlString += `
           <div class="row pl-3">
                <div class="col-sm-12 col-md-12 col-lg-12 pb-1  text-center">
                    <center> <img src="/img/certificate/certifiedstamp.png" width="300" alt=""> </center>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-sm-6 col-md-5 col-lg-6 pb-1">
                    <h4 style="font-family: Arial, sans-serif; font-size: 18px;"> Date of Birth of Certificate Holder: <span style="font-weight: bold;"> <u> ${data.dob !== "" ? moment(data.dob).format("DD-MMM-YYYY") : "N.A" } </u> </span> </h4>
                </div>
                <div class="col-sm-6 col-md-5 col-lg-6 pb-1">
                    <h4 style="font-family: Arial, sans-serif; font-size: 18px; text-align: end;"> Date of Issue of the Certificate: <span style="font-weight: bold;"> <u> ${moment(data.endDate).format("DD-MMM-YYYY") }  </u> </span> </h4>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6 col-md-5 col-lg-6">
                    <h4 style="font-family: Arial, sans-serif; font-size: 18px;">  National Identity Card No.:  <span style="font-weight: bold;"> <u> ${data.cnic !== "" ? data.cnic : "N.A"} </u> </span> </h4>
                </div>
                <div class="col-sm-6 col-md-5 col-lg-6">
                    <h4 style="font-family: Arial, sans-serif; font-size: 18px; text-align: end;">  </u> </span> </h4>
                </div>
            </div>
            <br>
            <div class="row mb-4">
                <div class="col-sm-6 col-md-6 col-lg-6">
                    <div class="row pl-3">
                        <div class="profile_img">
                            <img src="data:image/jpeg;base64,${data.image}" width="180" height="180" alt=""> 
                        </div>
                        <div id="qrcode-container${data.id}" class="pl-4 pt-4"></div>
                    </div>
                    
                </div>
                <div class="col-sm-6 col-md-6 col-lg-6" style="text-align: end;">
                    <div class="row" style="padding-top:50px">
                        <div style="border-bottom: 4px solid #000; width: 100%;"></div>
                    </div>
                    <div class="row">
                        <h5 style="font-weight:bold">Signature of Candidate</h5>
                    </div>
                    <div class="row " style="padding-top:60px">
                        <div style="border-bottom: 4px solid #000; width: 100%;"></div>
                    </div>
                    <div class="row">   
                        <h5 style="font-weight:bold">Course Incharge</h5>
                    </div>
                    <div class="row" style="padding-top:60px">
                        <div style="border-bottom: 4px solid #000; width: 100%;"></div>
                    </div>
                    <div class="row">
                        <h5 style="font-weight:bold">Principal</h5>
                    </div>
                </div>
            </div>
            <div class="row ">
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <h5 style="font-family: Arial, sans-serif;font-weight: bold;text-align: center;"> Verify your courses through our website www.institute.edu.pk </h5>
                </div>
            </div>
        </div>
    </div>`;    
    rpt_container.innerHTML  += htmlString
}

