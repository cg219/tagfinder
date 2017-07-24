# X-Team CLI Mockup

## Installation
```
npm install
```

## Run
```
npm run start
```

## Libraries Used

- Chalk: Used to change colors of console log outputs
- Columnify: Used to format console output to be more readable
- Inquirer: Used to create prompts in CLI to accept user inputs

### Debugging

I didn't run into many bugs while creating this. Most of my debugging consisted of console logs. I did however use the NodeJS debugger to track down a ReferenceError I was getting that I couldn't track down with *console.log*.

### Testing

Since this was a tiny example, I didn't create Mocha tests. For a moderately sized app I would definitely use that for something API based like this. The only section that needed heavy testing was the section in *index.js* that turned a comma delimited string into an Array. I tested this on a RegExp online simulator to make sure I covered as many use cases as possible. That seemed like a more efficient use of time to test that instead of creating test suites.

### Best Practices

I made sure to try to keep the seperation of duties concise. If a method or a particular file was getting too beefy or hard to follow, I'd break it out into its own class or split the method in 2. The ease of understanding what I write at a glance is important. I made sure to include comments as I coded to make sure I understood what I was doing if I ever took a break or a piece of code was too complex at first glance (Ex: recursive bit in the *database.js* file). As I mentioned in our previous convos, I stuck to mostly local variables and block level **let** variables.