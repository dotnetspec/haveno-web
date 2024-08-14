{- !!! DO NOT EDIT THIS FILE MANUALLY !!! -}

module Proto.Io.Haveno.Protobuffer.AddressEntry.Context exposing (Context(..), decodeContext, defaultContext, encodeContext, fieldNumbersContext)

{-| 
This file was automatically generated by
- [`protoc-gen-elm`](https://www.npmjs.com/package/protoc-gen-elm) 4.0.3
- `protoc` 3.12.4
- the following specification files: `pb.proto`

To run it, add a dependency via `elm install` on [`elm-protocol-buffers`](https://package.elm-lang.org/packages/eriktim/elm-protocol-buffers/1.2.0) version latest or higher.

@docs Context, decodeContext, defaultContext, encodeContext, fieldNumbersContext

-}

import Protobuf.Decode
import Protobuf.Encode


{-| The field numbers for the fields of `Context`. This is mostly useful for internals, like documentation generation.

-}
fieldNumbersContext : Context -> Int
fieldNumbersContext n_ =
    case n_ of
        PBERROR ->
            0

        ARBITRATOR ->
            1

        AVAILABLE ->
            2

        OFFERFUNDING ->
            3

        RESERVEDFORTRADE ->
            4

        MULTISIG ->
            5

        TRADEPAYOUT ->
            6

        ContextUnrecognized_ m_ ->
            m_


{-| Default for Context. Should only be used for 'required' decoders as an initial value.

-}
defaultContext : Context
defaultContext =
    PBERROR


{-| Declares how to encode a `Context` to Bytes. To actually perform the conversion to Bytes, you need to use Protobuf.Encode.encode from eriktim/elm-protocol-buffers.

-}
encodeContext : Context -> Protobuf.Encode.Encoder
encodeContext value =
    Protobuf.Encode.int32 <|
        case value of
            PBERROR ->
                0

            ARBITRATOR ->
                1

            AVAILABLE ->
                2

            OFFERFUNDING ->
                3

            RESERVEDFORTRADE ->
                4

            MULTISIG ->
                5

            TRADEPAYOUT ->
                6

            ContextUnrecognized_ i ->
                i


{-| Declares how to decode a `Context` from Bytes. To actually perform the conversion from Bytes, you need to use Protobuf.Decode.decode from eriktim/elm-protocol-buffers.

-}
decodeContext : Protobuf.Decode.Decoder Context
decodeContext =
    Protobuf.Decode.int32
        |> Protobuf.Decode.map
            (\i ->
                case i of
                    0 ->
                        PBERROR

                    1 ->
                        ARBITRATOR

                    2 ->
                        AVAILABLE

                    3 ->
                        OFFERFUNDING

                    4 ->
                        RESERVEDFORTRADE

                    5 ->
                        MULTISIG

                    6 ->
                        TRADEPAYOUT

                    _ ->
                        ContextUnrecognized_ i
            )


{-| `Context` enumeration

-}
type Context
    = PBERROR
    | ARBITRATOR
    | AVAILABLE
    | OFFERFUNDING
    | RESERVEDFORTRADE
    | MULTISIG
    | TRADEPAYOUT
    | ContextUnrecognized_ Int
