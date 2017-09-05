const handlers = {};

Handlebars.registerHelper('select', function( value, options ){
    let $el = $('<select />').html( options.fn(this) );
    $el.find('[value="' + value + '"]').attr({'selected':'selected'});
    return $el.html();
});

$(() => {
    const app = Sammy('#content', function () {
        this.use("Handlebars", 'hbs');

        this.get('index.html', handlers.displayHome);
        this.get('#/home', handlers.displayHome);
        this.get('#/register', handlers.displayRegister);
        this.get('#/tickets', handlers.displayTickets);
        this.get('#/login', handlers.displayLogin);
        this.get('#/logout', handlers.logoutUser);
        this.get('#/admin', handlers.displayAdminPanel);
        this.get('#/users', handlers.displayAllUsers);
        this.get('#/users/#admin', handlers.displayAdminUsers);
        this.get('#/users/#user', handlers.displayBasicUsers);
        this.get('#/editUser/:id', handlers.getEditUser);
        this.get('#/listTickets', handlers.getAllTicketsAdmin);
        this.get('#/editTicket/:id', handlers.getEditTicket);


        this.post('#/register', handlers.registerUser);
        this.post('#/login', handlers.loginUser);
        this.post('#/users', handlers.getSearchedUser);
        this.post('#/users/:id', handlers.getEditUser);
        this.post('#/delete/:id', handlers.deleteUser);
        this.post('#/deleteTicket/:id', handlers.deleteTicket);
        this.post('#/editUser/:id', handlers.editUser);
        this.post('#/editTicket/:id', handlers.editTicket);
    });

    app.run();
});