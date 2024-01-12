const fs = require('fs');
const path = require('path');
const Parser = require("gift-parser-ide").default;
const giftParser = require("./giftParser");
const folderPath = "../files/";
const pathFile = "../utils/users.json";
const prompt = require("prompt-sync")();
const colors = require('colors');
const vg = require('vega');
const vegalite = require('vega-lite');

const questions = [];

/**
 * Méthode qui permet de gérer le choix de l'utilisateur
 */
async function fileGestion() {
    let choix = "0";
    console.log("Bienvenue dans le gestionnaire de fichier");
    while (choix != "5") {
        console.log("\nVous avez pour l'instant " + questions.length + " questions dans votre examen");
        console.log("Pour générer un examen, vous devez avoir entre 15 et 20 questions");
        console.log("Que voulez-vous faire ?\n");
        console.log("1 - Ajouter une question");
        console.log("2 - Supprimer une question");
        console.log("3 - Afficher vos questions");
        console.log("4 - Générer l'examen");
        console.log("5 - Quitter le gestionnaire de fichier");

        choix = prompt("Votre choix : ");
        console.log("Vous avez choisi l'option " + choix);
        switch (choix) {
            case "1":
                console.log("Vous avez choisi d'ajouter une question");
                choixExamen();
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
                choix = "5";
                break;
            case "5":
                console.log("Vous avez choisi de quitter le gestionnaire de fichier");
                break;
            default:
                console.log("Vous n'avez pas choisi une option valide".red);
                break;
        }
        console.log("test");
    }
}

/**
 * Méthode qui permet d'ajouter une question dans le tableau de questions
 */
function choixExamen() {
    try {
        const files = fs.readdirSync(folderPath);

        affichageDossier();
        // Demander à l'utilisateur de choisir un fichier
        let numFichier = choixFichier(files);
        console.log("\nEntree dans le fichier " + files[numFichier - 1]);
        entrerDansFichier(files[numFichier - 1]);

    } catch (err) {
        console.error(("Erreur :", err).red);
    }
}

/**
 * Méthode qui permet d'afficher les fichiers du dossier
 */
function affichageDossier() {
    const files = fs.readdirSync(folderPath);
    let compteur = 1;

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');

        const parsedPath = path.parse(file);
        console.log("\n" + compteur + " - " + parsedPath.name + parsedPath.ext);
        compteur++;
    }
}

/**
 * Méthode qui permet de choisir un fichier
 * @param files - Fichier choisi par l'utilisateur
 * @returns {number} - Indice du fichier choisi
 */
function choixFichier(files) {
    let index = prompt("Numero du fichier à consulter ou (exit) pour revenir en arrière: ");
    if (index === "exit" || index === "EXIT" || index === "Exit") {
        console.log("Vous etes sortis de la fonction");
        fileGestion();
    } else {
        let i = parseInt(index);
        let fichier = files[i - 1];

        if (fichier != null) {
            return i;
        } else {
            console.log("Fichier non trouve".red);
            let choice = 0;
            while (choice !== "1" && choice !== "2") {
                choice = prompt("Voulez-vous réessayer ? (1) Réessayer | (2) Exit  :");
                switch (choice) {
                    case "1":
                        return choixFichier(files);
                    case "2":
                        console.log("Vous etes sortis de la fonction");
                        fileGestion();
                        break;
                    default:
                        console.log("Mauvais choix".red);
                }
            }
        }
    }
}

/**
 * Méthode qui permet d'entrer dans un fichier
 * @param selectedFile - Fichier choisi par l'utilisateur
 */
function entrerDansFichier(selectedFile) {
    const filePath = path.join(folderPath, selectedFile);

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const questionsInFile = extractQuestions(fileContent);
        console.log(questionsInFile);
        let index = 1;

        questionsInFile.forEach(question => {
            console.log(`${index} - Titre: ${question.title}`);
            console.log(`    Contenu: ${question.content}`);
            index++;
        });

        let fin = 0;
        while (fin === 0) {
            let selectedQuestion = prompt("Choisissez le numéro de la question à intégrer: ");
            selectedQuestion = parseInt(selectedQuestion);
            console.log("Selected question = " + selectedQuestion);

            if (selectedQuestion > 0 && selectedQuestion <= questionsInFile.length) {
                const selectedTitle = questionsInFile[selectedQuestion - 1].title;

                // Vérifier si la question est déjà présente dans le tableau
                const existingQuestion = questions.find(q => q.title === selectedTitle);

                if (existingQuestion) {
                    console.log("\nQuestion déjà présente dans votre sélection".red);
                } else {
                    // Afficher la question à ajouter
                    console.log("\nVous êtes sur le point d'ajouter la question suivante :");
                    console.log(`    Titre: ${selectedTitle}`);
                    console.log(`    Contenu: ${questionsInFile[selectedQuestion - 1].content}`);

                    // Demander confirmation à l'utilisateur
                    const confirmation = prompt("Voulez-vous vraiment ajouter cette question ? (Oui/Non): ");
                    if (confirmation.toLowerCase() === 'oui') {
                        // Ajouter la question uniquement si l'utilisateur confirme
                        questions.push({ title: selectedTitle, content: questionsInFile[selectedQuestion - 1].content });
                        fin = 1;
                        console.log("Question ajoutée avec succès !");
                        console.log(questions);
                    } else {
                        console.log("Ajout de la question annulé.".yellow);
                        fin = 1; // Terminer la boucle
                    }
                }
            } else {
                console.log("Numéro de question invalide".red);
            }
        }
    } catch (err) {
        console.error(("Erreur :", err).red);
    }
}




/**
 * Méthode qui permet de supprimer une question dans le tableau de questions
 */
let supprimerQuestion = () => {
    //afficher les questions du tableau
    afficherQuestions();
    let index = "-1";
    while ((parseInt(index) < 0 || parseInt(index) > questions.length) && (index != "exit" || index != "EXIT" || index != "Exit")) {
        index = prompt("Numéro de la question à supprimer (exit) pour revenir en arrière : ");
    }
    if (index === "exit" || index === "EXIT" || index === "Exit") {
        console.log("Vous etes sortis de la fonction");
        return;
    } else {
        index = parseInt(index);
        questions.splice(index, 1);
        console.log("Question supprimée".green);
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
        console.log("Il faut au moins 15 questions pour générer un examen !".red);
        return;
    }
    if (questions.length > 20) {
        console.log("Il y a trop de questions pour générer un examen !".red);
        return;
    }
    // Demander à l'utilisateur s'il veut changer l'index des questions
    let reponse = prompt("Voulez-vous changer l'index des questions dans le tableau ? (Oui/Non)");

    while (reponse.toLowerCase() !== 'oui' && reponse.toLowerCase() !== 'non') {
        console.log("Réponse invalide. Veuillez réessayer.".red);
        reponse = prompt("Voulez-vous changer l'index des questions dans le tableau ? (Oui/Non)");
    }

    while (reponse.toLowerCase() === 'oui') {
        // Changer l'index des questions
        changementIndexQuestion();
        reponse = prompt("Voulez-vous changer l'index des questions dans le tableau ? (Oui/Non)");
        while (reponse.toLowerCase() !== 'oui' && reponse.toLowerCase() !== 'non') {
            console.log("Réponse invalide. Veuillez réessayer.".red);
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
        fs.writeFileSync(filePath, giftContent, 'utf8');
        console.log(`Fichier GIFT généré avec succès : ${fileNameGift}.gift`);
    } catch (err) {
        console.error(("Erreur lors du parsage du fichier :", err).red);
    }

    let jsonExamen;

    //parser le nouveau examen
    try {
        giftParser.parser();
        let examen = fs.readFileSync("../jsonResult/" + fileNameGift + ".gift.json");
        //convert to JSON
        jsonExamen = JSON.parse(examen);
    } catch (err) {
        console.error("Erreur lors de la génération du graphique".red);
    }


    //compter combien de questions de chaque type
    let nbQuestionType = [];
    jsonExamen.forEach((question) => {
        if (question.result[0]) {
            if (nbQuestionType.some(e => e.name === question.result[0][0].type)) {
                nbQuestionType.forEach((element) => {
                    if (element.name === question.result[0][0].type) {
                        element.nbQuestion++;
                    }
                });
            } else {
                nbQuestionType.push({ name: question.result[0][0].type, nbQuestion: 1 });
            }
        } else {
            if (nbQuestionType.some(e => e.name === "null")) {
                nbQuestionType.forEach((element) => {
                    if (element.name === "") {
                        element.nbQuestion++;
                    }
                });
            } else {
                nbQuestionType.push({ name: "null", nbQuestion: 1 });
            }
        }
    });

    //generer le graphique
    var avgChart = {
        "width": 320,
        "height": 460,
        "data": {
            "values": nbQuestionType
        },
        "mark": "bar",
        "title": "Examen : " + fileNameGift,
        "encoding": {
            "x": {
                "field": "name", "type": "nominal",
                "axis": { "title": "Type of questions" }
            },
            "y": {
                "field": "nbQuestion", "type": "quantitative",
                "axis": { "title": "Count" }
            }
        }
    }



    const myChart = vegalite.compile(avgChart).spec;

    /* SVG version */
    var runtime = vg.parse(myChart);
    var view = new vg.View(runtime).renderer('svg').run();
    var mySvg = view.toSVG();

    try {
        var res = await mySvg;

        //créer le dossier pour le graphique
        // Définir le chemin du dossier et du fichier
        var dirPath = path.join(__dirname, '../charts');
        var chartPath = path.join(dirPath, fileNameGift + '.svg');

        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(chartPath, res)
        view.finalize();
        console.log("Chart output : ../charts/" + fileNameGift + ".svg");
    } catch (err) {
        console.error(("Error generating chart: ", err).red);
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
        console.log("Index invalide. Veuillez réessayer.".red);
        anciennePosition = parseInt(prompt("l'index de la question que vous voulez deplacer :"));
    }

    //on demande a l'utilisateur de choisir la nouvelle position de la question
    let nouvellePosition = parseInt(prompt("Entrez la nouvelle position de la question dans le tableau :"));

    while (isNaN(nouvellePosition) || nouvellePosition < 0 || nouvellePosition >= questions.length) {
        console.log("Index invalide. Veuillez réessayer.".red);
        nouvellePosition = parseInt(prompt("Entrez la nouvelle position de la question dans le tableau :"));
    }

    //on deplace la question a la nouvelle position
    questions.splice(nouvellePosition, 0, questions.splice(anciennePosition, 1)[0]);
    console.log("Question déplacée avec succès !".green);
    //on re affiche les questions
    afficherQuestions();
}

/**
 * Méthode qui permet d'afficher les questions du tableau
 */
let afficherQuestions = () => {
    if (questions.length === 0) {
        console.log("Il n'y a aucune question dans le tableau !".red);
    } else {
        questions.forEach((question, index) => {
            console.log(`${index} --> Titre: ${question.title}`);
            console.log(`    Contenu: ${question.content}`);
        });
    }
}

module.exports = { fileGestion };

