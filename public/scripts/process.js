function process(filename, filesize, file){
    alert(IsValidJSON(file,"Invalid"));
}

function batch_process(no_files, filenames, filesizes, files) {
    log("Initiating processing...");
    for (var i = 0; i < files.length; i++)
        process(filenames[i], filesizes[i], files[i]);
}