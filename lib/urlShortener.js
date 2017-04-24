/**
 * Created by petersquicciarini on 4/24/17.
 */

const db = require('./db');

module.exports = {
  toShort(long, cb) {
    if (!/^http(?:s)?:\/\/.+\..+$/.test(long)) {
      return cb('URL provided is not valid.');
    }
    return db.addUrl(long, (err, urlId) => {
      if (err) return cb(err);
      return cb(null, urlId);
    });
  },
  toLong(short, cb) {
    return db.getUrl(short, (err, long) => {
      if (err) return cb(err);
      return cb(null, long);
    });
  },
};
