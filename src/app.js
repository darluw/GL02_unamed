const fs = require('fs');
const login = require("./login.js");
const prompt = require("prompt-sync")();
const accueil = require("./accueil.js");


let app = () =>{
    menu();
}






let menu = () =>{
    console.log("=====================================");
    console.log("| Bienvenue dans le gestionnaire de QCM |");
    console.log("=====================================");
    console.log("1. Login");
    console.log("2. Register");
    console.log("3. Exit");
    let choice = prompt("Votre choix : ");
    switch (choice){
        case "1":
            let user = login.login();
            console.log(user);
            accueil.accueil(user);
            break;
        case "2":
            login.register();
            break;
        case "3":
            console.log("Bye bye");
            break;
        default:
            console.log("Wrong choice");
            menu();
            break;
    }
}
app();