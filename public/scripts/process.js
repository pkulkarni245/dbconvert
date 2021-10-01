function process(filename, filesize, file) {
    var tablecontainer = document.getElementById("table-container");
    var table = document.createElement("table");
    table.classList.add("result-table");
    var tablebody = document.createElement("tbody");
    table.appendChild(tablebody);
    tablecontainer.appendChild(table);
    log("Processing " + filename + "(" + filesize + "B)");
    var invalidJSONLogMessage = "<span class=\"error\">Error: </span>" + filename + " is invalid JSON.";
    try {
        if (IsValidJSON(file));
        else {
            log(invalidJSONLogMessage);
            invalidJSONError(filename);
        }
    } catch (error) {
        log(invalidJSONLogMessage);
        invalidJSONError(filename);
    }
    var f = JSON.parse(file);
    for(var i in f){
        var trow = table.insertRow();
        var g = f[i];
        if(i == 0){//insert table header
            var thead = document.createElement("thead");
            var titlerow = thead.insertRow();
            var tablename = titlerow.insertCell();
            tablename.colSpan = "10000";
            tablename.classList.add("table-title");
            var rtablename = filename.split(".json")[0];
            tablename.innerHTML = rtablename;
            
            var headrow = thead.insertRow();
            var k;
            for(k in Object.keys(g)){
                var headcell = headrow.insertCell();
                headcell.innerHTML = Object.keys(g)[k];
            }
            table.appendChild(thead);
        }
        for(idx in Object.keys(g)){
            var key = Object.keys(g)[idx];
            var val = Object.values(g)[idx];
            if(val == "[object Object]")
                val = JSON.stringify(val);
            tcell = trow.insertCell();
            tcell.innerHTML = val;

        }
        
    }
}

function batch_process(no_files, filenames, filesizes, files) {
    for (var i = 0; i < files.length; i++)
        process(filenames[i], filesizes[i], files[i]);
}

function invalidJSONError(filename) {
    $("#form-container, #table-container").toggleClass("active");
    $("#upload-form").trigger("reset");
}

function json2array(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
}