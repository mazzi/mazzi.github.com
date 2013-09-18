---
layout: post
title: Profiling PHP with Facebook xhprof
tags: [php, profiling, facebook, xhprof]
---

To improve speed of our sites (or scripts) we need to detect bottlenecks. How we can accomplish that? profiling. What's profiling? It's form of dynamic programing that analyzes and measures different aspects of software like memory usage, time, cyclomatic complexity, usage of functions and other useful metrics. Without metrics we cannot see improvement.

As a long time user of Zend extension Xdebug I wanted to try something different. With a little bit of research I found Facebook Zend extension XHprof and I must say that is an excellent tool.

The installation was straight away. You need to compile the module and add it to your php.ini file.

What's next then? Just configure your application to load the extension if it's available. Something like this...

	if ( extension_loaded ( 'xhprof' ) )
	{
    	include_once '/usr/share/php/xhprof_lib/utils/xhprof_runs.php';
    	include_once '/usr/share/php/xhprof_lib/utils/xhprof_lib.php';
    
    	xhprof_enable ( XHPROF_FLAGS_CPU + XHPROF_FLAGS_MEMORY );
    
    	Logger::info ( "Profiler ENABLED" );
	}

Now, choose your favourite HTTP server (Apache, Nginx, whatever) and configure the UI that is provided with Xhprof. In there, there's a list of all the existing runs that were executed. Basically one for each HTTP request in this example.

<img src="/images/2013/2013-09-16-sample-flat-view.jpg" alt="Network Layout" class="center" />

In the flat view, there is values for each method/function call with the ammount of them, processor and memory usage. I'm more a photographic person, so I prefer to see a callgraph of these values.

<img src="/images/2013/2013-09-16-sample-callgraph-image.jpg" alt="Network Layout" class="center" />

In red and yellow are being displayed critial function calls in terms of memory, cpu usage and ammount of calls. Useful for detecting low performance in algorithms.

But what's so good in comparission with the original zend extension? I found this extension way more easy to use (it's just a virtual host in your dev environment) and can be easily integrated in a test enviroment so the whole team can see the results. In my experience saved a lot of headaches when optimizing concrete algorithms. Give it a try.