FROM node:18.20

WORKDIR app

COPY . /app

RUN mkdir uploads/profilepics

RUN npm install

EXPOSE 3000

CMD  ["npm", "run", "start"]