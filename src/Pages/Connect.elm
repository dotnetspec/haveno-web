module Pages.Connect exposing (Model, Msg, init, initialModel, update, view)

import Comms.CustomGrpc exposing (gotPrimaryAddress)
import Grpc
import Html exposing (Html, button, div, h1, h2, input, p, text)
import Html.Attributes exposing (class, id, placeholder)
import Html.Events exposing (onClick, onInput)
import Proto.Io.Haveno.Protobuffer as Protobuf
import Utils.MyUtils



-- NAV: Model


type alias Model =
    { moneroNode : String -- Currently active Monero node
    , customMoneroNode : String -- User-entered node before applying
    , havenoConnected : Bool
    , walletConnected : Bool
    , retryingWallet : Bool
    , retryingHaveno : Bool
    , connectionAttempts : Int
    , primaryaddress : String
    }



-- Messages for user actions


type Msg
    = RetryWalletConnection (Result Grpc.Error Protobuf.GetXmrPrimaryAddressReply)
    | RetryHavenoConnection
    | SetCustomMoneroNode String
    | ApplyCustomMoneroNode
    | GoBack


initialModel : Model
initialModel =
    { moneroNode = "node.haveno.network:17750"
    , customMoneroNode = ""
    , havenoConnected = False
    , walletConnected = False
    , retryingWallet = False
    , retryingHaveno = False
    , connectionAttempts = 0
    , primaryaddress = ""
    }



-- NAV: Init


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel
    --, Comms.CustomGrpc.gotPrimaryAddress |> Grpc.toCmd RetryWalletConnection
    , Cmd.none
    )



-- Update function


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        RetryWalletConnection (Ok primaryAddresponse) ->
            ( { model | retryingWallet = False, connectionAttempts = model.connectionAttempts, primaryaddress = primaryAddresponse.primaryAddress, walletConnected = True }, Cmd.none )

        RetryWalletConnection (Err _) ->
            ( { model | retryingWallet = True, connectionAttempts = model.connectionAttempts + 1 }, gotPrimaryAddress |> Grpc.toCmd RetryWalletConnection )

        RetryHavenoConnection ->
            ( { model | retryingHaveno = True }, Cmd.none )

        SetCustomMoneroNode node ->
            ( { model | customMoneroNode = node }, Cmd.none )

        ApplyCustomMoneroNode ->
            ( { model | moneroNode = model.customMoneroNode, customMoneroNode = "" }, Cmd.none )

        GoBack ->
            ( model, Cmd.none )



-- NAV: View


view : Model -> Html Msg
view model =
    div [ class "funds-container" ]
        [ h1 [ class "funds-title" ] [ text "Connection Issues" ]
        , h2 [ class "funds-title" ] [ text "Here you can resolve wallet and Haveno connection issues." ]

        -- Monero Wallet Status
        , if not model.walletConnected then
            div []
                [ p [ id "walletNotConnectedWarning" ] [ text "⚠ Monero Wallet not connected." ]
                , p []
                    [ button [ class "info-button", id "retryWalletConnectionButton", onClick <| RetryWalletConnection (Err <| Grpc.UnknownGrpcStatus "") ] [ text "Retry Monero Wallet Connection" ] ]
                , p [] [ text "Current Monero Node:" ]
                , p [ class "current-node" ] [ text model.moneroNode ]
                ]

          else
            p [ id "walletNotConnectedWarning" ] [ text "" ]

        -- Input & Custom Monero Node (does not depend on gRPC)
        , div []
            [ p [] [ text "Enter a custom Monero node:" ]
            , input
                [ placeholder "Custom Monero Node"
                , onInput SetCustomMoneroNode
                , Html.Attributes.value model.customMoneroNode
                ]
                []
            , p [ id "retryHavenoConnectionButton" ] [ Utils.MyUtils.infoBtn "Use Custom Node" <| ApplyCustomMoneroNode ]
            ]

        -- Haveno Node Status
        , if not model.havenoConnected then
            div []
                [ p [ id "havenoNodeNotConnected" ] [ text "⚠ Haveno Node not connected." ]
                , p [ id "retryHavenoConnectionButton" ] [ Utils.MyUtils.infoBtn "Retry Haveno Connection" <| RetryHavenoConnection ]
                ]

          else
            text ""
        ]



-- NAV: View helpers:
{- custodialFundsView : Model -> Html Msg
   custodialFundsView model =
       Html.div [ class "funds-container", id "custodialFundsView" ]
           [ Html.h1 [ class "funds-title" ] [ Html.text "Funds" ]
           , primaryAddressView model
           , xmrBalView model
           , Html.div [ id "btcbalance", class "balance-text" ]
               [ Html.text ("Available BTC Balance: " ++ btcBalanceAsString model.balances ++ " BTC") ]
           , Html.div [ id "reservedOfferBalance", class "balance-text" ]
               [ Html.text ("Reserved Offer Balance: " ++ reservedOfferBalanceAsString model.balances ++ " XMR") ]
           , MyUtils.infoBtn "New Sub Address" <| ClickedGotNewSubaddress
           ]
-}
