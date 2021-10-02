function process(filename, filesize, file) {
    var tablecontainer = document.getElementById("table-container");
    var table = document.createElement("table");
    table.classList.add("result-table");
    table.setAttribute("contenteditable","true");
    var tablebody = document.createElement("tbody");
    table.appendChild(tablebody);
    tablecontainer.insertBefore(table, document.getElementById("verify-button"));
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

    //Obtain List of all Keys in Collection
    var keylist = obtainKeys(f);
    //Add Table Header
    var thead = document.createElement("thead");
    table.appendChild(thead);
    var titlerow = thead.insertRow();
    var tablename = document.createElement("th");
    thead.appendChild(tablename);
    tablename.colSpan = "100";
    tablename.classList.add("table-title");
    var rtablename = filename.split(".json")[0];
    tablename.innerHTML = rtablename;
    var headrow = thead.insertRow();
    for(var k in keylist){
        var headcell = document.createElement("th");
        headcell.classList.add("colname");
        headrow.appendChild(headcell);
        headcell.innerHTML = keylist[k];
    }

    //Iteratively obtain all corresponding values
    for(var i in f){
        var trow = tablebody.insertRow();
        var g = f[i];
        var keys = Object.keys(g);
        var values = Object.values(g);
        for(isx in keylist){
            val = "null";
            for(idx in Object.keys(g)){
                if(Object.keys(g)[idx] == keylist[isx]){
                    var val = Object.values(g)[idx];
                    if(val == "[object Object]")
                        val = JSON.stringify(val);
                }
            }
            var tcell = trow.insertCell();
            tcell.innerHTML = val;
            if(val == "null"){
                tcell.classList.add("null-value-cell");
            }
        }
    }
}

function obtainKeys(f){
    var keys = [];
    for(var i in f){
        var g= f[i];
        for(idx in Object.keys(g)){
            var key = Object.keys(g)[idx];
            if(!keys.includes(key))
                keys.push(key);
        }
    }
    return keys;
}

function batch_process(no_files, filenames, filesizes, files) {
    for (var i = 0; i < files.length; i++)
        process(filenames[i], filesizes[i], files[i]);
    alertedits = true;
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