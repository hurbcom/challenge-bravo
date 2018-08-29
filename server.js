const api = require('./api/api');

const port = process.env.PORT || 3000;

api.listen(port, () => console.log(`This server is running on port ${port}`));