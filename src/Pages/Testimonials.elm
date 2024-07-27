module Pages.Testimonials exposing (Model, Msg, content, init, update, view)

import Buttons.Default exposing (defaultButton)
import Html exposing (..)
import Html.Attributes as Attr exposing (..)


type alias Model =
    { status : Status
    , title : String
    , root : Testimonials
    }


type Testimonials
    = Testimonials
        { name : String
        }


type Status
    = Loading
    -- | Loaded
    -- | Errored


initialModel : Model
initialModel =
    { status = Loading
    , title = "Testimonials"
    , root = Testimonials { name = "Loading..." }
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { initialModel | title = "SP Testimonials" }
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
        h1 [ classList [( "text-center", True), ( "testimonial", True)] ] [ Html.text "Testimonials" ]
        , h4
            [ class "text-center" ]
            [ text "What Previous Players Have Gained From Their Sessions"
            {- -- HACK:style on the button  -}
            , div[class "text-center", style "margin-top" "1rem"][defaultButton "schedule"] ]
        
        , div [ class "split" ]
            [ div
                [ Attr.class "split-col"
                ]
                [ Html.blockquote [ Attr.cite "Conall Platts - CEO" ] [ text """'I travel a lot and connect with squash partners all over the world; I can genuinely
           recommend Squash Passion, both for their professional approach to scheduling and for their 
           skillful, personable and stretching coaching'""" ]
                , p [] [ text "Conall Platts - CEO" ]
                , Html.blockquote [ Attr.cite "Deborah Ng - Seminar Trainer" ] [ text """'After taking up Sessions with Squash Passion I am beginning to appreciate 
        the game more than I have ever known before'.""" ]
                , p [] [ text "Deborah Ng - Seminar Trainer" ]
                ]
            , div
                [ Attr.class "split-col"
                ]
                [ Html.blockquote [ Attr.cite "Samuel Kang" ] [ text """'Phil at Squash Passion really helped me to create a solid foundation for my game. His understanding of squash fundamentals has 
 been one of the key reasons for the improvements I have made. Anyone who has the opportunity to receive advice or 
 coaching from him will benefit 
 tremendously from his wealth of experience in the game'.""" ]
                , p [] [ a [ Attr.href "https://www.straitstimes.com/sport/squash-contrasting-wins-but-samuel-kang-au-yeong-wai-yhann-are-national-champions-again" ] [ text "Samuel Kang - Singapore's first ever Australian Open Champion (U-19) 2009" ] ]
                , Html.blockquote [ Attr.cite "Tomas Antonelius - Commercial Manager" ] [ text """'Squash Passion has enhanced my game enormously. The results achieved in a short period of a few weeks were fantastic. I am very, very 
                    happy with the coaching I received and can wholeheartedly recommend it to anyone who is considering taking up sessions'""" ]
                , p [] [ a [ Attr.href "https://nl.linkedin.com/in/tomas-antonelius-85bab710?original_referer=https%3A%2F%2Fwww.google.com%2F" ] [ text "Tomas Antonelius - Commercial Manager" ] ]
                ]
            , div
                [ Attr.class "split-col"
                ]
                [ Html.blockquote [ Attr.cite "Roger Winter - Engineer" ] [ text """'The difference Squash Passion has made to my game in a short time is more than I would have improved in years without their coaching.'""" ]
                , p [] [ text "Roger Winter - Engineer" ]
                , Html.blockquote [ Attr.cite "Jack Mozely" ] [ text """'I would recommend Phil to anyone looking to improve their game. Having played squash very                        
                            regularly for a number of years and at university,                        
                            I found that my game had reached a plateau and was a little frustrated at lack of progress.                        
                            Phil very quickly overhauled my technique and brought significant improvements through his                        
                            expert and methodical approach, with a close attention to detail, rapidly identifying existing weak spots or 
                            developing bad habits. He also made the sessions extremely enjoyable and challenging.'.""" ]
                , p [] [ text "Jack Mozely" ]
                ]
            ]
        ]
