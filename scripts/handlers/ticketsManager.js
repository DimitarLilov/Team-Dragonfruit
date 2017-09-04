handlers.displayTickets = function (ctx) {
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.username = sessionStorage.getItem('username');

    ticketsService.getAllTickets().then(function (tickets) {
        ctx.tickets = tickets;

        ctx.loadPartials({
            header: "./templates/common/header.hbs",
            footer: "./templates/common/footer.hbs",
            ticket: "./templates/tickets/ticket.hbs",

        }).then(function () {
            this.partial('./templates/tickets/tickets.hbs');
        });

    }).catch(notifications.handleError);
};