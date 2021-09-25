$(document).ready(function () {
    log("Application Loaded");
    localStorage.clear();
    $("#file-upload").change(function (e) {
        localStorage.clear();
        $("#invalid-file-list").html("Only JSON files are permitted.<br>");
        var files = e.target.files;
        var file = {};
        var no_files = 0;
        var fileName = "";
        var filenames = [];
        var filesizes = [];
        var invalidFiles = [];
        for (var i = 0; i < files.length; i++) {
            if (files[i].type != "application/json") {
                invalidFiles.push(files[i].name);
                if (invalidFiles.length == 1) {
                    $("#invalid-file-list").html($("#invalid-file-list").html() + "As a result, the following files will not be considered:<br>");
                }
                $("#invalid-file-list").html($("#invalid-file-list").html() + invalidFiles[i] + "<br>");
                continue;
            }
            file = {
                'name': files[i].name,
                'size': files[i].size,
                'text': "",
            }
            filenames[i] = files[i].name;
            filesizes[i] = files[i].size;
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

        $(this).trigger("reset");
    });
});