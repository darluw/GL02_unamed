const fs = require('fs');
const prompt = require("prompt-sync")();


let chargerExamen = () =>{
    let jsonExamen;



    fs.readFile("../jsonResult/U2-p22-Gra-Ing_or_inf.gift.json", "utf8", (err, data) => {

        if (err) {
            console.error(err);
            return;
        }
        jsonExamen = JSON.parse(data);
        testExamen(jsonExamen);

    });


}


let testExamen = (jsonExamen) =>{


    let score = 0;
    let nbQuestions = 0;
    jsonExamen.forEach(question => {
        const type = question.result[0][0]?.type;



        switch (type) {
            case "MC":
                console.log(question.result[0][0]?.stem.text);
                nbQuestions++;
                afficherReponses(question.result[0][0]?.choices);
                let reponse = prompt("Votre réponse : ");


                if(question.result[0][0]?.choices[reponse-1].isCorrect){
                    score++;
                    console.log("Correct");
                }else{
                    console.log("Incorrect");
                }
                break;
            case "Matching":
                console.log(question.result[0][0]?.title);
                nbQuestions++;
                let lstQuestions = getQuestionMatching(question.result[0][0]?.matchPairs);
                let lstReponses = getReponsesMatching(question.result[0][0]?.matchPairs);
                let dictionnaireQuestionReponse = {};
                let nbreQuestions = lstQuestions.length;
                for(let i = 0; i < nbreQuestions; i++){
                    afficherMatchings(lstQuestions, lstReponses);
                    let questionMatching = prompt("veuillez entrer l'index de votre question de gauche : ");
                    while(questionMatching < 0 || questionMatching > lstQuestions.length){
                        questionMatching = prompt("veuillez entrer l'index de votre question de gauche : ");
                    }
                    let reponseMatching = prompt("veuilleez entrer l'index de votre question de droite : ");
                    while(reponseMatching < 0 || reponseMatching > lstReponses.length){
                        reponseMatching = prompt("veuilleez entrer l'index de votre question de droite : ");
                    }
                    dictionnaireQuestionReponse[lstQuestions[questionMatching]] = lstReponses[reponseMatching];
                    lstQuestions[questionMatching] = null;
                    lstReponses[reponseMatching] = null;
                }

                score += verifierReponseMatching(question.result[0][0]?.matchPairs, dictionnaireQuestionReponse);
                break;

        }
    });
}

let getQuestionMatching = (matchPairs) =>{
    let lstQuestion = [];
    matchPairs.forEach(matchPair => {
        lstQuestion.push(matchPair.subquestion.text);
    });
    return lstQuestion
}

let getReponsesMatching = (matchPairs) =>{
    let lstReponses = [];
    matchPairs.forEach(matchPair => {
        lstReponses.push(matchPair.subanswer);
    });
    //melanger la liste
    lstReponses.sort(() => Math.random() - 0.5);
    return lstReponses
}

let afficherQuestionsMatching = (questions) =>{
    let res ="";
    for (i = 0; i < questions.length; i++) {
        if (questions[i]!==null)
            res += `${i} --> ${questions[i]}\n`;
    }
    return res;
}

let afficherReponsesMatching = (reponses) =>{
    let res ="";
    for (i = 0; i < reponses.length; i++) {
        if (reponses[i]!==null)
            res += `${i} --> ${reponses[i]}\n`;
    }
    return res;
}

let afficherMatchings = (lstQuestions, lstReponses) =>{
    console.log("Questions : ");
    console.log(afficherQuestionsMatching(lstQuestions));
    console.log("Reponses : ");
    console.log(afficherReponsesMatching(lstReponses));
}

let verifierReponseMatching = (matchPairs, dictionnaireQuestionReponse) =>{
    let score = 0;
    matchPairs.forEach(matchPair => {
        if(matchPair.subanswer === dictionnaireQuestionReponse[matchPair.subquestion.text]){
            score++;
        }
    });
    console.log(`Votre score est de ${score}/${matchPairs.length}`);
    return score;
}

let afficherReponses = (reponses) =>{
    for (i = 0; i < reponses.length; i++) {
        console.log(`${i+1} : ${reponses[i].text.text}`);
    }
}

chargerExamen();
