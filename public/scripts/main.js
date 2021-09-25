$(document).ready(function () {
    localStorage.clear();
    $("#file-upload").change(function(e){
        localStorage.clear();
        var files = e.target.files;
        var file = {};
        var no_files = 0;
        var fileName = "";
        var invalidFiles = [];
        for(var i = 0; i < files.length; i++){
            if(files[i].type!="application/json"){
                invalidFiles.push(files[i].name);
                continue;
            }
            no_files++;
            file = {
                'name'  : files[i].name,
                'size'  : files[i].size,
                'text'  : "",
            }
            files[i].text().then(t => {
                file["text"] = t;
                fileName = "file" + no_files;
                localStorage.setItem(fileName,JSON.stringify(file));
            });
        }
        localStorage.setItem("no_files", no_files);
    });
    $("#upload-form").submit(function(evt){
        evt.preventDefault();
        var no_files = JSON.parse(localStorage.getItem("no_files"));
        var fileName = "";
        var file;
        var files = [];
        for(var i = 0; i < no_files; i++){
            fileName = "file" + i;
            file = JSON.parse(localStorage.getItem(fileName));
            console.log(file["name"]);
            console.log(file["size"]);
            console.log(file["text"].subtring(0,200));
        }

        $(this).trigger("reset");
    });
});