#!/bin/bash

# Start a monerod instance
gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno && make monerod1-local; exec bash"



# Optional: Send the start_mining command to the tmux session
# Ensure the tmux session is running
#tmux new-session -d -s mysession
#tmux new-session -d -s mysession 'start_mining 9tsUiG9bwcU7oTbAdBwBk2PzxFtysge5qcEsHEpetmEKgerHQa1fDqH7a4FiquZmms7yM22jdifVAD7jAb2e63GSJMuhY75 1'

# Start the Haveno user1 seednode
gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno && make seednode-local; exec bash"

# Start the Haveno user1 daemon

gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno && make user1-daemon-local; exec bash"

# Start the Envoy proxy in haveno-ts

gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno-ts && docker run --rm --add-host host.docker.internal:host-gateway -it -v /home/alanpoe/Documents/Development/Monero/haveno-dex/haveno-ts/config/envoy.test.yaml:/envoy.test.yaml -p 8079:8079 -p 8080:8080 -p 8081:8081 -p 8082:8082 -p 8083:8083 -p 8084:8084 -p 8085:8085 -p 8086:8086 envoyproxy/envoy-dev:latest -c /envoy.test.yaml; exec bash"

# Optional: wait a few seconds to ensure previous terminals start
sleep 3

# Start the local wallet daemon
gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno && make funding-wallet-local; exec bash"
