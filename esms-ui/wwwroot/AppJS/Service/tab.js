
function viewhead(tcount) {
    var ckviewhead = document.getElementsByName("ck_view_head");
    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        document.getElementById("ck_view" + tcount + i).checked = Boolean(ckviewhead[tcount].checked);
    }
}

function allowhead(tcount) {
    var ckviewhead = document.getElementsByName("ck_allow_head");
    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        document.getElementById("ck_allow" + tcount + i).checked = Boolean(ckviewhead[tcount].checked);
    }
}


function newhead(tcount) {
    var cknewhead = document.getElementsByName("ck_new_head");
    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        document.getElementById("ck_new" + tcount + i).checked = Boolean(cknewhead[tcount].checked);
    }
}

function updatehead(tcount) {
    var ckupdatehead = document.getElementsByName("ck_update_head");
    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        document.getElementById("ck_update" + tcount + i).checked = Boolean(ckupdatehead[tcount].checked);
    }
    
}

function deletehead(tcount) {
    var ckdeletehead = document.getElementsByName("ck_delete_head");
    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        document.getElementById("ck_delete" + tcount + i).checked = Boolean(ckdeletehead[tcount].checked);
    }
}

function printhead(tcount) {
    var ckprinthead = document.getElementsByName("ck_print_head");
    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        document.getElementById("ck_print" + tcount + i).checked = Boolean(ckprinthead[tcount].checked);
    }
}


function checkhead(tcount) {
    var ckcheckhead = document.getElementsByName("ck_check_head");
    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        document.getElementById("ck_check" + tcount + i).checked = Boolean(ckcheckhead[tcount].checked);
    }
}

function approvedhead(tcount) {
    var ckapprovedhead = document.getElementsByName("ck_approved_head");
    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        document.getElementById("ck_approved" + tcount + i).checked = Boolean(ckapprovedhead[tcount].checked);
    }
}

function cancelhead(tcount) {
    var ckcancelhead = document.getElementsByName("ck_cancel_head");
    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        document.getElementById("ck_cancel" + tcount + i).checked = Boolean(ckcancelhead[tcount].checked);
    }
}

function taxhead(tcount) {
    var cktaxhead = document.getElementsByName("ck_tax_head");
    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        document.getElementById("ck_tax" + tcount + i).checked = Boolean(cktaxhead[tcount].checked);
    }
}
