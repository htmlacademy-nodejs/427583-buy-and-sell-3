'use strict';

const {HttpCode, Message} = require(`../constants`);

module.exports = (service) => (req, res, next) => {
  const {offerId} = req.params;
  const offer = service.findOne(offerId);

  if (!offer) {
    return res.status(HttpCode.NOT_FOUND)
              .send(`${Message.NOT_FOUND_WITH}${offerId}`);
  }

  res.locals.offer = offer;
  return next();
};
