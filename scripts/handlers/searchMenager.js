handlers.displaySearch = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;


    categoriesService.getCategoriesNotLogged().then(function (categories) {
        ctx.categories = categories;
        getCountTicketsInCart(ctx);
        ctx.loadPartials({
            header: "./templates/common/header.hbs",
            navCategory: "./templates/common/navCategory.hbs",
            footer: "./templates/common/footer.hbs"
        }).then(function () {
            this.partial('./templates/search/search.hbs')
        })
    }).catch(notifications.handleError);
};

handlers.searchByTown = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;


    categoriesService.getCategoriesNotLogged().then(function (categories) {
        ctx.categories = categories;
        getCountTicketsInCart(ctx);
        ctx.isEmpty = true;

        ctx.loadPartials({
            header: "./templates/common/header.hbs",
            navCategory: "./templates/common/navCategory.hbs",
            towns: "./templates/towns/towns.hbs",
            eventPage: "./templates/search/eventPage.hbs",
            footer: "./templates/common/footer.hbs"
        }).then(function () {
            this.partial('./templates/search/searchFormTown.hbs')
        })
    }).catch(notifications.handleError);


};

handlers.searchByDate = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    categoriesService.getCategoriesNotLogged().then(function (categories) {
        ctx.categories = categories;
        getCountTicketsInCart(ctx);

        ctx.isEmpty = true;

        ctx.loadPartials({
            header: "./templates/common/header.hbs",
            navCategory: "./templates/common/navCategory.hbs",
            eventPage: "./templates/search/eventPage.hbs",
            footer: "./templates/common/footer.hbs"
        }).then(function () {
            this.partial('./templates/search/searchFormDate.hbs')
        });
    }).catch(notifications.handleError);
};

handlers.displayAllTicketsByTown = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    let townName = ctx.params.town;

    categoriesService.getCategoriesNotLogged().then(function (categories) {
        searchService.getTicketByTownName(townName)
            .then(function (events) {

                for (let category of categories) {
                    for (let event of events) {
                        if (category._id === event.categoryId) {
                            event.category = category.category;
                        }
                    }
                }
                getCountTicketsInCart(ctx);
                ctx.isEmpty = false;
                ctx.events = events;
                ctx.categories = categories;
                ctx.selectTown = townName;

                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    towns: "./templates/towns/towns.hbs",
                    eventPage: "./templates/search/eventPage.hbs",
                    event: "./templates/events/event.hbs",
                    navCategory: "./templates/common/navCategory.hbs",
                }).then(function () {
                    this.partial('./templates/search/searchFormTown.hbs');
                });
            })
    }).catch(notifications.handleError);
};

handlers.displayAllTicketsByDate = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    let date = ctx.params.eventDate;
    categoriesService.getCategoriesNotLogged().then(function (categories) {
        searchService.getTicketByDate(date)
            .then(function (events) {

                for (let category of categories) {
                    for (let event of events) {
                        if (category._id === event.categoryId) {
                            event.category = category.category;
                        }
                    }
                }
                getCountTicketsInCart(ctx);
                ctx.isEmpty = false;
                ctx.events = events;
                ctx.categories = categories;
                ctx.eventDate = date;

                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    eventPage: "./templates/search/eventPage.hbs",
                    event: "./templates/events/event.hbs",
                    navCategory: "./templates/common/navCategory.hbs",
                }).then(function () {
                    this.partial('./templates/search/searchFormDate.hbs');
                });
            })
    }).catch(notifications.handleError);

};
