const GhostContentAPI = require('@tryghost/content-api');

const api = new GhostContentAPI({
  url: 'https://ghost-tcu6.onrender.com',
  key: '911afe56ee4b4475eb5717aebb',
  version: "v5.0"
});

module.exports = api;