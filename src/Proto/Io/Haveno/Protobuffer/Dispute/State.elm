{- !!! DO NOT EDIT THIS FILE MANUALLY !!! -}

module Proto.Io.Haveno.Protobuffer.Dispute.State exposing (State(..), decodeState, defaultState, encodeState, fieldNumbersState)

{-| 
This file was automatically generated by
- [`protoc-gen-elm`](https://www.npmjs.com/package/protoc-gen-elm) 4.0.3
- `protoc` 3.12.4
- the following specification files: `pb.proto`

To run it, add a dependency via `elm install` on [`elm-protocol-buffers`](https://package.elm-lang.org/packages/eriktim/elm-protocol-buffers/1.2.0) version latest or higher.

@docs State, decodeState, defaultState, encodeState, fieldNumbersState

-}

import Protobuf.Decode
import Protobuf.Encode


{-| The field numbers for the fields of `State`. This is mostly useful for internals, like documentation generation.

-}
fieldNumbersState : State -> Int
fieldNumbersState n_ =
    case n_ of
        NEEDSUPGRADE ->
            0

        NEW ->
            1

        OPEN ->
            2

        REOPENED ->
            3

        CLOSED ->
            4

        StateUnrecognized_ m_ ->
            m_


{-| Default for State. Should only be used for 'required' decoders as an initial value.

-}
defaultState : State
defaultState =
    NEEDSUPGRADE


{-| Declares how to encode a `State` to Bytes. To actually perform the conversion to Bytes, you need to use Protobuf.Encode.encode from eriktim/elm-protocol-buffers.

-}
encodeState : State -> Protobuf.Encode.Encoder
encodeState value =
    Protobuf.Encode.int32 <|
        case value of
            NEEDSUPGRADE ->
                0

            NEW ->
                1

            OPEN ->
                2

            REOPENED ->
                3

            CLOSED ->
                4

            StateUnrecognized_ i ->
                i


{-| Declares how to decode a `State` from Bytes. To actually perform the conversion from Bytes, you need to use Protobuf.Decode.decode from eriktim/elm-protocol-buffers.

-}
decodeState : Protobuf.Decode.Decoder State
decodeState =
    Protobuf.Decode.int32
        |> Protobuf.Decode.map
            (\i ->
                case i of
                    0 ->
                        NEEDSUPGRADE

                    1 ->
                        NEW

                    2 ->
                        OPEN

                    3 ->
                        REOPENED

                    4 ->
                        CLOSED

                    _ ->
                        StateUnrecognized_ i
            )


{-| `State` enumeration

-}
type State
    = NEEDSUPGRADE
    | NEW
    | OPEN
    | REOPENED
    | CLOSED
    | StateUnrecognized_ Int
