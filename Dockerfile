FROM node:16
RUN apt update && apt install -y \
        default-jre
# Create app directory
WORKDIR /app
ADD . /app/

RUN npm install --save --legacy-peer-deps
RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3000

# start command
CMD [ "npm", "run", "prod" ]
