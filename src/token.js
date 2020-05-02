const base64 = require('base-64');

function generate(user_name) {
  const token = user_name + '-' + base64.encode(Date.now());
  return(token.replace(/ /g, ''));
};

module.exports = {
  generate: generate
};