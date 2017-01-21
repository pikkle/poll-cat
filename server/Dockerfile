FROM ubuntu:16.04
MAINTAINER Julien Leroy

RUN apt-get update;\
    apt-get install -y\
    python\
    python-pip\
    python-mysqldb\
    libssl-dev\
    libffi-dev

RUN pip install\
        django\
        djangorestframework\
        django-cors-headers\
        channels

COPY . /root/server

EXPOSE 80:80
EXPOSE 8000:8000

ENTRYPOINT ["/usr/bin/python" ,"/root/server/manage.py", "runserver"]
