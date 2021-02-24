# aternos antishutdown bot

just host this on a free tier GCP instance

```
npm i 

cp .env.example .env # and setup the host at least

sudo ln -s $(realpath antishutdown.service) /etc/systemd/system
# make sure to edit the service file and set user, workingdir and execstart

sudo systemctl enable antishutdown

sudo systemctl start antishutdown
```

