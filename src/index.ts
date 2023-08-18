import express from 'express';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream';

const app = express();
const port = 18000 || process.env.PORT;
const image_list = new Set();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// const discord_host = 'ossprod.jrdaimao.com';
const discord_host = 'cdn.discordapp.com';

const ROOT_PATH = path.join(process.cwd(), '.images');

if (!fs.existsSync(ROOT_PATH)) {
    fs.mkdirSync(ROOT_PATH);
}
app.get('*', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE');
    res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE');

    const modified = req.headers['if-modified-since'];
    if (modified) {
        res.header('last-modified', modified);
        res.status(304);
        return;
    }

    const cache_path = path.join(ROOT_PATH, req.url.replace(/\//g, '_'));
    if (image_list.has(req.url)) {
        return fs.createReadStream(cache_path).pipe(res);
    }
    try {
        const response = await axios.get(`https://${discord_host}${req.url}`, { withCredentials: false, responseType: 'stream' });
        if (response.headers['last-modified']) {
            res.header('last-modified', response.headers['last-modified']);
        }
        response.data.pipe(res);
        pipeline(response.data, fs.createWriteStream(cache_path), (error) => {
            if (error) {
                console.log('请求失败', req.url);
                res.send('失败');
            } else {
                image_list.add(req.url);
            }
        });
    } catch (error) {
        console.log('请求失败', req.url);
        res.send('失败');
    }
});

app.listen(port, () => {
    console.log(`服务启动 http://127.0.0.1:${port}`);
});
