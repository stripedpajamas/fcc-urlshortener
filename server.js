/**
 * Created by petersquicciarini on 4/24/17.
 */

if (!process.env.MONGOURI) {
  console.log('Please provide MONGOURI in an env var.');
  process.exit();
}

const express = require('express');
const mongoose = require('mongoose');
const urlShortener = require('./lib/urlShortener');

const app = express();

mongoose.connect(process.env.MONGOURI, (err) => {
  if (err) {
    console.log('Could not connect to MongoDB! Aborting!');
    process.exit();
  }
});

app.use(express.static('public'));

app.get('/new/(*)', (req, res) => {
  const longUrl = req.params[0];
  urlShortener.toShort(longUrl, (err, urlId) => {
    if (err) {
      return res.json({ ok: false, error: err });
    }
    const shortUrl = `${req.protocol}://${req.hostname}/${urlId}`;
    return res.json({ ok: true, longUrl, shortUrl });
  });
});

app.get('/:id', (req, res) => {
  const urlId = req.params.id;
  urlShortener.toLong(urlId, (err, longUrl) => {
    if (err) {
      return res.send('Sorry! That url is not working today.');
    }
    return res.redirect(longUrl.url);
  });
});

app.listen(process.env.PORT || 8080);
