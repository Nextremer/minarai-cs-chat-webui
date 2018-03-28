FROM ubuntu

RUN apt-get update && apt-get install -y nginx

ADD nginx/s2t2s_sample.conf /etc/nginx/sites-available/
ADD nginx/includes /etc/nginx/includes/
ADD ["nginx/server.crt", "nginx/server.key", "/etc/nginx/"]

RUN ln -s /etc/nginx/sites-available/s2t2s_sample.conf \
          /etc/nginx/sites-enabled/s2t2s_sample.conf \
       && rm /etc/nginx/sites-enabled/default

ADD nginx/run.sh /opt/
RUN chmod a+x /opt/run.sh

CMD ["/opt/run.sh"]
