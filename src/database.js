const fs = require('fs');
const path = require('path');
const fileLoader = require('./file-loader');
const chalk = require('chalk');
const utils = require('util');
const SearchCache = require('./search-cache');
const defaultTagFile = 'src/tags.txt';

class Database {

  // Database constructor that loads the data.json files upon creation. Once all the json is loaded, a callback is called to let
  // the program know it is ready.
  constructor(source, callback) {
    this.source = source || path.join(process.cwd(), 'src/data/');
    this.data = [];
    this.cache = new SearchCache();

    // Keep track of total json files and the amount loaded. Used to know when all files are completely loaded in.
    let totalFiles = 0;
    let amountLoaded = 0;

    loadSources.call(this);
    
    //Load all data json files.
    function loadSources() {
      console.log(chalk.blue('Loading Databse Files'));

      fs.readdir(this.source, (err, files) => {
        totalFiles = files.length;

        files.forEach(file => {
          fileLoader.loadJSON(path.resolve(this.source, file), sourceCallback.bind(this));
        })
      });
    }

    // Called when a data.json file is completed read. Pushes data into an array to refeerence later during searches.
    // If an error occurs (JSON is invalid), it is skipped.
    function sourceCallback(error, json) {
      if(error) {
        console.error(chalk.red(`Error Loading ${error.filePath}. Skipping ...`));
      }
      else {
        this.data.push(json);
      }

      amountLoaded += 1;
      
      // Once all json files are loaded in, let the program know.
      if(amountLoaded >= totalFiles) {
        callback();
      }
    }
  }

  // Search function to check database for occurences of chosen tags
  search(tags, callback) {
    let searchTags = tags;
    let cache = this.cache;

    // Checks to see if any tags were submitted. If not it loads tags from the tags.txt file and then performs search.
    // If tags are present, the search is performed immediately.
    if(searchTags.length == 0) {
      console.log(chalk.blue('No Tags entered. Grabbing default tags'));

      fileLoader.loadText(path.resolve(process.cwd(), defaultTagFile), textTags => {
        searchTags = textTags;
        performSearch.call(this);
      })
    }
    else {
      performSearch.call(this);
    }

    // Private inner search function. Loops through given tags and recursively checks for occurences.
    function performSearch() {
      searchTags.forEach(tag => {
        // If this tag was previously searched, just grab the value from the cache and move to the next tag.
        if(cache.get(tag) === false) {
          console.log(chalk.yellow(`Searching Database for ${tag}`));

          // Add the tag to the cache for later use
          cache.add(tag, 0);
          this.data.forEach((object) => {
            // Check for occurences
            recursiveLookup(object, tag);
          })
        }
        else {
          console.log(chalk.green(`Retreiving ${tag} from cache.`));
        }
      })

      callback(true, cache, searchTags);
    }

    // Recursive function that checks for tag occurences and if a node contains children, it checks those too until there
    // areno more left.
    function recursiveLookup(object, tagToLookup) {
      if(object.tags) {
        object.tags.forEach(tag => {
          if(tagToLookup == tag) {
            // If a tag matches a tag in the database, increment that value inthe cache object
            cache.increment(tagToLookup);
          }
        })
      }

      // If this node has children, perform recursiveLookup() again.
      if(object.children) {
        object.children.forEach(data => {
          recursiveLookup(data, tagToLookup);
        })
      }
    }
  }
}

module.exports = Database;