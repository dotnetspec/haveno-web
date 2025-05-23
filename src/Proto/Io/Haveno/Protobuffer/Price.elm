{- !!! DO NOT EDIT THIS FILE MANUALLY !!! -}

module Proto.Io.Haveno.Protobuffer.Price exposing (getMarketDepth, getMarketPrice, getMarketPrices)

{-| 
This file was automatically generated by
- [`protoc-gen-elm`](https://www.npmjs.com/package/protoc-gen-elm) 4.0.3
- `protoc` 3.12.4
- the following specification files: `grpc.proto`

To run it, add a dependency via `elm install` on [`elm-protocol-buffers`](https://package.elm-lang.org/packages/eriktim/elm-protocol-buffers/1.2.0) version latest or higher.

/////////////////////////////////////////////////////////////////////////////////////////
 Price
/////////////////////////////////////////////////////////////////////////////////////////


@docs getMarketDepth, getMarketPrice, getMarketPrices

-}

import Grpc.Internal
import Proto.Io.Haveno.Protobuffer


{-| A template for a gRPC call to the method 'GetMarketDepth' sending a `MarketDepthRequest` to get back a `MarketDepthReply`.

-}
getMarketDepth :
    Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.MarketDepthRequest Proto.Io.Haveno.Protobuffer.MarketDepthReply
getMarketDepth =
    Grpc.Internal.Rpc
        { service = "Price"
        , package = "io.haveno.protobuffer"
        , rpcName = "GetMarketDepth"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeMarketDepthRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeMarketDepthReply
        }


{-| A template for a gRPC call to the method 'GetMarketPrices' sending a `MarketPricesRequest` to get back a `MarketPricesReply`.

-}
getMarketPrices :
    Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.MarketPricesRequest Proto.Io.Haveno.Protobuffer.MarketPricesReply
getMarketPrices =
    Grpc.Internal.Rpc
        { service = "Price"
        , package = "io.haveno.protobuffer"
        , rpcName = "GetMarketPrices"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeMarketPricesRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeMarketPricesReply
        }


{-| A template for a gRPC call to the method 'GetMarketPrice' sending a `MarketPriceRequest` to get back a `MarketPriceReply`.

-}
getMarketPrice :
    Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.MarketPriceRequest Proto.Io.Haveno.Protobuffer.MarketPriceReply
getMarketPrice =
    Grpc.Internal.Rpc
        { service = "Price"
        , package = "io.haveno.protobuffer"
        , rpcName = "GetMarketPrice"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeMarketPriceRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeMarketPriceReply
        }
