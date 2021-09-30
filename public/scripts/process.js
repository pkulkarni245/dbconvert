function process(filename, filesize, file) {
    try {
        if (IsValidJSON(file));
        else {
            invalidJSONError(filename);
        }
    } catch (error) {
        invalidJSONError(filename);
    }
    var f = JSON.parse(file);
    console.log(f);
    for(var i in f){
        var g = f[i];
        console.log(g);
        for(var j in g){
            var h = g[j];
            console.log(Object.keys(h));
            console.log(Object.values(h));
            console.log(IsValidJSON(JSON.parse(g)));
        }
    }
    /*for(var i in f){
        var g = f[i];
        console.log(g);
        for(var j in g){
            var h = g[j];
            console.log(h);
            for(var k in h){
                console.log(k);
            }
        }
    }*/

    //https://stackoverflow.com/questions/14528385/how-to-convert-json-object-to-javascript-array

    var g = Object.values(f)[0];
    var h = Object.values(g)[0];
    var i = Object.values(h)[0];
    var j = Object.values(i)[0];
    var k = Object.values(j)[1];
    console.log(Object.values(k));

    console.log(json2array(f));

}

function batch_process(no_files, filenames, filesizes, files) {
    log("Processing...");
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