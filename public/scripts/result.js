function processresult(){
    var elements = document.getElementById('table-container').children;
    var tables = [];
    for(var t = 1; t < elements.length - 1; t++)
            tables.push(elements[t]);
    for(var k in tables){
        for (var i = 0, row; row = tables[k].rows[i]; i++) {
            console.log("Row " + i);
            if(i == 1){
                for (var j = 0, col; col = row.cells[j]; j++) {
                    var sel = col.getElementsByTagName("select")[0];
                    var val = sel.options[sel.selectedIndex].value;
                    console.log(val);
                    addresult(val);
                }
            }
            else {
                for (var j = 0, col; col = row.cells[j]; j++) {
                    console.log(col.textContent);
                    addresult(col.textContent);
                }
            }
            addresult("\n");
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