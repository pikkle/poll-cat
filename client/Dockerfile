FROM ubuntu:16.04
MAINTAINER Julien Leroy

RUN apt-get update;\
    apt-get install -y nginx

COPY ./dist /var/www/dist
COPY pollCat.conf /etc/nginx/conf.d/

RUN rm -R /etc/nginx/sites-enabled

EXPOSE 8080:80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
