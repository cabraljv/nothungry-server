FROM node:lts-alpine 

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

RUN chmod -R 777 /home/node/app

COPY package.json yarn.* ./ 
 
USER node 
 
RUN yarn 
 
COPY --chown=node:node . .
RUN chmod +x /home/node/app/init.sh

EXPOSE 3333 
 
ENTRYPOINT [ "./init.sh" ] 