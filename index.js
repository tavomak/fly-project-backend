const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/db');

const app = express();

dbConnect();
app.use(express.json({ extended: true }))

const PORT = process.env.PORT || 4000;
app.use(cors());

app.use('/api/user', require('./routes/user'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/accounts', require('./routes/account'));
app.use('/api/projects', require('./routes/project'));
app.use('/api/tasks', require('./routes/task'));

app.listen(PORT, () => console.log(`Server up in ${PORT} port`))