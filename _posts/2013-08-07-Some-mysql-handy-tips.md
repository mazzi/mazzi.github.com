---
layout: post
title: Some MySQL handy tips
tags: [tips, copypaste, mysql]
---

This post is kind of a "copy paste memo" memo for myself.

How to check a `my.cnf` file syntax without restarting the service?

    sudo /opt/mysql/server-5.6/bin/mysqld --help --verbose --skip-networking --pid-file=/tmp/deleteme.pid 1>/dev/null

All the things that appear in the console are useful (of course, syntax errors included).

From mysql 5.6, the syntax to log slow queries and queries that perform full table scans (bad for performance!) changed. Here they are the new options.

    slow-query-log = ON
    slow_query_log_file = /var/log/mysql/mysql-slow.log
    long_query_time = 10
    log_queries_not_using_indexes = ON

Don't forget to do chmod the log file!
