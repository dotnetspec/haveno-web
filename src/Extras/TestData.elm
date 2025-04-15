module Extras.TestData exposing
    ( decryptCryptoAccountsMsgRequest
    , decryptCryptoAccountsMsgResponse
    , elmReadyMsgRequest
    , encodeGrpcMessage
    , getBalancesEncodedResponse
    , getSubAddressesEncodedResponse
    , getVersionBaseURL
    , placeholderUrl
    , primaryAddress
    , subAddress
    , successfullBalancesFetch
    , successfullSubAddressFetch
    , successfullVersionFetch
    , successfullXmrPrimaryAddressFetch
    , testBalanceInfo
    , toBytes
    , unSuccessfullXmrPrimaryAddressFetch
    , unsuccessfullBalancesFetch
    , unsuccessfullVersionFetch
    , walletsBaseUrl
    )

import Base64
import Bytes exposing (Bytes, Endianness(..))
import Bytes.Encode as BytesEncode
import Proto.Io.Haveno.Protobuffer as Protobuf exposing (BalancesInfo, BtcBalanceInfo, GetBalancesReply, XmrBalanceInfo, encodeGetBalancesReply)
import Protobuf.Encode as Encode
import Protobuf.Types.Int64 exposing (fromInts)
import Spec.Http.Route as Route
import Spec.Http.Stub as Stub
import Url exposing (Protocol(..), Url)


primaryAddress : String
primaryAddress =
    "9yLbftcD2cMDA5poVPBJQ5KuwADFRXhe28AtqfeTExaubeMAyiEGBYJ8a8T3kwzoqi6ZuScziHxKqBCToa2m3wuZScc2gJh"


subAddress : String
subAddress =
    "BceiPLaX7YDevCfKvgXFq8Tk1BGkQvtfAWCWJGgZfb6kBju1rDUCPzfDbHmffHMC5AZ6TxbgVVkyDFAnD2AVzLNp37DFz32"


decryptCryptoAccountsMsgRequest : String
decryptCryptoAccountsMsgRequest =
    "{\"typeOfMsg\":\"decryptCryptoAccountsMsgRequest\",\"currency\":\"BTC\",\"page\":\"AccountsPage\"}"


decryptCryptoAccountsMsgResponse : String
decryptCryptoAccountsMsgResponse =
    "{\"typeOfMsg\":\"decryptedCryptoAccountsResponse\",\"page\":\"AccountsPage\",\"accountsData\":\"['1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v'\",'2GK6XMLmzFVj8ALj6mfBsbifRoD4miY52o'],\"currency\":\"BTC\"}"


elmReadyMsgRequest : String
elmReadyMsgRequest =
    "{\"typeOfMsg\":\"ElmReady\",\"currency\":\"\",\"accountsData\":\"\"}"


getVersionBaseURL : String
getVersionBaseURL =
    "http://localhost:8080/io.haveno.protobuffer.GetVersion/"


walletsBaseUrl : String
walletsBaseUrl =
    "http://localhost:8080/io.haveno.protobuffer.Wallets/"


placeholderUrl : Url
placeholderUrl =
    Url Http "localhost" (Just 1234) "/" Nothing Nothing


testBalanceInfo : Maybe Protobuf.BalancesInfo
testBalanceInfo =
    Just
        { btc =
            Just
                { availableBalance = fromInts 10000 0
                , lockedBalance = fromInts 10000 0
                , reservedBalance = fromInts 10000 0
                , totalAvailableBalance = fromInts 10000 0
                }
        , xmr =
            Just
                { balance = fromInts 10000 0
                , availableBalance = fromInts 10000 0
                , pendingBalance = fromInts 2000 0
                , reservedOfferBalance = fromInts 5000 0
                , reservedTradeBalance = fromInts 3000 0
                }
        }


toBytes : String -> Maybe Bytes
toBytes string =
    Maybe.map BytesEncode.encode (Base64.encoder string)



-- NOTE: This stub causes an error in the test runner, but the test still passes
-- REF: https://github.com/brian-watkins/elm-spec/issues/75
-- NAV: Response Stubs


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
    Stub.for (Route.post <| getVersionBaseURL ++ "GetVersion")
        |> Stub.withHeader ( "Content-Type", "application/grpc-web+proto" )
        |> Stub.withBody (Stub.withBytes decodedBytes)


unsuccessfullVersionFetch : Stub.HttpResponseStub
unsuccessfullVersionFetch =
    Stub.for (Route.post <| getVersionBaseURL ++ "GetVersion")
        |> Stub.withHeader ( "Content-Type", "application/grpc-web+proto" )
        |> Stub.withBody (Stub.withBytes <| BytesEncode.encode (BytesEncode.unsignedInt8 0))


successfullBalancesFetch : Stub.HttpResponseStub
successfullBalancesFetch =
    Stub.for (Route.post <| walletsBaseUrl ++ "GetBalances")
        |> Stub.withHeader ( "Content-Type", "application/grpc-web+proto" )
        |> Stub.withBody (Stub.withBytes <| encodeGrpcMessage getBalancesEncodedResponse)


unsuccessfullBalancesFetch : Stub.HttpResponseStub
unsuccessfullBalancesFetch =
    Stub.for (Route.post <| walletsBaseUrl ++ "GetBalances")
        |> Stub.withHeader ( "Content-Type", "application/grpc-web+proto" )
        |> Stub.withBody (Stub.withBytes <| BytesEncode.encode (BytesEncode.unsignedInt8 0))


successfullXmrPrimaryAddressFetch : Stub.HttpResponseStub
successfullXmrPrimaryAddressFetch =
    let
        base64Response =
            "AAAAAGEKXzl5TGJmdGNEMmNNREE1cG9WUEJKUTVLdXdBREZSWGhlMjhBdHFmZVRFeGF1YmVNQXlpRUdCWUo4YThUM2t3em9xaTZadVNjemlIeEtxQkNUb2EybTN3dVpTY2MyZ0pogAAAAA9ncnBjLXN0YXR1czowDQo"

        decodedBytes =
            case toBytes base64Response of
                Just bytes ->
                    bytes

                Nothing ->
                    BytesEncode.encode (BytesEncode.unsignedInt8 0)
    in
    Stub.for (Route.post <| walletsBaseUrl ++ "GetXmrPrimaryAddress")
        |> Stub.withHeader ( "Content-Type", "application/grpc-web+proto" )
        |> Stub.withBody (Stub.withBytes decodedBytes)


unSuccessfullXmrPrimaryAddressFetch : Stub.HttpResponseStub
unSuccessfullXmrPrimaryAddressFetch =
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
    Stub.for (Route.post <| walletsBaseUrl ++ "GetXmrPrimaryAddress")
        |> Stub.withHeader ( "Content-Type", "application/grpc-web+proto" )
        |> Stub.withBody (Stub.withBytes decodedBytes)


successfullSubAddressFetch : Stub.HttpResponseStub
successfullSubAddressFetch =
    Stub.for (Route.post <| walletsBaseUrl ++ "GetSubAddresses")
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


getBalancesEncodedResponse : Bytes
getBalancesEncodedResponse =
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
            Encode.encode (encodeGetBalancesReply balancesReply)
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
