$(document).ready(function() {

    $(".nav-link").click(function(){ 
        $(".nav-link").removeClass("active"); 
        $(this).addClass("active"); 
    }); 

    $(".navbar-brand").click(function(){
        $('.nav-link').removeClass("active"); 
        $('.nav-link').first().addClass("active"); 
    })


});  