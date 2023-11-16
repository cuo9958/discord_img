import express from 'express';
import axios from 'axios';

const app = express();
const port = 18001 || process.env.PORT;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('*', async (req, res) => {
    console.log('请求', 'https://api.openai.com' + req.url);
    const response = await axios({
        url: 'https://api.openai.com' + req.url,
        headers: {
            Authorization: req.headers.authorization,
        },
        withCredentials: false,
        responseType: 'stream',
    });
    response.data.pipe(res);
});

app.post('*', async (req, res) => {
    console.log('请求', 'https://api.openai.com' + req.url);
    console.log('参数', req.body);
    const response = await axios.post('https://api.openai.com' + req.url, req.body, {
        headers: {
            Authorization: req.headers.authorization,
        },
        withCredentials: false,
        responseType: 'stream',
    });
    response.data.pipe(res);
});

app.listen(port, () => {
    console.log(`服务启动 http://127.0.0.1:${port}`);
});
