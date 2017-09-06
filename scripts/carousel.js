function carouselControls() {

    // let boxheight = $('.carousel-inner').height();
    // let itemlength = $('.item').length;
    // let triggerheight = Math.round(boxheight/itemlength+1);
    // $('.list-group-item').height(triggerheight);
    $('.list-group-item').height(50.65);

    let clickEvent = false;
    $('#myCarousel').carousel({
        interval:   3000
    }).on('click', '.list-group li', function() {
        clickEvent = true;

        $('.list-group li').removeClass('active');
        $(this).addClass('active');
    }).on('slid.bs.carousel', function(e) {
        if(!clickEvent) {
            let count = $('.list-group').children().length -1;
            let current = $('.list-group li.active');
            current.removeClass('active').next().addClass('active');
            let id = parseInt(current.data('slide-to'));
            if(count === id) {
                $('.list-group li').first().addClass('active');
            }
        }
        clickEvent = false;
    });
}