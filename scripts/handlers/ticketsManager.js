handlers.displayMyTickets = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    let userId = sessionStorage.getItem('userId');

    if (ctx.loggedIn) {
        ticketsService.getMyTickets(userId)
            .then(function (tickets) {
                categoriesService.getCategories().then(function (categories) {
                    for (let category of categories) {
                        for (let ticket of tickets) {
                            if (category._id === ticket.categoryId) {
                                ticket.category = category.category;
                                ticket.fullName = sessionStorage.getItem('fullName');
                            }
                        }
                    }

                    ctx.tickets = tickets;
                    ctx.categories = categories;
                    ctx.loadPartials({
                        header: "./templates/common/header.hbs",
                        footer: "./templates/common/footer.hbs",
                        ticket: "./templates/user/tickets/ticket.hbs",
                        navCategory: "./templates/common/navCategory.hbs",
                    }).then(function () {
                        this.partial('./templates/user/tickets/tickets.hbs');
                    });

                })
            }).catch(notifications.handleError);
    }
    else {
        ctx.redirect('#/home');
    }
};
handlers.displayAddTicket = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    ctx.eventId = ctx.params.id.substring(1);

    if (ctx.admin) {
        ctx.loadPartials({
            header: "./templates/admin/common/header.hbs",
            footer: "./templates/common/footer.hbs"
        }).then(function () {
            this.partial('./templates/admin/tickets/addTicket.hbs');
        });
    }
    else {
        ctx.redirect('index.html');
    }
};
handlers.addEventTicket = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    ctx.eventId = ctx.params.id.substring(1);

    let ticket =
        {
            priceCategory: ctx.params.priceCategory,
            ticketsCount: ctx.params.ticketsCount,
            price: ctx.params.price,
            eventId: ctx.eventId
        };
    ticketsService.addTicket(ticket).then(function () {
        notifications.showInfo(`Ticket created.`);
        ctx.redirect("#/admin/events");
    }).catch(notifications.handleError);
};