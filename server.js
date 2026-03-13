const app = require('./src/app');
const { port } = require('./src/config');

app.listen(port, () => {
  console.log(`Threadline API running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
});