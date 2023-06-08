import express from 'express';
import axios from 'axios';

const app = express();
const port = 18000 || process.env.PORT;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// const discord_host = 'ossprod.jrdaimao.com';
const discord_host = 'cdn.discordapp.com';

app.get('*', async (req, res) => {
    console.log(req.url);
    const response = await axios.get(`https://${discord_host}${req.url}`, { withCredentials: false, responseType: 'stream' });
    response.data.pipe(res);
});

app.listen(port, () => {
    console.log(`服务启动 http://127.0.0.1:${port}`);
});
