
const fs = require("fs");

let scriptArgs = process.argv;

let cli = {};
for (let i in scriptArgs) {
  switch(scriptArgs[i]) {
    case "-f":
      cli.filename = scriptArgs[1 + +i];
  }
}

let std = {};
std.open = (filename, mode) => {
  let fd = {};
  fd.internalFd = fs.openSync(filename, mode);
  fd.read = (buffer, position, len) => fs.readSync(fd.internalFd, buffer, position, len);
  fd.puts = (str) => fs.writeSync(fd.internalFd, str);
  fd.close = () => fs.closeSync(fd.internalFd);
  return fd;
};

std.loadFile = filename => {
  try {
    filename = fs.readFileSync(filename, { encoding: "utf-8" });
  } catch(e) {
    filename = null
  }
  return filename;
};


if (cli.filename) {
console.log(1);
  let code = std.loadFile(cli.filename);
  code = code
    .replace(new RegExp('import \\* as std from "std";', 'i'), 'const std = require("./std").std()')
    .replace(new RegExp('import \\* as os from "os";', 'i'), "")
    .replace(new RegExp('let run =', 'gi'), '/* let run =')
    .replace(new RegExp('return msg;\n}', ''), 'return msg;\n} */')
    .replace(new RegExp("run\\(", "g"), "std.run(");

console.log(2);
  console.log(code);
  let fd = std.open(`${cli.filename}_nodeCompatible.js`, "w");
  fd.puts(code);
  fd.close();
}

