

const pathFile = "../utils/users.json";
const fs = require("fs");
const prompt = require("prompt-sync")();




let login = ()=>{
    console.log("Login : ");
    let username = prompt("Username : ");
    let password = prompt("Password : ");
    let jsonData = fs.readFileSync(pathFile, "utf8");
    let jsonContent = JSON.parse(jsonData);
    let user = jsonContent.users.find((user) => user.username === username && user.password === password);
    if(user){
        console.log("Welcome " + user.username);
        return user;
    }else{
        console.log("Wrong username or password");
        let choice = prompt("Voulez-vous réessayer ou vous inscrire ? (1) Réessayer | (2) s'inscrire | (3) Exit  :")
        switch (choice){
            case "1":
                login();
                break;
            case "2":
                register();
                break;
            case "3":
                console.log("Bye bye");
                break;
            default:
                console.log("Wrong choice");
                break;
        }
    }
}

let register = ()=>{
    console.log("Register : ");
    let username = prompt("Username : ");
    let password = prompt("Password : ");
    while(password.length < 8){
        console.log("Password too short");
        password = prompt("Password(min: 8 char) : ");
    }
    let type = prompt("Type(etudiant|professeur) : ");
    while(type !== "etudiant" && type !== "professeur"){
        console.log("Wrong type");
        type = prompt("Type(etudiant|professeur) : ");
    }
    let jsonData = fs.readFileSync(pathFile, "utf8");
    let jsonContent = JSON.parse(jsonData);
    const users = jsonContent.users;
    let user = users.find((user) => user.username === username);
    if(user){
        console.log("Username already taken");
        register();
    }else{
        jsonContent.users.push({username: username, password: password,type: type});
        fs.writeFileSync(pathFile, JSON.stringify(jsonContent));
        console.log("User created");
        login();
    }
}


module.exports = {login, register};
