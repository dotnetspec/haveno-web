#!/bin/bash

# Open the first terminal and run the first command
#gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno && make monerod1-local; exec bash"

# Open the second terminal and run the second command
#gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno && make monerod2-local; exec bash"

# Optional: wait a few seconds to ensure previous terminals start
#sleep 3

# Send the start_mining command to the tmux session
# Ensure the tmux session is running
#tmux new-session -d -s mysession
#tmux send-keys -t mysession 'start_mining 9tsUiG9bwcU7oTbAdBwBk2PzxFtysge5qcEsHEpetmEKgerHQa1fDqH7a4FiquZmms7yM22jdifVAD7jAb2e63GSJMuhY75 1' C-m

#tmux new-session -d -s mysession 'start_mining 9tsUiG9bwcU7oTbAdBwBk2PzxFtysge5qcEsHEpetmEKgerHQa1fDqH7a4FiquZmms7yM22jdifVAD7jAb2e63GSJMuhY75 1'



#:' comments #code out
#:'
#gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno && make seednode-local; exec bash"

gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno && make user1-daemon-local; exec bash"

#gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno && make user2-daemon-local; exec bash"

#gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno && make arbitrator-daemon-local; exec bash"

#Only run Envoy server one time at beginning. Comment out this line for subsequent runs.

gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno-ts && docker run --rm --add-host host.docker.internal:host-gateway -it -v /home/alanpoe/Documents/Development/Monero/haveno-dex/haveno-ts/config/envoy.test.yaml:/envoy.test.yaml -p 8079:8079 -p 8080:8080 -p 8081:8081 -p 8082:8082 -p 8083:8083 -p 8084:8084 -p 8085:8085 -p 8086:8086 envoyproxy/envoy-dev:latest -c /envoy.test.yaml; exec bash"

#gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno && make funding-wallet-local; exec bash"

# -- NOTE: We're using elm-merge folder here:

#gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/elm-merge/haveno-web && npx http-server -p 5500 --cors; exec bash"
#'