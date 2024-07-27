module Pages.Privacy exposing (Model, Msg, content, init, update, view)

import Buttons.Default exposing (defaultButton)
import Html exposing (..)
import Html.Attributes as Attr exposing (..)


type alias Model =
    { status : Status
    , title : String
    , root : Privacy
    }


type Privacy
    = Privacy
        { name : String
        }


type Status
    = Loading



-- | Loaded
-- | Errored


initialModel : Model
initialModel =
    { status = Loading
    , title = "Privacy"
    , root = Privacy { name = "Loading..." }
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { initialModel | title = "SP Privacy" }
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
            [ h1 []
                [ text "Data Privacy Policy for SquashPassion.com" ]
            , defaultButton "schedule"
            , p []
                [ text """Effective Date: 13 Sept 2023""" ]
            , h2 []
                [ text "Introduction" ]
            , p []
                [ text """At SquashPassion.com, we are committed to protecting your privacy and ensuring that your personal information is handled responsibly. This Data Privacy Policy explains how we collect, use, and protect your personal data. By using our website and services, you consent to the practices described in this policy. """ ]
            , h2 []
                [ text "Information We Collect" ]
            , p []
                [ text """We collect and process the following types of personal data:

    User Account Information: To identify you at the courts and for any necessary communications we collect 
    your username, email address, and any other information you choose to provide during registration, on your first visit.

    Session Data: We collect data related to your coaching sessions, including session times, coach 
    information, and payment details for financial accounting and session provision.""" ]
            , h2 []
                [ text "Use of Personal Data" ]
            , p []
                [ text """We use your personal data for the following purposes:

    User Account Management: To manage your user account, including login credentials, profile settings, and communication related to your account.

    Financial Accounting: To process payments, track billing information, and maintain financial records.

    Session Provision: To schedule, coordinate, and provide coaching sessions as requested.

    Customer Support: To respond to your inquiries, comments, or requests for assistance. """ ]
            , h2 []
                [ text "Data Sharing" ]
            , p []
                [ text """We do not share your personal data with third parties for marketing purposes or any other reasons. Your data is used solely for the purposes described in this policy. """ ]
            , h2 []
                [ text "Data Removal" ]
            , p []
                [ text """You have the right to request the removal of your personal data from our system. To do so, please contact us at customer.support@squashpassion.com or
                squashpassion.com/contact with the message heading 
                containing the text 'REMOVE' followed by the relevant data types (e.g., 'REMOVE: Username, Email'). 
                We will process your request within 90 days.""" ]
            , p []
                [ h2 []
                    [ text "Changes to this Policy" ]
                , text """We may update this Data Privacy Policy to reflect changes to our practices or for 
                other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the revised policy on our website."""
                ]

            , h2 []
                [ text "Contact Us" ]
            , p []
                [ text """If you have any questions or concerns about our Data Privacy Policy or how we handle your personal data, please contact us at customer.support@squashpassion.com or
                squashpassion.com/contact.
                
                Thank you for choosing SquashPassion.com. We are committed to providing you with a secure and enjoyable experience.""" ]
            
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
