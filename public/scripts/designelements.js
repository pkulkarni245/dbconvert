$(document).ready(function(){
    $(".collapse-table").click(function(){
        var collapseElement = $(this).attr("data-collapse-id");
        $("#" + collapseElement + "-body").toggleClass("hidden");
        if($("#" + collapseElement + "-body").hasClass("hidden"))
            $(this).html('<th colspan="1000"><h2>' + collapseElement + '   &#9654;</h2></th>');
        else
            $(this).html('<th colspan="1000"><h2>' + collapseElement + '   &#9660;</h2></th>');
    });
});