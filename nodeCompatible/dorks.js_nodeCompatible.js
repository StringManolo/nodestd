const std = require("./std").std()


/* let run = command => {
  let p = std.popen(command, "r"),
  msg = "",
  r = "";
  while(( r = p.getline() ) != null) {                              msg += r + "\n";
  }
  return msg;
} */

let cli = {};
cli.COLORS = {
  RED: "\x1b[31m",
  RESET: "\x1b[0m",
  YELLOW:"\x1b[33m",
  BLUE: "\x1b[34m",
  GREEN: "\x1b[32m"
};

for (let i in scriptArgs) {
switch(scriptArgs[i]) {                                             case "-b":
    case "--backup-files":
      cli.backupFiles = true;
    break;
                                                                    case "-c":
    case "--config-files":
      cli.configFiles = true;
    break;

    case "-d":
    case "--directory-listing":
      cli.directoryListing = true;
    break;

    case "-e":
    case "--exposed-databases":
      cli.exposedDatabases = true;
    break;

    case "-g":
    case "--git":
      cli.git = true;
    break;

    case "-l":
    case "--log":
      cli.logFiles = true;
    break;

    case "-L":
    case "--login-urls":
      cli.loginUrls = true;
    break;

    case "-n":
    case "--number":
      cli.number = true;
    break;

    case "-p":
    case "--public-documents":
      cli.publicDocuments = true;
    break;

    case "-P":
    case "--php-errors":
      cli.phpErrors = true;
    break;

    case "--php-info":
      cli.phpInfo = true;
    break;

    case "--pastes":
      cli.pastes = true;
    break;

    case "-s":
    case "--source":
      cli.source = true;
    break;

    case "-S":
    case "--sql-errors":
      cli.sqlErrors = true;
    break;

    case "--stackoverflow":
      cli.stackoverflow = true;
    break;

    case "-t":
    case "--target":
      cli.target = encodeURIComponent(scriptArgs[+i + +1]);
    break;

    case "-v":
    case "--view":
      cli.view = true;
    break;

    case "-h":
    case "--help":
      console.log(`

usage: qjs dorks [options]
  -b  --backup-files         .bkf, .bkp, .bak, .old, .backup

  -c  --config-files         .xml, .conf, .cnf, .reg, .inf, .rdp, .cfg, .txt, .ora, .ini, .env

  -d  --directory-listing    index of dir list

  -e  --exposed-databases    .sql, .dbf, .mdb

  -g  --git                  github.com, gitlab.com

  -h  --help                 this message

  -l  --log                  .log

  -L  --login-urls           login in url

  -n  --number               phone numbers

  -p  --public-documents     .doc, .docx, .odt, .rtf, .sxw, .psw, .ppt, .pptx, .pps, .csv

  -P  --php-errors           .php errors in document

      --pastes               pastebin.com, paste2.org, pastehtml.com, slexy.org, snipplr.com, snipt.net, textsnip.com, bitpaste.app, justpaste.it, heypasteit.com, hastebin.com, dpaste.org, dpaste.com, codepad.org, jsitor.com, codepen.io, jsfiddle.net, dotnetfiddle.net, phpfiddle.org, ide.geeksforgeeks.org, repl.it, ideone.com, paste.debian.net, paste.org, paste.org.ru, codebeautify.org, codeshare.io, trello.com

      --php-info             .php info files

  -s  --source               source code of target

  -S  --sql-errors           sql syntax errors in document

      --stackoverflow        stackoverflow.com

  -t  --target               Your target. Can be a domain, a full url, etc. Based on the arguments of your chose.

  -v  --view                 text representation of the target.


`);
  std.exit(0);
  }
}

let checkResults = res => {
  /* Check if connection error */

  /* Check if captcha */
    /* Use good proxy chain list to evade captcha */
    /* Instruct user to evade if dynamic ip */

  /* Check if not found */
  if (new RegExp("ningún resultado. Sugerencias: ", "gim").test(res.replace(/\n/gm, " "))) {
    console.log( `${cli.COLORS.GREEN}Everything fine but nothing found.${cli.COLORS.RESET}`);
    exit(1);
  } else {
    console.log(res);
  }

  /* check if more than one page of results */
}

if (!cli.target) {
  console.log(`Missing target.
  write ${cli.COLORS.RED}qjs dorks --help${cli.COLORS.RESET} to show usage.
  `);
  exit(1);
}

if (cli.backupFiles) {
  checkResults(std.run(`lynx --dump 'https://www.google.com/search?q=site:${cli.target}+ext:bkf+|+ext:bkp+|+ext:bak+|+ext:old+|+ext:backup'`));
}

else if (cli.configFiles) {
  checkResults(std.run(`lynx --dump 'https://www.google.com/search?q=site:${cli.target}+ext:xml+|+ext:conf+|+ext:cnf+|+ext:reg+|+ext:inf+|+ext:rdp+|+ext:cfg+|+ext:txt+|+ext:ora+|+ext:ini+|+ext:env'`));
}

else if (cli.directoryListing) {
  checkResults(std.run(`lynx --dump 'https://www.google.com/search?q=site:${cli.target}+intitle:index.of'`));
} else if (cli.exposedDatabases) {
  checkResults(std.run(`lynx --dump 'https://www.google.com/search?q=site:${cli.target}+ext:sql+|+ext:dbf+|+ext:mdb'`));
}

else if (cli.exposedDatabases) {
  checkResults(std.run(`lynx --dump 'https://www.google.com/search?q=site:${cli.target}+intext:'"'"'sql syntax near'"'"'+|+intext:'"'"'syntax error has occurred'"'"'+|+intext:'"'"'incorrect syntax near'"'"'+|+intext:'"'"'unexpected end of SQL command'"'"'+|+intext:'"'"'Warning: mysql_connect()'"'"'+|+intext:'"'"'Warning: mysql_query()'"'"'+|+intext:'"'"'Warning: pg_connect()'"'"''`));
}

else if (cli.git) {
  checkResults(std.run(`lynx --dump 'https://www.google.com/search?q="${cli.target}"+site:github.com+|+site:gitlab.com'`));
}

else if (cli.logFiles) {
  checkResults(std.run(`lynx --dump 'https://www.google.com/search?q=site:${cli.target}+ext:log'`));
}

else if (cli.loginUrls) {
  checkResults(std.run(`lynx --dump 'https://www.google.com/search?q=site:${cli.target}+inurl:login+|+inurl:ingresar'`));
}

else if (cli.number) {
  checkResults(std.run(`lynx --dump 'https://www.google.com/search?q=site:${cli.target}+intext:'"'"'phone number'"'"''`));
}

else if (cli.publicDocuments) {
  checkResults(std.run(`lynx --dump 'https://www.google.com/search?q=site:${cli.target}+ext:doc+|+ext:docx+|+ext:odt+|+ext:rtf+|+ext:sxw+|+ext:psw+|+ext:ppt+|+ext:pptx+|+ext:pps+|+ext:csv'`));
}

else if (cli.pastes) {
  checkResults(std.run(`lynx --dump 'https://www.google.com/search?q=${cli.target}+site:pastebin.com+|+site:paste2.org+|+site:pastehtml.com+|+site:slexy.org+|+site:snipplr.com+|+site:snipt.net+|+site:textsnip.com+|+site:bitpaste.app+|+site:justpaste.it+|+site:heypasteit.com+|+site:hastebin.com+|+site:dpaste.org+|+site:dpaste.com+|+site:codepad.org+|+site:jsitor.com+|+site:codepen.io+|+site:jsfiddle.net+|+site:dotnetfiddle.net+|+site:phpfiddle.org+|+site:ide.geeksforgeeks.org+|+site:repl.it+|+site:ideone.com+|+site:paste.debian.net+|+site:paste.org+|+site:paste.org.ru+|+site:codebeautify.org +|+site:codeshare.io+|+site:trello.com'`));
}

else if (cli.phpErrors) {
  checkResults(std.run(`lynx --dump 'https://www.google.com/search?q=site:${cli.target}+'"'"'PHP Parse error'"'"'+|+'"'"'PHP Warning'"'"'+|+'"'"'PHP Error'"'"''`));
}

else if (cli.phpInfo) {
  checkResults(std.run(`lynx --dump 'https://www.google.com/search?q=site:${cli.target}+ext:php+intitle:phpinfo+'"'"'published by the PHP Group'"'"''`));
}

else if (cli.source) {
  console.log(std.run(`lynx --source ${decodeURIComponent(cli.target)}`));
}

else if (cli.sqlErrors) {
  checkResults(std.run(`lynx --dump 'https://www.google.com/search?q=site:${cli.target}+intext:'"'"'sql syntax near'"'"'+|+intext:'"'"'syntax error has occurred'"'"'+|+intext:'"'"'incorrect syntax near'"'"'+|+intext:'"'"'unexpected end of SQL command'"'"'+|+intext:'"'"'Warning: mysql_connect()'"'"'+|+intext:'"'"'Warning: mysql_query()'"'"'+|+intext:'"'"'Warning: pg_connect()'"'"''`));
}

else if (cli.stackoverflow) {
  checkResults(std.run(`lynx --dump 'https://www.google.com/search?q=${cli.target}+site:stackoverflow.com'`));
}

else if (cli.view) {
  console.log(std.run(`lynx --dump '${decodeURIComponent(cli.target)}'`));
}

else {
  console.log(`Missing argument. You need at least 1 argument more.
  write ${cli.COLORS.RED}qjs dorks --help${cli.COLORS.RESET} to show usage.

  `);
  exit(1);
}
