module BddStepDefinitions.DashboardSpec exposing (main)

import BddStepDefinitions.Extra exposing (equals)
import BddStepDefinitions.Runner exposing (browserProgram, pick, skip)
import Browser.Navigation

import Extras.Constants
import Extras.TestData as TestData
import Html

import Pages.Dashboard
import Spec exposing (Flags, Spec, describe, given, it, scenario)
import Spec.Claim as Claim 
import Spec.Command exposing (..)
import Spec.Http
import Spec.Markup as Markup

import Spec.Markup.Selector exposing (..)
import Spec.Observer
import Spec.Report
import Spec.Setup as Setup
import Spec.Step
import Time exposing (..)
import Url exposing (Protocol(..))






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
                    |> Spec.when "we log the http requests"
                        [ Spec.Http.logRequests
                        ]
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
    
    browserProgram [ runSpecTests ]
