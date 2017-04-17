FROM openjdk:8-jre
# grab gosu for easy step-down from root
ENV GOSU_VERSION 1.7
RUN set -x \
	&& wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture)" \
	&& wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture).asc" \
	&& export GNUPGHOME="$(mktemp -d)" \
	&& gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 \
	&& gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu \
	&& rm -r "$GNUPGHOME" /usr/local/bin/gosu.asc \
	&& chmod +x /usr/local/bin/gosu \
	&& gosu nobody true

# https://artifacts.elastic.co/GPG-KEY-elasticsearch
RUN apt-key adv --keyserver ha.pool.sks-keyservers.net --recv-keys 46095ACC8548582C1A2699A9D27D666CD88E42B4


#### install ELasticsearch
# https://www.elastic.co/guide/en/elasticsearch/reference/current/setup-repositories.html
# https://www.elastic.co/guide/en/elasticsearch/reference/5.0/deb.html
RUN set -x \
  && apt-get update && apt-get install -y --no-install-recommends apt-transport-https sudo && rm -rf /var/lib/apt/lists/* \
	&& echo 'deb https://artifacts.elastic.co/packages/5.x/apt stable main' > /etc/apt/sources.list.d/elasticsearch.list

ENV ELASTICSEARCH_VERSION 5.3.0

RUN set -x \
  # don't allow the package to install its sysctl file (causes the install to fail)
  # Failed to write '262144' to '/proc/sys/vm/max_map_count': Read-only file system
  && dpkg-divert --rename /usr/lib/sysctl.d/elasticsearch.conf \
  && apt-get update \
  && apt-get install -y --no-install-recommends elasticsearch=$ELASTICSEARCH_VERSION \
  && rm -rf /var/lib/apt/lists/*

ENV PATH /usr/share/elasticsearch/bin:$PATH

WORKDIR /usr/share/elasticsearch

RUN set -ex \
  && for path in \
    ./data \
    ./logs \
    ./config \
    ./config/scripts \
  ; do \
    mkdir -p "$path"; \
    chown -R elasticsearch:elasticsearch "$path"; \
  done

COPY ./ElasticSearch/config ./config

VOLUME /usr/share/elasticsearch/data


RUN /usr/share/elasticsearch/bin/elasticsearch-plugin install x-pack

##ServerSide NodeJs

#install npm and NodeJs
RUN curl -sL https://deb.nodesource.com/setup_7.x | bash -
RUN apt-get install -y nodejs

# Create app directory
RUN mkdir -p /usr/src/app

# Install app dependencies
#COPY ./package.json /usr/src/app/
#RUN npm install

# Bundle app source
COPY ./ /usr/src/a
pp/

#APP BINDING PORT
EXPOSE 9200 9300 8080

#ENTRYPOINT ["/docker-entrypoint.sh"]

WORKDIR /usr/src/app


COPY ./run.sh /

RUN chmod +x /run.sh

CMD ["/run.sh"]

#RUN the result dockerized image with
#docker run --privileged --name [container-name] -p 9200:9200 -p 9300:9300 -p 8080:8080 [image-tag]
#
#RUN filebeat module
#docker exec [container-name] /etc/init.d/filebeat start
#
#RUN nodeJS module
#docker exec [container-name] npm start


#what image we want to built
#FROM node:boron

# Create app directory
#RUN mkdir -p /usr/src/app
#WORKDIR /usr/src/app

# Install app dependencies
#COPY ./package.json /usr/src/app/
#RUN npm install

# Bundle app source
#COPY . /usr/src/app/

#APP BINDING PORT
#EXPOSE 4000

#START THE APP
#CMD [ "npm", "start" ]