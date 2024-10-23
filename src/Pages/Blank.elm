module Pages.Blank exposing (..)
import Buttons.Default exposing (defaultButton)
import Html exposing (..)
import Html.Attributes as Attr exposing (..)


type alias Model =
    { status : Status
    , title : String
    , root : Blank
    }


type Blank
    = Blank
        { name : String
        }


type Status
    = Loading
    -- | Loaded
    -- | Errored


initialModel : Model
initialModel =
    { status = Loading
    , title = "Blank"
    , root = Blank { name = "Loading..." }
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { initialModel | title = "Haveno-Web Main" }
    , Cmd.none
    )


type Msg
    = GotInitialModel Model


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        {- -- NOTE: This was originally setup to work with an Http Result (branch on OK and Err)
           but we're just handling the initialModel - not really doing much
        -}
        GotInitialModel newModel ->
            ( { newModel | title = model.title }, Cmd.none )



-- NOTE: Our view will be Html msg, not Document
-- as we won't use 'title' etc. cos we have our own formatting


view : Model -> Html msg
view _ =
    content


content : Html msg
content =
    section
        [ class "section-background"
        , Attr.id "page"
        ]
        [ {- -- NOTE: Need an extra div here to set the class, to center the button -} 
        -- NOTE: This is a placeholder for the Blank page
        {- h1 [ classList [( "text-center", True), ( "testimonial", True)] ] [ Html.text "Blank" ]
        , h4
            [ class "text-center" ]
            [ text "Blank your crypto here" 
            {- -- HACK:style on the button  -}
            , div[class "text-center", style "margin-top" "1rem"][defaultButton "hardware"] ]
         -}
        
        ]
