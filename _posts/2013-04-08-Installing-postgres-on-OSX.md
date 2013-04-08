---
layout: post
title: Installing postgres on OSX
tags: [howto, postgres]
---

Installing a project from a friend made with Rails I figured out that was using [postgres](http://www.postgresql.org/) and I didn't have it installed on my OSX. I found a couple of problems that I'll describe here (and how to solve them of course).

First of all, to install postgres using brew:

	brew install postgres

After the installation, is a good idea to create the first database

    initdb /usr/local/var/postgres

 Usually on default installations of OSX the following error appears:

	creating template1 database in /usr/local/var/postgres ...
	FATAL: could not create shared memory segment: Cannot allocate memory
	DETAIL: Failed system call was shmget(key=1, size=1318912, 03600).
	HINT: This error usually means that PostgreSQL's request for a shared memory segment exceeded available memory or swap space. To reduce the request size (currently 1318912 bytes), reduce PostgreSQL's shared_buffers parameter (currently 50) and/or its max_connections parameter (currently 10).
	The PostgreSQL documentation contains more information about shared memory configuration.
	child process exited with exit code 1
	initdb: removing contents of data directory "data"

This happens because the desktop installation of OSX is not configured to have enough shared memory to run postgres. 

Try executing this command to check your settings:

	sysctl -a

You can configure this by modifying kernel parameters, running the following as root: 

	sysctl -w kern.sysv.shmmax=1610612736
	sysctl -w kern.sysv.shmmin=1
	sysctl -w kern.sysv.shmmni=32
	sysctl -w kern.sysv.shmseg=8
	sysctl -w kern.sysv.shmall=393216
	sysctl -w kern.maxprocperuid=512
	sysctl -w kern.maxproc=2048

Or adding the kern.* parameters to `/etc/sysctrl.conf` permanently. You can find some related information [in the apple knowledge base](http://support.apple.com/kb/HT4022).

You need to reboot to reflect the changes.

Now after executing again the database creation command everything should be ok. Nice moment then to create a new user.

	createuser --interactive postgres

Another alternative command to create a databse could be the following:

	createdb -Opostgres -Eutf8 db_development

More on postgres on the following posts...

