const path = require("node:path");
const { createServer } = require("./src/app");

const port = Number(process.env.PORT || 3030);
const dataDir = path.join(__dirname, "data");
const publicDir = path.join(__dirname, "prototype");

const server = createServer({ dataDir, publicDir });

if (require.main === module) {
  server.listen(port, () => {
    const url = `http://localhost:${port}/`;
    console.log(`Сервер запущен: ${url}`);
    console.log(`Откройте сайт в браузере: ${url}`);
  });
}

module.exports = {
  server
};
