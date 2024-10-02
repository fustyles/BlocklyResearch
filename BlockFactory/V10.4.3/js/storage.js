/*!
  * Storage.js - A thin wrapper around localStorage for easier access 
  * (c) Félix Saparelli 2011
  * https://github.com/passcod/Storage.js
  * MIT License <http://mit.passcod.net>
  */
          

!function (name, definition) {
  if (typeof module != 'undefined') module.exports = definition();
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
  else this[name] = definition();
}('storage.js', function (storage) {
  
  function Storage() {
    
    var prefix = ""
      , ns
      , set, get, def, del
      , setAll, getAll, defAll, delAll;
    
    
    ns = function(ns) {
      if (ns) {
        var old = prefix;
        prefix = ns;
        return old;
      }
      
      return prefix;
    };
    
    set = function(name, data) {
      window.localStorage[prefix+name] = window.JSON.stringify(data);
    };
    
    get = function(name) {
      return window.JSON.parse(window.localStorage[prefix+name]);
    };
    
    def = function(name, def) {
      var data = get(name);
      if (data === null) {
        set(name, def);
        return def;
      } else {
        return data;
      }
    };
    
    del = function(name) {
      window.localStorage.removeItem(prefix+name);
    };
    
    setAll = function(obj) {
      for (var name in obj) {
        if (obj.hasOwnProperty(name)) {
          set(name, obj[name]);
        }
      }
    };
    
    getAll = function(arr) {
      var obj = {};
      for (var i in arr) {
        obj[arr[i]] = get(arr[i]);
      }
      return obj;
    };
    
    defAll = function(obj) {
      var ret = {};
      for (var name in obj) {
        if (obj.hasOwnProperty(name)) {
          ret[name] = def(name, obj[name]);
        }
      }
      return ret;
    };
    
    delAll = function(arr) {
      for (var i in arr) {
        del(arr[i]);
      }
    };
    
    return {
      set: set,
      get: get,
      def: def,
      del: del,
      all: {
        set: setAll,
        get: getAll,
        def: defAll,
        del: delAll
      }
    };
  }
  
  function storage() {
    return new Storage();
  }
  
  return storage;
});
