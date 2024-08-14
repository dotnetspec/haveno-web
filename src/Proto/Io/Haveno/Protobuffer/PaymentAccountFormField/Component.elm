{- !!! DO NOT EDIT THIS FILE MANUALLY !!! -}

module Proto.Io.Haveno.Protobuffer.PaymentAccountFormField.Component exposing (Component(..), decodeComponent, defaultComponent, encodeComponent, fieldNumbersComponent)

{-| 
This file was automatically generated by
- [`protoc-gen-elm`](https://www.npmjs.com/package/protoc-gen-elm) 4.0.3
- `protoc` 3.12.4
- the following specification files: `pb.proto`

To run it, add a dependency via `elm install` on [`elm-protocol-buffers`](https://package.elm-lang.org/packages/eriktim/elm-protocol-buffers/1.2.0) version latest or higher.

@docs Component, decodeComponent, defaultComponent, encodeComponent, fieldNumbersComponent

-}

import Protobuf.Decode
import Protobuf.Encode


{-| The field numbers for the fields of `Component`. This is mostly useful for internals, like documentation generation.

-}
fieldNumbersComponent : Component -> Int
fieldNumbersComponent n_ =
    case n_ of
        TEXT ->
            0

        TEXTAREA ->
            1

        SELECTONE ->
            2

        SELECTMULTIPLE ->
            3

        ComponentUnrecognized_ m_ ->
            m_


{-| Default for Component. Should only be used for 'required' decoders as an initial value.

-}
defaultComponent : Component
defaultComponent =
    TEXT


{-| Declares how to encode a `Component` to Bytes. To actually perform the conversion to Bytes, you need to use Protobuf.Encode.encode from eriktim/elm-protocol-buffers.

-}
encodeComponent : Component -> Protobuf.Encode.Encoder
encodeComponent value =
    Protobuf.Encode.int32 <|
        case value of
            TEXT ->
                0

            TEXTAREA ->
                1

            SELECTONE ->
                2

            SELECTMULTIPLE ->
                3

            ComponentUnrecognized_ i ->
                i


{-| Declares how to decode a `Component` from Bytes. To actually perform the conversion from Bytes, you need to use Protobuf.Decode.decode from eriktim/elm-protocol-buffers.

-}
decodeComponent : Protobuf.Decode.Decoder Component
decodeComponent =
    Protobuf.Decode.int32
        |> Protobuf.Decode.map
            (\i ->
                case i of
                    0 ->
                        TEXT

                    1 ->
                        TEXTAREA

                    2 ->
                        SELECTONE

                    3 ->
                        SELECTMULTIPLE

                    _ ->
                        ComponentUnrecognized_ i
            )


{-| `Component` enumeration

-}
type Component
    = TEXT
    | TEXTAREA
    | SELECTONE
    | SELECTMULTIPLE
    | ComponentUnrecognized_ Int
