$(document).ready(function () {
    $('#myCarousel').carousel({
        interval: 4000
    });

    let clickEvent = false;
    $('#myCarousel').on('click', '.nav a', function () {
        clickEvent = true;
        $('.nav li').removeClass('active');
        $(this).parent().addClass('active');
    }).on('slid.bs.carousel', function (e) {
        if (!clickEvent) {
            let count = $('.nav').children().length - 1;
            let current = $('.nav li.active');
            current.removeClass('active').next().addClass('active');
            let id = parseInt(current.data('slide-to'));
            if (count === id) {
                $('.nav li').first().addClass('active');
            }
        }
        clickEvent = false;
    });
});
