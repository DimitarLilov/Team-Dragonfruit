let categoriesService = (() => {

    function getCategories() {
        return requester.get('appdata', `categories`, 'kinvey');
    }

    function getCategoriesNotLogged() {
        return requester.get('appdata', 'categories', 'master');
    }

    function getCategory(categoryId) {
        return requester.get('appdata', `categories/${categoryId}`, 'master');
    }

    function addCategory(category) {
        return requester.post('appdata', `categories`, 'kinvey',category);
    }
    function editCategory(data) {
        return requester.post('rpc', 'custom/editCategory', 'kinvey', data);
    }

    return {
        getCategories,
        getCategoriesNotLogged,
        getCategory,
        addCategory,
        editCategory
    }
})();