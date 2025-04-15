module Pages.Sell exposing (Model, Msg(..), Status(..), View(..), btcAccountsView, errorView, init, initialModel, update, view)

import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Html exposing (Html, div, h4, section)
import Html.Attributes exposing (class, classList, id)
import Pages.Accounts exposing (Msg)
import Proto.Io.Haveno.Protobuffer as Protobuf
import Types.CryptoAccount exposing (CryptoAccount(..))
import Utils.MyUtils


type alias Model =
    { status : Status
    , pagetitle : String
    , balances : Maybe Protobuf.BalancesInfo
    , offersReply : Maybe Protobuf.GetOffersReply
    , isAddressVisible : Bool
    , primaryaddress : String
    , errors : List String
    , subaddress : String
    , currentView : View
    , listOfExistingCryptoAccounts : List String
    , listOfBTCAddresses : List String
    , newBTCAddress : String
    , cryptoAccountType : CryptoAccount
    , savedPassword : String -- The actual saved password
    , temporaryPassword : String -- The temporary password for the input box
    }


initialModel : Model
initialModel =
    { status = Loaded
    , pagetitle = "Sell"
    , balances = Just Protobuf.defaultBalancesInfo
    , offersReply = Just Protobuf.defaultGetOffersReply
    , isAddressVisible = False
    , primaryaddress = ""
    , errors = []
    , subaddress = ""
    , currentView = ManageSell
    , listOfExistingCryptoAccounts = [ "" ]
    , listOfBTCAddresses = [ "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v", "1GK6XMLmzFVj8ALj6mfBsbifRoD4miY36o" ]
    , newBTCAddress = ""
    , cryptoAccountType = BTC
    , savedPassword = "" -- The actual saved password
    , temporaryPassword = "" -- The temporary password for the input box
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel
      -- HACK: Just used to satisfy elm-reveiw for now
    , Cmd.none
    )



-- NAV: Types


type View
    = ManageSell
    | Bitcoin
    | Monero
    | Others
    | OfferToSellBTC


type Status
    = Loaded


type Msg
    = NoOp
    | ChangeView View



-- NAV: Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangeView newView ->
            ( { model | currentView = newView }
            , Cmd.none
            )

        NoOp ->
            ( model, Cmd.none )



-- NOTE: Our view will be Html msg, not Document
-- as we won't use 'title' etc. cos we have our own formatting


view : Model -> Html Msg
view model =
    section
        [ id "page"
        , class "section-background"
        , class "text-center"
        ]
        [ div [ class "split" ]
            [ div
                []
                []
            , case model.status of
                Loaded ->
                    div
                        [ class "split-col"
                        ]
                        [ case model.currentView of
                            ManageSell ->
                                div []
                                    [ h4 [] [ Html.text "Manage Sell" ]
                                    , Utils.MyUtils.infoBtn "MONERO" "monero-sell-button" <| ChangeView Monero
                                    , Utils.MyUtils.infoBtn "BITCOIN" "bitcoin-sell-button" <| ChangeView Bitcoin
                                    , Utils.MyUtils.infoBtn "OTHERS" "others-sell-button" <| ChangeView Others
                                    ]

                            Monero ->
                                div []
                                    [ h4 [] [ Html.text "MONERO Accounts" ]
                                    , Utils.MyUtils.infoBtn "BACK TO MANAGE SELL" "back-to-manage-sell-button" <| ChangeView ManageSell
                                    ]

                            Bitcoin ->
                                div []
                                    [ h4 [] [ Html.text "BTC Accounts" ]
                                    , btcAccountsView model
                                    ]

                            Others ->
                                div []
                                    [ h4 [] [ Html.text "OTHERS Accounts" ]
                                    , Utils.MyUtils.infoBtn "BACK TO MANAGE SELL" "back-to-manage-sell-button" <| ChangeView ManageSell
                                    ]

                            OfferToSellBTC ->
                                div []
                                    [ h4 [] [ Html.text "Offer to Sell BTC" ]
                                    , Html.h6 []
                                        (if List.isEmpty model.listOfBTCAddresses then
                                            [ Html.div [ class "btc-address-item" ] [ Html.text "You don't have a payment account set up for the selected currency." ] ]

                                         else
                                            List.map (\address -> Html.div [ classList [ ( "btc-address-item", True ), ( "address-label", True ) ] ] [ Html.text address ]) model.listOfBTCAddresses
                                        )
                                    , Utils.MyUtils.infoBtn "CREATE NEW OFFER TO SELL BTC" "create-new-offer-sell-BTC-button" <| ChangeView OfferToSellBTC
                                    , Utils.MyUtils.infoBtn "SETUP A NEW TRADING ACCOUNT" "back-to-manage-accounts-from-sell-button" <| ChangeView ManageSell
                                    ]
                        ]
            , div
                [ class "split-col"
                ]
                []
            ]
        ]



-- NAV: Helper functions


btcAccountsView : Model -> Html Msg
btcAccountsView model =
    Html.div []
        [ Html.h6 [ class "bitcoin-sell-subtitle" ] [ Html.text "Sell BTC for XMR" ]
        , Html.div [ id "accounts-listOfBTCAddresses" ]
            (if List.isEmpty model.listOfBTCAddresses then
                [ Html.div [ class "btc-address-item" ] [ Html.text "You don't have a payment account set up for the selected currency." ] ]

             else
                List.map (\address -> Html.div [ classList [ ( "btc-address-item", True ), ( "address-label", True ) ] ] [ Html.text address ]) model.listOfBTCAddresses
            )
        , Utils.MyUtils.infoBtn "CREATE NEW OFFER TO SELL BTC" "create-new-offer-sell-BTC-button" <| ChangeView OfferToSellBTC
        , Utils.MyUtils.infoBtn "BACK TO MANAGE SELL" "back-to-manage-sell-button" <| ChangeView ManageSell

        -- NOTE: Element.layout converts from Element to Html
        -- NOTE: Using Elm-UI here as 'standard' Html and Css was not working well
        , Element.layout [] (scrollableTable <| tableView model)
        ]



-- Scrollable wrapper


scrollableTable : Element msg -> Element msg
scrollableTable content =
    el
        [ scrollbarX
        , width fill
        , padding 10
        , Element.htmlAttribute (Html.Attributes.id "sell-offers-table")
        ]
        (el [ width (px 900) ] content)



-- Table definition
-- filepath: /home/alanpoe/Documents/Development/Monero/elm-merge/haveno-web/src/Pages/Sell.elm


tableView : Model -> Element msg
tableView model =
    let
        _ =
            Debug.log "offers" model.offersReply
    in
    column [ spacing 8 ]
        [ headerRow
        , case model.offersReply of
            Just offersReply ->
                column []
                    (List.map
                        (\offer ->
                            dataRow
                                offer.price
                                ("0.05" ++ " - " ++ "0.07")
                                offer.triggerPrice
                                offer.paymentMethodShortName
                                (String.fromFloat offer.buyerSecurityDepositPct ++ "%")
                                ""
                                offer.ownerNodeAddress
                        )
                        offersReply.offers
                    )

            Nothing ->
                el [] (Element.text "No offers available.")
        ]



-- Header row with split lines


headerRow : Element msg
headerRow =
    row [ spacing 0 ]
        [ columnHeader [ el [ Element.htmlAttribute (Html.Attributes.id "column-price") ] (Element.text "Price (XMR)") ]
        , columnHeader [ el [ Element.htmlAttribute (Html.Attributes.id "column-xmr-range") ] (Element.text "XMR Range") ]
        , columnHeader [ el [ Element.htmlAttribute (Html.Attributes.id "column-btc-range") ] (Element.text "BTC Range") ]
        , columnHeader [ el [ Element.htmlAttribute (Html.Attributes.id "column-payment") ] (Element.text "Payment") ]
        , columnHeader [ el [ Element.htmlAttribute (Html.Attributes.id "column-deposit") ] (Element.text "Deposit %") ]
        , columnHeader [ el [ Element.htmlAttribute (Html.Attributes.id "column-action") ] (Element.text "⚙") ]
        , columnHeader [ el [ Element.htmlAttribute (Html.Attributes.id "column-buyer") ] (Element.text "Buyer") ]
        ]



-- Header cell


columnHeader : List (Element msg) -> Element msg
columnHeader lines =
    column
        [ Font.bold
        , spacing 2
        , paddingXY 8 6
        , Border.width 1
        , Border.color (rgb255 200 200 200)
        , Background.color (rgb255 245 245 245)
        , width (px 120)
        ]
        lines



-- Data row


dataRow : String -> String -> String -> String -> String -> String -> String -> Element msg
dataRow price xmrRange btcRange payment deposit action buyer =
    row [ spacing 0 ]
        [ cell price
        , cell xmrRange
        , cell btcRange
        , cell payment
        , cell deposit
        , cell action
        , cell buyer
        ]



-- Data cell


cell : String -> Element msg
cell str =
    el
        [ paddingXY 8 6
        , Border.width 1
        , Border.color (rgb255 230 230 230)
        , width (px 120)
        , Element.htmlAttribute (Html.Attributes.id "offerCell")
        ]
        (Element.text str)


errorView : Html Msg
errorView =
    Html.div [ class "accounts-container" ]
        [ Html.h1 [ class "accounts-title" ] [ Html.text "Accounts" ]
        , Html.div [ class "error-message", id "accounts-error-message" ]
            [ Html.text "Error: Unable to retrieve relevant data. Please try again later." ]
        ]
