FROM node:10

RUN mkdir -p /bravo
WORKDIR /bravo

COPY . /bravo
RUN yarn

EXPOSE 3333
CMD yarn dev