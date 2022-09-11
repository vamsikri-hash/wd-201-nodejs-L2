const http = require("http");
const fs = require("fs");
const readline = require("readline");

const args = process.argv;

let homeContent = "";
let projectContent = "";

fs.readFile("home.html", (err, home) => {
  if (err) {
    throw err;
  }
  homeContent = home;
});

fs.readFile("project.html", (err, project) => {
  if (err) {
    throw err;
  }
  projectContent = project;
});

const getPort = (args, defaultPort) => {
  const portArg = args.at(2);
  let port;
  if (portArg) {
    const portNum = portArg.split("=").at(1);
    if (portNum) {
      port = parseInt(portNum);
    } else {
      console.log(
        `Port arg not supplied correctly ! Using default port - ${portNum}`
      );
      port = defaultPort;
    }
  } else {
    console.log(
      `No port argument supplied ! Using default port - ${defaultPort}`
    );
    port = defaultPort;
  }
  return port;
};

const PORT = getPort(args, 3000);

http
  .createServer((request, response) => {
    let url = request.url;
    response.writeHeader(200, { "Content-Type": "text/html" });
    switch (url) {
      case "/project":
        response.write(projectContent);
        response.end();
        break;
      case "/registration":
        const stream = fs.createReadStream("./registration.html");
        stream.on("error", (err) => {
          response.write(
            `<h2>Provided path is invalid !, Please provide right path</h2>`
          );
          response.end();
        });
        stream.pipe(response);
        break;
      default:
        response.write(homeContent);
        response.end();
        break;
    }
  })
  .listen(PORT, () => {
    console.log(`Server started... Please visit localhost:${PORT}`);
  });
