#!/bin/bash -e

perl -i -ple 's/localhost/'${TOSABEN_NODE_PORT_3000_TCP_ADDR}'/g' \
     /etc/nginx/sites-available/s2t2s_sample.conf

/usr/sbin/nginx -g "daemon off;" -c /etc/nginx/nginx.conf
