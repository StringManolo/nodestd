
const std = require("./std").std();

console.log(1);

console.log(std.evalScript("8*8"));

let text = std.loadFile("./helloWorld.js");
console.log(text);

//loadScript("./helloWorld.js");

let fd = std.open("./dummy.txt", "w");
fd.puts("abc");
fd.close();

for(let i in scriptArgs) {
  console.log(scriptArgs[i]);
}

std.exit(1);

console.log("Never print this"); 
