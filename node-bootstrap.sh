#!/usr/bin/env bash

# Get root up in here
sudo su

# Just a simple way of checking if we need to install everything
if [ ! -d "/var/www" ]
then
    # Add MongoDB to apt
    apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
    echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/10gen.list

    # Update and begin installing some utility tools
    apt-get -y update
    apt-get install -y python-software-properties
    apt-get install -y vim git subversion curl
    apt-get install -y memcached build-essential

    # Add nodejs repo
    add-apt-repository -y ppa:chris-lea/node.js
    apt-get -y update

    # Install nodejs
    apt-get install -y nodejs

    # Install latest stable version of MongoDB
    apt-get install -y mongodb-10gen

    # Add all your deps
	npm install -g keystone
	npm install -g express
	npm install -g jade
	npm install -g cloudinary
	npm install -g marked
	npm install -g embedly
	npm install -g mv
    
    # Symlink our host to the guest /var folder
    ln -s /vagrant /var

    # Victory!
    echo "You're all done! Your default node server should now be listening on http://10.0.33.34/. For code, see: node-mongo-vagrant/www/default/server.js."

    # Run it
    node /var/keystone.js
fi
