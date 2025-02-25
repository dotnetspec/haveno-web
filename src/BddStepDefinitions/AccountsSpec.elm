module BddStepDefinitions.AccountsSpec exposing (main)

import BddStepDefinitions.Extra exposing (equals)
import BddStepDefinitions.Runner exposing (browserProgram, pick, skip)
import Extras.TestData as TestData exposing (testBalanceInfo, placeholderUrl)
import Grpc
import Pages.Accounts as Accounts
import Spec exposing (Flags, Spec, describe, given, it, scenario, when)
import Spec.Claim as Claim
import Spec.Command
import Spec.Http.Stub as Stub
import Spec.Markup as Markup
import Spec.Markup.Selector exposing (by)
import Spec.Observer as Observer
import Spec.Setup
import Url exposing (Protocol(..))



-- NAV: Test scenarios


runSpecTests : Spec Accounts.Model Accounts.Msg
runSpecTests =
    describe
        "Haveno Web App Accounts Tests"
        [ --skip <|
          --pick <|
          scenario "1: Accessing the Accounts page with valid balance data"
            (given
                (Spec.Setup.init (Accounts.init ())
                    |> Spec.Setup.withView Accounts.view
                    |> Spec.Setup.withUpdate Accounts.update
                    |> Spec.Setup.withLocation placeholderUrl
                    |> Stub.serve [ TestData.successfullBalancesFetch, TestData.successfullXmrPrimaryAddressFetch ]
                )
                {- |> Spec.when "we log the http requests"
                   [ Spec.Http.logRequests
                   ]
                -}
                |> Spec.observeThat
                    [ it "has status as Loaded"
                        (Observer.observeModel .status
                            |> Spec.expect (equals Accounts.Loaded)
                        )
                    , it "pagetitle is Accounts"
                        (Observer.observeModel .pagetitle
                            |> Spec.expect (equals "Accounts")
                        )
                    , it "should have balances in the model"
                        (Observer.observeModel .balances
                            |> Spec.expect (equals <| testBalanceInfo)
                        )
                    , it "should receive primary address"
                        (Observer.observeModel .primaryaddress
                            |> Spec.expect (equals TestData.primaryAddress)
                        )
                    , it "should display an 'Add New Account' button"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "addnewaccountbutton" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Add New Account"
                                )
                        )
                    ]
            )
        , --skip <|
          --pick <|
          scenario "2: Handling the Accounts page with INvalid balance data"
            (given
                (Spec.Setup.init (Accounts.init ())
                    |> Spec.Setup.withView Accounts.view
                    |> Spec.Setup.withUpdate Accounts.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the page attempts to load Balances"
                    [ Spec.Command.send (Spec.Command.fake <| Accounts.GotBalances (Result.Err <| Grpc.UnknownGrpcStatus "unknown")) ]
                |> Spec.observeThat
                    [ it "has status as Loaded"
                        (Observer.observeModel .status
                            |> Spec.expect (equals Accounts.Errored)
                        )
                    , it "displays the Accounts page correctly"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "accounts-error-message" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Error: Unable to retrieve relevant data. Please try again later."
                                )
                        )
                    ]
            )

        {-
           --, --skip <|
           --pick <|
           , scenario "2a: Show available balance and reserved balance correctly in the UI"
               (given
                   (Spec.Setup.init (Accounts.init "http://localhost:1234")
                       |> Spec.Setup.withView Accounts.view
                       |> Spec.Setup.withUpdate Accounts.update
                       |> Spec.Setup.withLocation placeholderUrl
                       |> Stub.serve [ TestData.successfullBalancesFetch, TestData.successfullXmrPrimaryAddressFetch  ]
                   )
                   {- |> when "the user shows the hidden details"
                       [ Spec.Command.send (Spec.Command.fake <| Accounts.ToggleVisibility) ] -}
                   {- |> Spec.when "we log the http requests"
                       [ Spec.Http.logRequests
                       ] -}
                   |> Spec.observeThat
                       [ it "has status as Loaded"
                           (Observer.observeModel .status
                               |> Spec.expect (equals Accounts.Loaded)
                           )
                       , it "pagetitle is Accounts"
                           (Observer.observeModel .pagetitle
                               |> Spec.expect (equals "Accounts")
                           )
                       , it "should have balances in the model"
                           (Observer.observeModel .balances
                               |> Spec.expect (equals <| testBalanceInfo)
                           )
                       , it "displays the available balance correctly"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "xmrAvailableBalance" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Available Balance: 42.94967296 XMR"
                                   )
                           )
                       , it "displays the reserved balance correctly"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "reservedOfferBalance" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Reserved Offer Balance: 5000.0 XMR"
                                   )
                           )
                       ]
               )
        -}
        ]


main : Program Flags (Spec.Model Accounts.Model Accounts.Msg) (Spec.Msg Accounts.Msg)
main =
    browserProgram [ runSpecTests ]
