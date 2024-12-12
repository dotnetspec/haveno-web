module Proto.Tests.Test_GetBalances exposing (..)

import Bytes exposing (Bytes)
import Expect
import Extras.TestData exposing (getBalanceEncodedResponse, successfulWalletWithBalancesFetch)
import Fuzz exposing (Fuzzer)
import Parser exposing (run)
import Proto.Io.Haveno.Protobuffer as Protobuf exposing (GetBalancesReply, decodeGetBalancesReply, encodeGetBalancesReply)
import Protobuf.Decode as Decode
import Protobuf.Encode as Encode
import Protobuf.Types.Int64 as Int64 exposing (Int64, fromInts)
import Test exposing (..)


testEncodeGetBalancesReply : Test
testEncodeGetBalancesReply =
    test "Protobuf.encodeGetBalancesReply returns a valid GetBalancesReply" <|
        \() ->
            let
                -- Decode the bytes back to GetBalancesReply
                decodedResponse : Maybe Protobuf.GetBalancesReply
                decodedResponse =
                    Decode.decode Protobuf.decodeGetBalancesReply getBalanceEncodedResponse
            in
            case decodedResponse of
                Just decoded ->
                    Expect.equal (gotXmrBalance decoded) (Just "10000")

                Nothing ->
                    Expect.fail "Decoding GetBalances failed with error: "



-- NAV: Helper functions


gotXmrBalance : Protobuf.GetBalancesReply -> Maybe String
gotXmrBalance reply =
    case reply.balances of
        Just balances ->
            case balances.xmr of
                Just xmr ->
                    let
                        ( firstInt, secondInt ) =
                            Int64.toInts xmr.balance
                    in
                    Just (String.fromInt <| firstInt)

                Nothing ->
                    Nothing

        Nothing ->
            Nothing
