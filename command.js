var Command = {
  check: function () {
    console.log("Command Ready !");
    console.log("Magenta level checked".magenta);
    console.log("Cyan level checked".cyan);
    console.log("Blue level checked".blue);
    return true;
  },
};
module.exports = Command;
