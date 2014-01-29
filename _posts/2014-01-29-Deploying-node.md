---
layout: post
title: Deploying node 
tags: [tips, copypaste, node, nginx, deploy]
---

All good. You wrote your first [node](http://nodejs.org/) app using [express](http://expressjs.com/) as your web application framework and everything looks amazing locally. Now the big question: how we deploy this live?

First of all, I had to do it in a [DigitalOcean](http://www.digitalocean.com) VPS using Ubuntu 12.04 TLS, so my first idea was to install node using `apt-get install nodejs`. No problems at all, except that was an extremely old version. Node ecosystem is changing day by day so if you are not aware of that you can end with an edge version in development and a stable in production. To get then the latest version, I suggest to use [Chris Lea's repository](https://launchpad.net/~chris-lea/+archive/node.js/)

	$ sudo apt-get install python-software-properties 
	$ sudo apt-add-repository ppa:chris-lea/node.js
 	$ sudo apt-get update
 	$ sudo apt-get install nodejs

So far, so good. Next will be install [npm](https://npmjs.org), the node package manager with `apt-get install npm`.

Your node + express app will have a `package.json` file with all the project dependencies. In a good day doing `npm install` in your project root folder will be enough. `npm` on ubuntu has a differnt way to handle source repositories, so to be able to download all the dependencies we need to change an npm configuration setting. 

	npm config set registry http://registry.npmjs.org

The above command will tell npm were to go to download dependencies then. Re-executing `npm install` will download then all the dependencies.

Fair enough. Our application will be running without problems at this point. Now is time to configure nginx to serve the app.

When using node + express, executing `node app.js` in the project root folder will be enough to server the app in `http://localhost:3000`. Now we need to do the same but as a service in our Ubuntu box. For this task I've used `upstart`. Creating an file `/etc/init/myapp.conf` with the following content will do the trick.

	description     "My Express App"

	env HOME=/var/www/myexpressapp

	start on runlevel [2345]
	stop on runlevel [!2345]

	respawn

	env NODE_ENV=production
	exec start-stop-daemon --start --umask 000 --exec /usr/bin/node -- /var/www/myexpressapp/app.js >>/var/log/myexpressapp.sys.log

It's important to execute `env NODE_ENV=production` so the express app is able to run in production with different setting than development. In some `upstart` versions this command is not compatible. Excecuting then `service myapp start` will start the service.

Finally, we can create a virtual host in nginx to serve the app to the ouside world in a good way.

    upstream nodejs {
          server 127.0.0.1:3000 max_fails=0; 
    } 
	server { 
      server_name mynodeapp.com; 

      add_header Strict-Transport-Security max-age=500; 

      location / { 
        proxy_pass  http://nodejs; 
        proxy_redirect off; 
        proxy_set_header Host $host ; 
        proxy_set_header X-Real-IP $remote_addr ; 
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for ; 
        proxy_set_header X-Forwarded-Proto https; 
      } 
   }

Like this, nginx is acting as a proxy with the express service.
Do not forget to set up logs at nginx level to see what's going on!

