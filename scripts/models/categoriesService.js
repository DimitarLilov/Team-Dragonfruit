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

    return {
        getCategories,
        getCategoriesNotLogged,
        getCategory,
        addCategory
    }
})();