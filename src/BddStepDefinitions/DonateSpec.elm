module BddStepDefinitions.DonateSpec exposing (main)

import BddStepDefinitions.Extra exposing (equals)
import BddStepDefinitions.Runner exposing (browserProgram , pick, skip)
import Browser.Navigation

import Extras.Constants as Consts exposing (..)
import Extras.TestData as TestData
import Html exposing (Html)

import Pages.Donate
import Spec exposing (Flags, Spec, describe, given, it, scenario)
import Spec.Claim as Claim
import Spec.Command exposing (..)

import Spec.Markup as Markup

import Spec.Markup.Selector exposing (..)
import Spec.Observer 
import Spec.Report 
import Spec.Setup as Setup
import Spec.Step 

import Time exposing (..)

import Url exposing (Protocol(..))



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
                                (Spec.Observer.observeModel .status
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
    
    BddStepDefinitions.Runner.browserProgram  [ runSpecTests ]
