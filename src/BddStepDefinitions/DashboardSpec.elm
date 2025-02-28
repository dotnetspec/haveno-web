module BddStepDefinitions.DashboardSpec exposing (main)

import BddStepDefinitions.Runner
import Pages.Dashboard
import Spec exposing (Flags, Spec, describe, given, it, scenario)
import Spec.Claim as Claim
import Spec.Http
import Spec.Markup as Markup
import Spec.Markup.Selector exposing (..)
import Spec.Setup as Setup


runSpecTests : Spec Pages.Dashboard.Model Pages.Dashboard.Msg
runSpecTests =
    describe
        "Scenarios based on a Haveno Web App MVP"
        [ --Runner.pick <|
          --Runner.skip <|
          scenario "1. Accessing the Web App via Tor Browser"
            (given
                (Setup.init
                    -- NOTE: We have to use testInit cos we don't have a Nav.Key to initialize with
                    -- TODO: RF remove 'time' from Pages.Dashboard.init
                    -- HACK: This assumes the haveno version has been correctly sent through from Main
                    (Pages.Dashboard.init { time = Nothing, havenoVersion = "1.0.7" })
                    |> Setup.withView Pages.Dashboard.view
                    |> Setup.withUpdate Pages.Dashboard.update
                )
               
                |> Spec.observeThat
                    [ it "displays a message from the Dashboard page"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "h1" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Dashboard"
                                )
                        )
                    , it "makes the Haveno version visible to the user"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "versiondisplay" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "1.0.7"
                                )
                        )
                    ]
            )
        ]



--main : Program Flags (Spec.Model Main.Model Main.Msg) (Spec.Msg Main.Msg)


main : Program Flags (Spec.Model Pages.Dashboard.Model Pages.Dashboard.Msg) (Spec.Msg Pages.Dashboard.Msg)
main =
    BddStepDefinitions.Runner.browserProgram [ runSpecTests ]
