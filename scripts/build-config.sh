#!/bin/bash

# Build configuration script for Cuneiform Assets site
# Usage: ./build-config.sh [environment]
# Environments: dev, production

ENVIRONMENT=${1:-dev}

echo "Configuring site for environment: $ENVIRONMENT"

# Set environment-specific configurations
case $ENVIRONMENT in
    "dev")
        echo "Setting up development environment..."
        # Add any dev-specific configurations here
        # For example: enable debug mode, use dev analytics, etc.
        ;;
    "production"|"main")
        echo "Setting up production environment..."
        # Add any production-specific configurations here
        # For example: minify assets, use production analytics, etc.
        ;;
    *)
        echo "Unknown environment: $ENVIRONMENT"
        echo "Valid environments: dev, production"
        exit 1
        ;;
esac

# Ensure all necessary files exist
if [ ! -f "index.html" ]; then
    echo "Error: index.html not found"
    exit 1
fi

# Set proper permissions
find . -name "*.html" -exec chmod 644 {} \;
find . -name "*.css" -exec chmod 644 {} \;
find . -name "*.js" -exec chmod 644 {} \;
find . -name "*.jpg" -exec chmod 644 {} \;
find . -name "*.png" -exec chmod 644 {} \;
find . -name "*.svg" -exec chmod 644 {} \;
find . -name "*.pdf" -exec chmod 644 {} \;

echo "Site configuration complete for $ENVIRONMENT environment"