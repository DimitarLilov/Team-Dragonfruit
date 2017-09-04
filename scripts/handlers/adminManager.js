handlers.displayAllUsers = function (ctx) {
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';

    usersService.getUsers()
        .then(function (usersData) {

            ctx.users = usersData;

            ctx.loadPartials({
                header: "./templates/common/header.hbs",
                user: "./templates/admin/users/user.hbs",
                footer: "./templates/common/footer.hbs"
            }).then(function () {
                this.partial('./templates/admin/users/usersList.hbs');
            });

        }).catch(notifications.handleError);
};

handlers.displayAdminUsers = function (ctx) {
    ctx = this;
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';

    usersService.getAdminUsers()
        .then(function (usersData) {

            ctx.users = usersData;

            ctx.loadPartials({
                header: "./templates/common/header.hbs",
                user: "./templates/admin/users/user.hbs",
                footer: "./templates/common/footer.hbs"
            }).then(function () {
                this.partial('./templates/admin/users/usersList.hbs');
            });

        }).catch(notifications.handleError);
};

handlers.displayBasicUsers = function (ctx) {
    ctx = this;
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';

    usersService.getBasicUsers()
        .then(function (usersData) {

            ctx.users = usersData;

            ctx.loadPartials({
                header: "./templates/common/header.hbs",
                user: "./templates/admin/users/user.hbs",
                footer: "./templates/common/footer.hbs"
            }).then(function () {
                this.partial('./templates/admin/users/usersList.hbs');
            });

        }).catch(notifications.handleError);
};

handlers.getSearchedUser = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    let username = ctx.params.username;

    usersService.getSearchedUser(username)
        .then(function (usersData) {

            ctx.users = usersData;

            ctx.loadPartials({
                header: "./templates/common/header.hbs",
                user: "./templates/admin/users/user.hbs",
                footer: "./templates/common/footer.hbs"
            }).then(function () {
                this.partial('./templates/admin/users/usersList.hbs');
            });

        }).catch(notifications.handleError);
};

handlers.getEditUser = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';

};

handlers.getEditUser = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    // if (isLogin) {

        let id = ctx.params.id.substring(1);

        usersService.getEditUserInfo(id)
            .then(function (usersData) {

                ctx.username = usersData.username;
                ctx._id = usersData._id;
                ctx.firstName = usersData.firstName;
                ctx.lastName = usersData.lastName;
                ctx.email = usersData.email;
                ctx.isAdmin = usersData.role === 'admin';
                ctx.isUser = usersData.role === 'user';

                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs"
                }).then(function () {
                    this.partial('./templates/admin/users/userEdit.hbs');
                });

            }).catch(notifications.handleError);
    // }
};

handlers.editUser = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    let isLogin = sessionStorage.getItem('authtoken') !== null;

    if (isLogin) {

        let id = ctx.params.id.substring(1);

        let userObj = {
            firstName: ctx.params.firstName,
            lastName: ctx.params.lastName,
            email: ctx.params.email,
            role: "user"
        };

        console.log(userObj);
        console.log('THIS FUNCTIONALITY MAY NOT WORK: BY THE KINVEY DOCS !!!');
        // usersService.editUserInfo(id, userObj)
        //     .then(function () {
        //         ctx.trigger('userEditForm');
        //         ctx.redirect('#/users');
        //         setTimeout(() => notifications.showInfo('User edited!'), 500);
        //
        //     }).catch(notifications.handleError);
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