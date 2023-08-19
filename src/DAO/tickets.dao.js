const TicketsRepository = require("./repositories/tickets.repository");

const ticketsDao = new TicketsRepository();

module.exports = ticketsDao;
