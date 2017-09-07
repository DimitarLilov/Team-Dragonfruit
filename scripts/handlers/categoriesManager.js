handlers.displayAllCategories = function (ctx) {
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';

    if (ctx.admin) {
        categoriesService.getCategories()
            .then(function (categoriesData) {
                renderCategoryCommonTemplates(ctx, categoriesData);
            }).catch(notifications.handleError);
    }
    else {
        ctx.redirect('index.html');
    }

};

handlers.getEditCategory = function (ctx) {
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';

    let id = ctx.params.id.substring(1);

    if (ctx.admin) {
        categoriesService.getCategory(id).then(function (category) {
            ctx.category = category.category;
            ctx._id = id;

            ctx.loadPartials({
                header: "./templates/admin/common/header.hbs",
                footer: "./templates/common/footer.hbs"
            }).then(function () {
                this.partial('./templates/admin/categories/editCategory.hbs');
            });
        });
    }
    else {
        ctx.redirect('index.html');
    }
};

handlers.editCategory = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    let id = ctx.params.id.substring(1);
    let category =
        {
            "category": ctx.params.name,
            "_id" : id
        };

    categoriesService.editCategory(category).then(function () {
        notifications.showInfo(`Category edit.`);
        ctx.redirect("#/admin/categories");
    }).catch(notifications.handleError);
};

handlers.displayAddCategory = function (ctx) {
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';

    if (ctx.admin) {
        ctx.loadPartials({
            header: "./templates/admin/common/header.hbs",
            footer: "./templates/common/footer.hbs"
        }).then(function () {
            this.partial('./templates/admin/categories/addCategory.hbs');
        });
    }
    else {
        ctx.redirect('index.html');
    }
};

handlers.addCategory = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    let category =
        {
            "category": ctx.params.name,
        };
    categoriesService.addCategory(category).then(function () {
        notifications.showInfo(`Category created.`);
        ctx.redirect("#/admin/categories");
    }).catch(notifications.handleError);
};

function renderCategoryCommonTemplates(ctx, categoriesData) {

    ctx.categories = categoriesData;

    ctx.loadPartials({
        header: "./templates/admin/common/header.hbs",
        category: "./templates/admin/categories/category.hbs",
        footer: "./templates/common/footer.hbs"
    }).then(function () {
        this.partial('./templates/admin/categories/categoriesList.hbs');
    });
}