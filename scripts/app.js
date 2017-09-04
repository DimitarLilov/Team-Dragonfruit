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
        this.get('#/users', handlers.displayAllUsers);
        this.get('#/users/#admin', handlers.displayAdminUsers);
        this.get('#/users/#user', handlers.displayBasicUsers);
        this.get('#/editUser/:id', handlers.getEditUser);

        this.post('#/register', handlers.registerUser);
        this.post('#/login', handlers.loginUser);
        this.post('#/users', handlers.getSearchedUser);
        this.post('#/users/:id', handlers.getEditUser);
        this.post('#/delete/:id', handlers.deleteUser);
        this.post('#/editUser/:id', handlers.editUser);
    });

    app.run();

});