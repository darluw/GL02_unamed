const { jsonParse, correctFile } = require('../src/giftParser');
const fs = require('fs').promises;
const path = require('path');

describe('Tests for JSON parsing and correcting files', function () {
    const gitftPath = path.join(__dirname, "../files");
    const jsonPath = path.join(__dirname, "../jsonResult");

    beforeEach(function (done) {

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
        done();
    });

    it('Should correct files and save them', function (done) {
        let nbFiftFiles = 0;
        try {
            const files = fs.readdir(gitftPath);
            nbFiftFiles = files.length;
            console.log("nbGiftFiles " + nbFiftFiles);
        } catch (err) {
            console.error("Erreur lors de la lecture du dossier :", err);
            done.fail(err);
        }

        correctFile();

        let nbFiles = 0;
        let isCorrected = true;

        try {
            const files = fs.readdirSync(gitftPath);
            nbFiles = files.length;
            console.log("nbFiles" + nbFiles);

            for (let file of files) {
                if (file.includes("~=")) {
                    isCorrected = false;
                    break;
                }
            }

        } catch (err) {
            console.error("Erreur lors de la lecture du dossier :", err);
            done.fail(err);
        }

        expect(nbFiftFiles).toEqual(nbFiles);
        expect(isCorrected).toEqual(true);
        done();
    });

    it('Should parse files and save JSON results', async function (done) {
        let nbFiles = 0;
        try {
            const files =  fs.readdirSync();
            nbFiles = files.length;
            console.log("nbFiles" + nbFiles);
        } catch (err) {
            console.error("Erreur lors de la lecture du dossier :", err);
            done.fail(err);
        }

        await jsonParse();

        let nbJsonFiles = 0;
        try {
            const files = await fs.readdir(jsonPath);
            nbJsonFiles = files.length;
        } catch (err) {
            console.error("Erreur lors de la lecture du dossier :", err);
            done.fail(err);
        }

        expect(nbFiles).toEqual(nbJsonFiles);
        done();
    });
});


