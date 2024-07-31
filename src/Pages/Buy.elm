module Pages.Buy exposing (Model, Msg, content, init, update, view)

import Buttons.Default exposing (defaultButton)
import Html exposing (..)
import Html.Attributes as Attr exposing (..)




-- NOTE: To determine. What is the relationship between this model and the one in Main?


type alias Model =
    { status : Status
    , title : String
    , root : Buy
    }


type Buy
    = Buy
        { name : String
        }


type Status
    = Loading
    -- | Loaded
    -- | Errored


initialModel : Model
initialModel =
    { status = Loading
    , title = "Buy"
    , root = Buy { name = "Loading..." }
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { initialModel | title = "Haveno-Web Buy" }
    , Cmd.none
    )


type Msg
    = GotInitialModel Model


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotInitialModel newModel ->
            ( { newModel | title = model.title }, Cmd.none )


view : Model -> Html msg
view _ =
    content


content : Html msg
content =
    section
        [ Attr.id "page"
        , Attr.class "section-background"
        , class "text-center"
        ]
        [ 
        ul
            []
            [ h1 [class "pricing"] [ text "Buy" ]
            , defaultButton "hardware"
            
            ]
        ]
