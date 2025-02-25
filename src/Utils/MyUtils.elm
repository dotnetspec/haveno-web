module Utils.MyUtils exposing
    ( convertListOfMaybeToList
    , gotGrpcErr
    , gotHttpErr
    , infoBtn
    , removeNothingFromList
    , stringFromBool
    , stringFromMaybeString
    )

import Grpc
import Html exposing (Html, button, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Http
import Proto.Io.Haveno.Protobuffer as Protobuf exposing (GetBalancesReply)
import Protobuf.Decode
import Protobuf.Types.Int64 exposing (toInts)


removeNothingFromList : List (Maybe a) -> List a
removeNothingFromList list =
    List.filterMap identity list


convertListOfMaybeToList : List (Maybe a) -> List a
convertListOfMaybeToList hasAnything =
    let
        onlyHasRealValues =
            List.filterMap (\x -> x) hasAnything
    in
    onlyHasRealValues


stringFromBool : Bool -> String
stringFromBool bool =
    if
        bool
            == True
    then
        "True"

    else
        "False"


stringFromMaybeString : Maybe String -> String
stringFromMaybeString str =
    case str of
        Nothing ->
            "Not a string"

        Just a ->
            a



-- internal


gotHttpErr : Http.Error -> String
gotHttpErr httperr =
    case httperr of
        Http.BadUrl s ->
            "Bad" ++ s

        Http.Timeout ->
            "Timeout"

        Http.NetworkError ->
            "Network Err"

        Http.BadStatus statuscode ->
            String.fromInt <| statuscode

        Http.BadBody s ->
            "BadBody " ++ s


gotGrpcErr : Grpc.Error -> String
gotGrpcErr grpcErr =
    case grpcErr of
        Grpc.BadUrl s ->
            "Bad url" ++ s

        Grpc.Timeout ->
            "Timeout"

        Grpc.NetworkError ->
            "Network Err"

        Grpc.BadStatus statuscode ->
            let
                metadataStr =
                    "metadata: "

                --++
                --Http.Metadata.statusText statuscode.metadata
                responseStr =
                    {- Bytes.Encode.encode statuscode.response
                       |> Base64.encode
                    -}
                    "response"

                errMessageStr =
                    statuscode.errMessage

                statusStr =
                    --Grpc.GrpcStatus.toString statuscode.status
                    "status"
            in
            "Metadata: "
                ++ metadataStr
                ++ "\n"
                ++ "Response: "
                ++ responseStr
                ++ "\n"
                ++ "Error Message: "
                ++ errMessageStr
                ++ "\n"
                ++ "Status: "
                ++ statusStr

        Grpc.BadBody balReply ->
            "gRPC BadBody "
                ++ (case Protobuf.Decode.decode Protobuf.decodeGetBalancesReply balReply of
                        Just decoded ->
                            toStringGetBalancesReply decoded

                        Nothing ->
                            "unknown"
                   )

        Grpc.UnknownGrpcStatus _ ->
            "UnknownGrpcStatus"


toStringGetBalancesReply : GetBalancesReply -> String
toStringGetBalancesReply reply =
    let
        -- Replace these fields with the actual fields in your GetBalancesReply type
        balInformation =
            Maybe.withDefault Protobuf.defaultBalancesInfo reply.balances

        gotXmr =
            Maybe.withDefault Protobuf.defaultXmrBalanceInfo balInformation.xmr

        ( available1, avail2 ) =
            toInts gotXmr.availableBalance

        ( pend1, pend2 ) =
            toInts gotXmr.pendingBalance

        ( res1, res2 ) =
            toInts gotXmr.reservedOfferBalance
    in
    -- Replace these fields with the actual fields in your GetBalancesReply type
    "BalancesReply { "
        ++ "available = "
        ++ String.fromInt available1
        ++ ", "
        ++ "pending = "
        ++ String.fromInt pend1
        ++ ", "
        ++ "reserved = "
        ++ String.fromInt res1
        ++ " }"


infoBtn : String -> msg -> Html msg
infoBtn label msg =
    button [ class "info-button", onClick msg ] [ text label ]
