handlers.displayRegister = function (ctx) {
    ctx.loggedIn = auth.isAuthorized();
    ctx.username = sessionStorage.getItem('username');

    ctx.loadPartials({
        header: "./templates/common/header.hbs",
        registerForm: "./templates/register/registerForm.hbs",
        footer: "./templates/common/footer.hbs",

    }).then(function () {
        this.partial('./templates/register/registerPage.hbs');
    });
};

handlers.displayLogin = function (ctx) {
    ctx.loggedIn = auth.isAuthorized();
    ctx.username = sessionStorage.getItem('username');

    ctx.loadPartials({
        header: "./templates/common/header.hbs",
        loginForm: "./templates/login/loginForm.hbs",
        footer: "./templates/common/footer.hbs",

    }).then(function () {
        this.partial('./templates/login/loginPage.hbs');
    });
};

handlers.registerUser = function (ctx) {
    ctx.loggedIn = auth.isAuthorized();

    let userReg = new RegExp("^([a-zA-Z]){3,}$");
    let passReg = new RegExp("^([a-zA-Z0-9]){6,}$");

    let username = ctx.params.username;
    let firstName = ctx.params.firstName;
    let lastName = ctx.params.lastName;
    let email = ctx.params.email;
    let password = ctx.params.password;
    let repeatPassword = ctx.params.repeatPassword;

    // admin || user - roles
    let role = "user";

    if (password !== repeatPassword) {
        notifications.showError("The Passwords and Repeat Password do not match")
    } else if (!userReg.test(username)) {
        notifications.showError("invalid username")
    } else if (!passReg.test(password)) {
        notifications.showError("invalid password")
    } else {
        auth.register(username, password, email, firstName, lastName, role).then(function (userInfo) {
            auth.saveSession(userInfo);
            notifications.showInfo("User registration successful.");
            ctx.redirect("#/home");
        }).catch(notifications.handleError);
    }
};

handlers.loginUser = function (ctx) {
    ctx.loggedIn = auth.isAuthorized();

    let username = ctx.params.username;
    let password = ctx.params.password;

    if (username !== undefined && password !== undefined) {

        auth.login(username, password).then(function (userInfo) {
            auth.saveSession(userInfo);
            notifications.showInfo("Login successful.");
            ctx.redirect("#/home");
        }).catch(notifications.handleError);
    } else {

        facebookService.fbLogin(ctx);
    }
};

handlers.logoutUser = function (ctx) {
    let fbUserId = sessionStorage.getItem('userFBId');

    auth.logout().then(function () {
        sessionStorage.clear();
        notifications.showInfo("Logout successful.");
        ctx.redirect("#/home");

        if (fbUserId !== null) {
            usersService.deleteUser(fbUserId)
                .then(function () {
                    sessionStorage.clear();
                }).catch(notifications.handleError);
        }
    }).catch(notifications.handleError);
};