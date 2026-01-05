FROM maven:3.9.6-eclipse-temurin-21
WORKDIR /app
COPY pom.xml .
# This pre-downloads dependencies so rebuilds are faster
RUN mvn dependency:go-offline 
COPY src ./src
# Runs the app using the Spring Boot plugin instead of a static JAR
CMD ["mvn", "spring-boot:run"]