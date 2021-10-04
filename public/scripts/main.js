$(document).ready(function () {
    downloadsamplefiles();
    localStorage.clear();
    log("Loaded site");
    var fileselections = 0;
    $("#file-upload").change(function (e) {
        if (fileselections++ > 0)
            log("File selection reset by user");
        localStorage.clear();
        $("#invalid-file-list").html("Only JSON files are permitted.<br>");
        var files = e.target.files;
        var no_files = 0;
        var fileName = "";
        var filenames = [];
        var filesizes = [];
        var no_rejected = 0;
        for (var i = 0; i < files.length; i++) {
            if (files[i].type != "application/json") {
                log("Rejected " + files[i].name + " (" + files[i].size + "B) - non JSON file");
                no_rejected++;
                if (no_rejected == files.length) {
                    localStorage.setItem("dummy", 1);
                    $("#upload-form").trigger("reset");
                }
                continue;
            }
            filenames[i] = files[i].name;
            filesizes[i] = files[i].size;
            log("Selected file " + files[i].name + " (" + files[i].size + "B)");
            files[i].text().then(t => {
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
        if (localStorage.length == 0)
            return;
        log("Submitted form");
        var no_files = JSON.parse(localStorage.getItem("no_files"));
        var fileName = "";
        var file;
        var filenames = [];
        var filesizes = [];
        var files = [];
        for (var i = 0; i < no_files; i++) {
            file = "file" + i;
            fileName = file + "name";
            files[i] = localStorage.getItem(file);
            filenames = JSON.parse(localStorage.getItem("filenames"));
            filesizes = JSON.parse(localStorage.getItem("filesizes"));
        }
        $("#form-container, #table-container").toggleClass("active");
        batch_process(no_files, filenames, filesizes, files);
    });
    $("#upload-form").on("reset", function (evt) {
        if (localStorage.length == 0) {
            evt.preventDefault();
            return;
        }
        log("Reset form");
        localStorage.clear();
    });
    $(".type-cell").click(function () {
        alert("changed column type");
    });
    $("#verify-button").click(function () {
        log("Output verification received");
        processresult(collectdata());
        download("dbconvert.sql", sqlresult());
        output = [];
    });
});

function download(filename, text) {
    var element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function downloadsamplefiles() {
    if (window.location.href.includes("?samplefiles")) {
        const url = "assets/data.json";
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "data.json";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        window.location.replace("/");
    }
}