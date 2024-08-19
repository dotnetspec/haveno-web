# These files were taken from the haveno project:
/home/alanpoe/Documents/Development/Monero/haveno-dex/haveno/proto/src/main/proto

# They are used one time to generate the Protobuffer elm files:
/home/alanpoe/Documents/Development/Monero/elm-merge/haveno-web/src/Proto/Io/Haveno/Protobuffer.elm

# In the root of haveno-web:
```sh
protoc --proto_path=. --elm_out=./src  grpc.proto pb.proto
```

# The generated files are in:
/home/alanpoe/Documents/Development/Monero/elm-merge/haveno-web/src/Proto

# and they function as the interface from Elm to Haveno (core)

# Documentation for this interface is at (-- NOTE: haveno-ts):
https://haveno-dex.github.io/haveno-ts/classes/HavenoClient.HavenoClient.html#getVersion
