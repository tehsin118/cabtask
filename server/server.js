const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config/config').get(process.env.NODE_ENV);
const app = express();

//mongoose database configurations and connection setup..........
mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, }).then(() => console.log("connected")).catch((err) => console.log(err));

app.use(cors());

require('dotenv').config();
const cabRoutes = require('./routes/cabRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cabRoutes);
app.use(adminRoutes);

app.get("/system-status", (req, res) => {
    return res.json({ status: "Okay!" })
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Example app listening on port:${port}`
    )
})
