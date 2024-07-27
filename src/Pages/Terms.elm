module Pages.Terms exposing (Model, Msg, content, init, update, view)

import Buttons.Default exposing (defaultButton)
import Html exposing (..)
import Html.Attributes as Attr exposing (..)


type alias Model =
    { status : Status
    , title : String
    , root : Terms
    }


type Terms
    = Terms
        { name : String
        }


type Status
    = Loading



-- | Loaded
-- | Errored


initialModel : Model
initialModel =
    { status = Loading
    , title = "Terms"
    , root = Terms { name = "Loading..." }
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { initialModel | title = "SP Terms" }
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
                [ text "Terms And Conditions " ]
            , h3 []
                [ text "Bookings " ]
            , defaultButton "schedule"
            , p []
                [ text """Within 2 hours a $10 cancellation + court fee will apply. Outside of 2 hours there is no limit on the number of updates that can be made to a session timing.                    
        To ensure clarity and eliminate misunderstanding all communications are preferrably by email or whatsapp primarily. 
        Any  cancellations or no show made by a Squash Passion                    
        partner within 2 hours of the session commencing will result in a re-scheduling of the relevant                    
        session and the award of a free extra session                    to the squash playing customer in compensation.                    
                            
        In case of dispute or otherwise, Squash Passion's system scheduler (if used), PayPal, banking, email, whatsapp and                    
        internal                    data records will be the only sources relied upon to accurately determine customer's payment                    
        history.                    In all events (including, but not restricted to, the above) resolution is at the absolute and final                   
         discretion of Squash Passion.                """ ]
            , h2 []
                [ text "Courts " ]
            , p []
                [ text """Squash Passion will make a public squash court booking on behalf of the customer if requested and the court booking fee 
        will be added to the session cost.                    
        In the case of condominium facilities the provision of suitable and fully functional squash court(s) are entirely the responsibility of                    
        the customer. The customer is expected to ensure that no extenuating circumstances (e.g. access to                    
        condominium facilities, renovations) prevent the Squash Passion partner from completing the scheduled Session(s) on                    
        time.                    The customer is also responsible for ensuring that any extraneous requirements (e.g. partner                   
         registration fee) imposed by 3rd parties (e.g. condominium management) are met before Session(s)                    commence.                """ ]
            , h2 []
                [ text "Prices" ]
            , p []
                [ text "Squash Passion reserves the right to change prices without notice, although generally this would be an exception and normally users will be given at least 1 months notice of upcoming price changes.                    These terms constitute notice that the standard price will increase approximately                    in line with the Singapore inflation rate annually on 1st January each year. " ]
            , h2 []
                [ text "Injury" ]
            , p []
                [ text "Squash Passion accepts no liability whatsoever for personal injury. Squash is a physically demanding sport and it is entirely the responsibility                    of the student to ensure that he/she is medically fit enough to play and perform any                    instructions/routines/games etc. specified by the partner. The student also accepts                    full responsibility for any accident that may occur during the course of a session " ]
            , h2 []
                [ text "Acceptance of Control Terms " ]
            , p []
                [ text """By accessing, browsing and/or using this site ("Site"), you acknowledge that you have read, 
                understood, and agree, to be bound by these terms and to comply with all applicable local, national and international laws and regulations. 
                If you do not agree to these                    terms, do not                    use this Site. The materials provided on this Site is protected by law. 
                Any                    claim relating to, and the use of, this Site and the materials contained herein                    
                are governed by the laws of Singapore. """ ]
            , h2 []
                [ text "Use Restrictions " ]
            , p []
                [ text """The copyright in all material provided on this Site is held by Squash Passion or by relevant third parties ("Copyright Owner"). 
                Except as stated herein, none                    of the material may be copied, reproduced, distributed, republished, downloaded,                   
                 displayed, posted or transmitted in any form or by any means, including, but not                    limited to, electronic, mechanical, photocopying, 
                 recording, or otherwise,                    without the prior written permission of Squash Passion or the relevant                    Copyright Owner. 
                 Permission is granted to display, copy, distribute and download                    the materials on this Site for personal, non-commercial use only, 
                 provided you                    do not modify the materials and that you retain all copyright and other                    
                 proprietary notices contained in the materials. This permission terminates                    automatically if you breach any of these terms or 
                 conditions. Upon termination,                    you must immediately destroy any downloaded and printed materials. You also may                   
                  not, without Squash Passion's permission, "mirror" any material contained on                    this Site on any other server. 
                  Squash Passion's trademarks may be used only                    with express written permission from Squash Passion. 
                  Please contact Squash Passion for information                    on Squash Passion's trademarks. All other                    
                  trademarks, brands and names are the property of their respective owners. Except                    
                  as expressly granted in this section (or to you specifically in writing),                   
                  Squash Passion (or the relevant intellectual property owners, as the case                    
                  may be) do not grant any express or implied right to you under any patents,                    
                  copyrights, trademarks or trade secret information. Any unauthorized use of any                    
                  material contained on this Site may violate copyright laws, trademark laws, the                    
                  laws of privacy and publicity, and communications regulations and statutes. """ ]
            , p []
                [ h2 []
                    [ text "Limitation of Liability " ]
                , text "UNDER NO CIRCUMSTANCES, INCLUDING, BUT NOT LIMITED TO, NEGLIGENCE, SHALL Squash Passion BE LIABLE FOR                ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL OR                CONSEQUENTIAL DAMAGES, INCLUDING, BUT NOT LIMITED TO, LOSS OF DATA OR PROFIT,                ARISING OUT OF THE USE, OR THE INABILITY TO USE, THE MATERIALS ON THIS SITE,                EVEN IF Squash Passion OR AN Squash Passion AUTHORIZED REPRESENTATIVE                HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IF YOUR USE OF MATERIALS                FROM THIS SITE RESULTS IN THE NEED FOR SERVICING, REPAIR OR CORRECTION OF                EQUIPMENT OR DATA, YOU ASSUME ANY COSTS THEREOF. Although Squash Passion has                attempted to provide accurate information on this Site as a service to its                users, Squash Passion assumes no responsibility for, and makes no                representations with respect to the accuracy of the information. Squash Passion may change the programs                or products mentioned at any time without                notice. Mention of non-Squash Passion products or services is for                information purposes only and constitutes neither an endorsement nor a                recommendation. "
                ]
            , text "The limitation of liability extends to any website (e.g. www.squash-ladder.com)or service (e.g. PayPal)                accessible from the Squash Passion website            "
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
