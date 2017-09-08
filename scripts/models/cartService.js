let cartService = (() => {

    function addTicketCart(data) {
        return requester.post('appdata', `cart`, 'master',data);
    }

    return {
        addTicketCart
    }
})();