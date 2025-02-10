FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

# Install PM2 globally
# RUN npm install -g pm2

# Install production dependencies
RUN npm ci 

RUN npm run prisma

RUN npm run db:mysql

RUN npm run db:mongodb

COPY . .

EXPOSE 3000

# CMD ["pm2-runtime", "start", "ecosystem.config.js"]
CMD ["npm", "run", "start"]