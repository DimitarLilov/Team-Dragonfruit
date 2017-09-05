handlers.displayTickets = function (ctx) {
    let loggedIn = auth.isAuthorized();
    ctx.loggedIn = loggedIn;
    ctx.username = sessionStorage.getItem('username');

    if (loggedIn) {

        ticketsService.getAllTickets()
            .then(function (tickets) {

                renderTicketsTemplates(ctx, tickets);

        }).catch(notifications.handleError);
    } else {

        ticketsService.getAllTicketsNotLogged()
            .then(function (tickets) {

                renderTicketsTemplates(ctx, tickets);

        }).catch(notifications.handleError);
    }
};

handlers.getAllTicketsAdmin = function(ctx) {
    let loggedIn = auth.isAuthorized();
    ctx.loggedIn = loggedIn;

    if (loggedIn) {
        ctx.username = sessionStorage.getItem('username');
        ctx.admin = auth.isAdmin();

        ticketsService.getAllTickets()
            .then(function (ticketsData) {

                ctx.tickets = ticketsData;

                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    ticket: "./templates/admin/tickets/ticket.hbs",
                    footer: "./templates/common/footer.hbs"
                }).then(function () {
                    this.partial('./templates/admin/tickets/ticketsList.hbs');
                });

            }).catch(notifications.handleError);
    }
};

function renderTicketsTemplates(ctx, tickets) {

    ctx.tickets = tickets;

    ctx.loadPartials({
        header: "./templates/common/header.hbs",
        footer: "./templates/common/footer.hbs",
        ticket: "./templates/tickets/ticket.hbs",

    }).then(function () {
        this.partial('./templates/tickets/tickets.hbs');
    });
}