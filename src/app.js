const parse= require("gift-pegjs");
const fs = require('fs');
const login = require("./login.js");
const prompt = require("prompt-sync")();


/**let filePath = "../files/U3-p32-Gra-Present_perfect_simple_vs_continuous.gift";



// Lecture asynchrone (non bloquante)
fs.readFile(filePath, 'utf8', (err, fileContent) => {
    if (err) {
        console.error('Erreur lors de la lecture du fichier :', err);
        return;
    }
    console.log(fileContent);

    // Maintenant, vous pouvez utiliser fileContent comme entrée pour votre analyseur GIFT
    const quiz = parse.parse(fileContent);
    console.log(quiz);
});*/

console.log("Bienvenue dans le quiz");
console.log("1. Login");
console.log("2. Register");
console.log("3. Exit");
let choice = prompt("Votre choix : ");
switch (choice){
    case "1":
        login.login();
        break;
    case "2":
        login.register();
        break;
    case "3":
        console.log("Bye bye");
        break;
    default:
        console.log("Wrong choice");
        break;
}







