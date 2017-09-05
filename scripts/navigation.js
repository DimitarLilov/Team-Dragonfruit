function highlightActive() {

    $(".userMenuItem").on('click', function (ev) {

        let currentItem = $(ev.target).parent();
        let allLi = $("nav li");

        for (let obj of allLi) {
            $(obj).removeClass('active');
        }

        currentItem.addClass('active');
    })
}