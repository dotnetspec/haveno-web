module BddStepDefinitions.DonateSpec exposing (main)

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
import Pages.Donate
import Spec exposing (Flags, Spec, describe, expect, given, it, scenario, when)
import Spec.Claim as Claim exposing (Claim, Verdict)
import Spec.Command exposing (..)
import Spec.Http
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


runSpecTests : Spec Pages.Donate.Model Pages.Donate.Msg
runSpecTests =
    describe
        "Scenarios based on a Haveno Web App MVP"
        [ {- Runner.pick <|
            Runner.skip <| -}
                scenario "1. Accessing the Donate page"
                    (given
                        (Setup.init
                            -- NOTE: If need a Nav.Key to initialize with initForApplication
                            (Pages.Donate.init ())
                            |> Setup.withView Pages.Donate.view
                            |> Setup.withUpdate Pages.Donate.update
                        )
                        |> Spec.observeThat
                            [ it "has status as Loaded"
                                (Observer.observeModel .status
                                    |> Spec.expect (equals Pages.Donate.Loaded)
                                )
                            , it "displays a message from the Donate page"
                                (Markup.observeElement
                                    |> Markup.query
                                    << by [ tag "h1" ]
                                    |> Spec.expect
                                        (Claim.isSomethingWhere <|
                                            Markup.text <|
                                                Claim.isStringContaining 1 "Donate"
                                        )
                                )
                            , it "makes the Donation address visible to the user"
                                (Markup.observeElement
                                    |> Markup.query
                                    << by [ Spec.Markup.Selector.id "donationaddress" ]
                                    |> Spec.expect
                                        (Claim.isSomethingWhere <|
                                            Markup.text <|
                                                Claim.isStringContaining 1 Consts.donationAddress
                                        )
                                )
                            ]
                    )
        ]



--main : Program Flags (Spec.Model Main.Model Main.Msg) (Spec.Msg Main.Msg)


main : Program Flags (Spec.Model Pages.Donate.Model Pages.Donate.Msg) (Spec.Msg Pages.Donate.Msg)
main =
    -- NOTE: By using the browserProgram function, developers can specify configurations such as how the application's initial state is initialized
    -- , how the view is rendered, how updates are handled, and how subscriptions and browser events are managed during test execution
    --Runner.browserProgram { flags = \_ -> (), init = App.init, update = App.update, subscriptions = App.subscriptions, view = App.view }
    Runner.browserProgram [ runSpecTests ]
