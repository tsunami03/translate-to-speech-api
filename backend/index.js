const express = require('express');
const app = express();
app.use(express.json())
const path = require('path');
const { synthesize } = require('./text-to-speech');

const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    allowedHeaders: '*',       //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

const port = process.env.PORT || 5000;

app.post('/api/audio', async (req, res) => {
    const { text } = req.body;
    try {
        console.log(text);
        await synthesize(text);
        let filePath = path.join(__dirname, "output.mp3");
        res.sendFile(filePath);
    } catch (err) {
        console.log(err);
    }
})

app.listen(port, () =>
    console.log(`Server is listening on port ${port}...`)
);