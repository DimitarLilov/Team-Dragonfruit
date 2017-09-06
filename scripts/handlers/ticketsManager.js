handlers.displayTickets = function (ctx) {
    let loggedIn = auth.isAuthorized();
    ctx.loggedIn = loggedIn;
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = auth.isAdmin();
    ctx.type = "All Tickets";

    if (loggedIn) {
        ticketsService.getAllTickets()
            .then(function (tickets) {
                categoriesService.getCategories().then(function (categories) {
                    renderTicketsTemplates(ctx, tickets, categories);
                })
            }).catch(notifications.handleError);
    } else {

        ticketsService.getAllTicketsNotLogged()
            .then(function (tickets) {
                categoriesService.getCategoriesNotLogged().then(function (categories) {
                    renderTicketsTemplates(ctx, tickets, categories);
                })
            }).catch(notifications.handleError);
    }
};

handlers.getAllTicketsAdmin = function (ctx) {
    let loggedIn = auth.isAuthorized();
    ctx.loggedIn = loggedIn;

    if (loggedIn) {
        ctx.username = sessionStorage.getItem('username');
        ctx.admin = auth.isAdmin();
        if (ctx.admin) {
            ticketsService.getAllTickets()
                .then(function (ticketsData) {

                    ctx.tickets = ticketsData;

                    ctx.loadPartials({
                        header: "./templates/admin/common/header.hbs",
                        ticket: "./templates/admin/tickets/ticket.hbs",
                        footer: "./templates/common/footer.hbs"
                    }).then(function () {
                        this.partial('./templates/admin/tickets/ticketsList.hbs');
                    });

                }).catch(notifications.handleError);
        }
        else {
            ctx.redirect('index.html');
        }
    }
};

handlers.deleteTicket = function (ctx) {
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
                ctx.redirect("#/listTickets");
            }).catch(notifications.showError);
    }
    else {
        ctx.redirect('index.html');
    }
};

handlers.displayDetailsTicket = function (ctx) {
    ctx.loggedIn = auth.isAuthorized();
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = auth.isAdmin();

    let id = ctx.params.id.substring(1);

    if (ctx.loggedIn) {
        ticketsService.getTicketInfo(id)
            .then(function (ticketData) {
                categoriesService.getCategories().then(function (categories) {
                    renderTicketDetailsTemplates(ctx,ticketData,categories);
                });
            }).catch(notifications.handleError);
    } else {

        ticketsService.getTicketInfoNotLogged(id)
            .then(function (ticketData) {
                categoriesService.getCategoriesNotLogged().then(function (categories) {
                    renderTicketDetailsTemplates(ctx,ticketData,categories)
                })
            }).catch(notifications.handleError);
    }
};


handlers.displayCategoryTickets = function (ctx) {
    ctx.loggedIn = auth.isAuthorized();
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = auth.isAdmin();

    let id = ctx.params.id.substring(1);

    ticketsService.getTicketsByCategoryId(id).then(function (tickets) {
        categoriesService.getCategoriesNotLogged().then(function (categories) {
            categoriesService.getCategory(id).then(function (category) {
                ctx.type = category.category;
                renderTicketsTemplates(ctx, tickets, categories);
            })
        })
    });
};

handlers.getEditTicket = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    let id = ctx.params.id.substring(1);

    if (ctx.admin) {
        ticketsService.getTicketInfo(id)
            .then(function (ticketData) {
                categoriesService.getCategories().then(function (categories) {

                    ctx.title = ticketData.title;
                    ctx._id = ticketData._id;
                    ctx.image = ticketData.image;
                    ctx.location = ticketData.location;
                    ctx.details = ticketData.details;
                    ctx.eventTime = ticketData.eventTime;
                    ctx.eventDate = ticketData.eventDate;
                    ctx.price = ticketData.price;
                    ctx.selected = ticketData.categoryId;
                    ctx.categories = categories;

                    ctx.loadPartials({
                        header: "./templates/admin/common/header.hbs",
                        footer: "./templates/common/footer.hbs",
                        category: "./templates/admin/tickets/category.hbs"
                    }).then(function () {
                        this.partial('./templates/admin/tickets/ticketEdit.hbs');
                    });
                });
            }).catch(notifications.handleError);
    }
    else {
        ctx.redirect('index.html');
    }
};

handlers.editTicket = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    let ticketId = ctx.params.id.substr(1);

    let title = ctx.params.title;
    let image = ctx.params.image;
    let price = ctx.params.price;
    let location = ctx.params.location;
    let details = ctx.params.details;
    let eventTime = ctx.params.eventTime;
    let eventDate = ctx.params.eventDate;
    let categoryId = ctx.params.categoryId;
    let id = ticketId;

    let ticket = {
        "image": image,
        "title": title,
        "location": location,
        "price": price,
        "details": details,
        "eventTime": eventTime,
        "eventDate": eventDate,
        "categoryId": categoryId,
        "_id": id,
    };
    ticketsService.editTicket(ticket).then(function () {
        notifications.showInfo(`Ticket ${ticket.title} updated.`);
        ctx.redirect("#/listTickets");
    }).catch(notifications.handleError);

};

function renderTicketDetailsTemplates(ctx, ticketData, categories) {
    for (let category of categories) {
        if (category._id === ticketData.categoryId) {
            ctx.category = category.category;
        }
    }

    ctx.title = ticketData.title;
    ctx._id = ticketData._id;
    ctx.image = ticketData.image;
    ctx.location = ticketData.location;
    ctx.details = ticketData.details;
    ctx.eventTime = ticketData.eventTime;
    ctx.eventDate = ticketData.eventDate;
    ctx.price = ticketData.price;

    ctx.categories = categories;

    ctx.loadPartials({
        header: "./templates/common/header.hbs",
        footer: "./templates/common/footer.hbs",
        navCategory: "./templates/common/navCategory.hbs"
    }).then(function () {
        this.partial('./templates/tickets/details.hbs');
    });
}

function renderTicketsTemplates(ctx, tickets, categories) {

    for (let category of categories) {
        for (let ticket of tickets) {
            if (category._id === ticket.categoryId) {
                ticket.category = category.category;
            }
        }
    }

    ctx.tickets = tickets;
    ctx.categories = categories;

    ctx.loadPartials({
        header: "./templates/common/header.hbs",
        footer: "./templates/common/footer.hbs",
        ticket: "./templates/tickets/ticket.hbs",
        navCategory: "./templates/common/navCategory.hbs",

    }).then(function () {
        this.partial('./templates/tickets/tickets.hbs');
    });
}