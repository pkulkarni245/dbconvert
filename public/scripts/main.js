$(document).ready(function () {
    localStorage.clear();
    $("#file-upload").change(function (e) {
        localStorage.clear();
        $("#invalid-file-list").html("Only JSON files are permitted.<br>");
        var files = e.target.files;
        var file = {};
        var no_files = 0;
        var fileName = "";
        var invalidFiles = [];
        for (var i = 0; i < files.length; i++) {
            if (files[i].type != "application/json") {
                invalidFiles.push(files[i].name);
                if(invalidFiles.length == 1){
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
            files[i].text().then(t => {
                file["text"] = t;
                fileName = "file" + no_files;
                localStorage.setItem(fileName, t);
                no_files++;
                localStorage.setItem("no_files", no_files);
            });
        }
    });
    $("#upload-form").submit(function (evt) {
        evt.preventDefault();
        var no_files = JSON.parse(localStorage.getItem("no_files"));
        var fileName = "";
        var file;
        var files = [];
        for (var i = 0; i < no_files; i++) {
            fileName = "file" + i;
            file = localStorage.getItem(fileName);
        }

        $(this).trigger("reset");
    });
});