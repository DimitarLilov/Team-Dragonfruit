handlers.displayHome = function (ctx) {
    ctx.loggedIn = auth.isAuthorized();
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = auth.isAdmin();

    categoriesService.getCategoriesNotLogged().then(function (categories) {
        homeService.getUpcomingEvents().then(function (events) {
            events[0].active = "active";

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
