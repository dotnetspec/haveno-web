port module Pages.Accounts exposing (CryptoAccount(..), Model, Msg(..), Status(..), View(..), errorView, existingCryptoAccountsView, gotAvailableBalances, gotNewSubAddress, gotPrimaryAddress, init, initialModel, manageAccountsView, msgFromAccounts, update, view)


import Grpc
import Html exposing (Html, div, h4, p, section, text)
import Html.Attributes exposing (class, classList, id, placeholder, readonly, type_, value)
import Html.Events exposing (onInput)
import Json.Encode
import Proto.Io.Haveno.Protobuffer as Protobuf
import Proto.Io.Haveno.Protobuffer.Wallets as Wallets
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
    , listOfBTCAddresses : List String
    , newBTCAddress : String
    , cryptoAccountType : CryptoAccount
    , savedPassword : String -- The actual saved password
    , temporaryPassword : String -- The temporary password for the input box
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
    , listOfBTCAddresses = []
    , newBTCAddress = ""
    , cryptoAccountType = BTC
    , savedPassword = "" -- The actual saved password
    , temporaryPassword = "" -- The temporary password for the input box
    }






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
    | EncryptNewBTCAddress String
    | DecryptedBTCAddresses (List String)
    | AllCryptoCurrencies (List String)
    | ChangeView View
    | UpdateNewBTCAddress String
    | UpdatePassword String
    | ClearPasswordInput
    | SavePassword
    | GotBTCFromJs String
    | GotAllCryptoAccountsFromJs String



-- NAV: Types

type View
    = ManageAccounts
    | TraditionalCurrencyAccounts
    | CryptoAccounts
    | CreateNewBTCAccountView
    | DisplayStoredBTCAddresses
    | WalletPassword
    | WalletSeed
    | Backup

type Status
    = Loaded
    | Errored


type CryptoAccount
    = BTC
    | AllCrypto



-- NAV: Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        -- REVIEW: Need address or already in the model?
        EncryptNewBTCAddress address ->
            let
                message =
                    encryptCryptoAccountMsgRequest address model
            in
            -- TODO: Modify for different cryptos
            ( { model | currentView = DisplayStoredBTCAddresses, listOfBTCAddresses = model.listOfBTCAddresses ++ [ address ], cryptoAccountType = BTC }, encryptionMsg message )

        DecryptedBTCAddresses data ->
            ( { model | currentView = DisplayStoredBTCAddresses, listOfBTCAddresses = data, isAddressVisible = True }, Cmd.none )

        AllCryptoCurrencies data ->
            ( { model | currentView = CryptoAccounts, listOfExistingCryptoAccounts = data, cryptoAccountType = AllCrypto, isAddressVisible = True}, Cmd.none )

        GotXmrPrimaryAddress (Ok primaryAddresponse) ->
            ( { model | primaryaddress = primaryAddresponse.primaryAddress, status = Loaded }, Cmd.none )

        GotXmrPrimaryAddress (Err _) ->
            ( { model | status = Errored }, Cmd.none )

        GotXmrNewSubaddress (Ok subAddresponse) ->
            ( { model | subaddress = subAddresponse.subaddress, status = Loaded }, Cmd.none )

        GotXmrNewSubaddress (Err _) ->
            ( { model | status = Errored }, Cmd.none )

        GotBalances (Ok response) ->
            ( { model | balances = response.balances, status = Loaded }, Cmd.none )

        GotBalances (Err _) ->
            ( { model | status = Errored }, Cmd.none )

        ChangeView newView ->
            ( { model | currentView = newView }, Cmd.none )

        UpdateNewBTCAddress address ->
            ( { model | newBTCAddress = address }, Cmd.none )

        UpdatePassword newPass ->
            ( { model | temporaryPassword = newPass }, Cmd.none )

        SavePassword ->
            ( { model | savedPassword = model.temporaryPassword, temporaryPassword = "" }, Cmd.none )

        -- Save and clear input
        -- Only update temporaryPassword
        ClearPasswordInput ->
            ( { model | temporaryPassword = "" }, Cmd.none )

        GotBTCFromJs pword ->
            ( { model | currentView = DisplayStoredBTCAddresses }, Cmd.batch [ gotBTCFromJs pword ] )

        GotAllCryptoAccountsFromJs pword ->
            ( { model | currentView = CryptoAccounts }, Cmd.batch [ gotAllCryptoAccountsFromJs pword ] )



-- Clears the input box
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
                            DisplayStoredBTCAddresses ->
                                div []
                                    [ h4 [] [ text "BTC Accounts" ]
                                    , btcAccountsView model
                                    ]

                            ManageAccounts ->
                                manageAccountsView model

                            TraditionalCurrencyAccounts ->
                                div [] [ text "Traditional Currency Accounts" ]

                            CryptoAccounts ->
                                div []
                                    [ h4 [] [ text "Cryptocurrency Accounts" ]
                                    , p [] [ Utils.MyUtils.infoBtn "VIEW BTC ACCOUNTS" "btcAccountsButton" <| GotBTCFromJs model.savedPassword ]
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

                AllCrypto ->
                    Html.text "AllCrypto"
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
        , Utils.MyUtils.infoBtn "SAVE NEW BTC ACCOUNT" "save-new-BTC-account-button" <| EncryptNewBTCAddress model.newBTCAddress
        ]


existingCryptoAccountsView : Model -> Html Msg
existingCryptoAccountsView model =
    Html.div []
        [ Html.h6 [ class "accounts-subtitle" ] [ Html.text "Existing Accounts" ]
        , Html.div [ id "accounts-listOfExistingCryptoAccounts" ]
            (if List.isEmpty model.listOfExistingCryptoAccounts then
                [ Html.div [ class "account-item" ] [ Html.text "There are no accounts set up yet" ] ]

             else
                List.map (\account -> Html.div [ class "account-item" ] [ Html.text account ]) model.listOfExistingCryptoAccounts
            )
        ]


btcAccountsView : Model -> Html Msg
btcAccountsView model =
    Html.div []
        [ Html.h6 [ class "accounts-subtitle" ] [ Html.text "Your BTC Accounts" ]
        , Utils.MyUtils.infoBtn "BACK TO ACCOUNTS" "back-to-accounts-button" <| ChangeView ManageAccounts
        , Html.div [ id "accounts-listOfBTCAddresses" ]
            (if List.isEmpty model.listOfBTCAddresses then
                [ Html.div [ class "btc-address-item" ] [ Html.text "There are no BTC accounts set up yet" ] ]

             else
                List.map (\account -> Html.div [ classList [ ( "btc-address-item", True ), ( "address-label", True ) ] ] [ Html.text account ]) model.listOfBTCAddresses
            )
        ]


errorView : Html Msg
errorView =
    Html.div [ class "accounts-container" ]
        [ Html.h1 [ class "accounts-title" ] [ Html.text "Accounts" ]
        , Html.div [ class "error-message", id "accounts-error-message" ]
            [ Html.text "Error: Unable to retrieve relevant data. Please try again later." ]
        ]


manageAccountsView : Model -> Html Msg
manageAccountsView model =
    Html.div [ class "accounts-container" ]
        [ Html.h1 [ class "accounts-title" ] [ Html.text "Accounts" ]
        , passwordView model
        , p [] [ Utils.MyUtils.infoBtn "Traditional Currency Accounts" "traditionalCurrencyAccountsButton" <| ChangeView TraditionalCurrencyAccounts ]
        , p [] [ Utils.MyUtils.infoBtn "Crypto Currency Accounts" "cryptocurrencyAccountsButton" <| GotAllCryptoAccountsFromJs model.savedPassword ]
        , p [] [ Utils.MyUtils.infoBtn "Wallet Password" "walletPasswordButton" <| ChangeView WalletPassword ]
        , p [] [ Utils.MyUtils.infoBtn "Wallet Seed" "walletSeedButton" <| ChangeView WalletSeed ]
        , p [] [ Utils.MyUtils.infoBtn "Backup" "backupButton" <| ChangeView Backup ]
        ]


passwordView : Model -> Html Msg
passwordView model =
    Html.div []
        [ Html.div []
            [ Html.label [ class "large-text" ] [ Html.text "Password: " ]
            , Html.span []
                [ Html.input
                    [ id "accounts-password-input"
                    , type_ "text"
                    , placeholder "To en/decrypt accounts data"
                    , onInput UpdatePassword
                    , value model.temporaryPassword -- Ensures the input box stays in sync with `temporaryPassword`
                    ]
                    []
                ]
            ]
        , p []
            [ Utils.MyUtils.infoBtn "Save Password" "savePasswordButton" <| SavePassword ]
        , p [] [ Utils.MyUtils.infoBtn "Clear Password" "clearPasswordButton" <| ClearPasswordInput ]
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


gotBTCFromJs : String -> Cmd Msg
gotBTCFromJs pword =
    let
        message =
            Json.Encode.object
                [ ( "typeOfMsg", Json.Encode.string "decryptCryptoAccountsMsgRequest" )
                , ( "currency", Json.Encode.string "BTC" )
                , ( "page", Json.Encode.string "AccountsPage" )
                , ( "accountsData", Json.Encode.list Json.Encode.string [ "", "" ] )
                , ( "password", Json.Encode.string pword )
                ]
    in
    msgFromAccounts message


gotAllCryptoAccountsFromJs : String -> Cmd Msg
gotAllCryptoAccountsFromJs pword =
    let
        message =
            Json.Encode.object
                [ ( "typeOfMsg", Json.Encode.string "decryptCryptoAccountsMsgRequest" )
                , ( "currency", Json.Encode.string "AllCrypto" )
                , ( "page", Json.Encode.string "AccountsPage" )
                , ( "accountsData", Json.Encode.list Json.Encode.string [ "", "" ] )
                , ( "password", Json.Encode.string pword )
                ]
    in
    msgFromAccounts message



-- NAV: Helper functions


convertCurrencyTypeToString : CryptoAccount -> String
convertCurrencyTypeToString cryptoAccount =
    case cryptoAccount of
        BTC ->
            "BTC"

        AllCrypto ->
            "AllCrypto"





-- NAV: Cmd Msgs


encryptionMsg : Json.Encode.Value -> Cmd Msg
encryptionMsg msg =
    msgFromAccounts msg



-- NAV: Ports


port msgFromAccounts : Json.Encode.Value -> Cmd msg



-- NAV: Encoders
-- REVIEW: Need address or already in the model?


encryptCryptoAccountMsgRequest : String -> Model -> Json.Encode.Value
encryptCryptoAccountMsgRequest address model =
    let
        btcAccountCount =
            List.length model.listOfBTCAddresses

        storeAs =
            "BTC_Public_Key_" ++ String.fromInt btcAccountCount
    in
    Json.Encode.object
        [ ( "typeOfMsg", Json.Encode.string "encryptCryptoAccountMsgRequest" )
        , ( "currency", Json.Encode.string <| convertCurrencyTypeToString model.cryptoAccountType )
        , ( "accountsData", Json.Encode.string address )
        , ( "storeAs", Json.Encode.string storeAs )
        , ( "password", Json.Encode.string model.savedPassword )
        ]



-- NAV: Decoders
