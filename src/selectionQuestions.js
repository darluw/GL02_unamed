const fs = require('fs').promises;
const path = require('path');
const {accueil} = require("./accueil");
const Parser = require("gift-parser-ide").default;
const folderPath = "../files/";
const pathFile = "../utils/users.json";
const prompt = require("prompt-sync")();

const questions = [];

/**
 * Méthode qui permet gerer le choix de l'utilisateur
 */
let fileGestion = async () =>{
    let choix = "0";
    console.log("Bienvenue dans le gestionnaire de fichier");
    while (choix != "5"){
        console.log("\nVous avez pour l'instant " + questions.length + " questions dans votre examen");
        console.log("Pour générer un examen, vous devez avoir entre 15 et 20 questions");
        console.log("Que voulez-vous faire ?\n");
        console.log("1 - Ajouter une question");
        console.log("2 - Supprimer une question");
        console.log("3 - Afficher vos questions");
        console.log("4 - Générer l'examen");
        console.log("5 - Quitter le gestionnaire de fichier");

        choix = prompt("Votre choix : ");
        switch (choix){
            case "1":
                console.log("Vous avez choisi d'ajouter une question");
                await choixExamen()
                break;
            case "2":
                console.log("Vous avez choisi de supprimer une question");
                supprimerQuestion();
                break;
            case "3":
                console.log("Vous avez choisi d'afficher vos questions");
                afficherQuestions();
                break;
            case "4":
                console.log("Vous avez choisi de générer l'examen");
                await genererExamen();
                choix = 5;
                break;
            case "5":
                console.log("Vous avez choisi de quitter le gestionnaire de fichier");
                break;
            default:
                console.log("Vous n'avez pas choisi une option valide");
                fileGestion();
        }
    }
}


/**
 * Méthode qui permet d'ajouter une question dans le tableau de questions
 * @returns {Promise<void>} - Résolution de la promesse
 */
async function choixExamen() {
    try {
        const files = await fs.readdir(folderPath);

        // Afficher les fichiers
        await affichageDossier(files);

        // Demander à l'utilisateur de choisir un fichier
        let numFichier = await choixFichier(files); // Attendre la résolution de la promesse
        console.log("\nEntree dans le fichier " + files[numFichier - 1]);
        await entrerDansFichier(files[numFichier - 1]);

    } catch (err) {
        console.error("Erreur :", err);
    }
}

/**
 * Méthode qui permet d'entrer dans un fichier
 * @returns {Promise<void>} - Résolution de la promesse
 */
let affichageDossier = async () => {
    const files = await fs.readdir(folderPath);
    let compteur = 1;

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const fileContent = await fs.readFile(filePath, 'utf8');

        const parsedPath = path.parse(file);
        console.log("\n" + compteur + " - " + parsedPath.name+ parsedPath.ext);
        compteur++;
    }
}

/**
 * Méthode qui permet de choisir un fichier
 * @param files - Fichier choisi par l'utilisateur
 * @returns {Promise<unknown>} - Résolution de la promesse
 */
async function choixFichier(files) {
    return new Promise(resolve => {
        let index = prompt("Numero du fichier à consulter ou (exit) pour revenir en arrière: ");
        if (index === "exit" || index === "EXIT" || index === "Exit") {
            console.log("Vous etes sortis de la fonction");
            fileGestion();
        } else {
            let i = parseInt(index);
            let fichier = files[i - 1];

            if (fichier != null) {
                resolve(i);// marche pas avec return i (alors que c'est un entier je pense)
            } else {
                console.log("Fichier non trouve");
                let choice = 0;
                while (choice != "1" && choice != "2") {
                    choice = prompt("Voulez-vous réessayer ? (1) Réessayer | (2) Exit  :")
                    switch (choice) {
                        case "1":
                            resolve(choixFichier(files)); // Résoudre la promesse récursivement
                            break;
                        case "2":
                            console.log("Vous etes sortis de la fonction");
                            fileGestion();
                        default:
                            console.log("Mauvais choix");
                    }
                }
            }
        }
    });
}

/**
 * Méthode qui permet d'entrer dans un fichier
 * @param selectedFile - Fichier choisi par l'utilisateur
 * @returns {Promise<void>} - Résolution de la promesse
 */
async function entrerDansFichier(selectedFile) {
    const filePath = path.join(folderPath, selectedFile); // Utilisation de folderPath

    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const questionsInFile = extractQuestions(fileContent);
        console.log(questionsInFile);
        let index = 1;
        questionsInFile.forEach(question => {//Affichage du titre et du contenu
            console.log(`${index} - Titre: ${question.title}`);
            console.log(`    Contenu: ${question.content}`);
            index++;
        });

        let fin = 0;
        while(fin ===0){
            let selectedQuestion = prompt("Choisissez le numéro de la question à intégrer: ");
            selectedQuestion = parseInt(selectedQuestion);
            console.log("Selected question = " + selectedQuestion);

            if (selectedQuestion > 0 && selectedQuestion <= questionsInFile.length) {

                trouve = 0;
                for (var j = 0; j < questions.length; j++) {
                    if (questionsInFile[selectedQuestion - 1].title === questions[j]) {
                        trouve = 1;
                        console.log("\nQuestion deja presente dans la selection");
                    }
                }
                if (trouve === 0) {
                    questions.push({ title: questionsInFile[selectedQuestion - 1].title, content: questionsInFile[selectedQuestion - 1].content });
                    fin = 1;
                }
                console.log(questions);

            } else {
                console.log("Numéro de question invalide");
            }
        }

    } catch (err) {
        console.error("Erreur :", err);
    }
}

/**
 * Méthode qui permet de supprimer une question dans le tableau de questions
 */
let supprimerQuestion = () => {
    //afficher les questions du tableau
    afficherQuestions();
    let index="-1";
    while((parseInt(index) < 0 || parseInt(index) > questions.length) && (index != "exit" || index != "EXIT" || index != "Exit")){
        index = prompt("Numéro de la question à supprimer (exit) pour revenir en arrière : ");
    }
    if (index === "exit" || index === "EXIT" || index === "Exit"){
        console.log("Vous etes sortis de la fonction");
        return;
    } else {
        index = parseInt(index);
        questions.splice(index, 1);
        console.log("Question supprimée");
    }
}

/**
 * Méthode qui permet d'extraire les questions d'un fichier
 * @param fileContent
 * @returns {*[]}
 */
function extractQuestions(fileContent) {
    const questionRegex = /::(.+?)::(.+?)(?=\n::|\n*$)/gs;
    const matches = fileContent.matchAll(questionRegex);
    const questionsFile = [];

    for (const match of matches) {
        const title = match[1].trim();
        const content = match[2].trim();
        questionsFile.push({ title, content }); // Ajout du titre et du contenu
    }

    return questionsFile;
}


/**
 * Méthode qui permet de generer un examen en .gift
 */
let genererExamen = async () => {
    if (questions.length < 15) {
        console.log("Il faut au moins 15 questions pour générer un examen !");
        return;
    }
    if (questions.length > 20) {
        console.log("Il y a trop de questions pour générer un examen !");
        return;
    }
    // Demander à l'utilisateur s'il veut changer l'index des questions
    let reponse = prompt("Voulez-vous changer l'index des questions dans le tableau ? (Oui/Non)");

    while (reponse.toLowerCase() !== 'oui' && reponse.toLowerCase() !== 'non') {
        console.log("Réponse invalide. Veuillez réessayer.");
        reponse = prompt("Voulez-vous changer l'index des questions dans le tableau ? (Oui/Non)");
    }

    while (reponse.toLowerCase() === 'oui') {
        // Changer l'index des questions
        changementIndexQuestion();
        reponse = prompt("Voulez-vous changer l'index des questions dans le tableau ? (Oui/Non)");
        while (reponse.toLowerCase() !== 'oui' && reponse.toLowerCase() !== 'non') {
            console.log("Réponse invalide. Veuillez réessayer.");
            reponse = prompt("Voulez-vous changer l'index des questions dans le tableau ? (Oui/Non)");
        }
    }
    
    // Écrire le contenu GIFT dans un fichier
    const fileNameGift = prompt("Entrez le nom du fichier à générer : ");
    const filePath = path.join(folderPath, fileNameGift + ".gift");

    let giftContent = "";
    questions.forEach((question, index) => {
        giftContent += `::${question.title}::${question.content}\n\n`;
    });

    // generer l'examen
    try {
        await fs.writeFile(filePath, giftContent, 'utf8');
        console.log(`Fichier GIFT généré avec succès : ${fileNameGift}.gift`);
    } catch (err) {
        console.error("Erreur lors de la génération du fichier :", err);
    }

}


/**
 * Méthode qui permet de changer l'index des questions dans le tableau
 */
let changementIndexQuestion = () => {
    //on affiche les questions
    afficherQuestions();
    //on demande a l'utilisateur de choisir la question a deplacer
    let anciennePosition = parseInt(prompt("l'index de la question que vous voulez deplacer :"));
    while (isNaN(anciennePosition) || anciennePosition < 0 || anciennePosition >= questions.length) {
        console.log("Index invalide. Veuillez réessayer.");
        anciennePosition = parseInt(prompt("l'index de la question que vous voulez deplacer :"));
    }

    //on demande a l'utilisateur de choisir la nouvelle position de la question
    let nouvellePosition = parseInt(prompt("Entrez la nouvelle position de la question dans le tableau :"));

    while (isNaN(nouvellePosition) || nouvellePosition < 0 || nouvellePosition >= questions.length) {
        console.log("Index invalide. Veuillez réessayer.");
        nouvellePosition = parseInt(prompt("Entrez la nouvelle position de la question dans le tableau :"));
    }

    //on deplace la question a la nouvelle position
    questions.splice(nouvellePosition, 0, questions.splice(anciennePosition, 1)[0]);
    console.log("Question déplacée avec succès !");
    //on re affiche les questions
    afficherQuestions();
}

/**
 * Méthode qui permet d'afficher les questions du tableau
 */
let afficherQuestions = () => {
    questions.forEach((question, index) => {
        console.log(`${index} --> Titre: ${question.title}`);
        console.log(`    Contenu: ${question.content}`);
    });

}

module.exports = {fileGestion};


//Remarques
//  - Pourquoi certaines fonctions des let (ça fait deux types différents de questions) ?
//  - J'ai pas mis de nom au test (première ligne du fichier gift)