---
layout: post
title: Nginx alias, virtual hosts and debugging
tags: [tips, copypaste, nginx]
---

Searching on [The Internets](http://en.wikipedia.org/wiki/Internets) about "How to configure one virtual host in nginx with multiple subdirs" I found a lot of different answers (mostly wrong or misconfigured) so I decided to write some (more) on my humble blog.

What's the objective of the configuration? Being able to serve different folders under the same virtual host.

	www.domain.com               == served in ==>   /srv/htdocs/domain.com/
	www.domain.com/folder01/     == served in ==>   /srv/htdocs/deployment01/
	www.domain.com/folder02/     == served in ==>   /srv/htdocs/deployment02/

The most common solution for this scenario would be changing the `root` under different `location` directives. This could lead to different problems; especially knowing that Nginx processes virtual hosts configuration files from top to bottom. If some other location relies on the `root` value and we change it after the first definition we are not going to get the desired result (global variables anyone?).

What's the solution then? Using the `alias` directive.

	server {
	    listen      80;
	    server_name www.domain.com;
	    root        /srv/htdocs/domain.com;
	    set         $alternate_folder01 /srv/htdocs/deployment01

	    location /
	    {
	       index index.html index.htm index.php;
	    }

	    location ~ /folder01/(.*)$
	    {
	        alias $alternate_folder01/index.php;

	        rewrite "^/folder01/(.*)$"      /folder01/index.php?$1;

	        include       /etc/nginx/fastcgi_params;

	        fastcgi_pass  127.0.0.1:9000;
	        fastcgi_index index.php;
	        fastcgi_param SCRIPT_FILENAME $request_filename;

	        break;
	    }

We also need to change the way that `fastcgi_parm SCRIPT_FILENAME` is called. It's important to use `$request_filename` instead of `$document_root/$fastcgi_script_name` (It's the most common error when using alias).

In the example I used a variable called `$alternate_folder01`. This is the best way to keep the configuration modular and easy to read/configure if we have several sublocations added to that location later on.

One of the best ways of debugging the variables (and other stuff) in Nginx is to install [HttpEchoModule](http://wiki.nginx.org/HttpEchoModule). It's so easy to debug like doing this:

	 	location ~ /folder01/(.*)$
	    {
	        alias /srv/htdocs/deployment01/index.php;

	        rewrite "^/folder01/(.*)$"      /folder01/index.php?$1;

	        include       /etc/nginx/fastcgi_params;

	        fastcgi_pass  127.0.0.1:9000;
	        fastcgi_index index.php;
	        fastcgi_param SCRIPT_FILENAME $request_filename;

	        echo $uri

	        break;
	    }

To see the results it's better to use `curl` instead of a normal browser (we get rid of caches, cookies, whatever). You'll receive as an answer the $uri variable and also you are going to be sure where your request was processed.

	curl http://www.domain.com/folder01/

Probably you need to complile `HttpEchoModule` for Nginx (like I had to). But beleive me, it is worth it.