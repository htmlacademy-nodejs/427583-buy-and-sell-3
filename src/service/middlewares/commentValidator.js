'use strict';

const {commentKeys, HttpCode, Message} = require(`../constants`);

module.exports = (req, res, next) => {
  const newComment = req.body;
  const keys = Object.keys(newComment);
  const keyExists = commentKeys.every((key) => keys.includes(key));

  if (!keyExists) {
    return res.status(HttpCode.BAD_REQUEST)
              .send(Message.BAD_REQUEST);
  }

  return next();
};
