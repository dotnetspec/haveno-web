module Pages.Location exposing (Model, Msg, content, init, update, view)

import Buttons.Default exposing (defaultButton)
import Html exposing (..)
import Html.Attributes as Attr exposing (..)


type alias Model =
    { status : Status
    , title : String
    , root : Location
    }


type Location
    = Location
        { name : String
        }


type Status
    = Loading
    -- | Loaded
    -- | Errored


initialModel : Model
initialModel =
    { status = Loading
    , title = "Location"
    , root = Location { name = "Loading..." }
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { initialModel | title = "SP Location" }
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
                [ img [ Attr.class "left_column", src "resources/InText/Yio Chu Kang Sports Centre354X266.png", alt "Yio Chu Kang Squash Center", width 354, height 266, title "Yio Chu Kang Squash Center" ]
                    []
                ]
            , div
                [ class "split-col"
                ]
                [ 
                h1 [ class "text-center" ] [ Html.text "Location" ]
                , h4
                    [ class "text-center" ]
                    [ text "Public Or Private Courts - Your Choice" ]
                , defaultButton "schedule"
                , h5
                    [ class "text-center" ]
                    [ text "Where To Play" ]
                , ul []
                    [ li [] [ Html.text """Squash Passion's base address is: Yio Chu Kang Squash Center, 200 Ang Mo Kio Avenue 9, Singapore 569770 
            """ ]
                    , li [] [ Html.text """If you have a good squash court at your condo, please book there and I can meet you at the courts. If you
            do not have access to private courts there are 4 public squash centers available in Singapore. If you are happy to book yourself you can via
            """, a [ Attr.href "https://members.myactivesg.com" ] [ Html.text "ActiveSG Bookings" ], span [] [ Html.text """. Otherwise, I can book the court on your behalf (from between S$3 and S$10) once I have the time/date. Here are the details of the 
            4 public squash centers: """ ] ]
                    , li [] [ a [ Attr.href "https://www.myactivesg.com/facilities/kallang-squash-centre" ] [ Html.text "Kallang Squash Center" ], a [ Attr.href "https://goo.gl/maps/q66K2NNUwUqw5y8G9" ] [ Html.text " - View Map" ] ]
                    , li [] [ a [ Attr.href "https://www.myactivesg.com/facilities/yio-chu-kang-squash-centre" ] [ Html.text "Yio Chu Kang Squash Center" ], a [ Attr.href "https://goo.gl/maps/kfoYSbVveRSMvQio7" ] [ Html.text " - View Map" ] ]
                    , li [] [ a [ Attr.href "https://www.myactivesg.com/facilities/st-wilfred-squash-centre" ] [ Html.text "St. Wilfred's Squash Center" ], a [ Attr.href "https://goo.gl/maps/koYfatvgsuY9krvX6" ] [ Html.text " - View Map" ] ]
                    , li [] [ a [ Attr.href "https://www.myactivesg.com/facilities/burghley-squash-centre" ] [ Html.text "Burghley Squash Center" ], a [ Attr.href "https://goo.gl/maps/3ZB34bmv49Uhzjxs8" ] [ Html.text " - View Map" ] ]
                    ]
                ]
            , div
                [ class "split-col"
                ]
                [ img [ Attr.class "right_column", src "resources/InText/Kallang Squash and Tennis Centre354X266.png", alt "Kallang Squash Center", width 354, height 266, title "Kallang Squash Center" ]
                    []
                ]
            ]
        ]
