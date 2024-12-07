module Extras.TestData exposing (..)

import Base64
import Bytes exposing (Bytes)
import Bytes.Decode as DE
import Bytes.Encode as BE
import Extras.Constants as Consts exposing (..)
import Json.Encode as E
import Pages.Hardware as Hardware exposing (..)
import Proto.Io.Haveno.Protobuffer as Protobuf exposing (BalancesInfo, BtcBalanceInfo, GetBalancesReply, GetBalancesRequest, XmrBalanceInfo, encodeGetBalancesReply, encodeGetBalancesRequest)
import Protobuf.Encode as Encode
import Protobuf.Types.Int64 exposing (Int64, fromInts)
import Spec.Http.Route as Route exposing (HttpRoute)
import Spec.Http.Stub as Stub
import Time exposing (Posix, millisToPosix, utc)
import Url exposing (Protocol(..), Url)


grpcsetGetVersionURL : String
grpcsetGetVersionURL =
    "http://localhost:8080/io.haveno.protobuffer.GetVersion/GetVersion"


grpcsetGetBalancesURL : String
grpcsetGetBalancesURL =
    "http://localhost:8080/io.haveno.protobuffer.Wallets/GetBalances"


availabilityRequestURL27_Feb_2024_14_09 : String
availabilityRequestURL27_Feb_2024_14_09 =
    "http://localhost:3000/proxy?apiUrl=https://www.zohoapis.com/bookings/v1/json/availableslots&query_type=bookingsAvailability&service_id=4503471000000091024&staff_id=4503471000000033016&selected_date=27-Feb-2024 14:09"


failedMongodbLoginStub : Stub.HttpResponseStub
failedMongodbLoginStub =
    Stub.for (Route.post loginRequestURL)
        |> Stub.withStatus 401


loginRequestURL : String
loginRequestURL =
    "https://ap-southeast-1.aws.realm.mongodb.com/api/client/v2.0/app/sr-espa1-snonq/auth/providers/local-userpass/login"


loginRequestLocationURL : String
loginRequestLocationURL =
    "https://realm.mongodb.com/api/client/v2.0/app/sr-espa1-snonq/location"


loginRequestProfileURL : String
loginRequestProfileURL =
    "https://ap-southeast-1.aws.realm.mongodb.com/api/client/v2.0/auth/profile"


loginRequestCallURL : String
loginRequestCallURL =
    "https://ap-southeast-1.aws.realm.mongodb.com/api/client/v2.0/app/sr-espa1-snonq/functions/call"


placeholderUrl : Url
placeholderUrl =
    Url Http "localhost" (Just 1234) "/" Nothing Nothing


rankingsUrl : Url
rankingsUrl =
    Url Http "localhost" (Just 5501) "/rankings" Nothing Nothing


toBytes : String -> Maybe Bytes
toBytes string =
    Maybe.map BE.encode (Base64.encoder string)



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
                    BE.encode (BE.unsignedInt8 0)
    in
    Stub.for (Route.post grpcsetGetVersionURL)
        |> Stub.withHeader ( "Content-Type", "application/grpc-web+proto" )
        |> Stub.withBody (Stub.withBytes decodedBytes)


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
    let
        -- Create a XmrBalanceInfo message with the desired balances
        xmrBalanceInfo : XmrBalanceInfo
        xmrBalanceInfo =
               { balance = fromInts 10000 0 -- Example balance in atomic units (e.g., piconero)
               , availableBalance = fromInts 10000 0 -- Example available balance in atomic units
               , pendingBalance = fromInts 2000 0 -- Example pending balance in atomic units
               , reservedOfferBalance = fromInts 5000 0 -- Example reserved offer balance in atomic units
               , reservedTradeBalance = fromInts 3000 0 -- Example reserved trade balance in atomic units
               }

        -- Create a BtcBalanceInfo message with the desired balances
        btcBalanceInfo : BtcBalanceInfo
        btcBalanceInfo =
            { availableBalance = fromInts 10000 0 -- Example available balance in satoshis
            , reservedBalance = fromInts 10000 0 -- Example reserved balance in satoshis
            , totalAvailableBalance = fromInts 10000 0 -- Example total available balance in satoshis
            , lockedBalance = fromInts 10000 0 -- Example locked balance in satoshis
            }

        -- Create a BalancesInfo message with the BTC and XMR balances
        balancesInfo : BalancesInfo
        balancesInfo =
            { btc = Just btcBalanceInfo
            , xmr = Just xmrBalanceInfo
            }

        -- Create a GetBalancesReply message with the BalancesInfo
        balancesReply : GetBalancesReply
        balancesReply =
            { balances = Just balancesInfo }
    
    -- Encode the GetBalancesReply message to bytes
        encodedResponse : Bytes
        encodedResponse =
            Encode.encode (Protobuf.encodeGetBalancesReply balancesReply)
       
        {- rawResponse = """B,ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ ÿÿÿÿÿÿÿÿÿæÝœýÝ¯·æÝœýÝ¯·"""

           respon2 = "B,��������������������������� ����������ݽ�ݯ��ݽ�ݯ�"
           bytesAsString =
                   Encode.string respon2
                       |> Encode.encode
                       |> Base64.fromBytes

           stringAsBytes = case Base64.toBytes respon2 of
               Nothing ->
                   (BE.encode (BE.string (Maybe.withDefault "" bytesAsString)))
               Just bytes ->
                   --DE.decode (DE.string (Bytes.width bytes)) bytes
                   bytes
        -}
        --"00001010 01000010 00001010 00101100 00001000 11111111 11111111 11111111 11111111 11111111 11111111 11111111 11111111 11111111 00000001 00010000 11111111 11111111 11111111 11111111 11111111 11111111 11111111 11111111 11111111 00000001 00011000 11111111 11111111 11111111 11111111 11111111 11111111 11111111 11111111 11111111 00000001 00100000 11111111 11111111 11111111 11111111 11111111 11111111 11111111 11111111 11111111 00000001 00010010 00010010 00001000 11100110 11011101 10111101 11111101 11011101 10101111 10110111 00000011 00010000 11100110 11011101 10111101 11111101 11011101 10101111 10110111 00000011"
        -- Decode base64 string to bytes
        -- Base64 encoded response
        {- binaryResponse : String
        binaryResponse =
            "CkIKLAj//////////wEQ//////////wEY//////////wEg//////////wESEgjm3b39na+3AxDm3b39na+3Aw=="

        


        decodeBinaryResponse : Result String Bytes
        decodeBinaryResponse =
            case Maybe.map BE.encode (Base64.encoder  binaryResponse) of
                Just decoded ->
                    Ok decoded
                Nothing ->
                    Err "Failed to decode base64 string"


                -- Decode base64 string to bytes
        decodedBytes : Bytes
        decodedBytes =
            case DE.string binaryResponse of
                Ok decoded ->
                    decoded

                Err _ ->
                    ""

        -- Decode Protobuf message using decodeGetBalancesReply
        decodedResponse : Maybe Protobuf.GetBalancesReply
        decodedResponse =
            case decodedBytes of
                Just bytes ->
                    DE.decode Protobuf.decodeGetBalancesReply bytes

                Nothing ->
                    Nothing

        -- Encode Protobuf message using encodeGetBalancesReply
        encodedResponse : GetBalancesReply
        encodedResponse =
            case BE.encode (Protobuf.encodeGetBalancesReply (BE.string binaryResponse) of
                Just response ->
                    --Protobuf.encodeGetBalancesReply response
                    Protobuf.defaultGetBalancesReply

                Nothing ->
                    Protobuf.defaultGetBalancesReply -}

            

        -- Empty byte array

        base64Response =
            "AAAAAAcKBTEuMC43gAAAAA9ncnBjLXN0YXR1czowDQo="

        {- base64Response =
            "CkIKLAj//////////wEQ//////////wEY//////////wEg//////////wESEgjm3b39na+3AxDm3b39na+3Aw==" -}

        decodedBytes =
            case toBytes base64Response of
                Just bytes ->
                    bytes

                Nothing ->
                    BE.encode (BE.unsignedInt8 0)
    in
    Stub.for (Route.post "http://localhost:8080/io.haveno.protobuffer.Wallets/GetBalances")
        |> Stub.withHeader ( "Content-Type", "application/grpc-web+proto" )
        |> Stub.withBody (Stub.withBytes decodedBytes)
