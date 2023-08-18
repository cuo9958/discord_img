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
    res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE');
    res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE');

    const modified = req.get('If-Modified-Since');
    console.log(modified);
    if (modified) {
        res.header('Last-Modified', modified);
    }

    const cache_path = path.join(ROOT_PATH, req.url.replace(/\//g, '_'));
    if (image_list.has(req.url)) {
        return fs.createReadStream(cache_path).pipe(res);
    }
    const response = await axios.get(`https://${discord_host}${req.url}`, { withCredentials: false, responseType: 'stream' });
    console.log(response.headers);
    if (response.headers['Last-Modified']) {
        res.header('Last-Modified', response.headers['Last-Modified']);
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
});

app.listen(port, () => {
    console.log(`服务启动 http://127.0.0.1:${port}`);
});
