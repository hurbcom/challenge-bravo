FROM node:alpine AS dev

ENV APP_HOME /app

WORKDIR $APP_HOME

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

CMD yarn run dev

FROM node:alpine as base

ENV APP_HOME /app
ENV PORT 8000

EXPOSE $PORT

WORKDIR /app

# Copy the package.json and package-lock.json files to the first stage
COPY package*.json ./
COPY yarn.lock ./

# Install the dependencies in the first stage
RUN yarn install

# Copy the rest of the app's files to the first stage
COPY . .

# Build the app in the first stage
RUN yarn run build

CMD yarn start

# FROM base AS deploy

# WORKDIR /app

# # Dont run as root
# ENV RUN_USER user
# RUN addgroup -S $RUN_USER && \
#     adduser -h $APP_HOME -S -s /bin/false $RUN_USER -G $RUN_USER && \
#     chown -R $RUN_USER:$RUN_USER $APP_HOME
# USER $RUN_USER

# # Copy the compiled app files from the first stage to the second stage
# COPY --from=builder /app/dist ./dist

# # Copy the package.json file to the second stage
# COPY --from=builder /app/package*.json ./

# RUN yarn install --production

# # Specify the command to run when the container starts
# CMD [ "npm", "start" ]