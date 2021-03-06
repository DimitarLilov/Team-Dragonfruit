let categoriesService = (() => {

    function getCategories() {
        return requester.get('appdata', `categories`, 'kinvey');
    }

    function getSearchedCategory(categoryName) {
        return requester.get('appdata', `categories/?query={"category":"${categoryName}"}`);
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

    function removeCategory(categoryId) {
        return requester.remove('appdata', `categories/${categoryId}`, 'kinvey');
    }

    return {
        getCategories,
        getSearchedCategory,
        getCategoriesNotLogged,
        getCategory,
        addCategory,
        editCategory,
        removeCategory
    }
})();