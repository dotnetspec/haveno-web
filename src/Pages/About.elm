module Pages.About exposing (Model, Msg, content, init, update, view)

import Buttons.Default exposing (defaultButton)
import Html exposing (..)
import Html.Attributes as Attr exposing (..)


type alias Model =
    { status : Status
    , title : String
    , root : About
    }



-- NOTE: Don't confuse this About with the Route type in Main


type About
    = About
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
    , title = "About"
    , root = About { name = "Loading..." }
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { initialModel | title = "SP About" }
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
    section [ Attr.id "page", class "section-background" ]
        [ div
            [ class "container container--narrow"
            ]
            [ img [ src "resources/Partners/philatYCKSquashCenter.png", alt "Squash Partner Phil", width 494, height 458, title "Squash Partner Phil", Attr.class "philImage" ]
                []
            ]
        , div [ class "split" ]
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
                    [ text "About" ]
                , h3
                    [ class "text-center" ]
                    [ text "Good Squash" ]
                    , defaultButton "schedule"
                , ul
                    []
                    [ li [ Attr.class "about-us-list" ] [ Html.text """I understand that, as a long time, passionate squash player, you have your own network of squash partners on hand
                to get your squash 'fix'. I'm here for those times when, for whatever reason, you are having difficulty securing a partner at a convenient
                time and location and you simply want to get on court with someone you know will match your standard and/or help you understand your game better with the
                minimum of fuss.""" ]
                    , li [ Attr.class "about-us-list" ] [ Html.text """I have been working with Squash Passion for over 12 years helping hundreds of 
            players at all levels develop their game to their fullest potential. My credentials include: """ ]
                    , li [ Attr.class "about-us-list" ] [ a [ Attr.href "https://wsfworldmasters.com/" ] [ Html.text "World Squash Masters 2012 - Top 8-16" ] ]
                    , li [ Attr.class "about-us-list" ] [ a [ Attr.href "https://www.sgsquash.com/" ] [ Html.text "Singapore Squash Masters 2013 - Champion" ] ]
                    , li [ Attr.class "about-us-list" ] [ a [ Attr.href "https://englandsquashmasters.co.uk/" ] [ Html.text "British Open Squash Masters 2013 - Quarter Finalist" ] ]
                    , li [ Attr.class "about-us-list" ]
                        [ a [ Attr.href "https://www.sportyhq.com/league/view/division_rankings/1845" ] [ Html.text "Former A grade - Singapore National Squash League Player" ]
                        , Html.text " for multi 'Club of the Year' winning "
                        , a [ Attr.href "http://ucsc.sg" ] [ Html.text "UCSC" ]
                        ]
                    , li [ Attr.class "about-us-list" ] [ a [ Attr.href "https://www.sgsquash.com/" ] [ Html.text "Fully Qualified Squash Coach - 20+ years " ] ]
                    ]
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
