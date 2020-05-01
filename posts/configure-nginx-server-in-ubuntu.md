---
tags: [technology, unix, server, nginx]
title: Configure Nginx server in Ubuntu
description: Configure Nginx server in Ubuntu
date: 2020-05-01
---

| Note: If you want the one liner, [One Liner](#one-liner)

Make sure you have no `/etc/nginx` folder and if you do, remove any `Nginx` instance you may have in your system with:

```sh
$ sudo apt-get remove nginx nginx-common
$ sudo apt-get purge nginx nginx-common
$ sudo apt-get autoremove
rm -rf /etc/nginx
```

Install Nginx:

```sh
$ sudo apt update
$ sudo apt install nginx
```

Now you need to configure the Firewall to allow access to Nginx. Since we don't have SSL yet, let's just give access to `Nginx HTTP`:

```sh
$ sudo ufw allow 'Nginx HTTP'

# Now you should see it active
$ sudo ufw status
```

At this point, the `Nginx` server should be up running in the system, verify by checking its status in the systemctl:

```sh
$ systemctl status nginx
```

Also, you can verify it if you see the Nginx welcome page by hitting any of the IPs:

```sh
$ ip addr show eth0 | grep inet | awk '{ print $2; }' | sed 's/\/.*$//'
```

## Managing the Nginx Process

```sh
# Stop the web server
$ sudo systemctl stop nginx

# Start the web server when it is stopped
$ sudo systemctl start nginx

# To stop and then start the service again
$ sudo systemctl restart nginx

# Reload without dropping connections
$ sudo systemctl reload nginx

# By default, Nginx is configured to start automatically when the
# server boots. To disable this behavior
$ sudo systemctl disable nginx

# Re-enable the service to start up at boot
$ sudo systemctl enable nginx
```

## Setting up multiple domains/subdomains

Nginx in Ubuntu, creates the folders `/etc/nginx/sites-enabled` and `/etc/nginx/sites-available`. The `sites-available` is meant for all your site's Nginx configs and where you can modify them. `sites-enabled` is only meant to be Symlinks of the sites you actually want to make public and, by no means, edit files in this folder.

You can create as many sites as you want, following the next steps:

```sh
$ sudo mkdir -p /var/www/example.com/html

# assign ownership of the directory with the $USER environment variable
$ sudo chown -R $USER:$USER /var/www/example.com/html

# Make sure permissions are correct
$ sudo chmod -R 766 /var/www/example.com

# Create a simple html page
$ sudo nano /var/www/example.com/html/index.html
```

Now that you have finished with the folder for your website, let's create the Nginx config for this example.com:

```sh
$ sudo rm -rf /etc/nginx/sites-enabled/example.com
$ sudo nano /etc/nginx/sites-available/example.com
```

and paste in the following config (which will also handle redirects from non-www to www):

```sh
server {
    listen       80;
    server_name  example.com;
    return       301 $scheme://www.example.com$request_uri;
}

server {
    listen 80;
    listen [::]:80;

    root /var/www/example.com/html;
    index index.html;

    server_name www.example.com;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Now, we can enable this site:

```sh
$ sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
```

To avoid memory leak problems, go to:

```sh
$ sudo nano /etc/nginx/nginx.conf
```

And uncomment the `server_names_hash_bucket_size` directive.

Now, verify all configs have no syntax errors and restart Nginx:

```sh
$ sudo nginx -t
$ sudo systemctl restart nginx
```

## One liner

- Modify `_SITENAME` with the one you want and copy paste in the terminal
- Modify `_IF_DOMAIN_REDIRECT_NON_WWW_TO_WWW` to true if you have a domain name (no subdomain, eg: example.com)
  and want to redirect example.com to www.example.com
- Modify `_RESTART_NGINX_SERVER` if you want to restart the Nginx server
- Note: this will remove the dir at `"$_WWW_FOLDER$_SITENAME"`

```sh
_SCRIPT=$(sudo cat <<'EOF'
_SITENAME='blog.example.com'
_IF_DOMAIN_REDIRECT_NON_WWW_TO_WWW=false
_RESTART_NGINX_SERVER=false
_WWW_FOLDER=/var/www/

sudo rm -rf $_WWW_FOLDER$_SITENAME
sudo mkdir -p $_WWW_FOLDER$_SITENAME/html

# assign ownership of the directory with the $USER environment variable
sudo chown -R $USER:$USER $_WWW_FOLDER$_SITENAME/html

# Make sure permissions are correct
sudo chmod -R 777 $_WWW_FOLDER$_SITENAME

# Create a simple html page
echo "$_SITENAME page" | sudo tee $_WWW_FOLDER$_SITENAME/html/index.html > /dev/null

# Create config file
_CONFIG_FILE="server {
    listen 80;
    listen [::]:80;

    root $_WWW_FOLDER$_SITENAME/html;
    index index.html;

    server_name $_SITENAME;

    location / {
        try_files \$uri \$uri/ =404;
    }
}"

if [ "$_IF_DOMAIN_REDIRECT_NON_WWW_TO_WWW" = "true" ] ; then
  _CONFIG_FILE="server {
    listen       80;
    server_name  $_SITENAME;
    return       301 \$scheme://www.$_SITENAME\$request_uri;
}

server {
    listen 80;
    listen [::]:80;

    root $_WWW_FOLDER$_SITENAME/html;
    index index.html;

    server_name www.$_SITENAME;

    location / {
        try_files \$uri \$uri/ =404;
    }
}"
fi

echo "$_CONFIG_FILE" | sudo tee /etc/nginx/sites-available/$_SITENAME > /dev/null

# Enable site
sudo rm -rf /etc/nginx/sites-enabled/$_SITENAME
sudo ln -s /etc/nginx/sites-available/$_SITENAME /etc/nginx/sites-enabled/

# Verify Config
sudo nginx -t

# Restart server
if [ "$_RESTART_NGINX_SERVER" = "true" ] ; then
    sudo systemctl restart nginx
fi
EOF
) && eval $_SCRIPT
```
