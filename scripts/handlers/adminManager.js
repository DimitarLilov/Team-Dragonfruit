handlers.displayAllUsers = function (ctx) {
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';

    if (ctx.admin) {
        usersService.getUsers()
            .then(function (usersData) {

                renderCommonTemplates(ctx, usersData);

            }).catch(notifications.handleError);
    }
    else {
        ctx.redirect('index.html');
    }


};

handlers.displayAdminPanel = function (ctx) {
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';

    if (ctx.admin) {
        ctx.loadPartials({
            header: "./templates/admin/common/header.hbs",
            footer: "./templates/common/footer.hbs"
        }).then(function () {
            this.partial('./templates/admin/home/home.hbs');
        });
    }
    else {
        ctx.redirect('index.html');
    }
};

handlers.displayAdminUsers = function (ctx) {
    ctx = this;
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';

    if (ctx.admin) {
        usersService.getAdminUsers()
            .then(function (usersData) {

                renderCommonTemplates(ctx, usersData);

            }).catch(notifications.handleError);
    }
    else {
        ctx.redirect('index.html');
    }
};

handlers.displayBasicUsers = function (ctx) {
    ctx = this;
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';

    if (ctx.admin) {
    usersService.getBasicUsers()
        .then(function (usersData) {

            renderCommonTemplates(ctx, usersData);

        }).catch(notifications.handleError);
    }
    else {
        ctx.redirect('index.html');
    }
};

handlers.getSearchedUser = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    let username = ctx.params.username;

    if (ctx.admin) {
    usersService.getSearchedUser(username)
        .then(function (usersData) {

            renderCommonTemplates(ctx, usersData);

        }).catch(notifications.handleError);
    }
    else {
        ctx.redirect('index.html');
    }
};

handlers.deleteUser = function (ctx) {

    let userId = ctx.params.id.substr(1);

    usersService.deleteUser(userId)
        .then(function () {
            ctx.redirect('#/users');
            setTimeout(() => notifications.showInfo(`User deleted.`), 500);
        }).catch(notifications.showError);
};

function renderCommonTemplates(ctx, usersData) {

    ctx.users = usersData;

    ctx.loadPartials({
        header: "./templates/admin/common/header.hbs",
        user: "./templates/admin/users/user.hbs",
        footer: "./templates/common/footer.hbs"
    }).then(function () {
        this.partial('./templates/admin/users/usersList.hbs');
    });
}