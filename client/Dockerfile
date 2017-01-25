FROM ubuntu:16.04
MAINTAINER Julien Leroy

RUN sed -i -e 's/us.archive.ubuntu.com/archive.ubuntu.com/g' /etc/apt/sources.list;\
    apt-get update;\
    apt-get install -y nodejs npm nginx;\
    ln -s "$(which nodejs)" /usr/bin/node;\
    npm install

COPY src /root/src
COPY pollCat.conf /etc/nginx/conf.d/
COPY tsconfig.json webpack.config.js package.json /root/

RUN cd /root;\
    npm install;\
    npm run prod;\
    cp -R /root/dist /var/www/;\
    cp /root/airShootWeb.conf /etc/nginx/conf.d/;\
    rm -R /etc/nginx/sites-enabled

EXPOSE 8080:80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
