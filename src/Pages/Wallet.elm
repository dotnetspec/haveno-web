module Pages.Wallet exposing (Model, Msg(..), Status(..), View(..), gotNewSubAddress, init, initialModel, update, view)

import Buttons.Default exposing (defaultButton)
import Debug exposing (log)
import Grpc exposing (..)
import Html exposing (Html, div, section, text)
import Html.Attributes as Attr exposing (class, id)
import Http exposing (..)
import Json.Encode as E exposing (..)
import Maybe exposing (withDefault)
import Proto.Io.Haveno.Protobuffer as Protobuf exposing (..)
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
    , subaddress : String
    , currentView : View
    }


initialModel : Model
initialModel =
    { status = Loading
    , pagetitle = "Haveno Web Wallet"
    , balances = Just Protobuf.defaultBalancesInfo

    -- HACK: Hardcoding the address for now
    , address = ""
    , errors = []
    , subaddress = ""
    , currentView = WalletView
    }


type Status
    = Loading
    | Loaded
    | Errored


type View
    = WalletView
    | ErrorView
    | SubAddressView



-- NAV: Init


init : String -> ( Model, Cmd Msg )
init _ =
    -- HACK: Hardcoding the address for now
    ( initialModel
    , Cmd.batch [ gotAvailableBalances, gotNewSubAddress ]
    )


type Msg
    = SetAddress String
    | GotBalances (Result Grpc.Error Protobuf.GetBalancesReply)
    | GotNewSubaddress (Result Grpc.Error Protobuf.GetXmrNewSubaddressReply)
    | ClickedGotNewSubaddress
    | ChangeView View


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ClickedGotNewSubaddress ->
            ( model, gotNewSubAddress )

        GotNewSubaddress (Ok subAddresponse) ->
            ( { model | subaddress = subAddresponse.subaddress, status = Loaded, currentView = SubAddressView }, Cmd.none )

        GotNewSubaddress (Err error) ->
            ( { model | status = Errored }, Cmd.none )

        SetAddress address ->
            ( { model | address = address }, Cmd.none )

        GotBalances (Ok response) ->
            ( { model | balances = response.balances, status = Loaded }, Cmd.none )

        GotBalances (Err error) ->
            ( { model | status = Errored }, Cmd.none )

        ChangeView uiView ->
            ( { model | currentView = uiView }, Cmd.none )



-- NAV: View


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
                    div [ class "split-col" ] [ errorView ]

                Loaded ->
                    div
                        [ class "split-col"
                        ]
                        [ case model.currentView of
                            WalletView ->
                                custodialWalletView model

                            SubAddressView ->
                                subAddressView model.subaddress

                            ErrorView ->
                                errorView
                        ]
            , div
                [ class "split-col"
                ]
                []
            ]
        ]



-- NAV: View helpers:


custodialWalletView : Model -> Html Msg
custodialWalletView model =
    Html.div [ Attr.class "wallet-container", Attr.id "custodialWalletView" ]
        [ Html.h1 [ Attr.class "wallet-title" ] [ Html.text "Wallet" ]
        , Html.div [ Attr.id "currentaddress", Attr.class "address-text" ]
            [ Html.text ("Current address: " ++ model.address) ]
        , Html.div [ Attr.id "xmrbalance", Attr.class "balance-text" ]
            [ Html.text ("Available Balance: " ++ xmrBalanceAsString model.balances ++ " XMR") ]
        , Html.div [ Attr.id "btcbalance", Attr.class "balance-text" ]
            [ Html.text ("Available BTC Balance: " ++ btcBalanceAsString model.balances ++ " BTC") ]
        , Html.div [ Attr.id "reservedOfferBalance", Attr.class "balance-text" ]
            [ Html.text ("Reserved Offer Balance: " ++ reservedOfferBalanceAsString model.balances ++ " XMR") ]
        , MyUtils.infoBtn "New Sub Address" <| ClickedGotNewSubaddress
        ]


errorView : Html Msg
errorView =
    Html.div [ Attr.class "wallet-container" ]
        [ Html.h1 [ Attr.class "wallet-title" ] [ Html.text "Wallet" ]
        , Html.div [ Attr.class "error-message", Attr.id "wallet-error-message" ]
            [ Html.text "Error: Unable to retrieve relevant data. Please try again later." ]
        ]


subAddressView : String -> Html Msg
subAddressView newSubaddress =
    Html.div [ Attr.class "wallet-container" ]
        [ Html.h1 [ Attr.class "wallet-title" ] [ Html.text "Wallet" ]
        , Html.div [ Attr.class "address-text", Attr.id "newSubaddress" ]
            [ Html.text ("New Subaddress: " ++ newSubaddress) ]
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


gotNewSubAddress : Cmd Msg
gotNewSubAddress =
    let
        grpcRequest =
            Grpc.new Wallets.getXmrNewSubaddress Protobuf.defaultGetXmrNewSubaddressRequest
                |> Grpc.addHeader "password" "apitest"
                -- NOTE: "Content-Type" "application/grpc-web+proto" is already part of the request
                |> Grpc.setHost "http://localhost:8080"
    in
    Grpc.toCmd GotNewSubaddress grpcRequest
