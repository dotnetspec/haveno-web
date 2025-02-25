module BddStepDefinitions.ConnectSpec exposing (main)

import BddStepDefinitions.Extra
import BddStepDefinitions.Runner
import Pages.Connect
import Spec
import Spec.Claim
import Spec.Observer
import Spec.Setup
import Url exposing (Protocol(..))
import Spec.Markup
import Spec.Markup.Selector


runSpecTests : Spec.Spec Pages.Connect.Model Pages.Connect.Msg
runSpecTests =
    Spec.describe
        "Scenarios for Haveno Web App Connection Page"
        [ Spec.scenario "1. Accessing the Connect page no wallet or node connection"
            (Spec.given
                (Spec.Setup.init
                    (Pages.Connect.init ())
                    |> Spec.Setup.withView Pages.Connect.view
                    |> Spec.Setup.withUpdate Pages.Connect.update
                )
                |> Spec.observeThat
                    [ Spec.it "has status as Initialized"
                        (Spec.Observer.observeModel .walletConnected
                            |> Spec.expect (BddStepDefinitions.Extra.equals False)
                        )
                    , Spec.it "displays a message about wallet connection"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << Spec.Markup.Selector.by [ Spec.Markup.Selector.tag "p" ]
                            |> Spec.expect
                                (Spec.Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Spec.Claim.isStringContaining 1 "Monero Wallet not connected."
                                )
                        )
                    , Spec.it "displays a message about Haveno node connection"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "havenoNodeNotConnected" ]
                            |> Spec.expect
                                (Spec.Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Spec.Claim.isStringContaining 1 "Haveno Node not connected."
                                )
                        )
                    ]
            )
        ]


main : Program Spec.Flags (Spec.Model Pages.Connect.Model Pages.Connect.Msg) (Spec.Msg Pages.Connect.Msg)
main =
    BddStepDefinitions.Runner.browserProgram [ runSpecTests ]
