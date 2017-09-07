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

            if (response.status === "connected") {

                let loginTokens = {
                    _socialIdentity:
                        {
                            facebook:
                                {
                                    access_token: response.authResponse.accessToken,
                                    expires: response.authResponse.expiresIn
                                }
                        }
                };

                auth.loginFB(loginTokens).then(function (userInfo) {
                    auth.login(userInfo.username, userInfo.password)
                        .then(function (userInfo) {
                            console.log(userInfo);
                            let displayUsername = userInfo._socialIdentity.facebook.name;
                            sessionStorage.setItem('userFBId', userInfo.username);
                            // userInfo.role = 'user';
                            // userInfo.username = displayUsername; //access_token
                            // userInfo._kmd.authtoken = userInfo._socialIdentity.facebook.access_token;
                            // console.log(userInfo._socialIdentity.facebook.access_token);
                            auth.saveSession(userInfo);

                            // console.log(userInfo);

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

    return {
        fbLogin,
    }
})();