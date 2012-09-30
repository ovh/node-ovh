// Can be used with node-proxy to create forwarding proxy,
// i.e. forward all the calls to underlying object.
//
// Taken from http://wiki.ecmascript.org/doku.php?id=harmony:proxies
//
function handlerMaker(obj) {
  return {
   getOwnPropertyDescriptor: function(name) {
     var desc = Object.getOwnPropertyDescriptor(obj, name);
     // a trapping proxy's properties must always be configurable
     if (desc !== undefined) { desc.configurable = true; }
     return desc;
   },
   getPropertyDescriptor:  function(name) {
     var desc = Object.getPropertyDescriptor(obj, name); // not in ES5
     // a trapping proxy's properties must always be configurable
     if (desc !== undefined) { desc.configurable = true; }
     return desc;
   },
   getOwnPropertyNames: function() {
     return Object.getOwnPropertyNames(obj);
   },
   getPropertyNames: function() {
     return Object.getPropertyNames(obj);                // not in ES5
   },
   defineProperty: function(name, desc) {
     Object.defineProperty(obj, name, desc);
   },
   delete:       function(name) { return delete obj[name]; },
   fix:          function() {
     if (Object.isFrozen(obj)) {
       var result = {};
       Object.getOwnPropertyNames(obj).forEach(function(name) {
         result[name] = Object.getOwnPropertyDescriptor(obj, name);
       });
       return result;
     }
     // As long as obj is not frozen, the proxy won't allow itself to be fixed
     return undefined; // will cause a TypeError to be thrown
   },

   has:          function(name) { return name in obj; },
   hasOwn:       function(name) { return ({}).hasOwnProperty.call(obj, name); },
   get:          function(receiver, name) { return obj[name]; },
   set:          function(receiver, name, val) { obj[name] = val; return true; }, // bad behavior when set fails in non-strict mode
   enumerate:    function() {
     var result = [];
     for (var name in obj) { result.push(name); };
     return result;
   },
   keys: function() { return Object.keys(obj); }

  };
}


module.exports = handlerMaker;
