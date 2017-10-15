
var ovh = require('ovh-es')(require('./credentials.json'));


(async function(){
  try {
    var me = await ovh.request('GET', '/me');
    console.log(me);
  } catch(err) {
    console.log(err);

  }

})();