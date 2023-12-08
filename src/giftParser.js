const fs = require('fs');
const path = require('path');
const Parser = require("gift-parser-ide").default;
const colors = require('colors');

const folderPath = path.join(__dirname, "../files/");

let parse = new Parser();
let jsonParse = () => {
    let quiz = null;
    const jsonResultPath = path.join(__dirname, '../jsonResult');

    if (!fs.existsSync(jsonResultPath)) {
        fs.mkdirSync(jsonResultPath);
    }

    const files = fs.readdirSync(folderPath);

    files.forEach(file => {
        const filePath = path.join(folderPath, file);

        const fileContent = fs.readFileSync(filePath, 'utf8');

        parse.update(fileContent);
        quiz = parse.result();

        const jsonFilePath = path.join(jsonResultPath, `${file}.json`);
        fs.writeFileSync(jsonFilePath, JSON.stringify(quiz, null, 2));
    });

}

let correctFile = () => {
    try {
        const files = fs.readdirSync(folderPath);

        files.forEach(file => {
            const filePath = path.join(folderPath, file);

            const fileContent = fs.readFileSync(filePath, 'utf8');

            // Faire un regex pour remplacer les ~= par =
            const correctedContent = fileContent.replace(/~=/g, "=");

            fs.writeFileSync(filePath, correctedContent);
        });
    } catch (err) {
        console.error(('Erreur lors de la lecture ou de la correction des fichiers :', err).red);
        throw err;
    }
}

const parser = () => {
    correctFile();
    jsonParse();
};

module.exports = { jsonParse, correctFile, parser };
