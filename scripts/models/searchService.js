let searchService = (() => {
   function getTicketByTownName(townName) {
       let endpoint=`events?query={"town":"${townName}"}`;
       return requester.get('appdata',endpoint,'master')
   }
   function getTicketByDate(date) {
       let endpoint=`events?query={"eventDate":"${date}"}`;
       return requester.get('appdata',endpoint,'master')
   }
   function getTicketByPrice(price) {
       let endpoint=`tickets?query={"price":"${price}"}`;
       return requester.get('appdata',endpoint,'master')
   }
   function getTiketById(ticketId) {
       return requester.get('appdata',`events/${ticketId}`,'master')
   }
   return {
       getTicketByTownName,
       getTicketByDate,
       getTicketByPrice,
       getTiketById,
   }
})();