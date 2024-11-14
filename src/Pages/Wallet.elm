module Pages.Wallet exposing (Model, Msg, init, initialModel, update, view)

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
import Proto.Io.Haveno.Protobuffer.Wallets exposing (..)
import Protobuf.Types.Int64 exposing (toInts)
import Spec.Markup exposing (log)
import Types.DateType as DateType exposing (DateTime(..))
import Url exposing (Protocol(..), Url)




{- import Proto.Io.Haveno.Protobuffer as Protobuf exposing (..)
   import Proto.Io.Haveno.Protobuffer.GetVersion exposing (getVersion)
-}
-- Define your Model with relevant wallet data


type alias Model =
    { status : Status
    , pagetitle : String
    , balances : BalancesInfo
    , address : String
    , isHardwareWalletConnected : Bool
    , errors : List String
    , isPopUpVisible : Bool
    }



-- Define your initialModel with default values
{- { availableBalance : Protobuf.Types.Int64.Int64
   , reservedBalance : Protobuf.Types.Int64.Int64
   , totalAvailableBalance : Protobuf.Types.Int64.Int64
   , lockedBalance : Protobuf.Types.Int64.Int64
   }
-}


type alias BtcBalanceInfo =
    { availableBalance : Int
    , reservedBalance : Int
    , totalAvailableBalance : Int
    , lockedBalance : Int
    }


type alias XmrBalanceInfo =
    { balance : Int
    , availableBalance : Int
    , pendingBalance : Int
    , reservedOfferBalance : Int
    , reservedTradeBalance : Int
    }


initialBtcBalanceInfo : BtcBalanceInfo
initialBtcBalanceInfo =
    { availableBalance = 0
    , reservedBalance = 0
    , totalAvailableBalance = 0
    , lockedBalance = 0
    }


initialXmrBalanceInfo : XmrBalanceInfo
initialXmrBalanceInfo =
    { balance = 0, availableBalance = 0, pendingBalance = 0, reservedOfferBalance = 0, reservedTradeBalance = 0 }


initialModel : Model
initialModel =
    { status = Loaded
    , pagetitle = "Wallet"
    , balances = Protobuf.defaultBalancesInfo --{ btc = Nothing, xmr = Nothing }
    , address = "Not Connected"
    , isHardwareWalletConnected = False
    , errors = []
    , isPopUpVisible = True
    }



-- Status indicating whether the wallet is loaded, loading, or errored


type Status
    = Loading
    | Loaded
    | Errored



-- Init: Initializing the Wallet Page


init : String -> ( Model, Cmd Msg )
init _ =
    let
        newModel =
            Model Loaded "Wallet" { btc = Nothing, xmr = Nothing } "Not Connected" False [] True
    in
    ( newModel
    , Cmd.none
    )



-- Msg: Define messages for interactions on the Wallet page


type Msg
    = GotInitialModel Model
    | ClosePopUp
    | SetAddress String
    | GotBalances (Result Grpc.Error GetBalancesReply)



-- Update: Update the state based on actions


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotInitialModel newModel ->
            ( { model | balances = newModel.balances, address = newModel.address }, Cmd.none )

        ClosePopUp ->
            ( { model | isPopUpVisible = False }, Cmd.none )

        SetAddress address ->
            ( { model | address = address }, Cmd.none )

        GotBalances (Ok response) ->
        -- TODO: Update the model with the response
            --( { model | balances = response.balances }, Cmd.none )
            ( { model | balances = { btc = Nothing, xmr = Nothing } }, Cmd.none )

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

            -- WARN: Carefull with the management of the imports here:
            , Element.el [ Region.heading 4, Element.htmlAttribute (Attr.id "balance") ]
                --Heading.h4
                (Element.text ("Available Balance: " ++ (totalAvailableBalanceAsString model.balances.btc) ++ " XMR"))
            , Element.text "\n"
            , Element.text "\n"
            ]

totalAvailableBalanceAsString : Maybe Protobuf.BtcBalanceInfo -> String
totalAvailableBalanceAsString btcBalanceInfo =
    case btcBalanceInfo of
        Nothing ->
            "0.00"

        Just btcbalinfo ->
            let (firstInt, secondInt) = toInts btcbalinfo.totalAvailableBalance in
                String.fromInt firstInt



{- custodialWalletView : Model -> Html Msg
   custodialWalletView model =
       Framework.responsiveLayout []
           Element.column []
               [ Element.el Heading.h1
                   <| Element.text "Wallet"

               , Element.text "\n"
               {- , Element.el (Heading.h4 ++ [ Element.htmlAttribute (Attr.id "balance") ])
                   [ Element.text ("Balance: " ++ model.balance)
                   ] -}
               , Element.text "\n"
               , Element.el Heading.h4
                   <| Element.text ("Pending Balance: " ++ model.pendingBalance)

               , Element.text "\n"
               , Element.el Heading.h4
                   <| Element.text ("Reserved Balance: " ++ model.reservedBalance)

               , Element.text "\n"
               , Element.el Heading.h4
                   <| Element.text ("Address: " ++ model.address)

               , Element.text "\n"
               ]
-}
-- NAV: gRPC calls


gotAvailableBalance : GetBalancesRequest -> Cmd Msg
gotAvailableBalance getBalanceRequest =
    let
        grpcRequest =
            Grpc.new getBalances getBalanceRequest
                |> Grpc.addHeader "password" "apitest"
                -- NOTE: "Content-Type" "application/grpc-web+proto" is already part of the request
                |> Grpc.setHost "http://localhost:8080"
    in
    Grpc.toCmd GotBalances grpcRequest
