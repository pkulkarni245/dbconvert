function process(filename, filesize, file) {
    log("Processing " + filename + "(" + filesize + "B)");
    try {
        if (IsValidJSON(file));
        else {
            invalidJSONError(filename);
        }
    } catch (error) {
        invalidJSONError(filename);
    }
    var f = JSON.parse(file);
    for(var i in f){
        var g = f[i];
        //console.log(i + "--->\n" + Object.keys(g) + ": " + Object.values(g));
        console.log(i + "--->")
        for(idx in Object.keys(g)){
            var key = Object.keys(g)[idx];
            var val = Object.values(g)[idx];
            if(val == "[object Object]")
                val = JSON.stringify(val);
            console.log(key + ": " + val);

        }
        /* For one extra depth level
        for(j in g){
            var h = g[j];
            console.log("-----" + j + "-----");
            console.log(Object.keys(h) + ": " + Object.values(h));
        }/*/
    }
}

function batch_process(no_files, filenames, filesizes, files) {
    for (var i = 0; i < files.length; i++)
        process(filenames[i], filesizes[i], files[i]);
}

function invalidJSONError(filename) {
    log("<span class=\"error\">Error: </span>" + filename + " is invalid JSON.");
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