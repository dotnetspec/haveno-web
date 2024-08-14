{- !!! DO NOT EDIT THIS FILE MANUALLY !!! -}

module Proto.Io.Haveno.Protobuffer.Trade.State exposing (State(..), decodeState, defaultState, encodeState, fieldNumbersState)

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
        PBERRORSTATE ->
            0

        PREPARATION ->
            1

        MULTISIGPREPARED ->
            2

        MULTISIGMADE ->
            3

        MULTISIGEXCHANGED ->
            4

        MULTISIGCOMPLETED ->
            5

        CONTRACTSIGNATUREREQUESTED ->
            6

        CONTRACTSIGNED ->
            7

        SENTPUBLISHDEPOSITTXREQUEST ->
            8

        SENDFAILEDPUBLISHDEPOSITTXREQUEST ->
            9

        SAWARRIVEDPUBLISHDEPOSITTXREQUEST ->
            10

        PUBLISHDEPOSITTXREQUESTFAILED ->
            11

        ARBITRATORPUBLISHEDDEPOSITTXS ->
            12

        DEPOSITTXSSEENINNETWORK ->
            13

        DEPOSITTXSCONFIRMEDINBLOCKCHAIN ->
            14

        DEPOSITTXSUNLOCKEDINBLOCKCHAIN ->
            15

        BUYERCONFIRMEDPAYMENTSENT ->
            16

        BUYERSENTPAYMENTSENTMSG ->
            17

        BUYERSENDFAILEDPAYMENTSENTMSG ->
            18

        BUYERSTOREDINMAILBOXPAYMENTSENTMSG ->
            19

        BUYERSAWARRIVEDPAYMENTSENTMSG ->
            20

        SELLERRECEIVEDPAYMENTSENTMSG ->
            21

        SELLERCONFIRMEDPAYMENTRECEIPT ->
            22

        SELLERSENTPAYMENTRECEIVEDMSG ->
            23

        SELLERSENDFAILEDPAYMENTRECEIVEDMSG ->
            24

        SELLERSTOREDINMAILBOXPAYMENTRECEIVEDMSG ->
            25

        SELLERSAWARRIVEDPAYMENTRECEIVEDMSG ->
            26

        StateUnrecognized_ m_ ->
            m_


{-| Default for State. Should only be used for 'required' decoders as an initial value.

-}
defaultState : State
defaultState =
    PBERRORSTATE


{-| Declares how to encode a `State` to Bytes. To actually perform the conversion to Bytes, you need to use Protobuf.Encode.encode from eriktim/elm-protocol-buffers.

-}
encodeState : State -> Protobuf.Encode.Encoder
encodeState value =
    Protobuf.Encode.int32 <|
        case value of
            PBERRORSTATE ->
                0

            PREPARATION ->
                1

            MULTISIGPREPARED ->
                2

            MULTISIGMADE ->
                3

            MULTISIGEXCHANGED ->
                4

            MULTISIGCOMPLETED ->
                5

            CONTRACTSIGNATUREREQUESTED ->
                6

            CONTRACTSIGNED ->
                7

            SENTPUBLISHDEPOSITTXREQUEST ->
                8

            SENDFAILEDPUBLISHDEPOSITTXREQUEST ->
                9

            SAWARRIVEDPUBLISHDEPOSITTXREQUEST ->
                10

            PUBLISHDEPOSITTXREQUESTFAILED ->
                11

            ARBITRATORPUBLISHEDDEPOSITTXS ->
                12

            DEPOSITTXSSEENINNETWORK ->
                13

            DEPOSITTXSCONFIRMEDINBLOCKCHAIN ->
                14

            DEPOSITTXSUNLOCKEDINBLOCKCHAIN ->
                15

            BUYERCONFIRMEDPAYMENTSENT ->
                16

            BUYERSENTPAYMENTSENTMSG ->
                17

            BUYERSENDFAILEDPAYMENTSENTMSG ->
                18

            BUYERSTOREDINMAILBOXPAYMENTSENTMSG ->
                19

            BUYERSAWARRIVEDPAYMENTSENTMSG ->
                20

            SELLERRECEIVEDPAYMENTSENTMSG ->
                21

            SELLERCONFIRMEDPAYMENTRECEIPT ->
                22

            SELLERSENTPAYMENTRECEIVEDMSG ->
                23

            SELLERSENDFAILEDPAYMENTRECEIVEDMSG ->
                24

            SELLERSTOREDINMAILBOXPAYMENTRECEIVEDMSG ->
                25

            SELLERSAWARRIVEDPAYMENTRECEIVEDMSG ->
                26

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
                        PBERRORSTATE

                    1 ->
                        PREPARATION

                    2 ->
                        MULTISIGPREPARED

                    3 ->
                        MULTISIGMADE

                    4 ->
                        MULTISIGEXCHANGED

                    5 ->
                        MULTISIGCOMPLETED

                    6 ->
                        CONTRACTSIGNATUREREQUESTED

                    7 ->
                        CONTRACTSIGNED

                    8 ->
                        SENTPUBLISHDEPOSITTXREQUEST

                    9 ->
                        SENDFAILEDPUBLISHDEPOSITTXREQUEST

                    10 ->
                        SAWARRIVEDPUBLISHDEPOSITTXREQUEST

                    11 ->
                        PUBLISHDEPOSITTXREQUESTFAILED

                    12 ->
                        ARBITRATORPUBLISHEDDEPOSITTXS

                    13 ->
                        DEPOSITTXSSEENINNETWORK

                    14 ->
                        DEPOSITTXSCONFIRMEDINBLOCKCHAIN

                    15 ->
                        DEPOSITTXSUNLOCKEDINBLOCKCHAIN

                    16 ->
                        BUYERCONFIRMEDPAYMENTSENT

                    17 ->
                        BUYERSENTPAYMENTSENTMSG

                    18 ->
                        BUYERSENDFAILEDPAYMENTSENTMSG

                    19 ->
                        BUYERSTOREDINMAILBOXPAYMENTSENTMSG

                    20 ->
                        BUYERSAWARRIVEDPAYMENTSENTMSG

                    21 ->
                        SELLERRECEIVEDPAYMENTSENTMSG

                    22 ->
                        SELLERCONFIRMEDPAYMENTRECEIPT

                    23 ->
                        SELLERSENTPAYMENTRECEIVEDMSG

                    24 ->
                        SELLERSENDFAILEDPAYMENTRECEIVEDMSG

                    25 ->
                        SELLERSTOREDINMAILBOXPAYMENTRECEIVEDMSG

                    26 ->
                        SELLERSAWARRIVEDPAYMENTRECEIVEDMSG

                    _ ->
                        StateUnrecognized_ i
            )


{-| `State` enumeration

-}
type State
    = PBERRORSTATE
    | PREPARATION
    | MULTISIGPREPARED
    | MULTISIGMADE
    | MULTISIGEXCHANGED
    | MULTISIGCOMPLETED
    | CONTRACTSIGNATUREREQUESTED
    | CONTRACTSIGNED
    | SENTPUBLISHDEPOSITTXREQUEST
    | SENDFAILEDPUBLISHDEPOSITTXREQUEST
    | SAWARRIVEDPUBLISHDEPOSITTXREQUEST
    | PUBLISHDEPOSITTXREQUESTFAILED
    | ARBITRATORPUBLISHEDDEPOSITTXS
    | DEPOSITTXSSEENINNETWORK
    | DEPOSITTXSCONFIRMEDINBLOCKCHAIN
    | DEPOSITTXSUNLOCKEDINBLOCKCHAIN
    | BUYERCONFIRMEDPAYMENTSENT
    | BUYERSENTPAYMENTSENTMSG
    | BUYERSENDFAILEDPAYMENTSENTMSG
    | BUYERSTOREDINMAILBOXPAYMENTSENTMSG
    | BUYERSAWARRIVEDPAYMENTSENTMSG
    | SELLERRECEIVEDPAYMENTSENTMSG
    | SELLERCONFIRMEDPAYMENTRECEIPT
    | SELLERSENTPAYMENTRECEIVEDMSG
    | SELLERSENDFAILEDPAYMENTRECEIVEDMSG
    | SELLERSTOREDINMAILBOXPAYMENTRECEIVEDMSG
    | SELLERSAWARRIVEDPAYMENTRECEIVEDMSG
    | StateUnrecognized_ Int
