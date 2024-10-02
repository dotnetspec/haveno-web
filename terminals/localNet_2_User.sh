#!/bin/bash

gnome-terminal --tab -- bash -c "echo 'Starting monerod1-local'; cd ~/Documents/Development/Monero/haveno-dex/haveno && make monerod1-local; exec bash"
sleep 1
gnome-terminal --tab -- bash -c "echo 'Starting monerod2-local'; cd ~/Documents/Development/Monero/haveno-dex/haveno && make monerod2-local; exec bash"
sleep 1
gnome-terminal --tab -- bash -c "echo 'Starting tmux'; cd ~/Documents/Development/Monero/haveno-dex/haveno && make deploy-tmux; exec bash"
