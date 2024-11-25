# Build stage
FROM node:20.10.0-alpine AS builder

# Add labels for better maintainability
LABEL maintainer="Hurb Team"
LABEL description="Currency Converter API"
LABEL version="1.0"

# Set working directory
WORKDIR /app

# Set NODE_ENV for build
ENV NODE_ENV=production

# Install dependencies first (better layer caching)
COPY package.json yarn.lock ./
# Install all dependencies including devDependencies for building
RUN yarn install --frozen-lockfile --production=false

# Copy source files
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:20.10.0-alpine

# Set working directory
WORKDIR /app

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set NODE_ENV
ENV NODE_ENV=production

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile && \
    yarn cache clean

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Add healthcheck using the ping endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/currency-convert/ping || exit 1

# Start the application
CMD ["yarn", "start"]
