module Buttons.Default exposing (defaultButton)

import Html exposing (Html, a, button, div, text)
import Html.Attributes exposing (class, href, style)



--import Main exposing (Msg)


defaultButton : String -> Html msg
defaultButton btnName =
    div
        [ style "align-self" "center" ]
        [ button
            [ class "default-button" ]
            [ a
                [ {- -- NOTE: Overriding default a link text color -} style "color" "white"
                , case btnName of
                    "contact" ->
                        href "/contact"

                    "schedule" ->
                        href "/schedule"

                    "cost" ->
                        href "/pricing"

                    "bb" ->
                        href "https://squashpassion.com/partnerbb/"

                    _ ->
                        href "/"
                ]
                [ case btnName of
                    "contact" ->
                        text "Contact"

                    "schedule" ->
                        text "Rankings Now"

                    "cost" ->
                        text "Pricing"

                    "bb" ->
                        text "Squash Partner Bulletin Board"

                    _ ->
                        text ""
                ]
            ]
        ]
