import express from 'express';
import axios from 'axios';

const app = express();
const port = 18001 || process.env.PORT;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('*', async (req, res) => {
    const response = await axios({
        url: req.url,
        headers: {
            Authorization: req.headers.authorization,
        },
        withCredentials: false,
        responseType: 'stream',
    });
    response.data.pipe(res);
});

app.post('*', async (req, res) => {
    const response = await axios({
        url: req.url,
        headers: {
            Authorization: req.headers.authorization,
        },
        data: req.body,
        withCredentials: false,
        responseType: 'stream',
    });
    response.data.pipe(res);
});

app.listen(port, () => {
    console.log(`服务启动 http://127.0.0.1:${port}`);
});
