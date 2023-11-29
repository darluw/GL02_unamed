const prompt = require("prompt-sync")();
const fs = require("fs");
const login = require("./login.js");
const app = require("./app.js");
const vCard = require("./Vcard.js");
const pathFile = "../utils/users.json";

let accueil = (user) => {
    if (user.type === "etudiant") {
        console.log("1. Passer un test");
        console.log("2. Se déconnecter")
        let choice = prompt("Votre Choix : ");
        switch (choice) {
            case "1":
                accueil(user);
                break;
            case "2":
                break;
            default:
                console.log("Wrong choice");
                accueil(user);
                break;
        }

    }
    else if (user.type === "professeur") {
        console.log("1. Créer un QCM");
        console.log("2. Créer une vCard");
        console.log("3. Se déconnecter")
        let choice = prompt("Votre choix : ");
        switch (choice) {
            case "1":
                accueil(user);
                break;
            case "2":
                vCard.createVCard();
                accueil(user);
                break;
            case "3": 
                break;
            default:
                console.log("Wrong choice");
                accueil(user);
                break;
        }
    }
}

module.exports = {accueil} ; 