export const GETAPIURL = (end_point) => {
    return apiUrl + end_point
}

export const POST = (end_point, _cre, Onload) => {
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
                data: _cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
                },
                success: function (response) {
                  
                    if (response.statusCode === "200") {
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
                        title: xhr.status.toString() + ' #' + status + '\n' + xhr.responseText,
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

export const PUT = (end_point, _cre, Onload) => {
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
                data: _cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
                },
                success: function (response) {
                    if (response.statusCode === "200") {
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
                        title: xhr.status.toString() + ' #' + status + '\n' + xhr.responseText,
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

export const GETBYID = (end_point, _id, _name, petchdata) => {
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
                    xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
                    console.log("id" + _id),
                        console.log("id" + app_token)
                },
                success: function (response) {
                    if (response.statusCode === '200') {
                        petchdata(response.data)
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
                        title: xhr.status.toString() + ' #' + status + '\n' + xhr.responseText,
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
}
export const DELETE = (end_point, _Id, _name, Onload) => {
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
                    xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
                },
                success: function (response) {
                    if (response.statusCode === "200") {
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
                        title: xhr.status.toString() + ' #' + status + '\n' + xhr.responseText,
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

export const CLEAR = () => {
    document.getElementById('create_form').reset();
}

export const FILLCOMBO = (end_point, $element, placeholder) => {
    var $request = $.ajax({
        url: apiUrl + end_point,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
        },
    });

    $request.then(function (responce) {
        if (responce != null) {
            $element.empty(); // Clear existing options
            if (responce.statusCode === "200") {
                $element.select2({
                    placeholder: "Select " + placeholder,
                    multiple: false,
                    data: [{ id: -1, text: "Select " + placeholder + "" }, ...responce.data?.map((itm) => ({ text: itm.name, id: itm.id, fees: itm.fees, words: itm.words }))]
                });
            } else {
                $element.select2({
                    placeholder: "Select " + placeholder,
                    data: [{ id: -1, text: "Select " + placeholder + "" }]
                });

            }
        }

    });
}

export const FILLCOMBOBYID = (Id, end_point, $element, placeholder) => {
    var $request = $.ajax({
        url: apiUrl + end_point,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader("_Id", Id);
        },
    });
    $request.then(function (responce) {
        if (responce != null) {
            $element.empty(); // Clear existing options
            if (responce.statusCode === "200") {

                $element.select2({
                    placeholder: "Select " + placeholder,
                    multiple: false,
                    data: [{ id: -1, text: "Select " + placeholder + "" }, ...responce.data?.map((itm) => ({ text: itm.name, id: itm.id, fees: itm.fees }))]
                });
            } else {
                $element.select2({
                    placeholder: "Select " + placeholder,
                    data: [{ id: -1, text: "Select " + placeholder + "" }]
                });
            }
        }
    });
}

export const FILLCOMBOFILTER = (end_point, $element, Id) => {
    var $request = $.ajax({
        url: apiUrl + end_point,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + app_token);
            xhr.setRequestHeader("Search", Id.toString());
        },
    });

    $element.empty();
    $request.then(function (responce) {
        if (responce && responce.statusCode === "200" && responce.data) {
            $element.select2({
                placeholder: "Select option", 
                multiple: false,
                data: [{ id: -1, text: "Select option" }, ...responce.data.map((item) => ({ text: item.name, id: item.id }))]
            });
        } else {
            $element.select2({
                placeholder: "No options available",
                data: [{ id: -1, text: "No options available" }]
            });
        }
    });
}
