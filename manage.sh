#!/bin/bash

# MindMark Automation Script
# Use this to sync, build, and run your application locally (Git Bash / MINGW64)

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

function show_help() {
    echo -e "${BLUE}MindMark Management Tool${NC}"
    echo "Usage: ./manage.sh [command]"
    echo ""
    echo "Commands:"
    echo "  sync      - Pull latest changes from GitHub"
    echo "  setup     - Install npm dependencies"
    echo "  build     - Build web (Vite) and Electron apps"
    echo "  dev       - Run Electron in development mode"
    echo "  web       - Run local Express server (Web version)"
    echo "  deploy    - Deploy to Firebase (Hosting & Functions)"
    echo "  all       - Sync, Install, Build, and launch Electron"
    echo "  help      - Show this help message"
}

function sync_repo() {
    echo -e "${YELLOW}🚀 Syncing with GitHub...${NC}"
    git pull origin $(git branch --show-current)
}

function install_deps() {
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
}

function build_app() {
    echo -e "${YELLOW}🏗️ Building Web and Desktop versions...${NC}"
    npm run electron:build
}

function run_dev() {
    echo -e "${GREEN}✨ Launching MindMark Desktop (Dev Mode)...${NC}"
    npm run electron:dev
}

function run_web() {
    echo -e "${GREEN}🌐 Launching MindMark Web Server...${NC}"
    echo -e "${BLUE}Server will be available at http://localhost:3000${NC}"
    npm run start
}

function deploy_app() {
    echo -e "${YELLOW}🚀 Deploying to Firebase...${NC}"
    firebase deploy
}

# Main Logic
case "$1" in
    sync)
        sync_repo
        ;;
    setup)
        install_deps
        ;;
    build)
        build_app
        ;;
    dev)
        run_dev
        ;;
    web)
        run_web
        ;;
    deploy)
        deploy_app
        ;;
    all)
        sync_repo
        install_deps
        build_app
        run_dev
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        if [ -z "$1" ]; then
            show_help
        else
            echo -e "${RED}Unknown command: $1${NC}"
            show_help
            exit 1
        fi
        ;;
esac
