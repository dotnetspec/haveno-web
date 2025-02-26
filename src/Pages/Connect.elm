module Pages.Connect exposing (Model, Msg, init, update, view)

import Comms.CustomGrpc exposing (gotAvailableBalances, gotPrimaryAddress)
import Grpc
import Html exposing (Html, button, div, h1, h2, input, p, text)
import Html.Attributes exposing (class, id, placeholder)
import Html.Events exposing (onClick, onInput)
import Proto.Io.Haveno.Protobuffer as Protobuf



-- Model for connection management


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
    | ConnectionSuccess
    | ConnectionFailed
    | GoBack



-- Initial model


init : () -> ( Model, Cmd Msg )
init _ =
    ( { moneroNode = "default.node.address:18081"
      , customMoneroNode = ""
      , havenoConnected = False
      , walletConnected = False
      , retryingWallet = False
      , retryingHaveno = False
      , connectionAttempts = 0
      , primaryaddress = ""
      }
    , Cmd.none
    )



-- Update function


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        RetryWalletConnection (Ok primaryAddresponse) ->
            ( { model | retryingWallet = False, connectionAttempts = model.connectionAttempts, primaryaddress = primaryAddresponse.primaryAddress, walletConnected = True }, Cmd.none )

        RetryWalletConnection (Err error) ->
            ( { model | retryingWallet = True, connectionAttempts = model.connectionAttempts + 1 }, gotPrimaryAddress |> Grpc.toCmd RetryWalletConnection )

        RetryHavenoConnection ->
            ( { model | retryingHaveno = True }, Cmd.none )

        SetCustomMoneroNode node ->
            ( { model | customMoneroNode = node }, Cmd.none )

        ApplyCustomMoneroNode ->
            ( { model | moneroNode = model.customMoneroNode, customMoneroNode = "" }, Cmd.none )

        ConnectionSuccess ->
            ( { model | havenoConnected = True, walletConnected = True, retryingWallet = False, retryingHaveno = False }, Cmd.none )

        ConnectionFailed ->
            ( { model | retryingWallet = False, retryingHaveno = False }, Cmd.none )

        GoBack ->
            ( model, Cmd.none )



-- NAV: View

view : Model -> Html Msg
view model =
    div [ class "connect-page" ]
        [ h1 [] [ text "Connection Issues" ]
        , h2 [] [ text "Here you can resolve wallet and Haveno connection issues." ]

        -- Monero Wallet Status
        , if not model.walletConnected then
            div []
                [ p [] [ text "⚠ Monero Wallet not connected." ]
                , button [ onClick (RetryWalletConnection (Err <| Grpc.UnknownGrpcStatus "")), id "retryWalletConnection" ] [ text "Retry Wallet Connection" ]

                -- Display Current Monero Node
                , p [] [ text "Current Monero Node:" ]
                , p [ class "current-node" ] [ text model.moneroNode ]
                ]

          else
            text ""

        -- Input & Custom Monero Node (does not depend on gRPC)
        , div []
            [ p [] [ text "Enter a custom Monero node:" ]
            , input
                [ placeholder "Custom Monero Node"
                , onInput SetCustomMoneroNode
                , Html.Attributes.value model.customMoneroNode
                ]
                []
            , button [ onClick ApplyCustomMoneroNode ] [ text "Use Custom Node" ]
            ]

        -- Haveno Node Status
        , if not model.havenoConnected then
            div []
                [ p [ id "havenoNodeNotConnected" ] [ text "⚠ Haveno Node not connected." ]
                , button [ onClick RetryHavenoConnection ] [ text "Retry Haveno Connection" ]
                ]

          else
            text ""

        -- Back Button
        , button [ onClick GoBack ] [ text "Back" ]
        ]
