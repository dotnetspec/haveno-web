module Pages.Dashboard exposing (Model, Msg, content, init, update, view)

{-| The Dashboardpage. You can get here via either the / or /#/ routes.
-}

import Buttons.Default exposing (defaultButton)
import Html exposing (..)
import Html.Attributes as Attr exposing (..)



{- -- NOTE: The Model will contain all the data relevant to this kind of page. If this page,
   or a similar one became more sophisticated, you would start modelling it's data here. If things
   start getting tricky (lots of difficult changes to existing code), ask yourself if you need a similar,
   but different, data structure (e.g. Page AND Route)
-}


type alias Model =
    { status : Status
    , title : String
    , root : Dashboard
    }


type Dashboard
    = Dashboard
        { name : String
        }


type Status
    = Loading



-- | Loaded
-- | Errored


initialModel : Model
initialModel =
    { status = Loading
    , title = "Dashboard"
    , root = Dashboard { name = "Loading..." }
    }



{- -- NOTE: by calling (from Main) Tuple.first (Dashboard.init ()) , we’ll end up with
   the Dashboard.Model value we seek. () means we don't really care what goes in, we just
   want the output (in this case the model (slightly modified))
-}


init : () -> ( Model, Cmd Msg )
init _ =
    ( { initialModel | title = "Haveno-Web Dashboard" }
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
    section [ Attr.id "page", class "section-background" ]
        [ div [ class "container container--narrow" ]
            [ h1 [ classList [ ( "text-center", True ), ( "Dashboard", True ) ] ]
                [ text "Haveno Web" ]
            , h2 [ class "text-center" ]
                [ text "Online Dex" ]
            , div []
                [ div [ class "text-center" ]
                    [ text "Welcome to Haveno Web, the online decentralized exchange for Haveno, the private, untraceable cryptocurrency."
                    
                    
                    ]
                ]
            , div []
                [ div [ class "text-center" ]
                    [ text "Your balance is:"
                    ]
                ]
            ]
        ]
