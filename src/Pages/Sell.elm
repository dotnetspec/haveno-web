module Pages.Sell exposing (Model, Msg(..), Status(..), View(..), btcAccountsView, errorView, init, initialModel, update, view)

import Html exposing (Html, div, h4, section, text)
import Html.Attributes exposing (class, classList, id)
import Pages.Accounts exposing (Msg)
import Proto.Io.Haveno.Protobuffer as Protobuf
import Types.CryptoAccount exposing (CryptoAccount(..))
import Utils.MyUtils


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
    , pagetitle = "Sell"
    , balances = Just Protobuf.defaultBalancesInfo
    , isAddressVisible = False
    , primaryaddress = ""
    , errors = []
    , subaddress = ""
    , currentView = ManageSell
    , listOfExistingCryptoAccounts = []
    , listOfBTCAddresses = []
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


type Status
    = Loaded


type Msg
    = NoOp
    | ChangeView View


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
                                    [ Utils.MyUtils.infoBtn "MONERO" "monero-sell-button" <| ChangeView Monero
                                    , Utils.MyUtils.infoBtn "BITCOIN" "bitcoin-sell-button" <| ChangeView Bitcoin
                                    , Utils.MyUtils.infoBtn "OTHERS" "others-sell-button" <| ChangeView Others
                                    ]

                            Monero ->
                                div []
                                    [ h4 [] [ text "MONERO Accounts" ]
                                    , Utils.MyUtils.infoBtn "BACK TO ACCOUNTS" "back-to-accounts-button" <| ChangeView ManageSell
                                    ]

                            Bitcoin ->
                                div []
                                    [ h4 [] [ text "BTC Accounts" ]
                                    , btcAccountsView model
                                    ]

                            Others ->
                                div []
                                    [ h4 [] [ text "OTHERS Accounts" ]
                                    , Utils.MyUtils.infoBtn "BACK TO ACCOUNTS" "back-to-accounts-button" <| ChangeView ManageSell
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

        --, Utils.MyUtils.infoBtn "BACK TO ACCOUNTS" "back-to-accounts-button" <| ChangeView ManageAccounts
        , Html.div [ id "sell.listOfBTCAddresses" ]
            (if List.isEmpty model.listOfBTCAddresses then
                [ Html.div [ class "btc-address-item" ] [ Html.text "There are no BTC accounts set up yet" ] ]

             else
                List.map (\address -> Html.div [ classList [ ( "btc-address-item", True ), ( "address-label", True ) ] ] [ Html.text address ]) model.listOfBTCAddresses
            )
        ]


errorView : Html Msg
errorView =
    Html.div [ class "accounts-container" ]
        [ Html.h1 [ class "accounts-title" ] [ Html.text "Accounts" ]
        , Html.div [ class "error-message", id "accounts-error-message" ]
            [ Html.text "Error: Unable to retrieve relevant data. Please try again later." ]
        ]
