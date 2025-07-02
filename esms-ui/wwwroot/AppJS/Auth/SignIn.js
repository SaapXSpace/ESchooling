import  {GETAPIURL,GETBYID,POST,PUT,DELETE,CLEAR,FILLCOMBO}  from "../Service/ApiService.js";
import { Roles } from "../Service/Security.js";

// INITIALIZING VARIBALES
var end_point; 
var btn_login = $('#btn_login'); 
var ipeinstituteLogo = '';

// jQuery CONSTRUCTOR
$(document).ready(function () {    
    localStorage.clear()
    end_point = '/AuthService';
    getLocalIP(ip => {
        console.log(`Local IP einstituteLogo: ${ip}`)
        ipeinstituteLogo = ip
    });
    discon();    
});


// DISCONNECTION FUNCTION
function discon(){
    CLEAR();
}

// // VALIDATION FUNCTION
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '' ,id='';
   

    var txt_role = $('#txt_role');   
    var txt_Email = $('#txt_email');
    var txt_Password = $('#txt_password');

    if (txt_Password.val() == '') {
        ck = 1;
        _Error = 'Invalid Password';
        txt_Password.focus();
    }
    if (txt_Email.val() == '') {
        ck = 1;
        _Error = 'Please Enter Email';
        txt_Email.focus();
    }
    if (txt_role.val() == '') {
        ck = 1;
        _Error = 'Please Enter Vendor Type';
        txt_role.focus();
    }

    getLocalIP(displayLocalIP);

    function displayLocalIP(ip) {
            ipeinstituteLogo = ip;
    }

    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
    }

    else if (!Boolean(ck)) {
        _cre = JSON.stringify({
            "email": txt_Email.val(),
            "password": txt_Password.val(),
            "ip": ipeinstituteLogo,
            'header' : window.navigator.userAgent
        });
    }
    return { ckval: ck, creteria: _cre };
}

function getLocalIP(callback) {
    const rtc = new RTCPeerConnection({ iceServers: [] });
    rtc.createDataChannel('');
    rtc.createOffer()
        .then(offer => rtc.setLocalDescription(offer))
        .catch(console.error);
    
    rtc.onicecandidate = event => {
        var ipv4 = event.currentTarget.localDescription.sdp
        const ipMatch = /([0-9]{1,3}\.){3}[0-9]{1,3}/.exec(ipv4);
        if (event.candidate) {
            const ipMatch = /([0-9]{1,3}\.){3}[0-9]{1,3}/.exec(ipv4);
            if (ipMatch) {
                callback(ipMatch[0]);
                rtc.onicecandidate = () => {};  // Stop after finding the first IP
            }
        }
    };
}


// ADD BUTTON EVENT
$('fieldset').on('click', '#btn_login', function (e) {
    btn_login.prop("disabled", true);
    Login();
});   

// $('fieldset').on('click', '#btn_login', function (e) {
//     window.location.href='/Dashboards/Analytics';
// });
function Login(){
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;

    $.ajax({
        url: apiUrl + end_point + '/UserLogin',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data:  _cre,
        success: function (response) {
            btn_login.prop("disabled", false);
            
            if ( response.statusCode == 200) {
                localStorage.setItem(("Id"),btoa(response.data.id))
                localStorage.setItem(("UserName"),btoa(response.data.firstName +" "+ response.data.lastName))
                localStorage.setItem(("Phone"),btoa(response.data.contact))     
                localStorage.setItem(("Email"),btoa(response.data.email))
                localStorage.setItem(("Role"),btoa(response.data.role))
                localStorage.setItem(api_signature, response.message)
                window.location.href='/Dashboard/Dashboards/IndexDashboard';
            }
            else {
                btn_login.prop("disabled", false);
                Swal.fire({
                    title: response.message,
                    icon: 'warning',
                    showConfirmButton: true,
                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }
                })
            }
        },
        error: function (xhr, status, err) {
            btn_login.prop("disabled", false);
            Swal.fire({
                title: xhr.status.toString() + ' #'+ status + '\n' + xhr.responseText,
                width: 800,
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

var input = document.getElementById("txt_password");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        Login();
    }
});
