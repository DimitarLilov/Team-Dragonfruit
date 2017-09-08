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

handlers.displayEditTicket = function (ctx) {
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';

    let id = ctx.params.id.substring(1);

    if (ctx.admin) {
        ticketsService.getTicket(id).then(function (ticket) {
            ctx.priceCategory = ticket.priceCategory;
            ctx.price = ticket.price;
            ctx.ticketsCount = ticket.ticketsCount;
            ctx.eventId = ticket.eventId;
            ctx._id = id;

            console.log(ctx.eventId);

            ctx.loadPartials({
                header: "./templates/admin/common/header.hbs",
                footer: "./templates/common/footer.hbs"
            }).then(function () {
                this.partial('./templates/admin/tickets/editTicket.hbs');
            });
        });
    }
    else {
        ctx.redirect('index.html');
    }
};

handlers.editTickets = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    let id = ctx.params.id.substring(1);

    let ticket =
        {
            priceCategory: ctx.params.priceCategory,
            price: ctx.params.price,
            ticketsCount: ctx.params.ticketsCount,
            eventId: ctx.params.eventId,
            _id: id
        };

    ticketsService.editTicket(ticket).then(function () {
        notifications.showInfo(`Ticket edit.`);
        ctx.redirect("#/admin/events");
    }).catch(notifications.handleError);
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

handlers.displayEventTickets = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.username = sessionStorage.getItem('username');

    let eventId = ctx.params.id.substring(1);

    ticketsService.getEventTicketsNotLogged(eventId)
        .then(function (tickets) {
            for (let ticket of tickets) {
                if (Number(ticket.ticketsCount) <= 0) {
                    ticket.disabled = "disabled";
                }
            }
            ctx.eventId = eventId;
            ctx.tickets = tickets;
            ctx.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs",
                ticket: "./templates/tickets/ticket.hbs",
                navCategory: "./templates/common/navCategory.hbs",
            }).then(function () {
                this.partial('./templates/tickets/tickets.hbs');
            });
        }).catch(notifications.handleError);
}
;

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

handlers.buyTicket = function (ctx) {
    let loggedIn = sessionStorage.getItem('authtoken') !== null;

    if (loggedIn) {
        let data = {
            userId: sessionStorage.getItem('userId'),
            ticketId: ctx.params.ticketId,
            eventId: ctx.params.id.substring(1),
            ticketAmount: ctx.params.ticketAmount
        };

        cartService.addTicketCart(data).then(function () {
            notifications.showInfo(`Ticket added in cart.`);
            ctx.redirect(`#/events/:${ctx.params.id.substring(1)}`);
        }).catch(notifications.handleError);
    }else {
        ctx.redirect("#/login");
    }

};

handlers.deleteTickets = function (ctx) {
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = auth.isAdmin();

    let ticketId = ctx.params.id.substr(1);

    if (ctx.admin) {
        let data = {
            "id": ticketId
        };

        ticketsService.removeTicket(data)
            .then(function () {
                notifications.showInfo(`Ticket deleted.`);
                ctx.redirect("#/admin/events");
            }).catch(notifications.showError);
    }
    else {
        ctx.redirect('index.html');
    }
};