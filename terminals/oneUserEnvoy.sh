#!/bin/bash

# Start a monerod instance
gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno && make monerod1-local; exec bash"

# Start the Haveno user1 seednode (discover other Haveno nodes)
#In your testnet:
    #If only one Haveno instance is running, the seed node has no other peers to report.
    #If you start two or more Haveno nodes, they will discover each other through the seed node.
    #The seed node does not actually simulate trades—it just allows connection bootstrapping.
    
gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno && make seednode-local; exec bash"

# Start the Haveno user1 daemon

gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno && make user1-daemon-local; exec bash"

# Start the Envoy proxy in haveno-ts

gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno-ts && docker run --rm --add-host host.docker.internal:host-gateway -it -v /home/alanpoe/Documents/Development/Monero/haveno-dex/haveno-ts/config/envoy.test.yaml:/envoy.test.yaml -p 8079:8079 -p 8080:8080 -p 8081:8081 -p 8082:8082 -p 8083:8083 -p 8084:8084 -p 8085:8085 -p 8086:8086 envoyproxy/envoy-dev:latest -c /envoy.test.yaml; exec bash"

# Optional: wait a few seconds to ensure previous terminals start
sleep 3

# Start the local wallet daemon
gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno && make funding-wallet-local; exec bash"
