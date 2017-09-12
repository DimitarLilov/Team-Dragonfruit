let cartService = (() => {

    function getTicketByUserId(userId) {

       return requester.get('appdata', `cart?query={"userId":"${userId}"}`, 'kinvey')
    }

    function getTicketByEventId() {

        return requester.get('appdata', 'cart', 'kinvey');
    }

    function addTicketCart(data) {

        return requester.post('appdata', `cart`, 'master', data);
    }

    function deleteTicket(ticketId) {

        return requester.remove('appdata', `cart/${ticketId}`, 'master');
    }

    return {
        addTicketCart,
        getTicketByEventId,
        getTicketByUserId,
        deleteTicket,
    }
})();