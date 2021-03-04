# aternos antishutdown bot

**update 04/03/21**: guarenteeed to get you manually banned by a staff member of aternos before your sever ever shuts off 😂

just host this on a free tier GCP instance

```
npm i 

cp .env.example .env # and setup the host at least

sudo ln -s $(realpath antishutdown.service) /etc/systemd/system
# make sure to edit the service file and set user, workingdir and execstart

sudo systemctl enable antishutdown

sudo systemctl start antishutdown
```

