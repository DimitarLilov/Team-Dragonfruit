let searchService = (() => {
   function getTicketByTownName(townName) {
       let endpoint=`events?query={"town":"${townName}"}`;
       return requester.get('appdata',endpoint,'master')
   }
   function getTicketByTime(time) {
       let endpoint=`events?query={"eventTime":"${time}"}`;
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
       getTicketByTime,
       getTicketByPrice,
       getTiketById,
   }
})();