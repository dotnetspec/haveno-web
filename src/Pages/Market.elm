module Pages.Market exposing (Model, Msg, content, init, update, view)

import Buttons.Default exposing (defaultButton)
import Html exposing (..)
import Html.Attributes as Attr exposing (..)


type alias Model =
    { status : Status
    , title : String
    , root : Market
    }



-- NOTE: Don't confuse this Market with the Route type in Main


type Market
    = Market
        { -- NOTE: Is this the string obtained from the parser?
          name : String
        }


type Status
    = Loading
    -- | Loaded
    -- | Errored


initialModel : Model
initialModel =
    { status = Loading
    , title = "Market"
    , root = Market { name = "Loading..." }
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { initialModel | title = "Haveno-Web Market" }
    -- HACK: Just used to satisfy elm-reveiw for now
    , Cmd.map GotInitialModel Cmd.none
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
    section [ Attr.id "page", class "section-background" ]
        [ div [ class "split" ]
            [ {- -- NOTE: Placeholder -}
              div
                [ Attr.class "split-col"
                ]
                [ h6
                    []
                    [ text "" ]
                ]
            , div
                [ Attr.class "split-col"
                ]
                [ 
                h1
                    [ class "text-center" ]
                    [ text "Market" ]
                , h3
                    [ class "text-center" ]
                    [ text "" ]
                    , defaultButton "hardware"
                
                ]
            , {- -- NOTE: Placeholder -}
              div
                [ Attr.class "split-col"
                ]
                [ h6
                    []
                    [ text "" ]
                ]
            ]
        ]
