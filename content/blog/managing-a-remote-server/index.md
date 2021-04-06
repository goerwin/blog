---
tags: [technology, unix, server]
title: Managing a remote server
description: Useful commands for managing a remote server
date: 2020-04-24
---

Useful commands for managing a remote server and viceversa

```sh
# copy paste a file from a local machine to a remote machine
scp /path/to/file username@host:/var/www/mywebsite/html/

# copy paste a folder from a local machine to a remote machine
scp -r /path/to/folder username@host:/var/www/mywebsite/html/

# execute a command on a remote machine
ssh username@host 'rm -rf /var/www/mywebsite/html'
```
