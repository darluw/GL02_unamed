const prompt = require("prompt-sync")();
const fs = require("fs");
const login = require("./login.js");
const app = require("./app.js");
const vCard = require("./Vcard.js");
const pathFile = "../utils/users.json";
const parse = require("./giftParser.js");
const selectQ = require("./selectionQuestions.js")
const examen = require("./testExamen.js");

// Fonction qui affiche le menu d'accueil
let accueil = (user) => {
    parse.parser();
    // Vérifier le type d'utilisateur
    if (user.type === "etudiant") {
        // Afficher le menu
        console.log("1. Passer un test");
        console.log("2. Se déconnecter");
        // Demander le choix
        let choice = prompt("Votre Choix : ");
        // Vérifier le choix
        switch (choice) {
            case "1":
                // On lance la fonction pour passer un test
                accueil();
                break;
            case "2":
                // On se déconnecte
                break;
            default:
                // On affiche une erreur et on relance la fonction d'accueil
                console.log("Wrong choice");
                accueil();
                break;
        }

    }
    else if (user.type === "professeur") {
        // Afficher le menu
        console.log("1. Créer un QCM");
        console.log("2. Créer une vCard");
        console.log("3. Simulation du passsage d'un test");
        console.log("4. Se déconnecter");
        
        // Demander le choix
        let choice = prompt("Votre choix : ");
        // Vérifier le choix
        switch (choice) {
            case "1":
                // On lance la fonction pour créer un QCM
                selectQ.fileGestion()
                accueil(user);
                break;
            case "2":
                // On lance la fonction pour créer une vCard
                vCard.createVCard();
                accueil(user);
                break;
            case "3":
                // On lance la fonction pour le passage d'un test
                examen.chargerExamen(user);
                accueil(user);
                break;
            case "4": 
                // On se déconnecte
                break;
            default:
                // On affiche une erreur et on relance la fonction d'accueil
                console.log("Wrong choice");
                accueil(user);
                break;
        }
    }
}


// Export de la fonction pour pouvoir l'appeler dans un autre fichier
module.exports = {accueil} ; 