const handlers = {};
$(() => {
    const app = Sammy('#content', function () {
        this.use("Handlebars", 'hbs');

        this.get('index.html', displayHome);
        this.get('#/home', displayHome);
        this.get('#/register', handlers.displayRegister);
        this.get('#/logout', handlers.logoutUser);


        this.post('#/register', handlers.registerUser);

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
    });

    app.run();

});