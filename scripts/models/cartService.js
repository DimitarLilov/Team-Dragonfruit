let cartService = (() => {

    function getTicketByUserId(userId) {
       return requester.get('appdata',`cart?query={"userId":"${userId}"}`,'kinvey')
    }
    function getTicketByEventId(eventId) {
        return requester.get('appdata','cart','kinvey');
    }
    function addTicketCart(data) {
        return requester.post('appdata', `cart`, 'master',data);
    }

    return {
        addTicketCart,
        getTicketByEventId,
        getTicketByUserId,
    }
})();