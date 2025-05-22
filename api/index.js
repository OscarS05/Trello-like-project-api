const { config } = require('./config/config');
const createApp = require('./app');

const port = config.port || 3000;
const app = createApp();

app.listen(port, () => {
  console.info(`Server run in PORT: ${port}`);
});
