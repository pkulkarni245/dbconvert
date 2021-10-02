function processresult(){
    var elements = document.getElementById('table-container').children;
    console.log(elements.length);
    var tables = [];
    for(var t = 1; t < elements.length - 1; t++)
            tables.push(elements[t]);
    for(var k in tables){
        for (var i = 0, row; row = tables[k].rows[i]; i++) {
            console.log("Row " + i);
            for (var j = 0, col; col = row.cells[j]; j++) {
                console.log(col.textContent);
            }
        }
    }
        
}


var resultstring = [];
function sqlresult(){
    return resultstring;
}
function addresult(str){
    resultstring.push(str);
}