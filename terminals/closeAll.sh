#!/bin/bash

echo "Closing all terminals gracefully..."

# Gracefully stop processes using known commands
pkill -f "make monerod1-local"
pkill -f "make monerod2-local"
pkill -f "make seednode-local"
pkill -f "make user1-daemon-local"
pkill -f "make user2-daemon-local"
pkill -f "make arbitrator-daemon-local"
pkill -f "docker run --rm --add-host host.docker.internal:host-gateway"
pkill -f "make funding-wallet-local"
pkill -f "npx http-server dist -p 1234 --cors"
pkill -f "parcel serve"


# Optionally stop tmux session if active
if tmux has-session -t mysession 2>/dev/null; then
    echo "Stopping tmux session 'mysession'..."
    tmux kill-session -t mysession
fi

echo "All terminals and processes should now be closed."
