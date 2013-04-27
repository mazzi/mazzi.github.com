---
layout: post
title: Playing around with Haproxy
tags: [howto, haproxy]
---

As part of the infrastructure at work, we use [Haproxy](http://haproxy.1wt.euh) as a load balancer and [Nginx](http://nginx.org/) as webserver. Here is a nice layout made with [Gliffy](http://www.gliffy.com) 

<img src="/images/2013/haproxy.png" alt="Network Layout" class="center" />

As a requirement we had the necessity to redirect all the traffic received to only one of our servers depending on the format of the received request. The problem that we had was that all our traffic had to be over a secure connection (HTTPS) so the HTTP message received could not be analyzed because is encrypted.

The latest version of Haproxy (1.5-dev18) supports native SSL. It's not an stable version but does the trick. Following a configuration example.

	listen  https_server
        bind            127.0.0.1:443 ssl crt /etc/haproxy/ssl
        mode            http
        balance         source
        option          abortonclose
        
        option          forwardfor
        option          http-server-close
        option          originalto

In the folder `/etc/haproxy/ssl` we need to copy all of our certificates. Alternatively you can use a specific certificate. To be able to analyze HTTP headers the key here is to specify `mode http`. If we use `mode tcp` (like in a standard https configuration for Haproxy) we are not able to analyze the headers. You must take a peek at the OSI layer model to understand why.

Regarding the balancing, it's quick and easy to configure Haproxy using the `listen` directive instead of `backend` and `fronted` ones. Here's the rest of the configuration in the `listen https_server`.

        # Routing for operation with files
        acl             path01  path_reg        ^/api/upload/(.*)$
        acl             path02  path_reg        ^/api/download/(.*)$
        use-server      srv01 if path01 or path02

        server          srv01 192.168.0.1:8080 weight 1 maxconn 1000 check inter 10000 rise 1 fall 2
        server          srv02 192.168.0.2:8080 weight 1 maxconn 1000 check inter 10000 rise 1 fall 2


It's important not to include `option ssl-hello-chk` to this configuration because if we do so, haproxy will consider them down because of the `rise` and `fall` directives. Haproxy will not bej able to receive an answer status because we are checking HTTP servers instead of HTTPS. 

The `path_reg` directive is not the optimum regarding speed, but it depends on how many requests per second we need to analyze.

For automatic redirection to HTTPS we need to specify another listen directive in Haproxy.

	listen  http_server     127.0.0.1:80
        	redirect scheme https if !{ ssl_fc }

Last but not least, it's important to know that the webservers are now listening for incoming traffic in a non secure way (HTTP). If it's going to receive only requests from Haproxy maybe is a good idea to use the `allow` and `deny all` directives.



