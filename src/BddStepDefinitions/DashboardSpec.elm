module BddStepDefinitions.DashboardSpec exposing (main)

import BddStepDefinitions.Extra exposing (..)
import BddStepDefinitions.Runner as Runner exposing (..)
import Browser.Navigation as Nav exposing (..)
import Dict
import Extras.Constants as Consts exposing (..)
import Extras.TestData as TestData
import Html exposing (Html)
import Http
import Json.Decode as D
import Json.Encode as E
import Main
import Pages.Dashboard
import Spec exposing (Flags, Spec, describe, expect, given, it, scenario, when)
import Spec.Claim as Claim exposing (Claim, Verdict)
import Spec.Command exposing (..)


import Spec.Http.Stub as Stub
import Spec.Markup as Markup
import Spec.Markup.Event as Event
import Spec.Markup.Selector exposing (..)
import Spec.Observer as Observer exposing (Observer)
import Spec.Report as Report exposing (Report)
import Spec.Setup as Setup
import Spec.Step as Step exposing (Step)
import Spec.Time
import Time exposing (..)
import Types.DateType as DateType
import Url exposing (Protocol(..), Url)



-- NOTE: Local test setup
-- NOTE: App.Model and App.Msg are type paramters for the Spec type
-- They make Spec type more flexible as it can be used with any model and msg types
-- NOTE: placeholderURL is used to load the rankings page
-- FromMainToHardware is particular to the Hardware page
--(gives us the current time/date and the URL to the API which responds with the timeslot data for the page)
{- testFlags : Hardware.FromMainToHardware
   testFlags =
       -- WARN: We cannot set CurrentDateTime here, cos Tick newTime will override it.
       -- but can use Spec.Time.withTime to set the time in scenario setup
       Hardware.FromMainToHardware Nothing Consts.localhostForElmSpecProxyURL
-}
-- NOTE: The following is a test for the Hardware page
-- The test checks that the page displays the available timeslots when the access token request is successful
-- and the request for available timeslots is successful


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
                    (Pages.Dashboard.init { time = Nothing, flagUrl = TestData.placeholderUrl })
                    |> Setup.withView Pages.Dashboard.view
                    |> Setup.withUpdate Pages.Dashboard.update
                    |> Stub.serve [ TestData.successfullVersionFetch ]
                )
                {- |> Spec.when "we log the http requests"
                   [ Spec.Http.logRequests
                   ]
                -}
                |> Spec.observeThat
                    [ it "displays a message from the Dashboard page"
                        (Markup.observeElement
                            |> Markup.query
                            -- NOTE: It appears that the test ONLY matches on the first element that matches the selector
                            << by [ tag "h1" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Haveno Web"
                                )
                        )
                    ]
            )

        --, Runner.skip <|
        --, Runner.pick <|
        , scenario "2: Display the Haveno core app version number"
            (given
                (Setup.init
                    -- NOTE: We have to use testInit cos we don't have a Nav.Key to initialize with
                    -- TODO: RF remove 'time' from Pages.Dashboard.init
                    (Pages.Dashboard.init { time = Nothing, flagUrl = TestData.placeholderUrl })
                    |> Setup.withView Pages.Dashboard.view
                    |> Setup.withUpdate Pages.Dashboard.update
                    |> Stub.serve [ TestData.successfullVersionFetch ]
                )
                {- |> Spec.when "we log the http requests"
                   [ Spec.Http.logRequests
                   ]
                -}
                |> Spec.observeThat
                    [ it "displays Haveno version number on the Dashboard page"
                        (Markup.observeElement
                            |> Markup.query
                            -- NOTE: It appears that the test ONLY matches on the first element that matches the selector
                            << by [ tag "div" ]
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
    -- NOTE: By using the browserProgram function, developers can specify configurations such as how the application's initial state is initialized
    -- , how the view is rendered, how updates are handled, and how subscriptions and browser events are managed during test execution
    --Runner.browserProgram { flags = \_ -> (), init = App.init, update = App.update, subscriptions = App.subscriptions, view = App.view }
    Runner.browserProgram [ runSpecTests ]



-- NAV: Helper functions:
{- viewToHtml : Main.Model -> Html Main.Msg
   viewToHtml model =
       let

           document =
               Main.view model
       in
       Html.div [] document.body
-}
