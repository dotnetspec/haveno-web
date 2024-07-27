module Pages.Contact exposing (Model, Msg, content, init, update, view)

import Html exposing (..)
import Html.Attributes as Attr exposing (..)


type alias Model =
    { status : Status
    , title : String
    , root : Contact
    }


type Contact
    = Contact
        { name : String
        }


type Status
    = Loading



-- | Loaded
-- | Errored


initialModel : Model
initialModel =
    { status = Loading
    , title = "Contact"
    , root = Contact { name = "Loading..." }
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { initialModel | title = "SP Contact" }
    , Cmd.none
    )


type Msg
    = GotInitialModel Model


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotInitialModel newModel ->
            ( { newModel | title = model.title }, Cmd.none )


view : Model -> Html Msg
view _ =
    content


content : Html Msg
content =
    section
        [ Attr.id "page"
        , Attr.class "section-background"
        , class "text-center"
        ]
        [ h1
            [ class "contact" ]
            [ p [] [ text "Call now (+65) 8835 0839" ]
            ]
        , h2 []
            [ a
                [ Attr.href "https://chat.whatsapp.com/KIEF0OD3ICm5vHMdf6iD0A"
                , Attr.target "_blank"
                ]
                [ text "WhatsApp "
                , node "ion-icon"
                    [ Attr.name "logo-whatsapp"
                    ]
                    []
                ]
            ]
        , h2 []
            [ contactForm
            ]
        , div [ Attr.class "data-removal-notice" ] [ text """You have the right to request the removal of your personal data from our system. 
        To do so, please contact us at customer.support@squashpassion.com or squashpassion.com/contact with the message heading 
        containing the text 'REMOVE' followed by the relevant data types (e.g., 'REMOVE: All or Username, Email etc.'). 
        We will process your request within 90 days.""" ]
        ]



-- REF: https://docs.google.com/forms/d/13vXLO5uRHpUWtr6ixKTKvtbJ0ub_cPM08JD91dOMhks/edit


contactForm : Html Msg
contactForm =
    Html.iframe
        [ src "https://docs.google.com/forms/d/e/1FAIpQLSefjgmvWlJOlzfgCdWj1i1dD88sj3kBj110Meib_pVj7Mgatg/viewform?embedded=true"
        , width 640
        , height 750
        , class "containContactForm"
        ]
        []
