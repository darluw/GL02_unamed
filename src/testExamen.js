const fs = require('fs');
const prompt = require("prompt-sync")();

/**
 * Permet de charger ke fichier JSON contenant les questions et les réponses
 */
let chargerExamen = () =>{
    let jsonExamen;


    // Charger le fichier JSON
    fs.readFile("../jsonResult/U6-p67-Review.gift.json", "utf8", (err, data) => {

        if (err) {
            console.error(err);
            return;
        }
        jsonExamen = JSON.parse(data);
        //commencer le test
        testExamen(jsonExamen);

    });


}

/**
 * Permet d'éxécuter le test
 * @param jsonExamen : le fichier JSON contenant les questions et les réponses
 */
let testExamen = (jsonExamen) =>{


    let score = 0;
    let nbQuestions = 0;
    //Parcourir le fichier JSON
    jsonExamen.forEach(question => {
        const type = question.result[0][0]?.type;


        //Vérifier le type de la question
        switch (type) {
            case "MC":
                console.log(question.result[0][0]?.stem.text);
                nbQuestions++;
                afficherReponses(question.result[0][0]?.choices);
                let reponse = prompt("Votre réponse : ");

                while(reponse==="" || reponse < 0 || reponse > question.result[0][0]?.choices.length|| !isNaN(reponse)){
                    reponse = prompt("Votre réponse : ");
                }
                if(question.result[0][0]?.choices[reponse-1].isCorrect){
                    score++;
                    console.log("Correct");
                }else{
                    console.log("Incorrect");
                }
                break;
            case "Matching":
                // affichage du titre de la question
                console.log(question.result[0][0]?.title);
                nbQuestions++;
                // affichage des questions de gauche
                let lstQuestions = getQuestionMatching(question.result[0][0]?.matchPairs);
                // affichage des réponses de droite
                let lstReponses = getReponsesMatching(question.result[0][0]?.matchPairs);
                let dictionnaireQuestionReponse = {};
                let nbreQuestions = lstQuestions.length;
                for(let i = 0; i < nbreQuestions; i++){
                    // affichage des questions et des réponses
                    afficherMatchings(lstQuestions, lstReponses);
                    // récupération des index des questions et des réponses
                    let questionMatching = prompt("veuillez entrer l'index de votre question de gauche : ");
                    while(questionMatching < 0 || questionMatching >= lstQuestions.length){
                        questionMatching = prompt("veuillez entrer l'index de votre question de gauche : ");
                    }
                    let reponseMatching = prompt("veuilleez entrer l'index de votre question de droite : ");
                    while(reponseMatching < 0 || reponseMatching >= lstReponses.length){
                        reponseMatching = prompt("veuilleez entrer l'index de votre question de droite : ");
                    }
                    // ajout de la question et de la réponse dans le dictionnaire
                    dictionnaireQuestionReponse[lstQuestions[questionMatching]] = lstReponses[reponseMatching];
                    // suppression de la question et de la réponse dans les listes
                    lstQuestions[questionMatching] = null;
                    lstReponses[reponseMatching] = null;
                }
                //calcul du score
                score += verifierReponseMatching(question.result[0][0]?.matchPairs, dictionnaireQuestionReponse);
                break;
            case "Short":
                console.log(question.result[0][0]?.stem.text);
                nbQuestions++;
                let reponseShort = prompt("Votre réponse : ");
                while(reponseShort===""){
                    reponseShort = prompt("Votre réponse : ");
                }
                if(verifierReponseShort(question.result[0][0]?.choices, reponseShort)){score++;}
                console.log(score);

                break;


        }
    });
}

let verifierReponseShort = (question, reponse) =>{
    let estCorrect = false;
    question.forEach(mot => {
        if(mot.text.text.toLowerCase() === reponse.toLowerCase()){
            console.log("Correct");
            estCorrect = true;
        }
    })
    return estCorrect;
}

/**
 * Permet de créer un tableau contenant les questions d'une question de type Matching
 * @param matchPairs : la liste des réponses d'une question de matching
 * @returns {*[]} : le tableau des questions
 */
let getQuestionMatching = (matchPairs) =>{
    let lstQuestion = [];
    matchPairs.forEach(matchPair => {
        lstQuestion.push(matchPair.subquestion.text);
    });
    return lstQuestion
}

/**
 * Permet de créer un tableau contenant les réponses d'une question de type Matching et de les mélanger
 * @param matchPairs : la liste des réponses d'une question de matching
 * @returns {*[]} : le tableau des réponses mélangées
 */
let getReponsesMatching = (matchPairs) =>{
    let lstReponses = [];
    matchPairs.forEach(matchPair => {
        lstReponses.push(matchPair.subanswer);
    });
    //melanger la liste
    lstReponses.sort(() => Math.random() - 0.5);
    return lstReponses
}

/**
 * Permet d'afficher les questions au format Matching
 * @param questions : le tableau des questions
 * @returns {string} : la chaine de caractère contenant les questions
 */
let afficherQuestionsMatching = (questions) =>{
    let res ="";
    for (i = 0; i < questions.length; i++) {
        if (questions[i]!==null)
            res += `${i} --> ${questions[i]}\n`;
    }
    return res;
}

/**
 * Permet d'afficher les réponses au format Matching
 * @param reponses : le tableau des réponses
 * @returns {string} : la chaine de caractère contenant les réponses
 */
let afficherReponsesMatching = (reponses) =>{
    let res ="";
    for (i = 0; i < reponses.length; i++) {
        if (reponses[i]!==null)
            res += `${i} --> ${reponses[i]}\n`;
    }
    return res;
}

/**
 * Permet d'afficher les questions et les réponses au format Matching
 * @param lstQuestions : le tableau des questions
 * @param lstReponses : le tableau des réponses
 */
let afficherMatchings = (lstQuestions, lstReponses) =>{
    console.log("Questions : ");
    console.log(afficherQuestionsMatching(lstQuestions));
    console.log("Reponses : ");
    console.log(afficherReponsesMatching(lstReponses));
}

/**
 * Permet de vérifier les réponses au format Matching
 * @param matchPairs : la liste des réponses d'une question de matching
 * @param dictionnaireQuestionReponse : le dictionnaire contenant les questions et les réponses
 * @returns {number} : le score
 */
let verifierReponseMatching = (matchPairs, dictionnaireQuestionReponse) =>{
    let score = 0;
    matchPairs.forEach(matchPair => {
        if(matchPair.subanswer === dictionnaireQuestionReponse[matchPair.subquestion.text]){
            score++;
        }
    });
    return score;
}

/**
 * Permet d'afficher les réponses d'une question de type MC
 * @param reponses : la liste des réponses
 */
let afficherReponses = (reponses) =>{
    for (i = 0; i < reponses.length; i++) {
        console.log(`${i+1} : ${reponses[i].text.text}`);
    }
}

chargerExamen();
