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
import Spec.Http
import Spec.Http.Route as Route exposing (HttpRoute)
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
-- FromMainToRankings is particular to the Hardware page
--(gives us the current time/date and the URL to the API which responds with the timeslot data for the page)
{- testFlags : Hardware.FromMainToRankings
   testFlags =
       -- WARN: We cannot set CurrentDateTime here, cos Tick newTime will override it.
       -- but can use Spec.Time.withTime to set the time in scenario setup
       Hardware.FromMainToRankings Nothing Consts.localhostForElmSpecProxyURL
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
                   ] -}
               
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
        ,
          scenario "2: Display the Haveno core app version number"
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
                    ] -}
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

        --Runner.pick <|
        --, Runner.skip <|
        {- , scenario "3. Display An Active User On Login Succeed"
           (given
               (Setup.init
                   (Pages.Dashboard.init { time = Nothing, flagUrl = TestData.placeholderUrl })
                   |> Setup.withView Pages.Dashboard.view
                   |> Setup.withUpdate Pages.Dashboard.update
                   |> Stub.serve
                       [ TestData.successfullLocationFetch
                       , TestData.successfullLoginFetch
                       , TestData.successfullProfileFetch
                       , TestData.successfullCallResponse
                       ]
               )
               |> when "the user submits the login form"
                   [ Spec.Command.send <| Spec.Command.fake (Pages.Dashboard.ClickedLogInUser { email = "k2@k.com", password = "Pa55w0rd" }) ]
               {- |> Spec.when "we log the http requests"
                  [ Spec.Http.logRequests
                  ]
               -}
               |> Spec.observeThat
                   [ it "requests the realm server location"
                       (Spec.Http.observeRequests
                           -- NOTE: Copy the route from the logRequest above (assuming app actually makes the correct request)
                           -- to ensure it matches the request the app attempts.
                           -- otherwise, you would get a 404 response code if your program attempts to make a request that is not stubbed
                           -- NOTE: The route only appears in RED in the test results in terminal if it's correctly specified here:
                           (Route.get TestData.loginRequestLocationURL)
                           |> expect
                               (Claim.isListWhere
                                   [ Spec.Http.url <|
                                       -- HACK: These are not good tests currently:
                                       Claim.isStringContaining 1 ""
                                   ]
                               )
                       )
                   , it "makes the login request"
                       (Spec.Http.observeRequests
                           (Route.post TestData.loginRequestURL)
                           |> expect
                               (Claim.isListWhere
                                   [ Spec.Http.url <|
                                       Claim.isStringContaining 1 "local-userpass/login"
                                   ]
                               )
                       )
                   , it "sends the access token in the profile request"
                       (Spec.Http.observeRequests
                           (Route.get TestData.loginRequestProfileURL)
                           |> expect
                               (Claim.isListWhere
                                   [ Spec.Http.header "Authorization" <|
                                       Claim.isSomethingWhere <|
                                           Claim.isStringContaining 1 "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjY2MmEyMjFiNDc1Yzk3YWY2YTFlYmRiNCIsImJhYXNfZG9tYWluX2lkIjoiNjJmNDgxNWNkZjJiYmVlOWYxMGNkMTBhIiwiZXhwIjoxNzE0MTIwMTY5LCJpYXQiOjE3MTQxMTgzNjksImlzcyI6IjY2MmI1ZWUxMjBlMTVmMDNhOTVjMWM4NyIsImp0aSI6IjY2MmI1ZWUxMjBlMTVmMDNhOTVjMWM4OSIsInN0aXRjaF9kZXZJZCI6IjY2MmEyMjFiNDc1Yzk3YWY2YTFlYmRiNCIsInN0aXRjaF9kb21haW5JZCI6IjYyZjQ4MTVjZGYyYmJlZTlmMTBjZDEwYSIsInN1YiI6IjY1MWZhMDA2YjE1YTUzNGM2OWIxMTllZiIsInR5cCI6ImFjY2VzcyJ9.DpiBqSs8bPuanHw9VqHeSkqjSc84SLCQN-OWcePHQ8g"
                                   ]
                               )
                       )
                   , it "sends the access token in the call request"
                       (Spec.Http.observeRequests
                           (Route.post TestData.loginRequestCallURL)
                           |> expect
                               (Claim.isListWhere
                                   [ Spec.Http.header "Authorization" <|
                                       Claim.isSomethingWhere <|
                                           Claim.isStringContaining 1 "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjY2MmEyMjFiNDc1Yzk3YWY2YTFlYmRiNCIsImJhYXNfZG9tYWluX2lkIjoiNjJmNDgxNWNkZjJiYmVlOWYxMGNkMTBhIiwiZXhwIjoxNzE0MTIwMTY5LCJpYXQiOjE3MTQxMTgzNjksImlzcyI6IjY2MmI1ZWUxMjBlMTVmMDNhOTVjMWM4NyIsImp0aSI6IjY2MmI1ZWUxMjBlMTVmMDNhOTVjMWM4OSIsInN0aXRjaF9kZXZJZCI6IjY2MmEyMjFiNDc1Yzk3YWY2YTFlYmRiNCIsInN0aXRjaF9kb21haW5JZCI6IjYyZjQ4MTVjZGYyYmJlZTlmMTBjZDEwYSIsInN1YiI6IjY1MWZhMDA2YjE1YTUzNGM2OWIxMTllZiIsInR5cCI6ImFjY2VzcyJ9.DpiBqSs8bPuanHw9VqHeSkqjSc84SLCQN-OWcePHQ8g"
                                   ]
                               )
                       )
                   , it "correctly formats selected fields in the json in the POST request"
                       (Spec.Http.observeRequests (Route.post TestData.loginRequestCallURL)
                           |> expect
                               -- NOTE: list each POST request i.e. token validation and then booking request
                               (Claim.isListWhere
                                   [ Spec.Http.body
                                       (Spec.Http.asJson <| D.at [ "arguments", "0", "pipeline", "0", "$match", "_id", "$oid" ] D.string)
                                       (Claim.isStringContaining 1 "651fa006b15a534c69b119ef")

                                   {- , Spec.Http.body
                                      (Spec.Http.asJson <| D.at [ "arguments", "0"] D.string)
                                          D.field "collection" D.string
                                      )
                                      (Claim.isStringContaining 1 "users")
                                   -}
                                   ]
                               )
                       )
                   , it "the page should display the user's rankings and details (global view)"
                       (Markup.observeElement
                           |> Markup.query
                           -- NOTE: It appears that the test ONLY matches on the first element that matches the selector
                           << by [ tag "h5" ]
                           |> Spec.expect
                               (Claim.isSomethingWhere <|
                                   Markup.text <|
                                       Claim.isStringContaining 1 "SportRank - Welcome Back - Dave"
                               )
                       )
                   ]
           )
        -}
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
