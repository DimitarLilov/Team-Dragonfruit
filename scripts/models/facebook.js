let facebookService = (() => {

    window.fbAsyncInit = function () {
        FB.init({
            appId: '1825836177742564',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v2.10'
        });
    };

    (function (d, s, id) {
        let js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    function fbLogin(ctx) {

        FB.login(function (response) {
            FB.api('/me', {locale: 'en_US', fields: 'name, email'},
                function (facebookInfo) {
                    if (response.status === "connected") {
                        let [firstName, lastName] = facebookInfo.name.split(' ');

                        let loginTokens = {
                            username: facebookInfo.name,
                            firstName: firstName,
                            lastName: lastName,
                            email: facebookInfo.email,
                            role: 'user',
                            _socialIdentity:
                                {
                                    facebook:
                                        {
                                            access_token: response.authResponse.accessToken,
                                            expires: 999999999
                                        }
                                }
                        };
                        let data = {
                            "_socialIdentity.facebook.id": response.authResponse.userID
                        };


                        usersService.getFacebookUsers(data).then(function (user) {
                            if (user.length === 0) {
                                auth.register(loginTokens).then(function (userInfo) {
                                    auth.login(userInfo.username, userInfo.password)
                                        .then(function (userInfo) {
                                            auth.saveSession(userInfo);
                                            notifications.showInfo("Facebook login successful.");
                                            ctx.redirect("#/home")
                                        }).catch(notifications.handleError);
                                }).catch(notifications.handleError);
                            }
                            else {
                                auth.loginFB(loginTokens)
                                    .then(function (userInfo) {
                                        auth.saveSession(userInfo);
                                        notifications.showInfo("Facebook login successful.");
                                        ctx.redirect("#/home")
                                    }).catch(notifications.handleError);
                            }
                        });
                    } else if (response.status === "not_authorized") {
                        notifications.showError('Not logged in.');
                    } else {
                        notifications.showError('Not log into facebook.');
                    }
                }
            );

        }, {scope: 'public_profile,email'});
    }

    function fbLogout(ctx, userId) {
        FB.logout(function () {
            auth.logout().then(function () {
                sessionStorage.clear();
                notifications.showInfo("Logout successful.");
                ctx.redirect("#/home");
            });

        });

        let data = {
            userId: userId
        };
        // usersService.removeUser(data).catch(notifications.handleError);
    }

    return {
        fbLogin,
        fbLogout
    }
})();