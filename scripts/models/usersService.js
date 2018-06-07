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
        return requester.get('user', `?query={"username":{"$regex":"^${username}"}}`);
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

    function getFacebookUsers(data) {
        return requester.post('user', '_lookup', 'master', data);
    }

    return {
        getUsers,
        getAdminUsers,
        getBasicUsers,
        getSearchedUser,
        getEditUserInfo,
        editUserInfo,
        removeUser,
        getFacebookUsers
    }
})();