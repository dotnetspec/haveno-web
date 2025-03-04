module Pages.Accounts exposing (Model, Msg(..), Status(..), View(..), errorView, formatBalance, gotAvailableBalances, gotNewSubAddress, gotPrimaryAddress, init, initialModel, manageAccountsView, update, view)

import Extras.Constants exposing (xmrConversionConstant)
import Grpc
import Html exposing (Html, div, p, section, text, h4)
import Html.Attributes exposing (class, id)
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
    }


initialModel : Model
initialModel =
    { status = Loading
    , pagetitle = "Accounts"
    , balances = Just Protobuf.defaultBalancesInfo
    , isAddressVisible = False
    , primaryaddress = ""
    , errors = []
    , subaddress = ""
    , currentView = ManageAccounts
    }


type Status
    = Loading
    | Loaded
    | Errored


type View
    = ManageAccounts
    | TraditionalCurrencyAccounts
    | CryptocurrencyAccounts
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
    | AddNewAccount
    | ChangeView View



-- NAV: Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        AddNewAccount ->
            ( { model | currentView = ManageAccounts }, Cmd.none )

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
                [ 
                ]
                []
            , case model.status of
                Loading ->
                    div
                        []
                        [ div
                            [ class "spinner"
                            ]
                            []
                        ]

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

                            CryptocurrencyAccounts ->
                                div []
                                    [ h4 [] [text "CryptocurrencyAccounts Accounts"]
                                    , p [] [ Utils.MyUtils.infoBtn "Add New Account" "addnewaccountbutton" <| AddNewAccount ]
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
        , p [] [ Utils.MyUtils.infoBtn "Crypto Currency Accounts" "cryptocurrencyAccountsButton" <| ChangeView CryptocurrencyAccounts ]
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
