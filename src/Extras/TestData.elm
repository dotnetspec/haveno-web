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
        {- rawResponse = """B,ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ ÿÿÿÿÿÿÿÿÿæÝœýÝ¯·æÝœýÝ¯·""" -}
        -- Empty byte array
        {- base64Response =
           "AAAAAAcKBTEuMC43gAAAAA9ncnBjLXN0YXR1czowDQo="
        -}
        {- base64Response =
           "CkIKLAj//////////wEQ//////////wEY//////////wEg//////////wESEgjm3b39na+3AxDm3b39na+3Aw=="
        -}
        framedhexString =
            "00000000440A420A2C08FFFFFFFFFFFFFFFFFF0110FFFFFFFFFFFFFFFFFF0118FFFFFFFFFFFFFFFF0120FFFFFFFFFFFFFFFFFF01121208E6DDBDFD0DAF870310E6DDBDFD0DAFB703800000000F627270632D7374617475733A300D0A"

        -- Example usage
        rawBinaryStr : String
        rawBinaryStr =
            "0000000000000000000000000000000001000100000010100100001000001010001011000000100011111111111111111111111111111111111111111111111111111111111111111111111100000001000100001111111111111111111111111111111111111111111111111111111111111111111111110000000100011000111111111111111111111111111111111111111111111111111111111111111100000001001000001111111111111111111111111111111111111111111111111111111111111111111111110000000100010010000100100000100011100110110111011011110111111101000011011010111110000111000000110001000011100110110111011011110111111101000011011010111110110111000000111000000000000000000000000000000000001111011000100111001001110000011000110010110101110011011101000110000101110100011101010111001100111010001100000000110100001010"

        decimalsStr : String
        decimalsStr =
            "22368750995702150194708847055706628425502398838255408524937276416173507149753223177307545093094071475799463099366428816893612037682674315721718773476853921802227063806186937122635792313252836277313589366112652554"

        --hexStr = "440A420A2C08FFFFFFFFFFFFFFFFFF0110FFFFFFFFFFFFFFFFFF0118FFFFFFFFFFFFFFFF0120FFFFFFFFFFFFFFFFFF01121208E6DDBDFD0DAF870310E6DDBDFD0DAFB703800000000F627270632D7374617475733A300D0A"
        {- decimalList : List Int
           decimalList =
               [ 2, 2, 3, 6, 8, 7, 5, 0, 9, 9, 5, 7, 0, 2, 1, 5, 0, 1, 9, 4, 7, 0, 8, 8, 4, 7, 0, 5, 5, 7, 0, 6, 6, 2, 8, 4, 2, 5, 5, 0, 2, 3, 9, 8, 8, 3, 8, 2, 5, 5, 4, 0, 8, 5, 2, 4, 9, 3, 7, 2, 7, 6, 4, 1, 6, 1, 7, 3, 5, 0, 7, 1, 4, 9, 7, 5, 3, 2, 2, 3, 1, 7, 7, 3, 0, 7, 5, 4, 5, 0, 9, 3, 0, 9, 4, 0, 7, 1, 4, 7, 5, 7, 9, 9, 4, 6, 3, 0, 9, 9, 3, 6, 6, 4, 2, 8, 8, 1, 6, 8, 9, 3, 6, 1, 2, 0, 3, 7, 6, 8, 2, 6, 7, 4, 3, 1, 5, 7, 2, 1, 7, 1, 8, 7, 7, 3, 4, 7, 6, 8, 5, 3, 9, 2, 1, 8, 0, 2, 2, 2, 7, 0, 6, 3, 8, 0, 6, 1, 8, 6, 9, 3, 7, 1, 2, 2, 6, 3, 5, 7, 9, 2, 3, 1, 3, 2, 5, 2, 8, 3, 6, 2, 7, 7, 3, 1, 3, 5, 8, 9, 3, 6, 6, 1, 1, 2, 6, 5, 2, 5, 5, 4 ]
        -}
        --hexString : String
        hexString =
            "12380A1008A0860110A80318B0860120A001122208D0FA8284880110989A828488011880A48284880120002800"

        framedHexString : String
        framedHexString =
            "000000003812380A1008A0860110A80318B0860120A001122208D0FA8284880110989A828488011880A48284880120002800"

        -- Your list of byte values (represented as integers)
        byteDataList : List Int
        byteDataList =
            [ 0x8a, 0x9a, 0xc0, 0xd1, 0xb3, 0xae, 0x9d, 0xba, 0xe1, 0xe8, 0xcd, 0xeb, 0xb2, 0x8c, 0x9c, 0xb9, 
            0xe2, 0x9e, 0x80, 0x80, 0x80, 0x80, 0xe0, 0x81, 0xb7, 0xdf, 0xb6, 0xe8, 0xdf, 0xb7, 0xb7, 0xf3, 
            0x90, 0x86, 0x9c, 0xfc, 0xda, 0xa1, 0xff, 0xde, 0xdd, 0xcd, 0xa3, 0x90, 0xa1, 0xa2, 0xc0, 0xff, 
            0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xc1, 0x84, 0xf8, 0xff, 0xff, 0xff, 0xff, 
            0xff, 0xff, 0xff, 0xff, 0x8f, 0xa3, 0xc0, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 
            0xa1, 0x84, 0xf8, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x9f, 0x82, 0x96, 0x8a, 
            0x84, 0xa9, 0xa0, 0x04 ]

        -- Convert the list of byte values into the `Bytes` type using `Bytes.Encode`
        byteData : Bytes
        byteData =
            BytesEncode.encode (BytesEncode.sequence (List.map BytesEncode.unsignedInt8 byteDataList))  -- Encode the List Int as a Bytes
    in
    Stub.for (Route.post grpcsetGetBalancesURL)
        |> Stub.withHeader ( "Content-Type", "application/grpc-web+proto" )
        |> Stub.withBody (Stub.withBytes <| encodeGrpcMessage getBalanceEncodedResponse) --
        --|> Stub.withBody (Stub.withBytes (Maybe.withDefault (BE.encode (BE.sequence [])) <| HexConvert.toBytes hexString))
        {- |> Stub.withBody
            (Stub.withBytes
                (byteData
                )
            ) -}

            --BytesEncode

encodeGrpcMessage : Bytes -> Bytes
encodeGrpcMessage payload =
    BytesEncode.encode <|
        BytesEncode.sequence
            [ BytesEncode.unsignedInt8 0 -- Compression flag (0 = uncompressed)
            , BytesEncode.unsignedInt32 BE (Bytes.width payload) -- Payload length
            , BytesEncode.bytes payload -- Actual Protobuf message
            ]

--encodedResponse
-- NAV: Helper functions


sizedString : DE.Decoder String
sizedString =
    DE.unsignedInt32 BE
        |> DE.andThen DE.string


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



{- decimalsToBytes : List String -> Maybe Bytes
   decimalsToBytes decimals =
       let
           -- Convert the decimal string into a large integer
           bigInt =
               String.concat decimals
                   |> String.toInt

           -- Convert the large integer into a list of bytes
           toByteList n =
               if n == 0 then
                   []
               else
                   toByteList (n // 256) ++ [ modBy 256 n ]
       in
       case bigInt of
           Nothing ->
               -- Return Nothing if the input is not a valid integer
               Nothing

           Just n ->
               -- Convert the list of integers to Bytes
               Just (toByteList n
                   |> List.map BE.unsignedInt8
                   |> BE.sequence
                   |> BE.encode)


   hexToBytes : String -> Bytes
   hexToBytes hexString =
       let
           cleanHex =
               String.filter (\c -> not (Char.Extra.isSpace c)) hexString

           toByte hex =
               Maybe.withDefault 0 (String.toInt ("0x" ++ hex))

           hexPairs =
               String.toList cleanHex
                   |> chunksOfLeft 2
                   |> List.map String.fromList

           byteList =
               List.map toByte hexPairs
       in
       BE.encode (BE.sequence (List.map BE.unsignedInt8 byteList))
-}
