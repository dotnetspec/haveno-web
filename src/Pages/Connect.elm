module Pages.Connect exposing (Model, Msg, init, update, view)

import Html exposing (Html, a, button, div, h1, input, p, text)
import Html.Attributes exposing (class, placeholder)
import Html.Events exposing (onClick, onInput)



-- Model for connection management


type alias Model =
    { moneroNode : String -- Currently active Monero node
    , customMoneroNode : String -- User-entered node before applying
    , havenoConnected : Bool
    , walletConnected : Bool
    , retryingWallet : Bool
    , retryingHaveno : Bool
    , connectionAttempts : Int
    }



-- Messages for user actions


type Msg
    = RetryWalletConnection
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
      }
    , Cmd.none
    )



-- Update function


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        RetryWalletConnection ->
            ( { model | retryingWallet = True, connectionAttempts = model.connectionAttempts + 1 }, Cmd.none )

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
        , p [] [ text "Here you can resolve wallet and Haveno connection issues." ]

        -- Monero Wallet Status
        , if not model.walletConnected then
            div []
                [ p [] [ text "⚠ Monero Wallet not connected." ]
                , button [ onClick RetryWalletConnection ] [ text "Retry Wallet Connection" ]

                -- Display Current Monero Node
                , p [] [ text "Current Monero Node:" ]
                , p [ class "current-node" ] [ text model.moneroNode ]

                -- Input for Custom Monero Node
                , p [] [ text "Enter a custom Monero node:" ]
                , input
                    [ placeholder "Custom Monero Node"
                    , onInput SetCustomMoneroNode
                    , Html.Attributes.value model.customMoneroNode
                    ]
                    []

                -- Apply Custom Monero Node
                , button [ onClick ApplyCustomMoneroNode ] [ text "Use Custom Node" ]
                ]

          else
            text ""

        -- Haveno Node Status
        , if not model.havenoConnected then
            div []
                [ p [] [ text "⚠ Haveno Node not connected." ]
                , button [ onClick RetryHavenoConnection ] [ text "Retry Haveno Connection" ]
                ]

          else
            text ""

        -- Back Button
        , button [ onClick GoBack ] [ text "Back" ]
        ]
