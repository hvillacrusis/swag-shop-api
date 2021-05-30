const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const wishlist = new Schema({
  title: { type: String, default: 'Cool Wish List' },
  products: [{ type: ObjectId, ref: 'Product' }],
});

module.exports = mongoose.model('WishList', wishlist);
