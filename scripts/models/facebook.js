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

            // FB.api('/me', { locale: 'en_US', fields: 'name, email' },
            //     function(response) {
            //         console.log(response.email);
            //     }
            // );

            if (response.status === "connected") {

                let loginTokens = {
                    _socialIdentity:
                        {
                            facebook:
                                {
                                    access_token: response.authResponse.accessToken,
                                    expires: 999999999
                                }
                        }
                };

                auth.loginFB(loginTokens).then(function (userInfo) {
                    auth.login(userInfo.username, userInfo.password)
                        .then(function (userInfo) {

                            let displayUsername = userInfo._socialIdentity.facebook.name;
                            sessionStorage.setItem('userFBId', userInfo._id);
                            userInfo.role = 'user';
                            userInfo.username = displayUsername;
                            auth.saveSession(userInfo);

                            notifications.showInfo("Facebook login successful.");
                            ctx.redirect("#/home")
                        }).catch(notifications.handleError);
                }).catch(notifications.handleError);

            } else if (response.status === "not_authorized") {
                notifications.showError('Not logged in.');
            } else {
                notifications.showError('Not log into facebook.');
            }

        }, {scope: 'public_profile,email'});
    }

    function fbLogout(ctx, id) {
        FB.logout(function () {

            sessionStorage.clear();
            notifications.showInfo("Logout successful.");
            ctx.redirect("#/home");
        });

        usersService.deleteUser(id).catch(notifications.handleError);
    }

    return {
        fbLogin,
        fbLogout
    }
})();