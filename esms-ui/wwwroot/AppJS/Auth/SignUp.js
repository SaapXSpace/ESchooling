import  {GETAPIURL,GETBYID,POST,PUT,DELETE,CLEAR,FILLCOMBO}  from "../Service/ApiService.js";

// MAP VAIRABLE
// Initializes map
var map = L.map('map');
L.Control.geocoder().addTo(map);
L.control.locate().addTo(map);
var latitude=0;
var longitude=0;
var CurrenteinstituteLogo="";

let marker, circle, zoomed;

// INITIALIZING VARIBALES
var end_point; var btn_register = $('#btn_register'); 

// jQuery CONSTRUCTOR
$(document).ready(function () {    
    end_point = '/Vendor';
    discon();
    ComponentsDropdowns.init();
});

// --- Fill Select 2 of Module ---
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        FillVendorType();   //
    }
    return {
        init: function () {
            handleSelect2();
        }
    };
}();

// Populate Vendor Type Options in Vendor Type Dropdown 
function FillVendorType() {
    var $element = $('#txt_VendorType').select2(); 
    FILLCOMBO('/ListOfViewService/GetVendorTypeListOfView',$element)
}

// DISCONNECTION FUNCTION
function discon(){
    CLEAR();
    Map()
}

function Map(){
    // Temporary Map
    navigator.geolocation.getCurrentPosition(function(position) {
        latitude = position.coords.latitude
        longitude = position.coords.longitude       
        var geo= "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude="+ latitude +"&longitude="+longitude+"&localityLanguage=en"
        fetch(geo).then(res => res.json()).then(data => {

            CurrenteinstituteLogo = data.locality +", "+ data.localityInfo.administrative[data.localityInfo.administrative.length -1].name +", "+ data.city +", "+ data.countryName
            if (document.getElementById("txt_location")) {
                document.getElementById("txt_location").value = CurrenteinstituteLogo
                document.getElementById("txt_lat").value = latitude
                document.getElementById("txt_long").value = longitude
            }
        })
    })
}

// VALIDATION FUNCTION
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '' ,id='';
    var txt_VendorType = $('#txt_VendorType');   
    var txt_Company = $('#txt_Company');
    var txt_VendorName = $('#txt_VendorName');
    var txt_location = $('#txt_location');
    var txt_lat = $('#txt_lat');
    var txt_long = $('#txt_long');
    var txt_Phone = $('#txt_Phone');
    var txt_Email = $('#txt_Email');
    var txt_Document = $('#txt_Document');
    var txt_Password = $('#txt_Password');
    var txt_ConfirmPassword = $('#txt_ConfirmPassword');
    var ck_TermAndCondition = $('#ck_TermAndCondition'); 

    if (!ck_TermAndCondition[0].checked) {
        ck = 1;
        _Error = 'Plz Read Our Term And Condition';
        ck_TermAndCondition[0].focus();
    }

    if (txt_ConfirmPassword.val() != txt_Password.val()) {
        ck = 1;
        _Error = 'Password Mis-Matched Enter Valid Password';
        txt_ConfirmPassword.focus();
    }

    if (txt_Password.val() != '') {
        var passwordformate=  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        if(!txt_Password.val().match(passwordformate)) 
        { 
            ck = 1;
            _Error = 'Check your password between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character';
            txt_Password.focus();
        }  
    }

    if (txt_Document.val() == '') {
        ck = 1;
        _Error = 'Please Select Document';
        txt_Document.focus();
    }
    if (txt_Email.val() == '') {
        ck = 1;
        _Error = 'Please Enter Email';
        txt_Email.focus();
    }

    if (txt_Email.val() != '') {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!txt_Email.val().match(mailformat))
        {
            ck = 1;
            _Error = 'Please Enter Your Valid Email Patteren';
            txt_Email.focus();
        }
    }
    
    if (txt_Phone.val() == '') {
        ck = 1;
        _Error = 'Please Enter Phone Number';
        txt_Phone.focus();
    }
    if (txt_location.val() == '') {
        ck = 1;
        _Error = 'Please Enter Your Location';
        txt_location.focus();
    }
    if (txt_VendorName.val() == '') {
        ck = 1;
        _Error = 'Please Enter Vendor Name';
        txt_VendorName.focus();
    }
    if (txt_Company.val() == '') {
        ck = 1;
        _Error = 'Please Enter Company Name';
        txt_Company.focus();
    }
    if (txt_VendorType.val() == '') {
        ck = 1;
        _Error = 'Please Enter Vendor Type';
        txt_VendorType.focus();
    }
    // if (.val() == '') {
    //     id= '00000000-0000-0000-0000-000000000000'
    // }
    else{
        // id = txt_id.val()
    }

    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
    }

    else if (!Boolean(ck)) {
        _cre = JSON.stringify({
            "code":"NULL",
            "vendorTypeId": txt_VendorType.val(),
            "companyName": txt_Company.val(),
            "branch": "NULL",
            "userName": txt_VendorName.val(),
            "location": txt_location.val(),
            "lat": txt_lat.val(),
            "long": txt_long.val(),
            "phone": txt_Phone.val(),
            "email": txt_Email.val(),
            "document": txt_Document.val(),
            "hashPassword": txt_Password.val(),
            "approval": false,
        });
    }
    return { ckval: ck, creteria: _cre };
}

// ADD BUTTON EVENT
$('fieldset').on('click', '#btn_register', function (e) {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    POST(end_point + "/AddVendor",_cre,function () {
        discon();
    });
});





// MAP CODE

function getCurrentLocationOnMap() {
    navigator.geolocation.watchPosition(success, error);
    function success(pos) {
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        
        // Sets initial coordinates and zoom level
        map.setView([latitude, longitude], 13.2);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map); 
        //Sets map data source and associates with map

        if (marker) {
            map.removeLayer(marker);
            map.removeLayer(circle);
        }
        // Removes any existing marker and circule (new ones about to be set)
    
        marker = L.marker([latitude, longitude]).addTo(map);
        circle = L.circle([latitude, longitude], { radius: accuracy }).addTo(map);
        // Adds marker to the map and a circle for accuracy
    
        if (!zoomed) {
            zoomed = map.fitBounds(circle.getBounds()); 
        }
        // Set zoom to boundaries of accuracy circle
    
        map.setView([latitude, longitude]);
        // Set map focus to current user position

            CurrenteinstituteLogo ="";

            fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=87f70e732bbd44d984f351fc57d3e4cc`
            )
            .then((response) => response.json())
            .then((response) => {CurrenteinstituteLogo = (response.results[0].formatted)})

            .catch((err) => console.error(err));
    }
    function error(err) {
        if (err.code === 1) {
            alert("Please allow geolocation access");
        } else {
            alert("Cannot get current location");
        }
    }
}

  const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?"
  var txtInput = document.getElementById("location_input")
  txtInput.addEventListener('keyup', function (e) {
    const params = {
        q :e.target.value,
        format:'json',
        einstituteLogodetails:1,
        polygon_geojson:0,
        countrycodes:"pk",
      }
      const queryString = new URLSearchParams(params).toString();
      const requestOptions = {
        method:"GET",
        redirect:"follow",
      }
      fetch(`${NOMINATIM_BASE_URL}${queryString}`,requestOptions)
      .then((response)=>(response.text()))
      .then((result)=>(
          setSearchValue(JSON.parse(result))))
      .catch((err)=>(console.log(err)))


  })



  const setSearchValue = (locations)=>{
      locations.map((item)=>{
          const newliTag = document.getElementById('location_input'); 
          newliTag.addEventListener("change", function(){
            latitude = item.lat
            longitude = item.lon

             if (marker) {
              map.removeLayer(marker);
              map.removeLayer(circle);
              }
          
            // Removes any existing marker and circule (new ones about to be set)
      
          marker = L.marker([latitude, longitude]).addTo(map);
          circle = L.circle([latitude, longitude]).addTo(map);
          // Adds marker to the map and a circle for accuracy
      
          if (!zoomed) {
              zoomed = map.fitBounds(circle.getBounds()); 
          }
          // Set zoom to boundaries of accuracy circle
      
          map.setView([latitude, longitude]);
          // Set map focus to current user position
          })
      })
  }
  
  var popup = L.popup();
  async function onMapClick(e) {
      if (marker) {
          map.removeLayer(marker);
          map.removeLayer(circle);
      }
      marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
  
      if (!zoomed) {
          zoomed = map.fitBounds(circle.getBounds()); 
      }

      latitude = e.latlng.lat;
      longitude = e.latlng.lng

      // Set zoom to boundaries of accuracy circle
      map.setView([latitude, longitude]);

        //Get Full einstituteLogo using Selected Latititude and longitude
        fetch(
           // `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=87f70e732bbd44d984f351fc57d3e4cc`
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=6c40b2fb2b7e4c2aa795be2fef33f3fc`
        
           )
        .then((response) => response.json())
        .then((response) =>  CurrenteinstituteLogo = (response.results[0].formatted))
        .catch((err) => console.error(err));
        
        popup
        .setLatLng(e.latlng)
        .setContent(CurrenteinstituteLogo + "\n" + e.latlng.toString())
        .openOn(map)
       
       
  }
  map.on('click', onMapClick);

  // Save map info button event
$('div').on('click', '#save_location', function (e) {
    if (document.getElementById("txt_location")) {
        document.getElementById("txt_location").value = CurrenteinstituteLogo
        document.getElementById("txt_lat").value = latitude
        document.getElementById("txt_long").value = longitude
    }
    $('#modalMap').modal('hide');
});

$('div').on('click', '#current_location', function (e) {
    getCurrentLocationOnMap();
});

// OPEN MAP MODAL 
$('div').on('focus', '#txt_location', function (e) {
    $('#modalMap').modal('show');
    setTimeout(() => {   
        getCurrentLocationOnMap()
    },500);
});


