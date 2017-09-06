handlers.displayHome = function (ctx) {
    ctx.loggedIn = auth.isAuthorized();
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = auth.isAdmin();

    categoriesService.getCategoriesNotLogged().then(function (categories) {
        ctx.categories = categories;

        ctx.loadPartials({
            header: "./templates/common/header.hbs",
            footer: "./templates/common/footer.hbs",
            navCategory: "./templates/common/navCategory.hbs"
        }).then(function () {
            this.partial('./templates/home/home.hbs');
        });
    });
};