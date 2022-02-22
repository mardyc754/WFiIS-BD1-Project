const app = require('./app');

const port = 34343;

app.listen(process.env.PORT || port, () => {
  console.log(`Server listening on port ` + port);
});