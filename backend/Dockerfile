# ====== STAGE 1: Build the JAR ======
FROM eclipse-temurin:21-jdk-alpine AS builder

# Install Maven
RUN apk add --no-cache maven

# Set work directory
WORKDIR /build

# Copy only pom.xml first (for dependency caching)
COPY pom.xml .

# Download dependencies (cached if pom.xml unchanged)
RUN mvn -B dependency:go-offline

# Copy project source
COPY src ./src

# Build the application
RUN mvn -B clean package -DskipTests


# ====== STAGE 2: Create runtime image ======
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the built jar from stage 1
COPY --from=builder /build/target/*.jar app.jar

# Expose port for the backend
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
