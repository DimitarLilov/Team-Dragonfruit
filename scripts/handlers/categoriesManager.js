handlers.displayAllCategories = function (ctx) {
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';

    if (ctx.admin) {
        categoriesService.getCategories()
            .then(function (categoriesData) {
                renderCommonTemplates(ctx, categoriesData);
            }).catch(notifications.handleError);
    }
    else {
        ctx.redirect('index.html');
    }

};

function renderCommonTemplates(ctx, categoriesData) {

    ctx.categories = categoriesData;
    console.log(categoriesData);


    ctx.loadPartials({
        header: "./templates/admin/common/header.hbs",
        category: "./templates/admin/categories/category.hbs",
        footer: "./templates/common/footer.hbs"
    }).then(function () {
        this.partial('./templates/admin/categories/categoriesList.hbs');
    });
}