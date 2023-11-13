2
const fs= require('fs');
const readline = require("readline");


let app = ()=>{
    console.log('Welcome to the app');
    //mettre une liste de fonctionnaliter (professeur ou eleve)
    console.log('1. Professeur');
    console.log('2. Eleve');

    //demande à l'utilisateur de choisir une option readline (1 ou 2)
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }
    );
    rl.question("Choisissez une option: ", function(option) {
        if(option == 1){
            console.log('Professeur');
        }
        else if(option == 2) {
            console.log('Eleve');

        }
    });
}

/**
 * Méthode qui permet de parse un fichier gift en json
 */
const parseGiftToJson = (giftFile)=>{

    const file = fs.readFileSync(giftFile, 'utf8');
    const lines = file.split('\n');
    const json = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('::')) {
            const key = line.substring(2);
            json[key] = '';
            let j = i + 1;
            while (j < lines.length && !lines[j].startsWith('::')) {
                json[key] += lines[j];
                j++;
            }
            i = j - 1;
        }
    }

    return json;
}


app();




