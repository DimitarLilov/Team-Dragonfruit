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

handlers.getEditUser = function (ctx) {
    ctx.loggedIn = auth.isAuthorized();
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = auth.isAdmin();

    let userId = ctx.params.id.substr(1);

    if (ctx.admin) {
        usersService.getEditUserInfo(userId)
            .then(function (usersData) {

                ctx.username = usersData.username;
                ctx._id = usersData._id;
                ctx.firstName = usersData.firstName;
                ctx.lastName = usersData.lastName;
                ctx.email = usersData.email;
                ctx.role = usersData.role;


                ctx.loadPartials({
                    header: "./templates/admin/common/header.hbs",
                    footer: "./templates/common/footer.hbs"
                }).then(function () {
                    this.partial('./templates/admin/users/userEdit.hbs');
                });

            }).catch(notifications.handleError);
    }
    else {
        ctx.redirect('index.html');
    }
};

handlers.editUser = function (ctx) {
    ctx.loggedIn = auth.isAuthorized();
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = auth.isAdmin();

    let id = ctx.params.id.substring(1);

    let user = {
        _id: id,
        username: ctx.params.username,
        firstName: ctx.params.firstName,
        lastName: ctx.params.lastName,
        email: ctx.params.email,
        role: ctx.params.role
    };

    usersService.editUserInfo(user).then(function () {
        notifications.showInfo(`User updated.`);
        ctx.redirect("#/users");
    }).catch(notifications.handleError);

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