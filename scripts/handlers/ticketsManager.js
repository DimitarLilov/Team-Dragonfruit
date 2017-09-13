handlers.displayMyTickets = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    let userId = sessionStorage.getItem('userId');
    let fbEmail = sessionStorage.getItem('userMail');

    if (fbEmail !== null) {

        usersService.getUserByEmail(fbEmail)
            .then(function (userData) {

                userId = userData[0]._id;

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

                            getCountTicketsInCart(ctx);
                            renderTemplates(ctx, tickets, categories);

                        })
                    }).catch(notifications.handleError);
            });
    }

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

                    getCountTicketsInCart(ctx);
                    renderTemplates(ctx, tickets, categories);

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

    let isValidTicket = validateTicket(ticket);

    if (isValidTicket) {
        ticketsService.editTicket(ticket).then(function () {
            notifications.showInfo(`Ticket edit.`);
            ctx.redirect("#/admin/events");
        }).catch(notifications.handleError);
    }
};

handlers.displayAddTicket = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    ctx.eventId = ctx.params.id.substring(1);

    getCountTicketsInCart(ctx);

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

            ctx.isEmpty = tickets.length === 0;
            for (let ticket of tickets) {

                if (Number(ticket.ticketsCount) <= 0) {
                    ticket.disabled = "disabled";
                }
            }
            getCountTicketsInCart(ctx);

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

    let isValidTicket = validateTicket(ticket);

    if (isValidTicket) {
        ticketsService.addTicket(ticket).then(function () {
            notifications.showInfo(`Ticket created.`);
            ctx.redirect("#/admin/events");
        }).catch(notifications.handleError);
    }
};


handlers.addTicketInCart = function (ctx) {
    let loggedIn = sessionStorage.getItem('authtoken') !== null;
    let eventId = ctx.params.id.substring(1);
    let fbEmail = sessionStorage.getItem('userMail');

    if (loggedIn) {
        ticketsService.getTicket(ctx.params.ticketId).then(function (ticket) {
            eventsService.getEventsInfo(eventId).then(function (event) {

                let data = {
                    image: event.image,
                    title: event.title,
                    ticketAmount: ctx.params.ticketAmount,
                    eventDate: event.eventDate,
                    eventTime: event.eventTime,
                    price: ticket.price,
                    userId: sessionStorage.getItem('userId'),
                    ticketId: ticket._id,
                    eventId: eventId,
                    categoryId: event.categoryId
                };

                if (fbEmail !== null) {

                    usersService.getUserByEmail(fbEmail)
                        .then(function (userData) {

                            let dataFb = {
                                image: event.image,
                                title: event.title,
                                ticketAmount: ctx.params.ticketAmount,
                                eventDate: event.eventDate,
                                eventTime: event.eventTime,
                                price: ticket.price,
                                userId: userData[0]._id,
                                ticketId: ticket._id,
                                eventId: eventId,
                                categoryId: event.categoryId
                            };
                            console.log(dataFb.userId);
                            cartService.addTicketCart(dataFb).then(function () {
                                notifications.showInfo(`Ticket(s) added in cart.`);
                                ctx.redirect(`#/cart`);
                            }).catch(notifications.handleError);
                        });
                } else {
                    console.log(data.userId);
                    cartService.addTicketCart(data).then(function () {
                        notifications.showInfo(`Ticket(s) added in cart.`);
                        ctx.redirect(`#/cart`);
                    }).catch(notifications.handleError);
                }
            })
        });

    } else {
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
                ctx.redirect("#/cart");
            }).catch(notifications.showError);
    }
    else {
        ctx.redirect('index.html');
    }
};

function validateTicket(ticket) {

    if (ticket.priceCategory === null || ticket.priceCategory.length < 3) {

        notifications.showError('Ticket category name must be greater than 2 characters!');
        $('#priceCategory').addClass('error');
        return false;
    } else {

        $('#priceCategory').removeClass('error');
    }

    let ticketPrice = Number(ticket.price);

    if (ticketPrice < 0) {

        notifications.showError('Ticket price must not be negative number!');
        $('#price').addClass('error');
        return false;
    } else {

        $('#price').removeClass('error');
    }

    let ticketCount = Number(ticket.ticketsCount);

    if (ticketCount < 0) {

        notifications.showError('Tickets count must not be negative number!');
        $('#ticketsCount').addClass('error');
        return false;
    } else {

        $('#ticketsCount').removeClass('error');
    }

    return true;
}

function setTicketsAmountLeft(amount) {

    $('#ticketAmount').attr('max', amount);
}

function renderTemplates(ctx, tickets, categories) {

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
}