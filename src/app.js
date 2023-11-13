const fs = require('fs');

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


console.log(parseGiftToJson(''));


