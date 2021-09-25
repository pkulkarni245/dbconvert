$(document).ready(function(){
    $(".collapse-table").click(function(){
        var collapseElement = $(this).attr("data-collapse-id");
        $("." + collapseElement + "-row").toggleClass("hidden");
        if($("." + collapseElement + "-row").hasClass("hidden"))
            $(this).html('<th colspan="1000">' + collapseElement + '   &#9654;</th>');
        else
            $(this).html('<th colspan="1000">' + collapseElement + '   &#9660;</th>');
    });
});