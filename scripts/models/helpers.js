function getCountTicketsInCart(ctx) {
    let ticketsCount = sessionStorage.getItem('ticketsCount');

    ctx.ticketsCount = ticketsCount;
    if (Number(ticketsCount) === 0) {
        ctx.badgeHidden = "hidden"
    }
}
