FROM node:18.20

ENV PORT = 3000
ENV CORS_URL = "http://localhost"

WORKDIR app

COPY . /app

RUN  npm install

EXPOSE 3000

CMD  ["npm", "run", "start"]