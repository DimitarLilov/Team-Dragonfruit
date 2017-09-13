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
        ctx.loadPartials({
            header: "./templates/common/header.hbs",
            navCategory: "./templates/common/navCategory.hbs",
            towns: "./templates/towns/towns.hbs",
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
            footer: "./templates/common/footer.hbs"
        }).then(function () {
            this.partial('./templates/search/searchFormDate.hbs')
        });
    }).catch(notifications.handleError);
};

handlers.displayAllTicketsByTown = function (ctx) {
    console.log(ctx.params);
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    let townName = ctx.params.town;

    searchService.getTicketByTownName(townName)
        .then(function (ticketsArr) {
            let tickets = [];
            for (let ticket of ticketsArr) {
                let ticketObj = {
                    title: ticket.title,
                    details: ticket.details,
                    image: ticket.image,
                    location: ticket.location,
                    town: ticket.town,
                    eventDate: ticket.eventDate,
                    eventTime: ticket.eventTime,

                };
                tickets.push(ticketObj);
            }
            ctx.tickets = tickets;
            ctx.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs",
                ticket: "./templates/search/ticketForm.hbs",
                navCategory: "./templates/common/navCategory.hbs",
            }).then(function () {
                this.partial('./templates/search/ticketPage.hbs');
            });
        })

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


                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    event: "./templates/events/event.hbs",
                    navCategory: "./templates/common/navCategory.hbs",
                }).then(function () {
                    this.partial('./templates/search/searchFormDate.hbs');
                });
            })
    }).catch(notifications.handleError);

};
