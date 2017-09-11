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
        this.get('#/login', handlers.displayLogin);
        this.get('loginF', handlers.loginUser);
        this.get('#/logout', handlers.logoutUser);
        this.get('#/events', handlers.displayEvents);
        this.get('#/events/:id', handlers.displayDetailsEvent);
        this.get('#/events/category/:id', handlers.displayCategoryEvents);
        this.get('#/events/tickets/:id', handlers.displayEventTickets);
        this.get('#/my/tickets', handlers.displayMyTickets);
        this.get('#/admin', handlers.displayAdminPanel);
        this.get('#/admin/events', handlers.getAllEventsAdmin);
        this.get('#/admin/events/add', handlers.getAddEvent);
        this.get('#/admin/events/edit/:id', handlers.getEditEvent);
        this.get('#/admin/events/add/ticket/:id', handlers.displayAddTicket);
        this.get('#/admin/events/edit/ticket/:id', handlers.displayEditTicket);
        this.get('#/admin/categories', handlers.displayAllCategories);
        this.get('#/admin/categories/add', handlers.displayAddCategory);
        this.get('#/admin/categories/edit/:id', handlers.getEditCategory);
        this.get('#/users', handlers.displayAllUsers);
        this.get('#/users/edit/:id', handlers.getEditUser);
        this.get('#/users/admin', handlers.displayAdminUsers);
        this.get('#/users/user', handlers.displayBasicUsers);
        this.get('#/cart',handlers.displayCart);



        this.post('#/register', handlers.registerUser);
        this.post('#/login', handlers.loginUser);
        this.post('#/users', handlers.getSearchedUser);
        this.post('#/users/edit/:id', handlers.editUser);
        this.post('#/users/delete/:id', handlers.deleteUser);
        this.post('#/admin/events/add', handlers.addEvent);
        this.post('#/admin/events/delete/:id', handlers.deleteEvent);
        this.post('#/admin/events/edit/:id', handlers.editEvent);
        this.post('#/admin/events/add/ticket/:id', handlers.addEventTicket);
        this.post('#/admin/events/edit/ticket/:id', handlers.editTickets);
        this.post('#/admin/events/delete/ticket/:id', handlers.deleteTickets);
        this.post('#/admin/categories/add', handlers.addCategory);
        this.post('#/admin/categories/edit/:id', handlers.editCategory);
        this.post('#/admin/categories/delete/:id', handlers.deleteCategory);
        this.post('#/events/tickets/:id', handlers.buyTicket);
    });

    app.run();
});