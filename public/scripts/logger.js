function log(logstr) {
    var table = document.getElementById("log-body");
    var row = table.insertRow(0);
    row.classList.add("log-row");
    var timestampCell = row.insertCell();
    timestampCell.innerHTML = new Date().getTime();
    timestampCell.classList.add("timestamp-cell")
    var log = row.insertCell();
    log.classList.add("log-cell");
    timestampCell.classList.add("log-cell");
    log.innerHTML = logstr;
}
