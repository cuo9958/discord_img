#!/bin/bash

git pull

npm run build

pm2 restart discord_img@18000