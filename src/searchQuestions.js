const readline = require("readline");
const prompt = require("prompt-sync")();

let keywords = [];
//display all the question with the user's keywords.
function displayMatchingQuestions(keywords) {
  if (keywords.length === 0) {
    console.log("List of all questions without any keyword : ");
  } else {
    console.log("List of all questions with the keywords : ");
    console.log(keywords);
  }
}
//read the keywords until `/`is pressed.
function readKeywords() {
  let userInput = prompt("Enter a keyword or '/' to escape :");
  if (userInput === "/") {
  } else {
    keywords.push(userInput);
    readKeywords();
  }
}
function searchQuestions() {
  console.log("Search");
  console.log("Keywords : ");
  readKeywords();
  displayMatchingQuestions(keywords);
}

searchQuestions();
