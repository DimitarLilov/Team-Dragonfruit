let usersService = (() => {

    function getUsers() {
        return requester.get('user', '');
    }

    function getAdminUsers() {
        return requester.get('user', '?query={"role":"admin"}');
    }

    function getBasicUsers() {
        return requester.get('user', '?query={"role":"user"}');
    }

    function getUserByEmail(email) {
        return requester.get('user', `?query={"email":"${email}"}`, 'master');
    }

    function getSearchedUser(username) {
        return requester.get('user', `?query={"username":"${username}"}`);
    }

    function getEditUserInfo(userId) {
        return requester.get('user', `${userId}`);
    }

    function editUserInfo(data) {
        return requester.post('rpc', 'custom/editUser', 'kinvey', data);
    }

    function removeUser(data) {
        return requester.post('rpc', 'custom/deleteUser', 'kinvey', data);
    }

    return {
        getUsers,
        getAdminUsers,
        getBasicUsers,
        getUserByEmail,
        getSearchedUser,
        getEditUserInfo,
        editUserInfo,
        removeUser,
    }
})();