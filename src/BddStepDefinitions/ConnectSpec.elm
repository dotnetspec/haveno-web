module BddStepDefinitions.ConnectSpec exposing (main)

import BddStepDefinitions.Extra
import BddStepDefinitions.Runner
import Extras.TestData
import Pages.Connect
import Spec
import Spec.Claim
import Spec.Http
import Spec.Http.Stub as Stub
import Spec.Markup
import Spec.Markup.Event
import Spec.Markup.Selector
import Spec.Observer
import Spec.Setup


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
        , Spec.scenario "2. User successfully reconnects to the wallet"
            (Spec.given
                (Spec.Setup.init
                    (Pages.Connect.init ())
                    |> Spec.Setup.withView Pages.Connect.view
                    |> Spec.Setup.withUpdate Pages.Connect.update
                    |> Stub.serve [ Extras.TestData.successfullXmrPrimaryAddressFetch ]
                )
                |> Spec.when "we log the http requests"
                    [ Spec.Http.logRequests
                    ]
                |> Spec.when "User clicks Retry Wallet Connection"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "retryWalletConnection" ]
                    , Spec.Markup.Event.click
                    ]
                |> Spec.observeThat
                    [ Spec.it "updates the model to mark the wallet as connected"
                        (Spec.Observer.observeModel .walletConnected
                            |> Spec.expect (BddStepDefinitions.Extra.equals True)
                        )
                    , Spec.it "removes the wallet not connected warning"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "walletNotConnectedWarning" ]
                            |> Spec.expect
                                (Spec.Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Spec.Claim.isStringContaining 0 "Monero Wallet not connected."
                                )
                        )
                    ]
            )
        ]


main : Program Spec.Flags (Spec.Model Pages.Connect.Model Pages.Connect.Msg) (Spec.Msg Pages.Connect.Msg)
main =
    BddStepDefinitions.Runner.browserProgram [ runSpecTests ]
