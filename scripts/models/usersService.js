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

    function getSearchedUser(username) {
        return requester.get('user', `?query={"username":"${username}"}`);
    }

    function getEditUserInfo(userId) {
        return requester.get('user', `${userId}`);
    }

    function editUserInfo(data) {
        return requester.post('rpc', 'custom/editUser', 'kinvey', data);
    }

    function deleteUser(userId) {
        return requester.remove('user', `${userId}/?hard=true`, 'kinvey');
    }

    return {
        getUsers,
        getAdminUsers,
        getBasicUsers,
        getSearchedUser,
        getEditUserInfo,
        editUserInfo,
        deleteUser
    }
})();