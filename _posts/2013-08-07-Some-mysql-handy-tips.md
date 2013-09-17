---
layout: post
title: Some MySQL handy tips
tags: [tips, copypaste, mysql]
---

This post is kind of a "copy paste memo" to myself. Oldies but goldies.

How to check a `my.cnf` file syntax without restarting the service?

    sudo /opt/mysql/server-5.6/bin/mysqld --help --verbose --skip-networking --pid-file=/tmp/deleteme.pid 1>/dev/null

All the things that appear in the console are useful (of course, syntax errors included).

From mysql 5.6, the syntax to log slow queries and queries that perform full table scans (bad for performance!) changed. Here they are the new options.

    [mysqld]
    slow-query-log = ON
    slow_query_log_file = /var/log/mysql/mysql-slow.log
    long_query_time = 10
    log_queries_not_using_indexes = ON

Don't forget to do chmod the log file!

This settings can also be changed without restarting the service in mysql versions bigger than 5.3 (you probably want to do that on a live system). To do that, execute the following commands using a mysql client.

	SET @@GLOBAL.long_query_time=1;
	SET @@GLOBAL.log_queries_not_using_indexes = 'ON';
	SET @@GLOBAL.slow_query_log_file ='/var/log/mysql/slow-query.log';

To check that the settings that we just changed have succeeded:

	SHOW GLOBAL VARIABLES LIKE "%slow%";
	SHOW GLOBAL VARIABLES LIKE "%long%";

Finally, the log is being activated.

	SET @@GLOBAL.slow_query_log = 'ON';

How to analyze and optimize SQL queries is a subject for another post ;)