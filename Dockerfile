FROM node:10-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app
RUN npm init -y

COPY dist.html ./index.html

USER node
RUN npm install serve


EXPOSE 5000

CMD [ "./node_modules/serve/bin/serve.js", "." ]