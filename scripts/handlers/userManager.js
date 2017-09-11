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

    let user = {
        username: ctx.params.username,
        password: ctx.params.password,
        repeatPassword: ctx.params.repeatPassword,
        firstName: ctx.params.firstName,
        lastName: ctx.params.lastName,
        email: ctx.params.email,
        role: 'user'
    };

    let isValid = validateRegisterUser(user);

    if (isValid) {

        auth.register(user)
            .then(function (userInfo) {
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

    if (fbUserId !== null) {
        facebookService.fbLogout(ctx, fbUserId);
    } else {
        auth.logout().then(function () {
            sessionStorage.clear();
            notifications.showInfo("Logout successful.");
            ctx.redirect("#/home");
        }).catch(notifications.handleError);
    }
};

function validateRegisterUser(user) {

    let userReg = new RegExp("^([a-zA-Z]){3,}$");
    let passReg = new RegExp("^([a-zA-Z0-9]){6,}$");

    if (userReg.test(user.username)) {

        $('#username').removeClass('error');
    } else {

        notifications.showError('Username must more than 2 characters long and contains only lower and/or uppercase english letters!');
        $('#username').addClass('error');
        return false;
    }

    if (user.firstName === null || user.firstName.length < 3) {

        notifications.showError('First name length must be greater than 2 characters!');
        $('#firstName').addClass('error');
        return false;
    } else {

        $('#firstName').removeClass('error');
    }

    if (user.lastName === null || user.lastName.length < 3) {

        notifications.showError('Last name length must be greater than 2 characters!');
        $('#lastName').addClass('error');
        return false;
    } else {

        $('#lastName').removeClass('error');
    }

    if (passReg.test(user.password)) {

        $('#password').removeClass('error');
    } else {

        notifications.showError('Password must more than 5 characters long and contains only lower and/or uppercase letters and/or digits!');
        $('#password').addClass('error');
        return false;
    }

    if (user.password !== user.repeatPassword) {

        notifications.showError("The Passwords and Repeat Password do not match.");
        $('#password').addClass('error');
        $('#repeatPassword').addClass('error');
        return false;
    } else {

        $('#password').removeClass('error');
        $('#repeatPassword').removeClass('error');
    }

    return true;
}