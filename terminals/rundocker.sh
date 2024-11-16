#!/bin/bash

gnome-terminal -- bash -c "cd ~/Documents/Development/Monero/haveno-dex/haveno-ts && docker run --rm --add-host host.docker.internal:host-gateway -it -v /home/alanpoe/Documents/Development/Monero/haveno-dex/haveno-ts/config/envoy.test.yaml:/envoy.test.yaml -p 8079:8079 -p 8080:8080 -p 8081:8081 -p 8082:8082 -p 8083:8083 -p 8084:8084 -p 8085:8085 -p 8086:8086 envoyproxy/envoy-dev:latest -c /envoy.test.yaml; exec bash"
