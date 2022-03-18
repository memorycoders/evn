#!/bin/bash

GREEN='\033[0;32m'
NC='\033[0m'
echo "${GREEN}============ Starting deployment ============${NC}"
SSH_USERNAME="ubuntu" # Replace your deploy account here
SSH_HOST="13.212.58.171" # Replace your server IP here
SSH_KEY="./evn_dev.pem" #

START=`date +%s`

 ssh -i ${SSH_KEY} ${SSH_USERNAME}@${SSH_HOST} "
  echo '➜ git pull';
  cd /home/ubuntu/evn/evn-frontend;
  sudo git fetch;
  sudo git pull https://huongse7en1312@bitbucket.org/twendee/evn-frontend.git dev;
  sudo npm run build;
  echo '➜ Build done';
";

END=`date +%s`
RUNTIME=$((end - start))
echo "\n${GREEN}✔ 🎉 Done.${NC}\n"
