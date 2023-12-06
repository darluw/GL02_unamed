const { parser } = require('../src/giftParser');
const fs = require('fs');

const path = require('path');
let giftFolder;
let jsonFolder;

beforeEach(function() {
    giftFolder = fs.readdirSync(path.join(__dirname, "../files/"));
    jsonFolder = fs.readdirSync(path.join(__dirname, "../jsonResult/"));
});
describe('Tests for JSON parsing and correcting files', function () {


    it('Should correct files and save them', function (done) {
        let nbGiftFiles = 0;
        try {
            nbGiftFiles = giftFolder.length;
        } catch (err) {
            console.error("Erreur lors de la lecture du dossier :", err);
            done.fail(err);
        }

        parser();  // Add await to ensure the asynchronous parser() completes

        let nbFiles = 0;
        let isCorrected = true;

        try {
            nbFiles = giftFolder.length;

            for (let file of giftFolder) {  // Use giftFolder instead of files
                if (file.includes("~=")) {
                    isCorrected = false;
                    break;
                }
            }
        } catch (err) {
            console.error("Erreur lors de la lecture du dossier :", err);
            done.fail(err);
        }

        expect(nbGiftFiles).toEqual(nbFiles);
        expect(isCorrected).toEqual(true);
        done();
    });

    it('Should parse files and save JSON results',  function () {
        let nbFiles = 0;
        try {
            nbFiles = giftFolder.length;
        } catch (err) {
            console.error("Erreur lors de la lecture du dossier :", err);
            throw err; // Throw the error to indicate a test failure
        }

        try {
             parser()
            let nbJsonFiles = 0;

             nbJsonFiles = jsonFolder.length;

            expect(nbFiles).toEqual(nbJsonFiles);

        } catch (err) {
            console.error("Erreur lors de l'analyse des fichiers :", err);
            throw err;
        }
    });
});
