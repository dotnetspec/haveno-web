module Pages.Wallet exposing (Model, Msg(..), init, initialModel, update, view)

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


type alias Model =
    { status : Status
    , pagetitle : String
    , balances : Maybe Protobuf.BalancesInfo
    , address : String
    , errors : List String
    }


initialModel : Model
initialModel =
    { status = Loaded
    , pagetitle = "Haveno Web Wallet"
    , balances = Just Protobuf.defaultBalancesInfo
    -- HACK: Hardcoding the address for now
    , address = "BceiPLaX7YDevCfKvgXFq8Tk1BGkQvtfAWCWJGgZfb6kBju1rDUCPzfDbHmffHMC5AZ6TxbgVVkyDFAnD2AVzLNp37DFz32"
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
    ( {initialModel | address = "BceiPLaX7YDevCfKvgXFq8Tk1BGkQvtfAWCWJGgZfb6kBju1rDUCPzfDbHmffHMC5AZ6TxbgVVkyDFAnD2AVzLNp37DFz32"}
    , gotAvailableBalances
    )


type Msg
    = SetAddress String
    | GotBalances (Result Grpc.Error Protobuf.GetBalancesReply)



-- HACK: Currently hard coding the response to test the UI


xmrBalanceInfoInstance : Protobuf.XmrBalanceInfo
xmrBalanceInfoInstance =
    { balance = Protobuf.Types.Int64.fromInts 110 0
    , availableBalance = Protobuf.Types.Int64.fromInts 100 0
    , pendingBalance = Protobuf.Types.Int64.fromInts 0 0
    , reservedOfferBalance = Protobuf.Types.Int64.fromInts 50 0
    , reservedTradeBalance = Protobuf.Types.Int64.fromInts 5 0
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SetAddress address ->
            ( { model | address = address }, Cmd.none )

        GotBalances (Ok response) ->
            -- HACK: Want to replace xmrBalanceInfoInstance with response
            -- also so that real base64 test data is used.
            {- let
                _ =
                    Debug.log "GotBalances" response
            in -}
            -- TODO: Update the model with the response
            ( { model | balances = response.balances, status = Loaded }, Cmd.none )

        --( { model | balances = response.balances}, Cmd.none )
        GotBalances (Err error) ->
            {- let
                _ =
                    Debug.log "GotBalances error " error
            in -}
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
                    div [] [ Html.text "error" ]

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
    Framework.responsiveLayout [] <|
        Element.column Framework.container <|
            [ Element.el Heading.h1 <| Element.text "Wallet"
            , Element.text "\n"
            , Element.el [ Region.heading 4, Element.htmlAttribute (Attr.id "currentaddress") ]
                --Heading.h4
                -- NOTE: if this address doesn't appear, it means init never got called
                (Element.text ("Current address: " ++ model.address))
            , Element.text "\n"
            -- WARN: Carefull with the management of the imports here:
            , Element.el [ Region.heading 4, Element.htmlAttribute (Attr.id "xmrbalance") ]
                --Heading.h4
                (Element.text ("Available Balance: " ++ xmrBalanceAsString model.balances ++ " XMR"))
            , Element.text "\n"
            , Element.el [ Region.heading 4, Element.htmlAttribute (Attr.id "btcbalance") ]
                --Heading.h4
                (Element.text ("Available BTC Balance: " ++ btcBalanceAsString model.balances ++ " BTC"))
            , Element.text "\n"
            , Element.el [ Region.heading 4, Element.htmlAttribute (Attr.id "reservedOfferBalance") ]
                --Heading.h4
                (Element.text ("Reserved Offer Balance: " ++ reservedOfferBalanceAsString model.balances ++ " XMR"))
            , Element.text "\n"
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
        {- _ =
           Debug.log "gotAvailableBalances" "gotAvailableBalances" -}
       
        grpcRequest =
            Grpc.new Wallets.getBalances Protobuf.defaultGetBalancesRequest
                |> Grpc.addHeader "password" "apitest"
                -- NOTE: "Content-Type" "application/grpc-web+proto" is already part of the request
                |> Grpc.setHost "http://localhost:8080"
    in
    Grpc.toCmd GotBalances grpcRequest
