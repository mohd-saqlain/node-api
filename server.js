const express = require('express')
const cors = require('cors')
const app = express();
const port = 3000;
require('./db/connect')
app.use(express.json())
app.use(cors())


app.use(require('./routes/loyalty'))

app.listen(port);