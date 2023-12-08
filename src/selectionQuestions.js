const fs = require('fs');
const path = require('path');
const { accueil } = require("./accueil");
const Parser = require("gift-parser-ide").default;
const giftParser = require("./giftParser");
const folderPath = "../files/";
const pathFile = "../utils/users.json";
const prompt = require("prompt-sync")();
var colors = require('colors');
const vg = require('vega');
const vegalite = require('vega-lite');

const questions = [{
    title: 'U7 p77 [Key word transformation] 6.4',
    content: '[html]I had a wonderful time and I really enjoyed seeing everyone again.<br>\n' +
        '<b>GREAT</b><br>\n' +
        'I had a wonderful time and {=it was great to see} everyone again.'
},
{
    title: 'U8 p84 Voc Linking words 5.8',
    content: 'I enjoyed my time at the law firm. I made a lot of friends there {=too.}.'
},
{
    title: 'U7 p77 [It/There is] GR+.8',
    content: "{~It =There} isn't any time to have a quick coffee first."
},
{
    title: 'U7 p76 5 Relative clauses – Open writing',
    content: '[html]Describe a popular place in your country and why people go there. Use the phrases below.<br>\n' +
        "<i>It's a place which…</i><br>\n" +
        "<i>It's somewhere that…</i><br>\n" +
        '<i>The people who live there…</i><br>\n' +
        '<i>One reason why people like it is…</i><br>{}'
},
{
    title: 'U7 p77 [So,such,too,enough,very] 1.4',
    content: "There aren't {~enough~so~such~too=very} many people who could do that."
},
{
    title: 'EM U5 p35 Gra3.4',
    content: 'There {~was=were} few people in the restaurant.'
},
{
    title: 'U1 p10 GR2.3 Present tenses & habits',
    content: "I think she {=is being ='s being} a bit unfair – he didn't mean to upset her. (<i>be</i>)"
},
{
    title: 'U6 p63 Reading Voc8.1',
    content: "[html]I don't always feel very {=hopeful} (<i>hope</i>) about the impact of technology on our lives."
},
{
    title: 'U9 p95 4.3 Third conditional',
    content: '[html]\n' +
        '<b>A:</b> We set off a bit late and got held up in the traffic. (<i>leave earlier</i>) <br>\n' +
        '<b>B:</b> If you ____ in the traffic.{}'
},
{
    title: 'U7 p76 GR2.0 Relative clauses',
    content: 'Complete the sentences with the words in the box. You can use the words more than once.'
},
{
    title: 'U7 p76 GR2.1 Relative clauses',
    content: 'The letter is in the file {~when=where~whom~whose~why} I keep my bills.'
},
{
    title: 'U7 p76 GR2.2 Relative clauses',
    content: "It wasn't clear {~when~where~whom~whose=why} the children had stayed at home."
},
{
    title: 'U7 p76 GR2.3 Relative clauses',
    content: 'The lawyer from {~when~where=whom~whose~why} we had received the advice was well known.'
},
{
    title: 'U7 p76 GR2.4 Relative clauses',
    content: 'Please give Luke this message at any point {=when~where~whom~whose~why} it is convenient.'
},
{
    title: 'U7 p76 GR2.5 Relative clauses',
    content: 'The old men directed us to a small hotel, {~when=where~whom~whose~why} we spent the night.'
}];

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
                console.log("Vous n'avez pas choisi une option valide");
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
        console.error("Erreur :", err);
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
            console.log("Fichier non trouve");
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
                        console.log("Mauvais choix");
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
    const filePath = path.join(folderPath, selectedFile); // Utilisation de folderPath

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const questionsInFile = extractQuestions(fileContent);
        console.log(questionsInFile);
        let index = 1;
        questionsInFile.forEach(question => {//Affichage du titre et du contenu
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
        console.error("Error generating chart: ", err);
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
    if (questions.length === 0) {
        console.log("Il n'y a aucune question dans le tableau !");
    } else {
        questions.forEach((question, index) => {
            console.log(`${index} --> Titre: ${question.title}`);
            console.log(`    Contenu: ${question.content}`);
        });
    }
}

module.exports = { fileGestion };

