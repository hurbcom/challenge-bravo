FROM gradle:7.6.0-jdk8 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build

FROM openjdk:8-jre-slim
EXPOSE 8080 5005
COPY --from=build /home/gradle/src/build/libs/QuoteService-0.0.1-SNAPSHOT.jar /app/
RUN bash -c 'touch /app/QuoteService-0.0.1-SNAPSHOT.jar'
ENTRYPOINT ["java", "-XX:+UnlockExperimentalVMOptions", "-XX:+UseCGroupMemoryLimitForHeap", "-Djava.security.egd=file:/dev/./urandom","-jar","/app/QuoteService-0.0.1-SNAPSHOT.jar"]
