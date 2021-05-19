'use strict';

const {offerKeys, HttpCode, Message} = require(`../constants`);

module.exports = (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  const keyExists = offerKeys.every((key) => keys.includes(key));

  if (!keyExists) {
    return res.status(HttpCode.BAD_REQUEST)
              .send(Message.BAD_REQUEST);
  }

  return next();
};
