const handlers = {};
$(() => {
    const app = Sammy('#content', function () {
        this.use("Handlebars", 'hbs');

        this.get('index.html', handlers.displayHome);
        this.get('#/home', handlers.displayHome);
        this.get('#/register', handlers.displayRegister);
        this.get('#/tickets', handlers.displayTickets);
        this.get('#/login', handlers.displayLogin);
        this.get('#/logout', handlers.logoutUser);


        this.post('#/register', handlers.registerUser);
        this.post('#/login', handlers.loginUser);
    });

    app.run();

});