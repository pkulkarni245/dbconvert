function log(logstr) {
    var table = document.getElementById("log");
    var row = table.insertRow();
    row.classList.add("log-row")
    var timestampCell = row.insertCell();
    timestampCell.innerHTML = new Date().getTime();
    timestampCell.classList.add("timestamp-cell")
    var log = row.insertCell();
    log.innerHTML = logstr;
}