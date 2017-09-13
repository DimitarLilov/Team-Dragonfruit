handlers.displayHome = function (ctx) {
    ctx.loggedIn = auth.isAuthorized();
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = auth.isAdmin();

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    today = yyyy + '-' + mm + '-' + dd;

    categoriesService.getCategoriesNotLogged().then(function (categories) {
        homeService.getUpcomingEvents(today).then(function (events) {
            events[0].active = "active";
            getCountTicketsInCart(ctx);
            ctx.events = events;
            ctx.categories = categories;

            ctx.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs",
                event: "./templates/home/event.hbs",
                eventLi: "./templates/home/eventLi.hbs",
                navCategory: "./templates/common/navCategory.hbs"
            }).then(function () {
                this.partial('./templates/home/home.hbs');
            });
        });
    }).catch(notifications.handleError);
};