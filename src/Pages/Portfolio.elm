module Pages.Portfolio exposing (Model, Msg, content, init, update, view)

import Buttons.Default exposing (defaultButton)
import Html exposing (..)
import Html.Attributes as Attr exposing (..)


type alias Model =
    { status : Status
    , title : String
    , root : Portfolio
    }


type Portfolio
    = Portfolio
        { name : String
        }


type Status
    = Loading



-- | Loaded
-- | Errored


initialModel : Model
initialModel =
    { status = Loading
    , title = "Portfolio"
    , root = Portfolio { name = "Loading..." }
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { initialModel | title = "Haveno-Web Portfolio" }
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
    div
        [ Attr.id "page"
        ]
        [ {- start content -}
          div
            [ Attr.id "content"
            , Attr.class "col3-column"
            ]
            [ htmlContent
            ]
        ]


htmlContent : Html msg
htmlContent =
    section
        [ Attr.id "page"
        , Attr.class "section-background"
        , class "text-center"
        , class "split"
        ]
        [ {- -- NOTE: Placeholder -}
          div
            [ Attr.class "split-col"
            ]
            [ h1
                []
                [ text "" ]
            ]
        , div
            [ Attr.class "split-col"
            ]
            [ {- -- HACK: -}
              --   h6 [ Attr.style "margin-top" "0px" ]
              --     [ text "_ " ]
              h1 []
                [ text "Portfolio" ]
            , h3 []
                [ text "Info " ]
            , defaultButton "hardware"
            , p []
                [ text """Any text              """ ]
            ]

        --]
        {- -- NOTE: Placeholder -}
        , div
            [ Attr.class "split-col"
            ]
            [ h1
                []
                [ text "" ]
            ]
        ]
