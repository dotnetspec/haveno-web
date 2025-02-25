module BddStepDefinitions.ConnectSpec exposing (main)

import BddStepDefinitions.Extra exposing (equals)
import BddStepDefinitions.Runner exposing (browserProgram, pick, skip)
import Browser.Navigation
import Extras.TestData as TestData
import Html exposing (Html)
import Pages.Connect
import Spec exposing (Flags, Spec, describe, expect, given, it, scenario, when)
import Spec.Claim as Claim 
import Spec.Command exposing (..)

import Spec.Markup as Markup

import Spec.Markup.Selector exposing (..)
import Spec.Observer as Observer
import Spec.Report
import Spec.Setup as Setup
import Spec.Step 
import Time exposing (..)
import Url exposing (Protocol(..), Url)


runSpecTests : Spec Pages.Connect.Model Pages.Connect.Msg
runSpecTests =
    describe
        "Scenarios for Haveno Web App Connection Page"
        [ scenario "1. Accessing the Connect page no wallet or node connection"
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
                            << by [ id "havenoNodeNotConnected" ]
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
    
    browserProgram [ runSpecTests ]
