$(document).ready(function () {
    localStorage.clear();
    log("Loaded site");
    $("#file-upload").change(function (e) {
        localStorage.clear();
        $("#invalid-file-list").html("Only JSON files are permitted.<br>");
        var files = e.target.files;
        var file = {};
        var no_files = 0;
        var fileName = "";
        var filenames = [];
        var filesizes = [];
        var no_rejected = 0;
        for (var i = 0; i < files.length; i++) {
            if (files[i].type != "application/json") {
                log("Rejected " + files[i].name + " - non JSON file");
                no_rejected++;
                if(no_rejected == files.length){
                    localStorage.setItem("dummy",1);
                    $("#upload-form").trigger("reset");
                }
                continue;
            }
            file = {
                'name': files[i].name,
                'size': files[i].size,
                'text': "",
            }
            filenames[i] = files[i].name;
            filesizes[i] = files[i].size;
            log("Selected file " + files[i].name +" ("+files[i].size+"B)");
            files[i].text().then(t => {
                file["text"] = t;
                fileName = "file" + no_files;
                localStorage.setItem(fileName, t);
                no_files++;
                localStorage.setItem("no_files", no_files);
                localStorage.setItem("filenames", JSON.stringify(filenames));
                localStorage.setItem("filesizes", JSON.stringify(filesizes));
            });
        }
    });
    $("#upload-form").submit(function (evt) {
        evt.preventDefault();
        if(localStorage.length == 0)
            return;
        log("Submitted form");
        var no_files = JSON.parse(localStorage.getItem("no_files"));
        var fileName = "";
        var file;
        var filenames = [];
        var filesizes = [];
        var files = [];
        console.log(no_files + " files uploaded:");
        for (var i = 0; i < no_files; i++) {
            file = "file" + i;
            fileName = file + "name";
            files[i] = localStorage.getItem(file);
            filenames = JSON.parse(localStorage.getItem("filenames"));
            filesizes = JSON.parse(localStorage.getItem("filesizes"));
            console.log(filenames[i]);
            console.log(filesizes[i]);
            console.log(files[i].substring(0, 200));
        }
    });
    $("#upload-form").on("reset", function(evt){
        if(localStorage.length == 0){
            evt.preventDefault();
            return;
        }
        log("Reset form");
        localStorage.clear();
    });
});