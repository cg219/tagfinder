const fs = require('fs');
const chalk = require('chalk');

// Helper Class for loading JSON and TXT files
class FileLoader {
  // Read Json file and check if is valid.
  loadJSON(filePath, callback) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      let json;

      try {
        json = JSON.parse(data);
        callback(null, json);
      }
      catch(error) {
        callback({
          error: error,
          filePath: filePath
        });
      }
    })
  }

  // Read Text File and convert the text to an array seperated by the \n character
  loadText(filePath, callback) {
    console.log(chalk.blue('Loading Default Tags'));
    fs.readFile(filePath, 'utf-8', (err, data) => {
      let tags = data.split('\n').filter(tag => tag.length > 0);

      console.log(chalk.blue('Default tags Loaded and Parsed'));
      callback(tags);
    })
  }
}

module.exports = new FileLoader();