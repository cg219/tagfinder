const chalk = require('chalk');

// Cache Object that holds all searched tags for quick retrieval later.
class SearchCache {
  constructor() {
    this.hash = {};
  }

  increment(name, amount) {
    if(this.hash.hasOwnProperty(name)) {
      this.hash[name] += amount || 1;
    }
    else {
      this.hash[name] = amount || 1;
    }
  }

  add(name) {
    if(!this.hash.hasOwnProperty(name)) {
      this.hash[name] = 0;
    }
  }

  get(name) {
    if(this.hash.hasOwnProperty(name)) {
      return this.hash[name];
    }

    return false;
  }
}

module.exports = SearchCache;