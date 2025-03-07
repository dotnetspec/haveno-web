module BddStepDefinitions.FundsSpec exposing (main)

import BddStepDefinitions.Extra exposing (equals)
import BddStepDefinitions.Runner
import Extras.TestData as TestData
import Pages.Funds as Funds
import Spec exposing (given, it, scenario, when)
import Spec.Claim as Claim
import Spec.Command
import Spec.Http.Stub as Stub
import Spec.Markup as Markup
import Spec.Markup.Selector exposing (by, id)
import Spec.Observer as Observer
import Spec.Setup


fundsInitialModel : Funds.Model
fundsInitialModel =
    Funds.initialModel



-- NAV: Test scenarios


runSpecTests : Spec.Spec Funds.Model Funds.Msg
runSpecTests =
    Spec.describe
        "Haveno Web App Funds Tests"
        [ scenario "1: Accessing the Funds page with valid balance data"
            (given
                (Spec.Setup.init ( { fundsInitialModel | status = Funds.Loaded, balances = TestData.testBalanceInfo, primaryaddress = TestData.primaryAddress }, Cmd.none )
                    |> Spec.Setup.withView Funds.view
                    |> Spec.Setup.withUpdate Funds.update
                    |> Spec.Setup.withLocation TestData.placeholderUrl
                )
                |> when "the user shows the hidden details"
                    [ Spec.Command.send (Spec.Command.fake <| Funds.ToggleFundsVisibility) ]
                |> Spec.observeThat
                    [ it "has status as Loaded"
                        (Observer.observeModel .status
                            |> Spec.expect (equals Funds.Loaded)
                        )
                    , it "pagetitle is Funds"
                        (Observer.observeModel .pagetitle
                            |> Spec.expect (equals "Funds")
                        )
                    , it "should have balances in the model"
                        (Observer.observeModel .balances
                            |> Spec.expect (equals <| TestData.testBalanceInfo)
                        )
                    , it "should receive primary address"
                        (Observer.observeModel .primaryaddress
                            |> Spec.expect (equals TestData.primaryAddress)
                        )
                    , it "should display primaryaddress"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "primaryaddress" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 TestData.primaryAddress
                                )
                        )
                    ]
            )
        , scenario "2: Handling the Funds page with INvalid balance data"
            (given
                (Spec.Setup.init ( { fundsInitialModel | status = Funds.Errored, balances = Nothing, primaryaddress = "" }, Cmd.none )
                    |> Spec.Setup.withView Funds.view
                    |> Spec.Setup.withUpdate Funds.update
                    |> Spec.Setup.withLocation TestData.placeholderUrl
                )
                |> Spec.observeThat
                    [ it "has status as Loaded"
                        (Observer.observeModel .status
                            |> Spec.expect (equals Funds.Errored)
                        )
                    , it "displays the Funds page correctly"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "funds-error-message" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Error: Unable to retrieve relevant data. Please try again later."
                                )
                        )
                    ]
            )
        , scenario "2a: Show available balance and reserved balance correctly in the UI"
            (given
                (Spec.Setup.init ( { fundsInitialModel | status = Funds.Loaded, balances = TestData.testBalanceInfo, primaryaddress = TestData.primaryAddress }, Cmd.none )
                    |> Spec.Setup.withView Funds.view
                    |> Spec.Setup.withUpdate Funds.update
                    |> Spec.Setup.withLocation TestData.placeholderUrl
                )
                |> Spec.observeThat
                    [ it "has status as Loaded"
                        (Observer.observeModel .status
                            |> Spec.expect (equals Funds.Loaded)
                        )
                    , it "pagetitle is Funds"
                        (Observer.observeModel .pagetitle
                            |> Spec.expect (equals "Funds")
                        )
                    , it "should have balances in the model"
                        (Observer.observeModel .balances
                            |> Spec.expect (equals <| TestData.testBalanceInfo)
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
        , scenario "3: Generating a New Subaddress"
            (given
                (Spec.Setup.init ( fundsInitialModel, Cmd.none )
                    |> Spec.Setup.withView Funds.view
                    |> Spec.Setup.withUpdate Funds.update
                    |> Spec.Setup.withLocation TestData.placeholderUrl
                    |> Stub.serve [ TestData.successfullSubAddressFetch ]
                )
                {- |> Spec.when "we log the http requests"
                   [ Spec.Http.logRequests
                   ]
                -}
                -- NOTE: Use this to bypass need to go via Main.elm, which is what will happen in the real app
                -- via GotFundsMsg
                |> when "the response triggers GotNewSubaddress in Funds.update"
                    [ Spec.Command.send
                        (Spec.Command.fake <|
                            Funds.GotXmrNewSubaddress
                                (Ok { subaddress = TestData.subAddress })
                        )
                    ]
                |> Spec.observeThat
                    [ it "should have status as SubAddressView"
                        (Observer.observeModel .status
                            |> Spec.expect (equals Funds.Loaded)
                        )
                    , it "should have currentView as SubAddressView"
                        (Observer.observeModel .currentView
                            |> Spec.expect (equals Funds.SubAddressView)
                        )
                    , it "displays the new subaddress"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ id "newSubaddress" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 TestData.subAddress
                                )
                        )
                    ]
            )

        -- NOTE: Uncomment these tests one at a time to maintain managability
        {-




           scenario "6: Viewing Funding Addresses"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation TestData.placeholderUrl
                   )
                   |> when "the app retrieves the funding addresses"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotFundingAddresses (Ok "Funding Address")) ]
                   |> Spec.observeThat
                       [ it "displays the funding addresses"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "fundingAddresses" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Funding Address"
                                   )
                           )
                       ]
               )

           scenario "7: Unlocking the Wallet"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation TestData.placeholderUrl
                   )
                   |> when "the user attempts to unlock the wallet"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotUnlockWallet (Ok "Wallet Unlocked")) ]
                   |> Spec.observeThat
                       [ it "updates the Wallet page to reflect the unlocked state"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "walletUnlocked" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Wallet Unlocked"
                                   )
                           )
                       ]
               )

           scenario "8: Locking the Wallet"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation TestData.placeholderUrl
                   )
                   |> when "the user requests to lock the wallet"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotLockWallet (Ok "Wallet Locked")) ]
                   |> Spec.observeThat
                       [ it "updates the Wallet page to reflect the locked state"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "walletLocked" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Wallet Locked"
                                   )
                           )
                       ]
               )

           scenario "9: Setting a Wallet Password"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation TestData.placeholderUrl
                   )
                   |> when "the user sets a password for the wallet"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotSetWalletPassword (Ok "Password successfully set")) ]
                   |> Spec.observeThat
                       [ it "confirms the wallet password was successfully set"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "passwordSetConfirmation" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Password successfully set"
                                   )
                           )
                       ]
               )

           scenario "10: Removing the Wallet Password"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation TestData.placeholderUrl
                   )
                   |> when "the user removes the wallet password"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotRemoveWalletPassword (Ok "Password successfully removed")) ]
                   |> Spec.observeThat
                       [ it "confirms the password was successfully removed"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "passwordRemovedConfirmation" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Password successfully removed"
                                   )
                           )
                       ]
               )

           scenario "11: Relaying a Monero Transaction"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation TestData.placeholderUrl
                   )
                   |> when "the user requests to relay a transaction"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotRelayTransaction (Ok "Transaction Relayed")) ]
                   |> Spec.observeThat
                       [ it "broadcasts the transaction to the Monero network"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "transactionStatus" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Transaction Relayed"
                                   )
                           )
                       ]
               )

           scenario "12: Creating a New Monero Transaction"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation TestData.placeholderUrl
                   )
                   |> when "the user initiates a new transaction"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotCreateTransaction (Ok "Transaction Pending")) ]
                   |> Spec.observeThat
                       [ it "displays the pending transaction status"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "transactionPending" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Transaction Pending"
                                   )
                           )
                       ]
               )

           scenario "13: Show pending balance correctly when a transaction is initiated"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation TestData.placeholderUrl
                   )
                   |> when "the user initiates a transaction"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotTransactionInitiated (Ok "Transaction Initiated")) ]
                   |> when "the transaction enters pending status"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotTransactionPending (Ok "Pending Balance: 20.0 XMR")) ]
                   |> Spec.observeThat
                       [ it "displays the pending balance correctly"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "pendingBalance" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Pending Balance: 20.0 XMR"
                                   )
                           )
                       ]
               )

           scenario "14: Display warning when attempting to send more than available balance"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation TestData.placeholderUrl
                   )
                   |> when "the user attempts to send more than the available balance"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotExceedsAvailableBalance (Ok "Insufficient funds")) ]
                   |> Spec.observeThat
                       [ it "displays an error message about insufficient funds"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "errorMessage" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Insufficient funds"
                                   )
                           )
                       ]
               )

           scenario "15: Show wallet balance updates after successful deposit"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation TestData.placeholderUrl
                   )
                   |> when "the user successfully deposits funds into the wallet"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotDepositSuccess (Ok "Available Balance: 200.0 XMR")) ]
                   |> Spec.observeThat
                       [ it "updates the available balance after deposit"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "availableBalance" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Available Balance: 200.0 XMR"
                                   )
                           )
                       ]
               )
        -}
        ]



-- JSON-like structure for creating a new transaction
-- JSON-like structure for navigating to the Funds page
-- Action type to navigate
-- JSON-like structure for requesting a new Monero subaddress
-- Action type to request a new subaddress
-- JSON-like structure for requesting the primary Monero address
-- Action type to request the primary Monero address


main : Program Spec.Flags (Spec.Model Funds.Model Funds.Msg) (Spec.Msg Funds.Msg)
main =
    BddStepDefinitions.Runner.browserProgram [ runSpecTests ]
