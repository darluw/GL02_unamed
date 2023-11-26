const { jsonParse, correctFile } = require('../src/giftParser');
const fs = require('fs');

describe('Tests for JSON parsing and correcting files', function(){
    it('Should parse files and save JSON results', function(){
        jsonParse();

        let gitftPath = "../files/";
        let jsonPath = "../jsonResult/";

        //compter le nombre de fichiers dans le dossier files
        let files = fs.readdirSync(gitftPath);
        let nbFiles = files.length;

        //compter le nombre de fichiers dans le dossier jsonResult
        let jsonFiles = fs.readdirSync(jsonPath);
        let nbJsonFiles = jsonFiles.length;

        expect(nbFiles).toEqual(nbJsonFiles);
    });

    it('Should correct files and save them', (done) => {
        correctFile(() => {
            done();
        });
    });
});