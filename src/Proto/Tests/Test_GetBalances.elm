module Proto.Tests.Test_GetBalances exposing (gotXmrBalance, testEncodeGetBalancesReply)

import Expect
import Extras.TestData exposing (getBalancesEncodedResponse)
import Proto.Io.Haveno.Protobuffer as Protobuf
import Protobuf.Decode as Decode
import Protobuf.Types.Int64 as Int64
import Test exposing (..)


testEncodeGetBalancesReply : Test
testEncodeGetBalancesReply =
    test "Protobuf.encodeGetBalancesReply returns a valid GetBalancesReply" <|
        \() ->
            let
                -- Decode the bytes back to GetBalancesReply
                decodedResponse : Maybe Protobuf.GetBalancesReply
                decodedResponse =
                    Decode.decode Protobuf.decodeGetBalancesReply getBalancesEncodedResponse
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
