-- REVIEW: Not sure if it's better to have all the Elements together here,
-- or Elements relevant to eg. User, Ranking etc. in those modules?
-- For now we put here.
-- WARN: Any elements that ref. Msg variant need to be in Main
-- that will generally be buttons


module SR.Elements exposing
    ( colors
    , ethereumNotEnabledPara
    , ethereumWalletWarning
    , footer
    , globalHeading
    , justParasimpleUserInfoText
    , ladderCityValidation
    , ladderNameValidation
    , ladderStreetValidation
    , legalUserInfoText
    , memberSelectedRankingHeaderEl
    , spectatorSelectedRankingHeaderEl
    , missingDataPara
    , nameValidView
    , ownedSelectedRankingHeaderEl
    , passwordValidView
    , permanentlyDeleteWarnPara
    , placeholder
    , warningParagraph
    , warningText
    )

-- WARN: expose all here?
-- NOTE: Exposing Element gives us access to the rgb colors:

import Data.Hardware as R
import Data.User as U
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Framework.Card as Card
import Framework.Color as Color
import Framework.Heading as Heading
import Html exposing (..)
import Html.Attributes exposing (..)
import Utils.Validation.Validate as V


type alias Colors =
    { coral : Element.Color
    , white : Element.Color
    , lightblue : Element.Color
    , blue : Element.Color
    , green : Element.Color
    , purple : Element.Color
    , black : Element.Color
    , red : Element.Color
    , darkBlue : Element.Color
    , grey : Element.Color
    }


colors : Colors
colors =
    { coral = rgb255 204 75 75
    , white = rgb255 255 255 255
    , lightblue = rgb255 0 128 255
    , blue = rgb255 2 7 239
    , green = rgb255 0 153 0
    , purple = rgb255 102 0 102
    , black = rgb255 0 0 0
    , red = rgb 0.8 0 0
    , darkBlue = rgb 0 0 0.9
    , grey = rgb 0.9 0.9 0.9
    }


warningText : String -> Element msg
warningText warningTxt =
    Element.el
        [ Font.color (Element.rgb 1 0 0)
        , Font.size 18
        , Font.family
            [ Font.typeface "Open Sans"
            , Font.sansSerif
            ]
        , Font.center
        ]
        (Element.text warningTxt)


warningParagraph : Element msg
warningParagraph =
    Element.paragraph (Card.fill ++ Color.warning) <|
        [ Element.el [ Font.bold ] <| Element.text "Please note: "
        , Element.paragraph [] <|
            List.singleton <|
                Element.text "Can all your members find the venue (if there is one)?"
        ]


missingDataPara : Element msg
missingDataPara =
    Element.paragraph (Card.fill ++ Color.warning) <|
        [ Element.el [ Font.bold ] <| Element.text "Please note: "
        , Element.paragraph [] <|
            List.singleton <|
                Element.text "Essential data is missing!"
        ]


ethereumNotEnabledPara : Element msg
ethereumNotEnabledPara =
    Element.paragraph (Card.fill ++ Color.warning) <|
        [ Element.el [ Font.bold ] <| Element.text "Please note: "
        , Element.paragraph [] <|
            List.singleton <|
                Element.text "Ethereum is not current enabled for this dApp. Please click 'Enable Ethereum' (at top) to continue."
        ]


permanentlyDeleteWarnPara : Element msg
permanentlyDeleteWarnPara =
    Element.paragraph (Card.fill ++ Color.warning) <|
        [ Element.el [ Font.bold ] <| Element.text "Please note: "
        , Element.paragraph [] <|
            List.singleton <|
                Element.text "Clicking 'Confirm' will permanently delete this ranking. Participants will be notified in due course."
        ]


globalHeading : U.User -> Element msg
globalHeading user =
    case user of
        U.Spectator _ ->
            Element.el Heading.h5 <| Element.text "Spectator in global heading"

        U.Registered (userInfo ) ->
            Element.el Heading.h5 <| Element.text <| "SportRank - Welcome Back - " ++ userInfo.nickname


ownedSelectedRankingHeaderEl : R.Ranking -> Element msg
ownedSelectedRankingHeaderEl r =
    Element.el Heading.h5 <|
        Element.text <|
            r.owner_name ++ " this your owned ranking"
                ++ " - "
                ++ r.name
                ++ " . \n Id is: "
                ++ r.id


memberSelectedRankingHeaderEl : U.UserInfo  -> R.Ranking -> Element msg
memberSelectedRankingHeaderEl userInfo r =
    Element.el Heading.h5 <|
        Element.text <|
            userInfo.nickname ++ " you're a member of"
                ++ " - "
                ++ r.name
                ++ " Id no: "
                ++ r.id
                ++ " . \n Which is owned by "
                ++ r.owner_name
                ++ " id no: "
                ++ r.owner_id

spectatorSelectedRankingHeaderEl : U.UserInfo  -> R.Ranking -> Element msg
spectatorSelectedRankingHeaderEl userInfo r =
    Element.el Heading.h5 <|
        Element.text <|
            userInfo.nickname ++ " you're interested in joining"
                ++ " - "
                ++ r.name
                ++ " Id no: "
                ++ r.id
                ++ " . \n Which is owned by "
                ++ r.owner_name
                ++ " id no: "
                ++ r.owner_id



-- RF


justParasimpleUserInfoText : Element msg
justParasimpleUserInfoText =
    Element.paragraph [] <|
        List.singleton <|
            Element.text "Can your challengers reach you if you don't submit contact details?"


legalUserInfoText : Element msg
legalUserInfoText =
    Element.paragraph (Card.fill ++ Color.warning) <|
        [ Element.el [ Font.bold ] <| Element.text "Please note: "
        , Element.paragraph [] <|
            List.singleton <|
                Element.text "Portfolio and Conditions Apply"
        ]



-- selectedHeading : U.User -> Data.RankingR.Ranking -> Element msg
-- selectedHeading user rnkInfo =
--     Element.column Grid.section <|
--         [ Element.el Heading.h5 <|
--             Element.text (user.username ++ " you selected ranking")
--         , Element.column Card.fill
--             [ Element.el Heading.h4 <|
--                 Element.text rnkInfo.rankingname
--             , Element.text rnkInfo.rankingdesc
--             ]
--         ]


ethereumWalletWarning : Element msg
ethereumWalletWarning =
    Element.paragraph (Card.fill ++ Color.warning) <|
        [ Element.el [ Font.bold ] <| Element.text "Please note: "
        , Element.paragraph [] <|
            List.singleton <|
                Element.text "This confirmation will interact with your Ethereum wallet"
        ]


footer : Element msg
footer =
    Element.paragraph [] <|
        List.singleton <|
            Element.text """SportRank - all rights reserved. 
Use of this application is without 
any liablity whatsoever."""


wireframeTheme : { bg : Color, frame : Color, text : Color }
wireframeTheme =
    { bg = Color.grey
    , frame = Color.black
    , text = Color.black
    }


placeholder : List (Element.Attribute msg) -> String -> Element msg
placeholder attr name =
    Element.text name
        |> Element.el
            [ Border.rounded 5
            , Border.dotted
            , Border.color wireframeTheme.frame
            , Border.width 2
            , Element.height Element.fill
            , Element.width Element.fill
            , Element.padding 20
            , Background.color wireframeTheme.bg
            , Font.center
            , Font.color wireframeTheme.text
            ]
        |> Element.el attr


nameValidView : U.UserInfo -> Element msg
nameValidView userInfo =
    if String.length userInfo.nickname == 0 then
        Element.el (List.append [ Element.htmlAttribute (Html.Attributes.id "usernameValidMsg") ] [ Font.color colors.green, Font.alignLeft ] ++ [ Element.moveLeft 1.0 ]) (Element.text "Anon OK!")

    else if V.isValid4to8Chars userInfo.nickname then
        Element.el (List.append [ Element.htmlAttribute (Html.Attributes.id "usernameValidMsg") ] [ Font.color colors.green, Font.alignLeft ] ++ [ Element.moveLeft 1.0 ]) (Element.text "Nickname OK!")

    else
        Element.el
            (List.append [ Element.htmlAttribute (Html.Attributes.id "usernameValidMsg") ] [ Font.color colors.red, Font.alignLeft ]
                ++ [ Element.moveLeft 0.0 ]
            )
            (Element.text """If entered please make 
unique and 5-8 continuous chars""")


passwordValidView : U.UserInfo -> Element msg
passwordValidView userInfo =
    if V.isValid4to8Chars userInfo.password then
        Element.el ([ Font.color colors.green, Font.alignLeft, Element.moveLeft 1.0 ]) (Element.text "Password OK!")

    else
        Element.el
            [ Font.color colors.red, Font.alignLeft, Element.moveLeft 0.0 ]
            (Element.text """5-8 continuous chars""")



-- RF: On this validation?


ladderNameValidation : R.Ranking -> Element msg
ladderNameValidation ranking =
    if V.isValid4to20Chars ranking.name then
        Element.el
            (List.append [ Element.htmlAttribute (Html.Attributes.id "laddernameValidMsg") ]
                [ Font.color colors.green, Font.alignLeft ]
                ++ [ Element.moveLeft 1.0 ]
            )
            (Element.text "Ranking name OK!")

    else
        Element.el
            (List.append [ Element.htmlAttribute (Html.Attributes.id "laddernameValidMsg") ]
                [ Font.color colors.red, Font.alignLeft ]
                ++ [ Element.moveLeft 0.0 ]
            )
            (Element.text """Must be unique (4-20 continuous chars)""")


ladderStreetValidation : R.Ranking -> Element msg
ladderStreetValidation ranking =
    if V.isValid4to20Chars ranking.baseaddress.street then
        Element.el
            (List.append [ Element.htmlAttribute (Html.Attributes.id "ladderstreetValidMsg") ]
                [ Font.color colors.green, Font.alignLeft ]
                ++ [ Element.moveLeft 1.0 ]
            )
            (Element.text "Street name OK!")

    else
        Element.el
            (List.append [ Element.htmlAttribute (Html.Attributes.id "ladderstreetValidMsg") ]
                [ Font.color colors.blue, Font.alignLeft ]
                ++ [ Element.moveLeft 0.0 ]
            )
            (Element.text """If entered, must be unique (4-20 continuous chars)""")


ladderCityValidation : R.Ranking -> Element msg
ladderCityValidation ranking =
    if V.isValid4to20Chars ranking.baseaddress.city then
        Element.el
            (List.append [ Element.htmlAttribute (Html.Attributes.id "laddercityValidMsg") ]
                [ Font.color colors.green, Font.alignLeft ]
                ++ [ Element.moveLeft 1.0 ]
            )
            (Element.text "City name OK!")

    else
        Element.el
            (List.append [ Element.htmlAttribute (Html.Attributes.id "laddercityValidMsg") ]
                [ Font.color colors.blue, Font.alignLeft ]
                ++ [ Element.moveLeft 0.0 ]
            )
            (Element.text """If entered, must be unique (4-20 continuous chars)""")
