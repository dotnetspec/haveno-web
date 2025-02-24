module BddStepDefinitions.ConnectSpec exposing (main)

import BddStepDefinitions.Extra exposing (..)
import BddStepDefinitions.Runner as Runner exposing (..)
import Browser.Navigation as Nav exposing (..)
import Dict
import Extras.TestData as TestData
import Html exposing (Html)
import Http
import Json.Decode as D
import Json.Encode as E
import Main
import Pages.Connect
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
import Url exposing (Protocol(..), Url)


runSpecTests : Spec Pages.Connect.Model Pages.Connect.Msg
runSpecTests =
    describe
        "Scenarios for Haveno Web App Connection Page"
        [ scenario "1. Accessing the Connect page"
            (given
                (Setup.init
                    (Pages.Connect.init ())
                    |> Setup.withView Pages.Connect.view
                    |> Setup.withUpdate Pages.Connect.update
                )
                |> Spec.observeThat
                    [ it "has status as Initialized"
                        (Observer.observeModel .walletConnected
                            |> Spec.expect (equals False)
                        )
                    , it "displays a message about wallet connection"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "p" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Monero Wallet not connected."
                                )
                        )
                    , it "displays a message about Haveno node connection"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "p" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Haveno Node not connected."
                                )
                        )
                    ]
            )
        ]

main : Program Flags (Spec.Model Pages.Connect.Model Pages.Connect.Msg) (Spec.Msg Pages.Connect.Msg)
main =
    -- NOTE: By using the browserProgram function, developers can specify configurations such as how the application's initial state is initialized
    -- , how the view is rendered, how updates are handled, and how subscriptions and browser events are managed during test execution
    --Runner.browserProgram { flags = \_ -> (), init = App.init, update = App.update, subscriptions = App.subscriptions, view = App.view }
    Runner.browserProgram [ runSpecTests ]
