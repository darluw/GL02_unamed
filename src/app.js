const parse= require("gift-pegjs");
const fs = require('fs');
const login = require("./login.js");
const prompt = require("prompt-sync")();


let app = ()=>{
    main();
}

let main = ()=>{
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
}

app();





