#!/bin/bash
BLUE='\033[0;34m'; GREEN='\033[1;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
case "$1" in
    setup) rm -rf node_modules package-lock.json && npm install ;;
    start)
        echo -e "${YELLOW}🚀 Starting System...${NC}"
        # Start server with TSX
        npx cross-env NODE_ENV=production npx tsx server.ts &
        SERVER_PID=$!
        sleep 6
        echo -e "${GREEN}✨ Launching Desktop...${NC}"
        npx electron .
        kill $SERVER_PID
        ;;
    *) echo "Usage: ./manage.sh [setup|start]" ;;
esac
