$(document).ready(function () {
    localStorage.clear();
    $("#file-upload").change(function(e){
        var files = e.target.files;
        var fileArray = [];
        //var file = {};
        for(var i = 0; i < files.length; i++){
            //files[i].text().then(t => alert(t));
            /*file = {
                'name'  : files[i].name,
                'size'  : files[i].size,
                'type'  : files[i].type,
            }*/
            fileArray.push(files[i]);
        }
        localStorage.setItem('files', JSON.stringify(fileArray));
    });
    $("#upload-form").submit(function(evt){
        evt.preventDefault();
        var subFiles = JSON.parse(localStorage.files);
        subFiles[0].text().then(t => alert(t));
        /*for(var i = 0; i < subFiles.length; i++){
            alert(subFiles[i].name);
            var reader = new FileReader();
            reader.readAsText(subFiles[i]);
            reader.onload = function(e){
                alert(e.target.result);
            }
        }*/
    });
});