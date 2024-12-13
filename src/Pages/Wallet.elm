module Pages.Wallet exposing (Model, Msg(..), Status(..), init, initialModel, update, view)

import Buttons.Default exposing (defaultButton)
import Debug exposing (log)
import Element exposing (Attribute, el, text)
import Element.Font as Font
import Element.Input as Input
import Element.Region as Region
import Framework
import Framework.Button as Button
import Framework.Card as Card
import Framework.Color as Color
import Framework.Grid as Grid
import Framework.Heading as Heading
import Framework.Input as Input
import Grpc exposing (..)
import Html exposing (Html, div, section, text)
import Html.Attributes as Attr exposing (class, id)
import Http exposing (..)
import Json.Encode as E exposing (..)
import Maybe exposing (withDefault)
import Proto.Io.Haveno.Protobuffer as Protobuf exposing (..)
import Proto.Io.Haveno.Protobuffer.Internals_
import Proto.Io.Haveno.Protobuffer.Wallets as Wallets
import Protobuf.Types.Int64 exposing (toInts)
import Spec.Markup exposing (log)
import Types.DateType as DateType exposing (DateTime(..))
import Url exposing (Protocol(..), Url)
import Utils.MyUtils as MyUtils


type alias Model =
    { status : Status
    , pagetitle : String
    , balances : Maybe Protobuf.BalancesInfo
    , address : String
    , errors : List String
    }


initialModel : Model
initialModel =
    { status = Loading
    , pagetitle = "Haveno Web Wallet"
    , balances = Just Protobuf.defaultBalancesInfo

    -- HACK: Hardcoding the address for now
    , address = ""
    , errors = []
    }


type Status
    = Loading
    | Loaded
    | Errored



-- NAV: Init


init : String -> ( Model, Cmd Msg )
init _ =
    -- HACK: Hardcoding the address for now
    ( initialModel
    , gotAvailableBalances
    )


type Msg
    = SetAddress String
    | GotBalances (Result Grpc.Error Protobuf.GetBalancesReply)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SetAddress address ->
            ( { model | address = address }, Cmd.none )

        GotBalances (Ok response) ->
            ( { model | balances = response.balances, status = Loaded }, Cmd.none )

        GotBalances (Err error) ->
            ( { model | status = Errored }, Cmd.none )



-- View: Render the Wallet page UI


view : Model -> Html Msg
view model =
    section
        [ Attr.id "page"
        , class "section-background"
        , class "text-center"
        ]
        [ div [ class "split" ]
            [ div
                [ class "split-col"
                ]
                []
            , case model.status of
                Loading ->
                    div
                        []
                        [ div
                            [ class "spinner"
                            ]
                            [ Html.text "Loading ..." ]
                        ]

                Errored ->
                    div [] [ Html.text "Error" ]

                Loaded ->
                    div
                        [ class "split-col"
                        , id "custodialWalletView"
                        ]
                        [ custodialWalletView model
                        ]
            , div
                [ class "split-col"
                ]
                []
            ]
        ]


custodialWalletView : Model -> Html Msg
custodialWalletView model =
    Html.div [ Attr.class "wallet-container" ]
        [ Html.h1 [ Attr.class "wallet-title" ] [ Html.text "Wallet" ]
        , Html.div [ Attr.id "currentaddress", Attr.class "address-text" ]
            [ Html.text ("Current address: " ++ model.address) ]
        , Html.div [ Attr.id "xmrbalance", Attr.class "balance-text" ]
            [ Html.text ("Available Balance: " ++ xmrBalanceAsString model.balances ++ " XMR") ]
        , Html.div [ Attr.id "btcbalance", Attr.class "balance-text" ]
            [ Html.text ("Available BTC Balance: " ++ btcBalanceAsString model.balances ++ " BTC") ]
        , Html.div [ Attr.id "reservedOfferBalance", Attr.class "balance-text" ]
            [ Html.text ("Reserved Offer Balance: " ++ reservedOfferBalanceAsString model.balances ++ " XMR") ]
        ]



xmrBalanceAsString : Maybe Protobuf.BalancesInfo -> String
xmrBalanceAsString balInfo =
    case balInfo of
        Just blInfo ->
            case blInfo.xmr of
                Nothing ->
                    "0.00"

                Just xmrbalinfo ->
                    let
                        ( firstInt, secondInt ) =
                            toInts xmrbalinfo.availableBalance
                    in
                    String.fromInt firstInt ++ "." ++ String.fromInt secondInt

        Nothing ->
            "0.00"


btcBalanceAsString : Maybe Protobuf.BalancesInfo -> String
btcBalanceAsString balInfo =
    case balInfo of
        Just blInfo ->
            case blInfo.btc of
                Nothing ->
                    "0.00"

                Just btcbalinfo ->
                    let
                        ( firstInt, secondInt ) =
                            toInts btcbalinfo.availableBalance
                    in
                    String.fromInt firstInt ++ "." ++ String.fromInt secondInt

        Nothing ->
            ""


reservedOfferBalanceAsString : Maybe Protobuf.BalancesInfo -> String
reservedOfferBalanceAsString balInfo =
    case balInfo of
        Just blInfo ->
            case blInfo.xmr of
                Nothing ->
                    "0.00"

                Just xmrbalinfo ->
                    let
                        ( firstInt, secondInt ) =
                            toInts xmrbalinfo.reservedOfferBalance
                    in
                    String.fromInt firstInt ++ "." ++ String.fromInt secondInt

        Nothing ->
            ""



-- NAV: gRPC calls


gotAvailableBalances : Cmd Msg
gotAvailableBalances =
    let
        grpcRequest =
            Grpc.new Wallets.getBalances Protobuf.defaultGetBalancesRequest
                |> Grpc.addHeader "password" "apitest"
                -- NOTE: "Content-Type" "application/grpc-web+proto" is already part of the request
                |> Grpc.setHost "http://localhost:8080"
    in
    Grpc.toCmd GotBalances grpcRequest
