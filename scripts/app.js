const handlers = {};
$(() => {
    const app = Sammy('#content', function () {
        this.use("Handlebars", 'hbs');

        this.get('index.html', displayHome);
        this.get('#/home', displayHome);
        this.get('#/register', handlers.displayRegister);
        this.get('#/tickets', displayTickets);
        this.get('#/login', handlers.displayLogin);
        this.get('#/logout', handlers.logoutUser);


        this.post('#/register', handlers.registerUser);
        this.post('#/login', handlers.loginUser);

        function displayHome(ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs",

            }).then(function () {
                this.partial('./templates/home/home.hbs');
            });
        }

        function displayTickets(ctx) {
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
        }
    });

    app.run();

});