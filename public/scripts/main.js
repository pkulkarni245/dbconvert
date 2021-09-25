$(document).ready(function () {
    localStorage.clear();
    $("#file-upload").change(function(e){
        var inFiles = e.target.files;
        localStorage.inFiles = JSON.stringify(inFiles);
        alert("hererere: " + inFiles[0].name);
    });
    $("#upload-form").submit(function(evt){
        evt.preventDefault();
        var files = JSON.parse(localStorage.inFiles);
        alert(files);
        var file;
        for(var i = 0; i < files.length; i++){
            file = files[i];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (e) {
                console.log(e.target.result);
            };
        }
    });
});
/*$(document).ready(function () {
    localStorage.clear();
    $("#file-upload").change(function(e){
        var inFiles = e.target.files;
        localStorage.inFiles = inFiles;
        var reader = new FileReader();
        var file = inFiles[0];
        reader.readAsText(file);
        reader.onload = function (e) {
            localStorage.firstFile = e.target.result;
            alert("ff: " + localStorage.firstFile);
        };
        localStorage.jsFile = JSON.stringify(inFiles);
        console.log("ttt: "+typeof JSON.parse(localStorage.jsFile));
    });
    $("#upload-form").submit(function(evt){
        evt.preventDefault();
        var files = localStorage.inFiles;
        var file;
        for(var i = 0; i < files.length; i++){
            alert(files);
            file = files[i];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (e) {
                alert(e.target.result);
            };
        }
    });
});*/