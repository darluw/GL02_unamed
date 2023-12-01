const fs = require('fs');
const path = require('path');
const Parser = require("gift-parser-ide").default;

const folderPath = "../files/";

let parse = new Parser();
let jsonParse = () =>{
    let quiz = null;
    if(!fs.existsSync('../jsonResult')){
        fs.mkdirSync('../jsonResult');
    }

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error("Erreur lors de la lecture du dossier :", err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(folderPath, file);

            fs.readFile(filePath, 'utf8', (err, fileContent) => {
                if (err) {
                    console.error('Erreur lors de la lecture du fichier :', err);
                    return;
                }

                parse.update(fileContent);
                quiz = parse.result();

                fs.writeFile(`../jsonResult/${file}.json`, JSON.stringify(quiz, null, 2), (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
            });
        });
    });
}


let correctFile = () =>{
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error("Erreur lors de la lecture du dossier :", err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(folderPath, file);

            fs.readFile(filePath, 'utf8', (err, fileContent) => {
                if (err) {
                    console.error('Erreur lors de la lecture du fichier :', err);
                    return;
                }

                //faire un regex pour remplacer les ~= par =
                fileContent = fileContent.replace(/~=/g, "=");

                fs.writeFile(filePath, fileContent, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
            });
        });
    });
}
jsonParse();

module.exports = {jsonParse, correctFile};
