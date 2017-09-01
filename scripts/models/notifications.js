let notifications = (() => {

    let loading = 0;
    $(document).on({
        ajaxStart: () => {
            if (loading === 0) $('#loadingBox').show();
            loading++;
        },
        ajaxStop: () => {
            loading--;
            setTimeout(() => {if (loading === 0) $('#loadingBox').fadeOut()}, 400);
        }
    });

    function handleError(reason) {
        showError(reason.responseJSON.description);
    }

    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.empty();
        let span = $('<span>').text(message);
        infoBox.append(span);
        infoBox.show();
        infoBox.click((event) => $(event.target).hide());
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        errorBox.empty();
        let spanmsg = $('<span>').text(message);
        errorBox.append(spanmsg);
        errorBox.show();
        errorBox.click((event) => $(event.target).hide());
    }

    return {
        showInfo,
        showError,
        handleError
    }
})()