

export const GETAPIURL = (end_point)=>{
    return apiUrl + end_point
}

export  const  POST = (end_point,_cre,Onload) =>{
   Swal.fire({
        title: 'Are you sure you want to save?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Save',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }

    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: apiUrl + end_point,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data:  _cre,
                success: function (response) {
                    if ( response.statusCode == 200) {                       
                        $('#data_Model').modal('hide');
                        Onload();
                        Swal.fire({
                            title: response.message,
                            icon: 'success',
                            showConfirmButton: true,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }
                        })
                    }
                    else {
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
    })
   return true
}

export const PUT = (end_point,_cre,Onload)=>{
    Swal.fire({
        title: 'Are you sure you want to Update?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Update',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }

    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: apiUrl + end_point,
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                data:  _cre,
                success: function (response) {
                    if ( response.statusCode == 200) {                       
                         $('#data_Model').modal('hide');
                         Onload();
                        Swal.fire({
                            title: response.message,
                            icon: 'success',
                            showConfirmButton: true,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }
                        })
                    }
                    else {
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
    })
    return true;
}

export const GETBYID = (end_point, _id,_name,petchdata)=>{
    Swal.fire({
        title: 'Are sure wants to edit <br/>' + _name + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Edit',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: apiUrl + end_point,
                type: "Get",
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("_Id", _id);
                },
                success: function (response) {
                    if (response.statusCode == '200') {
                        petchdata(response.data)
                    }
                    else {
                        Swal.fire({
                            title: response.message ,
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
                    Swal.fire({
                        title: xhr.status.toString() + ' #'+ status + '\n' + xhr.responseText,
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
    })
}
export const DELETE = (end_point,_Id,_name,Onload)=>{
    Swal.fire({
        title: 'Are sure wants to delete <br> ' + _name + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: apiUrl + end_point,
                type: "Delete",
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Id", _Id);
                },
                success: function (response) {
                    if (response.statusCode == 200) {
                        Swal.fire({
                            title: response.message,
                            icon: 'success',
                            showConfirmButton: true,

                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }
                        })
                        Onload();
                    }
                    else {
                        //var _title = response.statusCode == 405 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + response.message + "' target='_blank'>"+ " " + response.message + "</a>" : response.message;
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
                    Swal.fire({
                        title: xhr.status.toString() + ' #'+ status + '\n' + xhr.responseText,
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
    })
}

export const CLEAR = ()=>{
    document.getElementById('create_form').reset();
}

export const FILLCOMBO = (end_point,$element)=>{
    var $request = $.ajax({
        url: apiUrl + end_point, //GETAPIURL('/ListOfViewService/GetMenuCategoryListOfView') 
        // beforeSend: function (xhr) {
        //     xhr.setRequestHeader("User", localStorage.getItem("Id"));
        // },
     });

     
    var option = new Option("", "0", true, true);
    $element.append(option); 
    $request.then(function (responce) {
        if (responce.data!=null) {
            for (var d = 0; d < responce.data.length; d++) {
                var item = responce.data[d];
                var option = new Option(item.name, item.id, false, false);
                $element.append(option);
        }
        
        }
           
    });
     //$element.trigger('change');
}



export const FILLCOMBOUSER = (end_point,$element)=>{
    
    var $request = $.ajax({
        url: apiUrl + end_point, //GETAPIURL('/ListOfViewService/GetMenuCategoryListOfView') 
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Id", localStorage.getItem("Id"));
        },
     });

     
    var option = new Option("  ", "0", true, true);
    $element.append(option); 
    $request.then(function (responce) {
        
        for (var d = 0; d < responce.data.length; d++) {
        var item = responce.data[d];
        var option = new Option(item.name, item.id, false, false);
        $element.append(option);
        }
           
    });
     //$element.trigger('change');
}


export const FILLCOMBOFILTER = (end_point,$element,Id)=>{
    
    var $request = $.ajax({
        url: apiUrl + end_point, //GETAPIURL('/ListOfViewService/GetMenuCategoryListOfView') 
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Search", Id.toString());
        },
     });

     $element.CLEAR
    //var option = new Option(" ", "0", true, true);
    //$element.append(option); 
    $request.then(function (responce) {
        for (var d = 0; d < responce.data.length; d++) {
        var item = responce.data[d];
        var option = new Option(item.name, item.id, false, false);
        $element.append(option);
        }
    });
     //$element.trigger('change');
}





