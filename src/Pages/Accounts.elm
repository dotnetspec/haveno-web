port module Pages.Accounts exposing (CryptoAccount(..), Model, Msg(..), Status(..), View(..), encryptedMsg, errorView, existingCryptoAccountsView, formatBalance, gotAvailableBalances, gotNewSubAddress, gotPrimaryAddress, init, initialModel, manageAccountsView, update, view)

import Extras.Constants exposing (xmrConversionConstant)
import Grpc
import Html exposing (Html, div, h4, p, section, text)
import Html.Attributes exposing (class, id, placeholder, readonly, type_, value)
import Html.Events exposing (onInput)
import Json.Encode as JE
import Proto.Io.Haveno.Protobuffer as Protobuf
import Proto.Io.Haveno.Protobuffer.Wallets as Wallets
import UInt64
import Utils.MyUtils



-- NAV: Model


type alias Model =
    { status : Status
    , pagetitle : String
    , balances : Maybe Protobuf.BalancesInfo
    , isAddressVisible : Bool
    , primaryaddress : String
    , errors : List String
    , subaddress : String
    , currentView : View
    , listOfExistingCryptoAccounts : List String
    , newBTCAddress : String
    , cryptoAccountType : CryptoAccount
    }


initialModel : Model
initialModel =
    { status = Loaded
    , pagetitle = "Accounts"
    , balances = Just Protobuf.defaultBalancesInfo
    , isAddressVisible = False
    , primaryaddress = ""
    , errors = []
    , subaddress = ""
    , currentView = ManageAccounts
    , listOfExistingCryptoAccounts = []
    , newBTCAddress = ""
    , cryptoAccountType = BTC
    }


type Status
    = Loaded
    | Errored


type View
    = ManageAccounts
    | TraditionalCurrencyAccounts
    | CryptoAccounts
    | CreateNewBTCAccountView
    | WalletPassword
    | WalletSeed
    | Backup



-- NAV: Init


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel
    , Cmd.none
    )



-- NAV: Msg


type Msg
    = GotBalances (Result Grpc.Error Protobuf.GetBalancesReply)
    | GotXmrPrimaryAddress (Result Grpc.Error Protobuf.GetXmrPrimaryAddressReply)
    | GotXmrNewSubaddress (Result Grpc.Error Protobuf.GetXmrNewSubaddressReply)
    | AddNewCryptoAccount CryptoAccount
    | ChangeView View
    | UpdateNewBTCAddress String



-- NAV: Types


type CryptoAccount
    = BTC



-- NAV: Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        AddNewCryptoAccount cryptoAcct ->
            let
                message =
                    JE.encode 0 (JE.object [ ( "type", JE.string "encryptionMsg" ), ( "currency", JE.string "BTC" ), ( "address", JE.string "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v" ) ])
            in
            ( { model | currentView = CryptoAccounts, cryptoAccountType = cryptoAcct }, encryptionMsg message )

        GotXmrPrimaryAddress (Ok primaryAddresponse) ->
            ( { model | primaryaddress = primaryAddresponse.primaryAddress, status = Loaded, currentView = ManageAccounts }, Cmd.none )

        GotXmrPrimaryAddress (Err _) ->
            ( { model | status = Errored }, Cmd.none )

        GotXmrNewSubaddress (Ok subAddresponse) ->
            ( { model | subaddress = subAddresponse.subaddress, status = Loaded, currentView = ManageAccounts }, Cmd.none )

        GotXmrNewSubaddress (Err _) ->
            ( { model | status = Errored }, Cmd.none )

        GotBalances (Ok response) ->
            ( { model | balances = response.balances, status = Loaded, currentView = ManageAccounts }, Cmd.none )

        GotBalances (Err _) ->
            ( { model | status = Errored }, Cmd.none )

        ChangeView newView ->
            ( { model | currentView = newView }, Cmd.none )

        UpdateNewBTCAddress address ->
            ( { model | newBTCAddress = address }, Cmd.none )



-- NAV: View


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
                Errored ->
                    div [ class "split-col" ] [ errorView ]

                Loaded ->
                    div
                        [ class "split-col"
                        ]
                        [ case model.currentView of
                            ManageAccounts ->
                                manageAccountsView

                            TraditionalCurrencyAccounts ->
                                div [] [ text "Traditional Currency Accounts" ]

                            CryptoAccounts ->
                                div []
                                    [ h4 [] [ text "Cryptocurrency Accounts" ]
                                    , existingCryptoAccountsView model
                                    , p [] [ Utils.MyUtils.infoBtn "Add New BTC CryptoCurrency Account" "addnewBTCaccountViewbutton" <| ChangeView CreateNewBTCAccountView ]
                                    ]

                            CreateNewBTCAccountView ->
                                div []
                                    [ h4 [] [ text "Cryptocurrency Accounts" ]
                                    , existingCryptoAccountsView model
                                    , createNewBTCAccountView model
                                    ]

                            WalletPassword ->
                                div [] [ text "Wallet Password " ]

                            WalletSeed ->
                                div [] [ text "Seed " ]

                            Backup ->
                                div [] [ text "Backup " ]
                        ]
            , div
                [ class "split-col"
                ]
                []
            ]
        ]



-- NAV: View helpers:


createNewBTCAccountView : Model -> Html Msg
createNewBTCAccountView model =
    Html.div []
        [ Html.h6 [ class "cryptocurrency-list" ] [ Html.text "Cryptocurrency" ]
        , Html.div [ class "account-item", id "crypto-type" ]
            [ case model.cryptoAccountType of
                BTC ->
                    Html.text "BTC"
            ]
        , Html.div []
            [ Html.label [ class "large-text" ] [ Html.text "Bitcoin address: " ]
            , Html.span []
                [ Html.input [ id "bitcoin-address-input", type_ "text", placeholder "Enter valid BTC address", onInput UpdateNewBTCAddress ] []
                ]
            ]
        , Html.div []
            [ Html.label [ class "large-text" ] [ Html.text "Limitations: " ]
            , Html.span []
                [ Html.input [ id "limitations-input", type_ "text", readonly True, value "Max. trade duration: 0 hours/Max.trade limit: 96.00 XMR" ] []
                ]
            ]
        , Html.div []
            [ Html.label [ class "large-text" ] [ Html.text "Account name: " ]
            , Html.span []
                [ Html.input [ id "account-name-input", type_ "text", readonly True, value ("BTC: " ++ model.newBTCAddress) ] []
                ]
            ]
        , Utils.MyUtils.infoBtn "SAVE NEW BTC ACCOUNT" "save-new-BTC-account-button" <| AddNewCryptoAccount BTC
        ]


existingCryptoAccountsView : Model -> Html Msg
existingCryptoAccountsView model =
    Html.div []
        [ Html.h6 [ class "accounts-subtitle" ] [ Html.text "Your Cryptocurrency Accounts" ]
        , Html.div [ id "accounts-listOfExistingCryptoAccounts" ]
            (if List.isEmpty model.listOfExistingCryptoAccounts then
                [ Html.div [ class "account-item" ] [ Html.text "There are no accounts set up yet" ] ]

             else
                List.map (\account -> Html.div [ class "account-item" ] [ Html.text account ]) model.listOfExistingCryptoAccounts
            )
        ]


errorView : Html Msg
errorView =
    Html.div [ class "accounts-container" ]
        [ Html.h1 [ class "accounts-title" ] [ Html.text "Accounts" ]
        , Html.div [ class "error-message", id "accounts-error-message" ]
            [ Html.text "Error: Unable to retrieve relevant data. Please try again later." ]
        ]


manageAccountsView : Html Msg
manageAccountsView =
    Html.div [ class "accounts-container" ]
        [ Html.h1 [ class "accounts-title" ] [ Html.text "Accounts" ]
        , p [] [ Utils.MyUtils.infoBtn "Traditional Currency Accounts" "traditionalCurrencyAccountsButton" <| ChangeView TraditionalCurrencyAccounts ]
        , p [] [ Utils.MyUtils.infoBtn "Crypto Currency Accounts" "cryptocurrencyAccountsButton" <| ChangeView CryptoAccounts ]
        , p [] [ Utils.MyUtils.infoBtn "Wallet Password" "walletPasswordButton" <| ChangeView WalletPassword ]
        , p [] [ Utils.MyUtils.infoBtn "Wallet Seed" "walletSeedButton" <| ChangeView WalletSeed ]
        , p [] [ Utils.MyUtils.infoBtn "Backup" "backupButton" <| ChangeView Backup ]
        ]



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


gotPrimaryAddress : Cmd Msg
gotPrimaryAddress =
    let
        grpcRequest =
            Grpc.new Wallets.getXmrPrimaryAddress Protobuf.defaultGetXmrPrimaryAddressRequest
                |> Grpc.addHeader "password" "apitest"
                -- NOTE: "Content-Type" "application/grpc-web+proto" is already part of the request
                |> Grpc.setHost "http://localhost:8080"
    in
    Grpc.toCmd GotXmrPrimaryAddress grpcRequest


gotNewSubAddress : Cmd Msg
gotNewSubAddress =
    let
        grpcRequest =
            Grpc.new Wallets.getXmrNewSubaddress Protobuf.defaultGetXmrNewSubaddressRequest
                |> Grpc.addHeader "password" "apitest"
                -- NOTE: "Content-Type" "application/grpc-web+proto" is already part of the request
                |> Grpc.setHost "http://localhost:8080"
    in
    Grpc.toCmd GotXmrNewSubaddress grpcRequest



-- NAV: Helper functions


formatBalance : { higher : Int, lower : Int } -> String
formatBalance int64 =
    let
        -- Convert higher and lower into a full 64-bit integer
        fullUInt64 : UInt64.UInt64
        fullUInt64 =
            let
                highPart =
                    UInt64.fromInt int64.higher |> UInt64.mul (UInt64.fromInt xmrConversionConstant)

                lowPart =
                    if int64.lower < 0 then
                        UInt64.fromInt (int64.lower + xmrConversionConstant)

                    else
                        UInt64.fromInt int64.lower
            in
            UInt64.add highPart lowPart

        -- Convert UInt64 to Float
        fullFloat : Float
        fullFloat =
            UInt64.toFloat fullUInt64

        -- Convert piconero to XMR
        xmrAmount : Float
        xmrAmount =
            fullFloat / 1000000000000

        -- Ensure proper rounding to 11 decimal places
        scale : Float
        scale =
            toFloat (10 ^ 11)

        roundedXmr : Float
        roundedXmr =
            toFloat (round (xmrAmount * scale)) / scale
    in
    String.fromFloat roundedXmr


encryptionMsg : String -> Cmd Msg
encryptionMsg msgString =
    encryptedMsg msgString



-- NAV: Ports


port encryptedMsg : String -> Cmd msg
