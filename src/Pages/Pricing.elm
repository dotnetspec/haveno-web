module Pages.Pricing exposing (Model, Msg, content, init, update, view)

import Buttons.Default exposing (defaultButton)
import Html exposing (..)
import Html.Attributes as Attr exposing (..)




-- NOTE: To determine. What is the relationship between this model and the one in Main?


type alias Model =
    { status : Status
    , title : String
    , root : Pricing
    }


type Pricing
    = Pricing
        { name : String
        }


type Status
    = Loading
    -- | Loaded
    -- | Errored


initialModel : Model
initialModel =
    { status = Loading
    , title = "Pricing"
    , root = Pricing { name = "Loading..." }
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { initialModel | title = "SP Pricing" }
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
            [ h1 [class "pricing"] [ text "How Much Does It Cost?" ]
            , defaultButton "schedule"
            , text "An intoductory/trial session is just "
            , p [ style "font-weight" "bold" ] [ text "S$10" ]
            , p [] [ text "+ court fee*." ]
            , p [] [ text "If you decide to continue sessions hourly price is S$40 + court fee." ]
            , p [] [ text """*Court fees are determined by SGActive rates and are between S$3 and S$10""" ]
            , p [] [ text """Any questions? Please contact me for more info""" ]
            ]
        ]
