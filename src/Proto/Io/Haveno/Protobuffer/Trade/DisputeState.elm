{- !!! DO NOT EDIT THIS FILE MANUALLY !!! -}

module Proto.Io.Haveno.Protobuffer.Trade.DisputeState exposing (DisputeState(..), decodeDisputeState, defaultDisputeState, encodeDisputeState, fieldNumbersDisputeState)

{-| 
This file was automatically generated by
- [`protoc-gen-elm`](https://www.npmjs.com/package/protoc-gen-elm) 4.0.3
- `protoc` 3.12.4
- the following specification files: `pb.proto`

To run it, add a dependency via `elm install` on [`elm-protocol-buffers`](https://package.elm-lang.org/packages/eriktim/elm-protocol-buffers/1.2.0) version latest or higher.

@docs DisputeState, decodeDisputeState, defaultDisputeState, encodeDisputeState, fieldNumbersDisputeState

-}

import Protobuf.Decode
import Protobuf.Encode


{-| The field numbers for the fields of `DisputeState`. This is mostly useful for internals, like documentation generation.

-}
fieldNumbersDisputeState : DisputeState -> Int
fieldNumbersDisputeState n_ =
    case n_ of
        PBERRORDISPUTESTATE ->
            0

        NODISPUTE ->
            1

        DISPUTEREQUESTED ->
            2

        DISPUTEOPENED ->
            3

        ARBITRATORSENTDISPUTECLOSEDMSG ->
            4

        ARBITRATORSENDFAILEDDISPUTECLOSEDMSG ->
            5

        ARBITRATORSTOREDINMAILBOXDISPUTECLOSEDMSG ->
            6

        ARBITRATORSAWARRIVEDDISPUTECLOSEDMSG ->
            7

        DISPUTECLOSED ->
            8

        MEDIATIONREQUESTED ->
            9

        MEDIATIONSTARTEDBYPEER ->
            10

        MEDIATIONCLOSED ->
            11

        REFUNDREQUESTED ->
            12

        REFUNDREQUESTSTARTEDBYPEER ->
            13

        REFUNDREQUESTCLOSED ->
            14

        DisputeStateUnrecognized_ m_ ->
            m_


{-| Default for DisputeState. Should only be used for 'required' decoders as an initial value.

-}
defaultDisputeState : DisputeState
defaultDisputeState =
    PBERRORDISPUTESTATE


{-| Declares how to encode a `DisputeState` to Bytes. To actually perform the conversion to Bytes, you need to use Protobuf.Encode.encode from eriktim/elm-protocol-buffers.

-}
encodeDisputeState : DisputeState -> Protobuf.Encode.Encoder
encodeDisputeState value =
    Protobuf.Encode.int32 <|
        case value of
            PBERRORDISPUTESTATE ->
                0

            NODISPUTE ->
                1

            DISPUTEREQUESTED ->
                2

            DISPUTEOPENED ->
                3

            ARBITRATORSENTDISPUTECLOSEDMSG ->
                4

            ARBITRATORSENDFAILEDDISPUTECLOSEDMSG ->
                5

            ARBITRATORSTOREDINMAILBOXDISPUTECLOSEDMSG ->
                6

            ARBITRATORSAWARRIVEDDISPUTECLOSEDMSG ->
                7

            DISPUTECLOSED ->
                8

            MEDIATIONREQUESTED ->
                9

            MEDIATIONSTARTEDBYPEER ->
                10

            MEDIATIONCLOSED ->
                11

            REFUNDREQUESTED ->
                12

            REFUNDREQUESTSTARTEDBYPEER ->
                13

            REFUNDREQUESTCLOSED ->
                14

            DisputeStateUnrecognized_ i ->
                i


{-| Declares how to decode a `DisputeState` from Bytes. To actually perform the conversion from Bytes, you need to use Protobuf.Decode.decode from eriktim/elm-protocol-buffers.

-}
decodeDisputeState : Protobuf.Decode.Decoder DisputeState
decodeDisputeState =
    Protobuf.Decode.int32
        |> Protobuf.Decode.map
            (\i ->
                case i of
                    0 ->
                        PBERRORDISPUTESTATE

                    1 ->
                        NODISPUTE

                    2 ->
                        DISPUTEREQUESTED

                    3 ->
                        DISPUTEOPENED

                    4 ->
                        ARBITRATORSENTDISPUTECLOSEDMSG

                    5 ->
                        ARBITRATORSENDFAILEDDISPUTECLOSEDMSG

                    6 ->
                        ARBITRATORSTOREDINMAILBOXDISPUTECLOSEDMSG

                    7 ->
                        ARBITRATORSAWARRIVEDDISPUTECLOSEDMSG

                    8 ->
                        DISPUTECLOSED

                    9 ->
                        MEDIATIONREQUESTED

                    10 ->
                        MEDIATIONSTARTEDBYPEER

                    11 ->
                        MEDIATIONCLOSED

                    12 ->
                        REFUNDREQUESTED

                    13 ->
                        REFUNDREQUESTSTARTEDBYPEER

                    14 ->
                        REFUNDREQUESTCLOSED

                    _ ->
                        DisputeStateUnrecognized_ i
            )


{-| `DisputeState` enumeration

-}
type DisputeState
    = PBERRORDISPUTESTATE
    | NODISPUTE
    | DISPUTEREQUESTED
    | DISPUTEOPENED
    | ARBITRATORSENTDISPUTECLOSEDMSG
    | ARBITRATORSENDFAILEDDISPUTECLOSEDMSG
    | ARBITRATORSTOREDINMAILBOXDISPUTECLOSEDMSG
    | ARBITRATORSAWARRIVEDDISPUTECLOSEDMSG
    | DISPUTECLOSED
    | MEDIATIONREQUESTED
    | MEDIATIONSTARTEDBYPEER
    | MEDIATIONCLOSED
    | REFUNDREQUESTED
    | REFUNDREQUESTSTARTEDBYPEER
    | REFUNDREQUESTCLOSED
    | DisputeStateUnrecognized_ Int
