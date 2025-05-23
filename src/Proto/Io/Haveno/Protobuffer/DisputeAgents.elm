{- !!! DO NOT EDIT THIS FILE MANUALLY !!! -}

module Proto.Io.Haveno.Protobuffer.DisputeAgents exposing (registerDisputeAgent, unregisterDisputeAgent)

{-| 
This file was automatically generated by
- [`protoc-gen-elm`](https://www.npmjs.com/package/protoc-gen-elm) 4.0.3
- `protoc` 3.12.4
- the following specification files: `grpc.proto`

To run it, add a dependency via `elm install` on [`elm-protocol-buffers`](https://package.elm-lang.org/packages/eriktim/elm-protocol-buffers/1.2.0) version latest or higher.

/////////////////////////////////////////////////////////////////////////////////////////
 DisputeAgents
/////////////////////////////////////////////////////////////////////////////////////////


@docs registerDisputeAgent, unregisterDisputeAgent

-}

import Grpc.Internal
import Proto.Io.Haveno.Protobuffer


{-| A template for a gRPC call to the method 'UnregisterDisputeAgent' sending a `UnregisterDisputeAgentRequest` to get back a `UnregisterDisputeAgentReply`.

-}
unregisterDisputeAgent :
    Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.UnregisterDisputeAgentRequest Proto.Io.Haveno.Protobuffer.UnregisterDisputeAgentReply
unregisterDisputeAgent =
    Grpc.Internal.Rpc
        { service = "DisputeAgents"
        , package = "io.haveno.protobuffer"
        , rpcName = "UnregisterDisputeAgent"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeUnregisterDisputeAgentRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeUnregisterDisputeAgentReply
        }


{-| A template for a gRPC call to the method 'RegisterDisputeAgent' sending a `RegisterDisputeAgentRequest` to get back a `RegisterDisputeAgentReply`.

-}
registerDisputeAgent :
    Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.RegisterDisputeAgentRequest Proto.Io.Haveno.Protobuffer.RegisterDisputeAgentReply
registerDisputeAgent =
    Grpc.Internal.Rpc
        { service = "DisputeAgents"
        , package = "io.haveno.protobuffer"
        , rpcName = "RegisterDisputeAgent"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeRegisterDisputeAgentRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeRegisterDisputeAgentReply
        }
