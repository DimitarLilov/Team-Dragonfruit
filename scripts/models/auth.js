let auth = (() => {
    //Check if current user is in Admin Role
    function isAdmin() {
        return sessionStorage.getItem('userRole') === 'admin';
    }

    //check if user is logged in
    function isAuthorized() {
        return sessionStorage.getItem('authtoken') !== null;
    }

    function saveSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authtoken', userAuth);
        let userId = userInfo._id;
        sessionStorage.setItem('userId', userId);
        let username = userInfo.username;
        sessionStorage.setItem('username', username);
        let userRole = userInfo.role;
        sessionStorage.setItem('userRole', userRole);
    }

    // user/login
    function login(username, password) {
        let userData = {
            username,
            password
        };

        return requester.post('user', 'login', 'basic', userData);
    }

    // user/register
    function register(username, password, email, firstName, lastName, role) {
        let userData = {
            username,
            password,
            email,
            firstName,
            lastName,
            role
        };

        return requester.post('user', '', 'basic', userData);
    }

    // user/logout
    function logout() {
        let logoutData = {
            authtoken: sessionStorage.getItem('authtoken')
        };

        return requester.post('user', '_logout', 'kinvey', logoutData);
    }

    return {
        login,
        register,
        logout,
        saveSession,
        isAuthorized,
        isAdmin
    }
})();