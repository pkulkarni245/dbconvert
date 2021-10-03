function collectdata(){
    var elements = document.getElementById('table-container').children;
    var htmltables = [];
    var tables = [];
    for(var t = 1; t < elements.length - 1; t++)
            htmltables.push(elements[t]);
    for(var k in htmltables){
        var table = [];
        for (var i = 0, row; row = htmltables[k].rows[i]; i++) {
            var rowdata = [];
            var val;
            if(i == 1){
                for (var j = 0, col; col = row.cells[j]; j++) {
                    var sel = col.getElementsByTagName("select")[0];
                    val = sel.options[sel.selectedIndex].value;
                    rowdata.push(val);
                }
            }
            else {
                for (var j = 0, col; col = row.cells[j]; j++) {
                    val = col.textContent;
                    rowdata.push(val);
                }
            }
            table.push(rowdata);
        }
        tables.push(table);
    }
    return tables;
}

function processresult(tabledata){
    for(table of tabledata)
        processtable(table);
}

function processtable(table){
    const name = table.shift()[0];
    const type = table.shift();
    const column = table.shift();


}


var resultstring = [];
function sqlresult(){
    return resultstring;
}
function addresult(str){
    resultstring.push(str);
}