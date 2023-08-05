require('dotenv').config()
const app = require('./src/main.js');

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));