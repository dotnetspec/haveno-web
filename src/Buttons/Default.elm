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

                    "hardware" ->
                        href "/hardware"

                    

                    "cost" ->
                        href "/pricing"

                    

                    _ ->
                        href "/"
                ]
                [ case btnName of
                    

                    

                    "hardware" ->
                        text "Hardware Now"

                    "cost" ->
                        text "Buy"

                    

                    _ ->
                        text ""
                ]
            ]
        ]
