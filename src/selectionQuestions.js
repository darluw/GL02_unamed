const fs = require('fs').promises;
const path = require('path');
const Parser = require("gift-parser-ide").default;
const folderPath = "../files/";
const prompt = require("prompt-sync")();

const questions = [];

let fileGestion = () =>{
    console.log("Bienvenue dans le gestionnaire de fichier");
    console.log("Vous avez pour l'instant " + questions.length + " questions dans votre examen");
    console.log("Vous pouvez ajouter jusqu'à 20 questions");
    console.log("Que voulez-vous faire ?\n");
    console.log("1 - Ajouter une question");
    console.log("2 - Supprimer une question");
    console.log("3 - Afficher vos questions");
    console.log("4 - Générer l'examen");
    console.log("5 - Quitter le gestionnaire de fichier");

    let choix = prompt("Votre choix : ");
    switch (choix){
        case "1":
            console.log("Vous avez choisi d'ajouter une question");
            choixExamen()
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
            genererExamen();
            break;
        case "5":
            console.log("Vous avez choisi de quitter le gestionnaire de fichier");
            break;
        default:
            console.log("Vous n'avez pas choisi une option valide");
            fileGestion();
    }


}




async function choixExamen() {
    try {
        const files = await fs.readdir(folderPath);
        let compteur = 1;

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const fileContent = await fs.readFile(filePath, 'utf8');



            const parsedPath = path.parse(file);
            console.log("\n" + compteur + " - " + parsedPath.name+ parsedPath.ext);
            compteur++;
        }

        while (questions.length < 15) {
            let numFichier = await choixFichier(files); // Attendre la résolution de la promesse
            console.log("\nEntree dans le fichier " + files[numFichier - 1]);
            await entrerDansFichier(files[numFichier - 1]);

        }
        var arret = 0;
        while (arret === 0){
            if (questions.length >= 15 && questions.length < 20){
                console.log("Total de question de l'examen : " + questions.length)
                let rep = prompt("Souhaitez-vous continuer (1) ou arreter (0) ?");
                rep = parseInt(rep);
                if (rep === 0){
                    arret = 1;
                }
                else {
                    let numFichier = await choixFichier(files); // Attendre la résolution de la promesse
                    console.log("\nEntree dans le fichier " + files[numFichier - 1]);
                    await entrerDansFichier(files[numFichier - 1]);
                }
            }
        }
        return questions;
        
    } catch (err) {
        console.error("Erreur :", err);
    }
}

async function choixFichier(files) {
    return new Promise(resolve => {
        let index = prompt("Numero du fichier à consulter (exit) pour revenir en arrière: ");
        if (index === "exit") {
            console.log("Vous etes sortis de la fonction");
            process.exit();
        }
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
                        process.exit();
                    default:
                        console.log("Mauvais choix");
                }
            }
        }
    });
}

async function entrerDansFichier(selectedFile) {
    const filePath = path.join(folderPath, selectedFile); // Utilisation de folderPath

    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const questionsInFile = extractQuestions(fileContent);

        let index = 1;
        questionsInFile.forEach(question => {
            console.log(`${index} - ${question.title}`);
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
                        console.log("\Question deja presente dans la selection");
                    }
                }
                if (trouve === 0) {
                    questions.push(questionsInFile[selectedQuestion - 1].title);
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


function supprimerQuestion() {
    displayQuestions();
    let index="-1";
    while((parseInt(index) < 0 || parseInt(index) > questions.length)&& index != "exit"){
        index = prompt("Numéro de la question à supprimer (exit) pour revenir en arrière : ");
    }
    if (index === "exit"){
        console.log("Vous etes sortis de la fonction");
        //retourner a la fonction d'avant (choixFichier)

    }
    index = parseInt(index);
    questions.splice(index, 1);
    console.log("Question supprimée");
}

function extractQuestions(fileContent) {
    const questionRegex = /::(.+?)::/g;
    const matches = fileContent.matchAll(questionRegex);
    const questionsFile = [];

    for (const match of matches) {
        questionsFile.push({ title: match[1] });
    }

    return questionsFile;
}





let genererExamen = () => {
    if (questions.length>=15) {
        console.log("Il y a trop de questions dans la selection, veuillez en supprimer");
    }
    //demander le nom du fichier
    let nameFile = prompt("Nom du fichier : ");

}

afficherQuestions = () => {
    questions.forEach(question => {
        console.log(`${questions.indexOf(question)} --> ${question}`);
    });

}

start();