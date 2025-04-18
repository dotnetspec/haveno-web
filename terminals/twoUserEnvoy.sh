#!/bin/bash

# This is a script to start a local network with 2 users, 2 monerod nodes
# and the Envoy server

gnome-terminal --tab -- bash -c "echo 'Starting monerod1-local'; cd ~/Documents/Development/Monero/haveno-dex/haveno && make monerod1-local; exec bash"
sleep 1
gnome-terminal --tab -- bash -c "echo 'Starting monerod2-local'; cd ~/Documents/Development/Monero/haveno-dex/haveno && make monerod2-local; exec bash"
sleep 1
gnome-terminal --tab -- bash -c "echo 'Starting tmux'; cd ~/Documents/Development/Monero/haveno-dex/haveno && make deploy-tmux; exec bash"

# Start the Envoy proxy in haveno-ts

gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno-ts && docker run --rm --add-host host.docker.internal:host-gateway -it -v /home/alanpoe/Documents/Development/Monero/haveno-dex/haveno-ts/config/envoy.test.yaml:/envoy.test.yaml -p 8079:8079 -p 8080:8080 -p 8081:8081 -p 8082:8082 -p 8083:8083 -p 8084:8084 -p 8085:8085 -p 8086:8086 envoyproxy/envoy-dev:latest -c /envoy.test.yaml; exec bash"

# Optional: wait a few seconds to ensure previous terminals start
sleep 3

# Start the local wallet daemon
gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno && make funding-wallet-local; exec bash"
