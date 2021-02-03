const std = require("./std").std()


/* let run = command => {
  let p = std.popen(command, "r"),
  msg = "",
  r = "";                                                       
  while(( r = p.getline() ) != null) {
    msg += r + "\n";
  }
  return msg;
} */

let cli = {};
cli.COLORS = {
  RED: "\x1b[31m",                                                RESET: "\x1b[0m",
  YELLOW:"\x1b[33m",
  BLUE: "\x1b[34m",
  GREEN: "\x1b[32m"                                             };

let javascriptBotFunctions = `const std = require("./std").std();


`;

let loggedInUsers = [];
let requestedLogin = [];
for (let i in scriptArgs) {
  switch(scriptArgs[i]) {
    case "-t":
    case "--token":
      cli.token = scriptArgs[+i + +1];
    break;

    case "-s":
    case "--save":
      let fd = std.open(".token", "w");
      fd.puts(cli.token);
      fd.close();
    break;

    case "-l":
    case "--load":
      cli.token = std.loadFile(".token");
    break;

    case "-h":
    case "--help":
      console.log( `

usage: node tgbot [options]
  -t  --token            Telegram Bot Api Token. https://t.me/BotFather
  -s  --save             Save the token internally to start the bot in the future without manually provide the token each time.
  -l  --load             Use the saved token to start the bot.
  -h  --help             This message.
  -p  --password         Password to log from Telegram.
  -v  --verbose          Show basic feedback to the command line interface.
  -w  --wait             Bot delay in seconds. (Can process multiple messages at once, so you don't need a really low number to don't fallback).

Examples:
node tgbot -t 192829292:iqidkwiexampleunvalidtokeniwjwusjwis -s -v

node tgbot -l -v
`);
  std.exit(1);

    case "-p":
    case "--password":
      cli.password = scriptArgs[+i + +1];
    break;

    case "-v":
    case "--verbose":
      cli.v = true;;
    break;

    case "-w":
    case "--wait":
      cli.wait = scriptArgs[+i + +1];
    break;
  }
}


if (!cli.token) {
  console.log(`${cli.COLORS.RED}No has introducido tu token de telegram.${cli.COLORS.RESET}

Si aún no pusiste tu token.
Inicia con: node tgbot -t 183828181:kqnsiwnskwkziqnsoqnsiqn -s

Si ya introduciste tu token.
Inicia con: node tgbot -l

Si aún no tienes un token.
Visita ${cli.COLORS.BLUE}https://t.me/BotFather${cli.COLORS.RESET} y escríbele /newBot


ESCRIBE ${cli.COLORS.YELLOW}node tgbot -h${cli.COLORS.RESET} PARA OBTENER LISTA DE COMANDOS.`);
  std.exit(1);
}

let bot = () => {
let api = std.run(`curl https://api.telegram.org/bot${cli.token}/getUpdates --silent`);

if (!api) {
  console.log("Unable to access Telegram Bot Api. Do you have internet conection?");
  return;
}

let apiJson = JSON.parse(api);

if (apiJson.ok !== true) {
  console.log(`Telegram Api Returning An Error:
${api}`);
  std.exit(1);
}

if (!apiJson.result) {
  console.log(`No results to parse:
${api}`);
  std.exit(1);
}

let process = (text, username, chatId) => {
  let response = "";
  let userRequestedLogin = false;
  let userLogged = false;
  for (let i in requestedLogin) {
    if (requestedLogin[i] == username) {
      cli.v && console.log(`${username} requested login previously`);
      userRequestedLogin = true;
      if (cli.password == text) {
        cli.v && console.log(`password match pushing user to loggedInUsersList`);
        loggedInUsers.push(username);
        response = "Estás loggeado.";
      } else {
        cli.v && console.log(`${text} is not the password`);
        response = "Contraseña incorrecta";
      }
    }
  }

  for (let i in requestedLogin) {
    if (username == requestedLogin[i]) {
      cli.v && console.log(`${username} ended login intent`);
      requestedLogin.splice(i, 1);
    }
  }

  if (!userRequestedLogin) {
    for (let i in loggedInUsers) {
      if (username == loggedInUsers[i]) {
        userLogged = true;
      }
    }


    /* Process commands */
    if (text.substr(0,1) == "/") {
      let recv = text.substring(1).toLowerCase();
      if (userLogged) {
        cli.v && console.log(`Acceso a comandos especiales permitido para ${username}`);
        if (recv.substr(0, 3) == "run") {
          cli.v && console.log(`Running command $ ${text.substring(5)}`);
          response = std.run(text.substring(5));
        } else if (recv.substr(0, 2) == "js") {
          cli.v && console.log(`Running javascript ${text.substring(4)}`);
          try {
            let fd = std.open(".evaling", "w+");
            fd.puts(`${javascriptBotFunctions}${text.substring(4)}`);
            fd.close();
            response = std.run(`node .evaling 2>&1`);
          } catch(err) {
            response = `Error running the code: ${err}`;
          }
        } else if (recv.substr(0, 8) == "shutdown") {
          console.log("Shutdown ordered by " + username);
	  exit(1);
        } else if (recv.substr(0, 4) == "wait") {
          cli.wait = +recv.substring(4);
          cli.v && console.log("Wait time changed to " + cli.wait);
          response = `Changed wait time to ${cli.wait} seconds`;
        } else if (recv.substr(0, 3) == "c++") {
          cli.v && console.log(`Running c++ ${text.substring(5)}`);
          let fd = std.open(".compiling.cpp", "w+");
          fd.puts(`${text.substring(5)}`);
          fd.close();
          response = std.run(`g++ -o .compiled .compiling.cpp 2>&1 && chmod +775 .compiled && ./.compiled`);
        } else if (recv.substr(0, 6) == "python") {
          cli.v && console.log(`Running python ${text.substring(8)}`);
          let fd = std.open(".running.py", "w+");
          fd.puts(`${text.substring(8)}`);
          fd.close();
          response = std.run(`python .running.py 2>&1`);
        }
      }

      switch(recv) {
        case "start":
        case "help":
          response = "Comandos Disponibles:\n/login loggeate con tu contraseña\n/help muestra este mensaje\n";
          if (userLogged) {
            response += "\nComandos Disponibles Para Usuario Loggeado:\n/help muestra este mensaje\n/run comando corre el comando en bash\n/c++ corre el codigo c++\n/js corre el código javascript en un motor node\n/python corre el código python\n/shutdown detiene permanentemente el bot\n/wait segundos cambia la velocidad de espera entre cada ciclo del bot.\n";
          }
        break;

        case "hola":
          response = `Hola ${username} soy un bot escrito en javascript por @StringManolo.`;
        break;

        case "login":
          cli.v && console.log(`${username} requested login`);
          response = `Escribe tu contraseña por privado`;
          requestedLogin.push(username);
        break;

        default:
          if (!response) {
            response = `No se que significa ${recv}...`;
          } else {
            console.log(`RESP:${response}]`);
          }
      }
    }
  }


  if (response) {
    cli.v && console.log(`Respuesta: ${response}\n`);
    let aux = `https://api.telegram.org/bot${cli.token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(response)}`;
    std.run(`curl "${aux}" --silent`);
  }
}


let lastId = 0;
for (let i in apiJson.result) {
  if (apiJson.result[i].message &&
  apiJson.result[i].message.text &&
  apiJson.result[i].update_id &&
  apiJson.result[i].message.from.username &&
  apiJson.result[i].message.chat.id) {
    let text = apiJson.result[i].message.text;
    let updateId = apiJson.result[i].update_id;
    let username = apiJson.result[i].message.from.username;
    let chatId = apiJson.result[i].message.chat.id;
    lastId = updateId;
    process(text, username, chatId);
  }
}

let borrarMensajesApi = () => {
  std.run(`curl https://api.telegram.org/bot${cli.token}/getUpdates?offset=${+lastId + 1} --silent`);
}

borrarMensajesApi();
cli.v && console.log("Bot process end");
}

/* Corre el bot cada 10 segundos */
let i = 0;
for (;;) {
  cli.v && console.log(`Running bot for the ${++i}° time.`);
  bot();
  cli.v && console.log(`Waiting ${(cli.wait || 20)} seconds to save resources.`);
  std.sleep( (cli.wait || 20) * 1000);
}

