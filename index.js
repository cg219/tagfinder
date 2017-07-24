const chalk = require('chalk');
const inquirer = require('inquirer');
const columnify = require('columnify');
const Database = require('./src/database');

console.log(chalk.white('Welcome to the X-Team CLI Test'));

/** A Prompt for entering tags. Will filter out all spaces between commas and tags.
    (Ex: a, b , c ,d , ) would be a valid entry making the list (a,b,c,d)
*/
let tagsPrompt = {
  name: 'tags',
  type: 'input',
  message: 'Enter tags seperated by a comma',
  filter(value) {
    return value.split(/\s+,\s+|,\s+|\s+,|,/).filter(item => item.length > 0);
  },
  default: null
}

//Create new Database. Once Database is ready, the prompt will be presented. See src/database.js for more info
let db = new Database(null, () => {
  console.log(chalk.blue('Database Loaded'));
  prompt();
});

// Creates Prompt. If first parameter is true, it will also display results. Decided to go with this instead of having 2 nearly
// identical functions. One to present prompt then another to show results and present the prompt again.
function prompt(results, cache, tags) {
  if(results) {
    showResults(cache, tags);
  }
  
  inquirer.prompt([tagsPrompt])
    .then(response => db.search(response.tags, prompt));
}

// Show Results of search.
function showResults(cache, tags) {
  let resultsArray = [];

  console.log(chalk.cyan('Results'));

  // Loop through searched tags and cache to create a results array.
  tags.forEach(tag => {
    let tagObject = {
      name: '',
      amount: 0
    };

    tagObject.name = tag;
    tagObject.amount = cache.get(tag);
    resultsArray.push(tagObject);
  })

  // Sort Results Array from most popular occurence to least.
  resultsArray.sort((a, b) => {
    if(a.amount < b.amount) {
      return 1;
    }

    if(a.amount > b.amount) {
      return -1;
    }

    return 0;
  })

  // Present Resullts using columnify to make it pretty =D
  console.log(chalk.cyan(columnify(resultsArray, {
    showHeaders: false,
    minWidth: 20
  })));
}