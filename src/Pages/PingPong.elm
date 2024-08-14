module Pages.PingPong exposing (..)

import Browser
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)
import Http
import Json.Decode exposing (..)
import Json.Encode exposing (..)



-- MODEL


{- type alias Model =
    String -}

{- 
init : () -> ( Model, Cmd Msg )
init _ =
    ( "Nothing sent yet", Cmd.none ) -}


type alias Model =
    { status : Status
    , title : String
    , root : PingPong
    }


type PingPong
    = PingPong
        { name : String
        }


type Status
    = Loading
    -- | Loaded
    -- | Errored


initialModel : Model
initialModel =
    { status = Loading
    , title = "PingPong"
    , root = PingPong { name = "Ready..." }
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { initialModel | title = "Haveno-Web Buy" }
    , Cmd.none
    )



-- UPDATE


type Msg
    = Send
    | Receive (Result Http.Error PongResponse)
    | GotInitialModel Model


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotInitialModel newModel ->
            ( { newModel | title = model.title }, Cmd.none )

        Send ->
            let
                therequest =
                    Http.request
                        { url = "http://localhost:9001/ping"
                        , body = Http.jsonBody (encodePingRequest { message = "Ping" })
                        , expect = Http.expectJson Receive decodePongResponse
                        , method = "POST"
                        , headers = []
                        , timeout = Nothing
                        , tracker = Nothing
                        }
            in
            ( {model | root = PingPong { name = "Sending ..." }}, therequest )

        Receive (Ok response) ->
            ( {model | root = PingPong { name = "Received: " ++ response.message}}, Cmd.none )

        Receive (Err _) ->
            ( {model | root = PingPong { name = "Error receiving response"}}, Cmd.none )

--

-- VIEW


view : Model -> Html Msg
view model =
    case model.root of
        PingPong { name } ->
            div []
                [ text name
                , button [ onClick Send ] [ text "Send Ping" ]
                ]




-- JSON ENCODING/DECODING


type alias PongResponse =
    { message : String }


decodePongResponse : Decoder PongResponse
decodePongResponse =
    Json.Decode.map PongResponse (Json.Decode.field "message" Json.Decode.string)


type alias PingRequest =
    { message : String }


encodePingRequest : PingRequest -> Json.Encode.Value
encodePingRequest request =
    Json.Encode.object [ ( "message", Json.Encode.string request.message ) ]
