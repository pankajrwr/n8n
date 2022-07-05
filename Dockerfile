FROM node:14.15-alpine

# # Set a custom user to not have n8n run as root
USER root

# Update everything and install needed dependencies
RUN apk add --update graphicsmagick tzdata git tini su-exec

# Install fonts
RUN apk --no-cache add --virtual fonts msttcorefonts-installer fontconfig && \
	update-ms-fonts && \
	fc-cache -f && \
	apk del fonts && \
	find  /usr/share/fonts/truetype/msttcorefonts/ -type l -exec unlink {} \; \
	&& rm -rf /root /tmp/* /var/cache/apk/* && mkdir /root

# Install n8n and the also temporary all the packages
# it needs to build it correctly.
# INSTALL N8N (build locally using build-packages.sh)
ADD dist/ /root/
RUN apk --update add --virtual build-dependencies python build-base ca-certificates && \
	npm_config_user=root npm install -g lodash full-icu /root/*.tgz && \
	apk del build-dependencies \
	&& rm -rf /root /tmp/* /var/cache/apk/* && mkdir /root;

ENV NODE_ICU_DATA /usr/local/lib/node_modules/full-icu

# DATA DIR
VOLUME /data

# Change home of node user to /data
RUN sed -ix 's/home[/]node/data/' /etc/passwd && \
    rm /etc/passwdx && \
    chown -R node /data

WORKDIR /data


ENTRYPOINT ["tini", "--"]
CMD su-exec node n8n

EXPOSE 5678/tcp