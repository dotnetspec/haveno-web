module Extras.TestData exposing (..)

import Base64
import Binary
import Bytes exposing (Bytes, Endianness(..))
import Bytes.Decode as DE
import Bytes.Encode as BytesEncode exposing (bytes)
import Char.Extra
import Extras.Constants as Consts exposing (..)
import Hex.Convert as HexConvert exposing (..)
import Json.Encode as E
import List.Split exposing (chunksOfLeft)
import Proto.Io.Haveno.Protobuffer as Protobuf exposing (BalancesInfo, BtcBalanceInfo, GetBalancesReply, GetBalancesRequest, XmrBalanceInfo, encodeGetBalancesReply, encodeGetBalancesRequest)
import Protobuf.Encode as Encode
import Protobuf.Types.Int64 exposing (Int64, fromInts)
import Spec.Http.Route as Route exposing (HttpRoute)
import Spec.Http.Stub as Stub
import Time exposing (Posix, millisToPosix, utc)
import Url exposing (Protocol(..), Url)

primaryAddress : String
primaryAddress =
    "BceiPLaX7YDevCfKvgXFq8Tk1BGkQvtfAWCWJGgZfb6kBju1rDUCPzfDbHmffHMC5AZ6TxbgVVkyDFAnD2AVzLNp37DFz32"

subAddress : String
subAddress =
    "BceiPLaX7YDevCfKvgXFq8Tk1BGkQvtfAWCWJGgZfb6kBju1rDUCPzfDbHmffHMC5AZ6TxbgVVkyDFAnD2AVzLNp37DFz32"

grpcsetGetVersionURL : String
grpcsetGetVersionURL =
    "http://localhost:8080/io.haveno.protobuffer.GetVersion/GetVersion"


grpcsetGetBalancesURL : String
grpcsetGetBalancesURL =
    "http://localhost:8080/io.haveno.protobuffer.Wallets/GetBalances"


protoBufferWalletBaseUrl : String
protoBufferWalletBaseUrl =
    "http://localhost:8080/io.haveno.protobuffer.Wallets/"


placeholderUrl : Url
placeholderUrl =
    Url Http "localhost" (Just 1234) "/" Nothing Nothing



toBytes : String -> Maybe Bytes
toBytes string =
    Maybe.map BytesEncode.encode (Base64.encoder string)



-- NOTE: This stub causes an error in the test runner, but the test still passes
-- REF: https://github.com/brian-watkins/elm-spec/issues/75


successfullVersionFetch : Stub.HttpResponseStub
successfullVersionFetch =
    let
        
        base64Response =
            "AAAAAAcKBTEuMC43gAAAAA9ncnBjLXN0YXR1czowDQo="

        decodedBytes =
            case toBytes base64Response of
                Just bytes ->
                    bytes

                Nothing ->
                    BytesEncode.encode (BytesEncode.unsignedInt8 0)
    in
    Stub.for (Route.post grpcsetGetVersionURL)
        |> Stub.withHeader ( "Content-Type", "application/grpc-web+proto" )
        |> Stub.withBody (Stub.withBytes decodedBytes)


unsuccessfullVersionFetch : Stub.HttpResponseStub
unsuccessfullVersionFetch =
    let
        base64Response =
            ""

        decodedBytes =
            case toBytes base64Response of
                Just bytes ->
                    bytes

                Nothing ->
                    BytesEncode.encode (BytesEncode.unsignedInt8 0)
    in
    Stub.for (Route.post grpcsetGetVersionURL)
        |> Stub.withHeader ( "Content-Type", "application/grpc-web+proto" )
        |> Stub.withBody (Stub.withBytes <| BytesEncode.encode (BytesEncode.unsignedInt8 0))


pipelineAsJsonString : String
pipelineAsJsonString =
    """[{"$match":{"_id":{"$oid":"651fa006b15a534c69b119ef"}}},{"$lookup":{"from":"rankings","localField":"ownerOf","foreignField":"_id","as":"ownedRankings"}},{"$lookup":{"from":"rankings","localField":"memberOf","foreignField":"_id","as":"memberRankings"}},{"$lookup":{"from":"users","localField":"memberRankings.owner_id","foreignField":"_id","as":"memberRankingsWithOwnerName"}},{"$project":{"_id":{"$numberInt":"1"},"userid":{"$numberInt":"1"},"nickname":{"$numberInt":"1"},"active":{"$numberInt":"1"},"description":{"$numberInt":"1"},"datestamp":{"$numberInt":"1"},"token":{"$numberInt":"1"},"updatetext":{"$numberInt":"1"},"mobile":{"$numberInt":"1"},"credits":{"$numberInt":"1"},"ownedRankings":{"_id":{"$numberInt":"1"},"active":{"$numberInt":"1"},"owner_id":{"$numberInt":"1"},"baseaddress":{"$numberInt":"1"},"ranking":{"$numberInt":"1"},"player_count":{"$numberInt":"1"},"name":{"$numberInt":"1"},"owner_name":"$nickname"},"memberRankings":{"_id":{"$numberInt":"1"},"name":{"$numberInt":"1"},"active":{"$numberInt":"1"},"owner_id":{"$numberInt":"1"},"baseaddress":{"$numberInt":"1"},"ranking":{"$numberInt":"1"},"player_count":{"$numberInt":"1"},"owner_name":{"$arrayElemAt":["$memberRankingsWithOwnerName.nickname",{"$numberInt":"0"}]}},"owner_ranking_count":{"$size":"$ownedRankings"},"member_ranking_count":{"$size":"$memberRankings"},"addInfo":{"$numberInt":"1"},"gender":{"$numberInt":"1"},"age":{"$numberInt":"1"}}}]}]"""



-- NAV: LNS tests


successfulLnsResponseStub : Stub.HttpResponseStub
successfulLnsResponseStub =
    let
        jsonResponse =
            E.object
                [ ( "context", E.object [ ( "function", E.string "send" ) ] )
                , ( "date", E.string "Tue Aug 27 2024 12:56:47 GMT+0800 (Singapore Standard Time)" )
                , ( "id", E.string "5" )
                , ( "message", E.string "Received response from exchange" )
                , ( "type", E.string "transport" )
                ]
    in
    Stub.for (Route.post "http://localhost:1234/hardware")
        |> Stub.withHeader ( "Content-Type", "application/json" )
        |> Stub.withBody (Stub.withJson jsonResponse)


successfulWalletWithBalancesFetch : Stub.HttpResponseStub
successfulWalletWithBalancesFetch =
    Stub.for (Route.post grpcsetGetBalancesURL)
        |> Stub.withHeader ( "Content-Type", "application/grpc-web+proto" )
        |> Stub.withBody (Stub.withBytes <| encodeGrpcMessage getBalanceEncodedResponse)


successfullXmrPrimaryAddressFetch : Stub.HttpResponseStub
successfullXmrPrimaryAddressFetch =
    Stub.for (Route.post <| protoBufferWalletBaseUrl ++ "GetXmrPrimaryAddress")
        |> Stub.withHeader ( "Content-Type", "application/grpc-web+proto" )
        |> Stub.withBody (Stub.withBytes <| encodeGrpcMessage getXmrPrimaryAddressEncodedResponse)

successfullSubAddressFetch : Stub.HttpResponseStub
successfullSubAddressFetch =
    Stub.for (Route.post <| protoBufferWalletBaseUrl ++ "GetSubAddresses")
        |> Stub.withHeader ( "Content-Type", "application/grpc-web+proto" )
        |> Stub.withBody (Stub.withBytes <| encodeGrpcMessage getSubAddressesEncodedResponse)



-- NOTE: gRPC messages require custom config that is defined in encodeGrpcMessage


encodeGrpcMessage : Bytes -> Bytes
encodeGrpcMessage payload =
    BytesEncode.encode <|
        BytesEncode.sequence
            [ BytesEncode.unsignedInt8 0 -- Compression flag (0 = uncompressed)
            , BytesEncode.unsignedInt32 BE (Bytes.width payload) -- Payload length
            , BytesEncode.bytes payload -- Actual Protobuf message
            ]



-- NAV: Helper functions


getBalanceEncodedResponse : Bytes
getBalanceEncodedResponse =
    let
        -- Create a XmrBalanceInfo message with the desired balances
        xmrBalanceInfo : Protobuf.XmrBalanceInfo
        xmrBalanceInfo =
            { balance = fromInts 10000 0 -- Example balance in atomic units (e.g., piconero)
            , availableBalance = fromInts 10000 0 -- Example available balance in atomic units
            , pendingBalance = fromInts 2000 0 -- Example pending balance in atomic units
            , reservedOfferBalance = fromInts 5000 0 -- Example reserved offer balance in atomic units
            , reservedTradeBalance = fromInts 3000 0 -- Example reserved trade balance in atomic units
            }

        -- Create a BtcBalanceInfo message with the desired balances
        btcBalanceInfo : Protobuf.BtcBalanceInfo
        btcBalanceInfo =
            { availableBalance = fromInts 10000 0 -- Example available balance in satoshis
            , reservedBalance = fromInts 10000 0 -- Example reserved balance in satoshis
            , totalAvailableBalance = fromInts 10000 0 -- Example total available balance in satoshis
            , lockedBalance = fromInts 10000 0 -- Example locked balance in satoshis
            }

        -- Create a BalancesInfo message with the BTC and XMR balances
        balancesInfo : Protobuf.BalancesInfo
        balancesInfo =
            { btc = Just btcBalanceInfo
            , xmr = Just xmrBalanceInfo
            }

        -- Create a GetBalancesReply message with the BalancesInfo
        balancesReply : Protobuf.GetBalancesReply
        balancesReply =
            { balances = Just balancesInfo }

        -- Encode the GetBalancesReply message to bytes
        encodedResponse : Bytes
        encodedResponse =
            Encode.encode (Protobuf.encodeGetBalancesReply balancesReply)
    in
    encodedResponse

getXmrPrimaryAddressEncodedResponse : Bytes
getXmrPrimaryAddressEncodedResponse =
    let
        
        primAddrReply : Protobuf.GetXmrPrimaryAddressReply
        primAddrReply =
        -- HACK: This is a placeholder address
        -- NOTE: Used compiler messages to determine the structure of this message
            { primaryAddress = primaryAddress }

        -- Encode to bytes
        encodedResponse : Bytes
        encodedResponse =
            Encode.encode (Protobuf.encodeGetXmrPrimaryAddressReply primAddrReply)
    in
    encodedResponse


getSubAddressesEncodedResponse : Bytes
getSubAddressesEncodedResponse =
    let
        
        subAddrReply : Protobuf.GetXmrNewSubaddressReply
        subAddrReply =
            { subaddress = subAddress }

        -- Encode the GetBalancesReply message to bytes
        encodedResponse : Bytes
        encodedResponse =
            Encode.encode (Protobuf.encodeGetXmrNewSubaddressReply subAddrReply)
    in
    encodedResponse


