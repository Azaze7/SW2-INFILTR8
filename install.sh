#!/bin/bash

# Get the operating system name
os_name=$(uname -s)

# Function to check if a command is available
check_command() {
    command -v "$1" >/dev/null 2>&1
}

# Variables
ZIP_FILE="program.zip"
APP_DIR="CS4311_INFILTR8_6TheNine-Bytes_Fall2024-main/my-app"

# Check if the OS is macOS or Linux
if [ "$os_name" == "Darwin" ]; then
    if check_command node && check_command npm; then
        echo "Node.js and NPM are already installed."
        echo "Node.js version: $(node -v)"
        echo "NPM version: $(npm -v)"
    else
        echo "Node.js or NPM is not installed."
        echo "Installing Node.js and NPM for macOS using brew"
        echo "Updating brew"
        brew update >/dev/null 2>&1
        echo "Upgrading brews"
        brew upgrade >/dev/null 2>&1
        echo "Installing Node.js and NPM"
        brew install node >/dev/null 2>&1
        echo "Node.js and NPM installed"
        echo "Node.js version: $(node -v)"
        echo "NPM version: $(npm -v)"
    fi

    # Unzip the program.zip file
    if [ -f "$ZIP_FILE" ]; then
        echo "Unzipping $ZIP_FILE"
        unzip -q "$ZIP_FILE"
        if [ $? -ne 0 ]; then
            echo "Failed to unzip the file."
            exit 1
        fi
    else
        echo "$ZIP_FILE not found."
        exit 1
    fi

    # Navigate to the application directory
    cd "$APP_DIR" || { echo "Directory not found: $APP_DIR"; exit 1; }

    # Install dependencies
    npm install >/dev/null 2>&1

    # Build the project
    npm run build >/dev/null 2>&1

    # Start the development server
    npm run dev

elif [ "$os_name" == "Linux" ]; then
    if check_command node && check_command npm; then
        echo "Node.js and NPM are already installed."
        echo "Node.js version: $(node -v)"
        echo "NPM version: $(npm -v)"
    else
        echo "Node.js or NPM is not installed."
        echo "Installing Node.js and NPM for Debian Linux using apt"
        echo "Updating package list"
        sudo apt update >/dev/null 2>&1
        echo "Upgrading packages"
        sudo apt upgrade -y >/dev/null 2>&1
        echo "Installing Node.js and NPM"
        sudo apt install -y nodejs npm >/dev/null 2>&1
        echo "Node.js and NPM installed"
        echo "Node.js version: $(node -v)"
        echo "NPM version: $(npm -v)"
    fi

    # Unzip the program.zip file
    if [ -f "$ZIP_FILE" ]; then
        echo "Unzipping $ZIP_FILE"
        unzip -q "$ZIP_FILE"
        if [ $? -ne 0 ]; then
            echo "Failed to unzip the file."
            exit 1
        fi
    else
        echo "$ZIP_FILE not found."
        exit 1
    fi

    # Navigate to the application directory
    cd "$APP_DIR" || { echo "Directory not found: $APP_DIR"; exit 1; }

    # Install dependencies
    npm install >/dev/null 2>&1

    # Build the project
    npm run build >/dev/null 2>&1

    # Start the development server
    npm run dev

else
    echo "Unknown operating system: $os_name"
    exit 1
fi

# Exit script
exit 0
