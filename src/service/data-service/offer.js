'use strict';

const {MAX_ID_LENGTH} = require(`../constants`);
const {nanoid} = require(`nanoid`);

class OfferService {
  constructor(offers) {
    this._offers = offers;
  }

  create(offer) {
    const newOffer = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
      comments: []
    }, offer);

    this._offers.push(newOffer);
    return newOffer;
  }

  drop(id) {
    const offer = this._getOffer(id);

    if (!offer) {
      return null;
    }

    this._offers = this._offers.filter((item) => item.id !== id);
    return offer;
  }

  findAll() {
    return this._offers;
  }

  findOne(id) {
    return this._getOffer(id);
  }

  update(id, offer) {
    const oldOffer = this._getOffer(id);

    return Object.assign(oldOffer, offer);
  }

  _getOffer(id) {
    return this._offers.find((item) => item.id === id);
  }
}

module.exports = OfferService;
