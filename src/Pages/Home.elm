module Pages.Home exposing (Model, Msg, content, init, update, view)

{-| The homepage. You can get here via either the / or /#/ routes.
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
    , root : Home
    }


type Home
    = Home
        { name : String
        }


type Status
    = Loading
    -- | Loaded
    -- | Errored


initialModel : Model
initialModel =
    { status = Loading
    , title = "Home"
    , root = Home { name = "Loading..." }
    }



{- -- NOTE: by calling (from Main) Tuple.first (Home.init ()) , we’ll end up with
   the Home.Model value we seek. () means we don't really care what goes in, we just
   want the output (in this case the model (slightly modified))
-}


init : () -> ( Model, Cmd Msg )
init _ =
    ( { initialModel | title = "SP Home" }
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
            [ h1 [ classList [( "text-center", True), ( "home", True)]]
                [ text "SportRank" ]
            , h2 [ class "text-center" ]
                [ text "Where You're At" ]
            , div [ class "split" ]
                [ 
                    div [ class "split-col" ]
                    [ img
                        [ src "resources/InText/busy_executive416x409.png"
                        , alt "Squash Partner for Busy Exec"
                        , width 416
                        , height 409
                        , title "Squash Partner Busy Exec"
                        ]
                        []
                        , defaultButton "schedule"
                    , h4 []
                        [ text "Busy Executives" ]
                    , h5 []
                        [ text "No Fuss - Just Great Squash" ]
                    , p []
                        [ text "You played a lot in your home country or before a break and don't want to lose out now." ]
                    , p []
                        [ text "Attempting to fit squash in with everything else is sometimes easier said than done." ]
                    , p []
                        [ text "Turn the talk into action and make it happen with a trial today. Leave the details to us." ]
                    ]
                , div [ class "split-col" ]
                    [ img
                        [ src "resources/InText/seasoned_players_416X409.png"
                        , alt "Seasoned Squash Players"
                        , width 416
                        , height 409
                        , title "Seasoned Squash Players"
                        ]
                        []
                        , defaultButton "schedule"
                    , h4 []
                        [ text "Seasoned Players" ]
                    , h5 []
                        [ text "Get On Court And Play ... Today" ]
                    , p []
                        [ text "You're already a strong player who's enjoyed the game for years." ]
                    , p []
                        [ text "You know the great health benefits squash brings to your life. Not to mention the enjoyment and satisfaction of a good game, well played." ]
                    , p []
                        [ text "However, finding a good, reliable, partner can prove difficult." ]
                    ]
               
               , div [ class "split-col" ]
                    [ img
                        [ src "resources/InText/Junior_Squash_Partner_Bharat_ 416X409.png"
                        , alt "Squash Partner Phil and Junior Partner"
                        , width 416
                        , height 409
                        , title "Squash Partner Phil and Junior Partner"
                        ]
                        []
                    , defaultButton "schedule"
                    , h4 []
                        [ text "Developing Juniors" ]
                    , h5 []
                        [ text "Experience Fastrack" ]
                    , p []
                        [ text "As you develop it is essential you spend time on court with players that know what they're doing and don't encourage bad habits." ]
                    , p []
                        [ text "I can help you with exercises, routines, conditioned games and full games to develop your strengths and minimize your weaknesses." ]
                    , p []
                        [ text "In addition to improving your technical skills, I can also help you enhance your tactical thinking and mental approach on court." ]
                    ]
                ]
            ]
        ]
