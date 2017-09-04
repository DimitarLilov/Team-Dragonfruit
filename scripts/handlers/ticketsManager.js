handlers.displayTickets = function (ctx) {
    let loggedIn = auth.isAuthorized();
    ctx.loggedIn = loggedIn;
    ctx.username = sessionStorage.getItem('username');

    if (loggedIn) {

        ticketsService.getAllTickets()
            .then(function (tickets) {

            ctx.tickets = tickets;

            ctx.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs",
                ticket: "./templates/tickets/ticket.hbs",

            }).then(function () {
                this.partial('./templates/tickets/tickets.hbs');
            });

        }).catch(notifications.handleError);
    } else {

        ticketsService.getAllTicketsNotLogged()
            .then(function (tickets) {

            ctx.tickets = tickets;

            ctx.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs",
                ticket: "./templates/tickets/ticket.hbs",

            }).then(function () {
                this.partial('./templates/tickets/tickets.hbs');
            });

        }).catch(notifications.handleError);
    }

};