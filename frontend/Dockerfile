FROM node:20-alpine
WORKDIR /app
RUN mkdir -p /tmp && chmod 1777 /tmp
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]