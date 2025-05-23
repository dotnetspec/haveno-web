module BddStepDefinitions.SplashSpec exposing (main)

import BddStepDefinitions.Runner
import Pages.Splash
import Spec exposing (Flags, Spec, describe, given, it, scenario)
import Spec.Claim as Claim
import Spec.Markup as Markup
import Spec.Markup.Selector exposing (..)
import Spec.Setup as Setup


runSpecTests : Spec Pages.Splash.Model Pages.Splash.Msg
runSpecTests =
    describe
        "Scenarios based on a Haveno Web App MVP"
        [ scenario "1. Accessing the Web App via Tor Browser"
            (given
                (Setup.init
                    -- NOTE: We have to use testInit cos we don't have a Nav.Key to initialize with
                    -- TODO: RF remove 'time' from Pages.Splash.init
                    -- HACK: This assumes the haveno version has been correctly sent through from Main
                    (Pages.Splash.init { time = Nothing, havenoVersion = "1.0.7" })
                    |> Setup.withView Pages.Splash.view
                    |> Setup.withUpdate Pages.Splash.update
                )
                |> Spec.observeThat
                    [ it "displays the spinner from the Splash page"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ class "spinner" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 0 "anything"
                                )
                        )
                    ]
            )
        ]


main : Program Flags (Spec.Model Pages.Splash.Model Pages.Splash.Msg) (Spec.Msg Pages.Splash.Msg)
main =
    BddStepDefinitions.Runner.browserProgram [ runSpecTests ]
