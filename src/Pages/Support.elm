module Pages.Support exposing (Model, Msg, content, init, update, view, initialModel)

import Buttons.Default exposing (defaultButton)
import Html exposing (..)
import Html.Attributes as Attr exposing (..)


type alias Model =
    { status : Status
    , title : String
    , root : Support
    }


type Support
    = Support
        { name : String
        }


type Status
    = Loading
    -- | Loaded
    -- | Errored


initialModel : Model
initialModel =
    { status = Loading
    , title = "Support"
    , root = Support { name = "Loading..." }
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { initialModel | title = "Haveno-Web Support" }
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
        [ class "section-background"
        , Attr.id "page"
        ]
        [ {- -- NOTE: Use elements not divs, unless necessary -}
          div [ class "split" ]
            [ div
                [ class "split-col"
                ]
                [ 
                ]
            , div
                [ class "split-col"
                ]
                [ 
                h1 [ class "text-center" ] [ Html.text "Support" ]
                , p [ class "text-center" ] [ Html.text "We're here to help you with any issues you may have." ]
                , defaultButton "hardware"
                
                
                ]
            , div
                [ class "split-col"
                ]
                [ 
                ]
            ]
        ]
