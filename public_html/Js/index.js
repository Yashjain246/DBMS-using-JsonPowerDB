
var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var stuDBName = "SCHOOL-DB";
var stuRelationName = "STUDENT-TABLE";
var connToken = "90934558|-31949210423118502|90959067";

$('#rollno').focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getrollnoAsJsonObj() {
    var rollno = $('#rollno').val();
    var jsonStr = {
        id: rollno
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;

    $('#stuname').val(record.name);
    $('#classNo').val(record.class);
    $('#BirthDate').val(record.BirthDate);
    $('#Address').val(record.Address);
    $('#EnrollmentDate').val(record.EnrollmentDate);
}


function resetForm() {
    $('#rollno').val("");
    $("#stuname").val("");
    $('#classNo').val("");
    $('#BirthDate').val("");
    $('#Address').val("");
    $('#EnrollmentDate').val("");
    $('#rollno').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#change').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#rollno').focus();
}

function validateData() {
    var rollno, stuname, classNo, BirthDate, Address, EnrollmentDate;

    rollno = $('#rollno').val();
    stuname = $('#stuname').val();
    classNo = $('#classNo').val();
    BirthDate = $('#BirthDate').val();
    Address = $('#Address').val();
    EnrollmentDate = $('#EnrollmentDate').val();

    if (rollno === "") {
        alert("Student rollno missing");
        $('#rollno').focus();
        return "";
    }

    if (stuname === "") {
        alert("student Name missing");
        $('#stuname').focus();
        return "";
    }

    if (classNo === "") {
        alert("Student class missing");
        $('#classNo').focus();
        return "";
    }

    if (BirthDate === "") {
        alert("BirthDate missing");
        $('#BirthDate').focus();
        return "";
    }

    if (Address === "") {
        alert("Address missing");
        $('#Address').focus();
        return "";
    }

    if (EnrollmentDate === "") {
        alert("Enrollment Date missing");
        $('#EnrollmentDate').focus();
        return "";
    }

    var jsonStrObj = {
        id: rollno,
        name: stuname,
        class: classNo,
        BirthDate: BirthDate,
        Address: Address,
        EnrollmentDate: EnrollmentDate
    };

    return JSON.stringify(jsonStrObj);
}

function changeData() {
    $('#change').prop("disabled", true);

    var jsonChg = validateData();
    if (jsonChg === "")
        return;

    var recNo = localStorage.getItem("recno");
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stuDBName, stuRelationName, recNo);

    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});

    console.log(resJsonObj);
    resetForm();
    $('#rollno').focus();
}

function getRollno() {
    var rollnoJsonObj = getrollnoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stuDBName, stuRelationName, rollnoJsonObj);

    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    console.log("GET response:", resJsonObj); // ✅ See if it's 200 or 400

    if (resJsonObj.status === 400) {
        console.log("New record. Enabling save.");
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#stuname").focus();
    } else if (resJsonObj.status === 200) {
        console.log("Record found. Filling form.");
        $("#rollno").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#stuname").focus();
    } else {
        console.log("Unexpected status:", resJsonObj.status);
    }
}



function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }

    var putRequest = createPUTRequest(connToken, jsonStrObj, stuDBName, stuRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#rollno').focus();
}


