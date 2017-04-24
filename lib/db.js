/**
 * Created by petersquicciarini on 4/24/17.
 */

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const CounterSchema = mongoose.Schema({
  _id: String,
  urlId: Number,
});
const shortUrlSchema = mongoose.Schema({
  url: String,
  urlId: Number,
});
const Counter = mongoose.model('Counter', CounterSchema);
const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

const getNextUrlId = (cb) => {
  Counter.findOneAndUpdate(
    { _id: 'shortUrl' },
    { $inc: { urlId: 1 } },
    { new: true },
    (err, res) => {
      if (err) return cb(err);
      return cb(null, res.urlId);
    });
};
module.exports = {
  addUrl(url, cb) {
    getNextUrlId((err, urlId) => {
      if (err) return cb(err);
      const urlDoc = new ShortUrl({
        url,
        urlId,
      });
      return urlDoc.save()
        .then(() => cb(null, urlId))
        .catch(saveErr => cb(saveErr));
    });
  },
  getUrl(urlId, cb) {
    return ShortUrl.findOne(
      { urlId },
      'url',
      (err, res) => {
        if (err) return cb(err);
        return cb(null, res);
      });
  },
};
