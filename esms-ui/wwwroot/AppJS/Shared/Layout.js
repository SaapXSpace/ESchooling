
// Form Request Name get from URL param
var url = new URLSearchParams(window.location.search);
var Id = '';
if (url.has('M')) {
    Id = window.atob(url.get('M'));
}
var app_token = ""
var LoginUserId = ""
var LoginUser = ""
var Role = ""
var Email = ""
var Phone = ""
var Role = ""

// jQuery CONSTRUCTOR
$(document).ready(function () {  
    if (localStorage.getItem(api_signature) != null) {
        app_token = localStorage.getItem(api_signature)
        LoginUserId = atob(localStorage.getItem("Id"))
        LoginUser = atob(localStorage.getItem("UserName"))
        Email = atob(localStorage.getItem("Phone"))
        Phone = atob(localStorage.getItem("Email"))
        Role = atob(localStorage.getItem("Role"))
        Onload()
        startTime()
    }else{
        window.location.href='/Auth/SignIn';
    }
  });

// ONLOAD FUNCTION
function Onload() {
    var tbl_row_cnt = 1;
    $.ajax({
        url: apiUrl + "/api/v1/ConfigurationLovService/GetMenuInitializer",
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
        },
        success: function (response) {
            if (response.statusCode === "200") {
                CreateMenu(response.data)
            }
        },
        error: function (xhr, status, err) {
            if (xhr.status == 401) {
                setTimeout("location.href = '../../Auth/SignIn';",0);
            }else if (xhr.status === 500){
                Swal.fire({
                    title: "Server is Down",
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
                return
            }
            
        }
    })
    return true;
}

function CreateMenu(responce) {
    var modules = [];
    var modulesObj = {};
    var menuCategories = [];
    var menuCategoriesObj = {};
    for (const obj in responce) {
        if (!modules.includes(responce[obj].moduleName)) {
            modules.push(responce[obj].moduleName)
            modulesObj[responce[obj].moduleName] = responce[obj]
        }if (!menuCategories.includes(responce[obj].menuCategoryName)) {
            menuCategories.push(responce[obj].menuCategoryName)
            menuCategoriesObj[responce[obj].menuCategoryName] = responce[obj]
        }
    }
    
    var menuSubCategory=""
   
    var menu = '<li class="sidebar-item">'
    for (const module in modulesObj) {
           if (modulesObj[module].moduleName.replace(" ","") === modulesObj[module].menuAlias) {
                menu += '<a class="sidebar-link" href="' + (modulesObj[module].menuURL.replace(" ","") + "?M=" + btoa(modulesObj[module].menuId)) + '"> <i class="align-middle mr-2 ' + modulesObj[module].moduleIcon + '"></i>' + modulesObj[module].moduleName + '</a>';
                continue;
           }
           menu+= '<a href="#'+ module +'" data-toggle="collapse" class="sidebar-link collapsed">'
                menu+=	'<i class="align-middle mr-2 '+modulesObj[module].moduleIcon+'"></i> <span class="align-middle">'+ modulesObj[module].moduleName +'</span>'
            menu+='</a>'
            menu+='<ul id="'+ module +'" class="sidebar-dropdown list-unstyled collapse" data-parent="#sidebar">'
                menu+='<li class="sidebar-item">'
                
            for (const menuCategory in menuCategoriesObj) {
                menuSubCategories = responce.filter(function(obj) {
                    return obj.moduleName === module && obj.menuCategoryName === menuCategory;
                }); 
                if (menuSubCategories.length != 0) {
                    menu+='<a href="#'+menuCategory+'" data-toggle="collapse" class="sidebar-link collapsed">'
                    menu+='<i class="align-middle mr-2 '+ menuCategoriesObj[menuCategory].menuCategoryIcon+ '"></i><span class="align-middle"> '+ menuCategoriesObj[menuCategory].menuCategoryName +'</span>'
                    menu+='</a>'
                    menu+='<ul id="'+menuCategory+'" class="sidebar-dropdown list-unstyled collapse" data-parent="#'+module+'">'
                
                    for (const menuSubCategory of menuSubCategories) {
                            menu+='<li class="sidebar-item"><a class="sidebar-link" href="'+ (menuSubCategory.menuURL +"?M="+ btoa(menuSubCategory.menuId)) +'"> <i class="align-middle mr-2 '+ menuCategoriesObj[menuCategory].menuIcon+ '"></i>' +menuSubCategory.menuAlias+'</a></li>'
                    }
                    menu+='</ul>'
                }
            }
                menu+='</li>'
            menu+='</ul>'
            
            
    }
    menu+='</li>'
    var sidebar = document.getElementById("sideMenu")
    sidebar.innerHTML=""
    sidebar.innerHTML =  menu;
    
}

// function CreateMenu(response) {
//     var modules = [];
//     var modulesObj = {};
//     var menuCategories = [];
//     var menuCategoriesObj = {};
    
//     for (const obj in response) {
//         if (!modules.includes(response[obj].moduleName)) {
//             modules.push(response[obj].moduleName)
//             modulesObj[response[obj].moduleName] = response[obj]
//         }
//         if (!menuCategories.includes(response[obj].menuCategoryName)) {
//             menuCategories.push(response[obj].menuCategoryName)
//             menuCategoriesObj[response[obj].menuCategoryName] = response[obj]
//         }
//     }
    
//     var menu = '<li class="sidebar-item">'
    
//     for (const module in modulesObj) {
//         var hasSubCategories = false;
//         for (const menuCategory in menuCategoriesObj) {
//             var menuSubCategories = response.filter(function(obj) {
//                 return obj.moduleName === module && obj.menuCategoryName === menuCategory;
//             }); 
//             if (menuSubCategories.length != 0) {
//                 hasSubCategories = true;
//                 menu += '<a href="#' + menuCategory + '" data-toggle="collapse" class="sidebar-link collapsed">'
//                 menu += '<i class="align-middle mr-2 ' + menuCategoriesObj[menuCategory].menuCategoryIcon + '"></i><span class="align-middle"> ' + menuCategoriesObj[menuCategory].menuCategoryName + '</span>'
//                 menu += '</a>'
//                 menu += '<ul id="' + menuCategory + '" class="sidebar-dropdown list-unstyled collapse" data-parent="#' + module + '">'
//                 for (const menuSubCategory of menuSubCategories) {
//                     menu += '<li class="sidebar-item"><a class="sidebar-link" href="' + (menuSubCategory.menuURL + "?M=" + btoa(menuSubCategory.menuId)) + '"> <i class="align-middle mr-2 ' + menuCategoriesObj[menuCategory].menuIcon + '"></i>' + menuSubCategory.menuAlias + '</a></li>'
//                 }
//                 menu += '</ul>'
//             }
//         }

        
//         // if (!hasSubCategories && modulesObj[module].moduleName === menuCategoriesObj[module].menuCategoryName && menuCategoriesObj[module].menuCategoryName === menuSubCategory.menuAlias) {
//         //     menu += '<a class="sidebar-link" href="' + (modulesObj[module].menuURL + "?M=" + btoa(modulesObj[module].menuId)) + '"> <i class="align-middle mr-2 ' + modulesObj[module].moduleIcon + '"></i>' + modulesObj[module].moduleName + '</a>';
//         // } else {
//         //     menu += '<a href="#' + module + '" data-toggle="collapse" class="sidebar-link collapsed">'
//         //     menu += '<i class="align-middle mr-2 ' + modulesObj[module].moduleIcon + '"></i> <span class="align-middle">' + modulesObj[module].moduleName + '</span>'
//         //     menu += '</a>'
//         //     menu += '<ul id="' + module + '" class="sidebar-dropdown list-unstyled collapse" data-parent="#sidebar">'
//         //     menu += '<li class="sidebar-item">'
//         //     menu += '</li>'
//         //     menu += '</ul>'
//         // }
//     }
//     menu += '</li>'
    
//     var sidebar = document.getElementById("sideMenu")
//     sidebar.innerHTML = menu;
// }


//Timing Start
function startTime() {
    var today = new Date();
    $("#ClockTime").html(
        //        "Date: " + moment(today).format("DD-MMM-YYYY") + "<br/> Time : " + moment(today).format("HH:mm:ss"));
        moment(today).format("DD - MMMM - YYYY") + " " +
        moment(today).format("HH : mm : ss"))
    var t = setTimeout(startTime, 500);
}
//Time End

