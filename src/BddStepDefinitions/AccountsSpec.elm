module BddStepDefinitions.AccountsSpec exposing (main)

import BddStepDefinitions.Extra exposing (equals)
import BddStepDefinitions.Runner
import Extras.TestData as TestData exposing (placeholderUrl, testBalanceInfo)
import Grpc
import Json.Decode
import Pages.Accounts as Accounts
import Spec exposing (Flags, Spec, describe, given, it, scenario, when)
import Spec.Claim as Claim
import Spec.Command
import Spec.Markup
import Spec.Markup.Event
import Spec.Markup.Selector exposing (by)
import Spec.Observer as Observer
import Spec.Port
import Spec.Setup



-- NAV: Test scenarios
-- NOTE: Override the initial model in the module under test where necessary using
-- using this:


accountsInitialModel : Accounts.Model
accountsInitialModel =
    Accounts.initialModel


runSpecTests : Spec Accounts.Model Accounts.Msg
runSpecTests =
    describe
        "Haveno Web App Accounts Tests"
        [ scenario "1: Accessing the Accounts page with valid balance data and primary address which would get from Main"
            (given
                (Spec.Setup.initWithModel { accountsInitialModel | balances = testBalanceInfo, primaryaddress = TestData.primaryAddress }
                    |> Spec.Setup.withUpdate Accounts.update
                    |> Spec.Setup.withLocation placeholderUrl
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
                    , it "has view ManageAccounts"
                        (Observer.observeModel .currentView
                            |> Spec.expect (equals Accounts.ManageAccounts)
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
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "accounts-error-message" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "Error: Unable to retrieve relevant data. Please try again later."
                                )
                        )
                    ]
            )
        , Spec.scenario "3. User navigates to Traditional Currency Accounts"
            (Spec.given
                (Spec.Setup.initWithModel accountsInitialModel
                    |> Spec.Setup.withView Accounts.view
                    |> Spec.Setup.withUpdate Accounts.update
                )
                |> Spec.when "User clicks Traditional Currency Accounts"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "traditionalCurrencyAccountsButton" ]
                    , Spec.Markup.Event.click
                    ]
                |> Spec.observeThat
                    [ it "has status as Loaded"
                        (Observer.observeModel .status
                            |> Spec.expect (equals Accounts.Loaded)
                        )
                    , Spec.it "updates the model to show Traditional Currency Accounts"
                        (Observer.observeModel .currentView
                            |> Spec.expect (BddStepDefinitions.Extra.equals Accounts.TraditionalCurrencyAccounts)
                        )
                    ]
            )
        , Spec.scenario "4. User navigates to Cryptocurrency Accounts"
            (Spec.given
                (Spec.Setup.initWithModel accountsInitialModel
                    |> Spec.Setup.withView Accounts.view
                    |> Spec.Setup.withUpdate Accounts.update
                )
                |> Spec.when "User clicks Cryptocurrency Accounts"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "cryptocurrencyAccountsButton" ]
                    , Spec.Markup.Event.click
                    ]
                |> Spec.when "User clicks Add New BTC Account"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "addnewBTCaccountViewbutton" ]
                    , Spec.Markup.Event.click
                    ]
                |> Spec.observeThat
                    [ Spec.it "has status as Loaded"
                        (Observer.observeModel .status
                            |> Spec.expect (equals Accounts.Loaded)
                        )
                    , Spec.it "has cryptoAccount as BTC"
                        (Observer.observeModel .cryptoAccountType
                            |> Spec.expect (equals Accounts.BTC)
                        )
                    , Spec.it "updates the model to show Create new BTC Account"
                        (Observer.observeModel .currentView
                            |> Spec.expect (BddStepDefinitions.Extra.equals Accounts.CreateNewBTCAccountView)
                        )
                    , it "displays the Cryptocurrency list with BTC as the first option"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "crypto-type" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "BTC"
                                )
                        )
                    , it "displays a text input box titled 'Enter BTC address'"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "bitcoin-address-input" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.attribute "placeholder" <|
                                        Claim.isSomethingWhere <|
                                            Claim.isStringContaining 1 "Enter valid BTC address"
                                )
                        )
                    , it "displays a text input box titled 'Limitations' that cannot be modified"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "limitations-input" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.property (Json.Decode.field "value" Json.Decode.string) <|
                                        Claim.isStringContaining 1 "Max. trade duration: 0 hours/Max.trade limit: 96.00 XMR"
                                )
                        )
                    , it "displays a text input box titled 'Account name' that cannot be modified"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "account-name-input" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.property (Json.Decode.field "value" Json.Decode.string) <|
                                        Claim.isStringContaining 1 "BTC:"
                                )
                        )
                    , it "displays the available Add New BTC Account button correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "save-new-BTC-account-button" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "SAVE NEW BTC ACCOUNT"
                                )
                        )
                    ]
            )
        , Spec.scenario "User navigates to Wallet Password"
            (Spec.given
                (Spec.Setup.initWithModel accountsInitialModel
                    |> Spec.Setup.withView Accounts.view
                    |> Spec.Setup.withUpdate Accounts.update
                )
                |> Spec.when "User clicks Wallet Password"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "walletPasswordButton" ]
                    , Spec.Markup.Event.click
                    ]
                |> Spec.observeThat
                    [ Spec.it "updates the model to show Wallet Password"
                        (Observer.observeModel .currentView
                            |> Spec.expect (BddStepDefinitions.Extra.equals Accounts.WalletPassword)
                        )
                    ]
            )
        , Spec.scenario "User navigates to Wallet Seed"
            (Spec.given
                (Spec.Setup.initWithModel accountsInitialModel
                    |> Spec.Setup.withView Accounts.view
                    |> Spec.Setup.withUpdate Accounts.update
                )
                |> Spec.when "User clicks Wallet Seed"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "walletSeedButton" ]
                    , Spec.Markup.Event.click
                    ]
                |> Spec.observeThat
                    [ Spec.it "updates the model to show Wallet Seed"
                        (Observer.observeModel .currentView
                            |> Spec.expect (BddStepDefinitions.Extra.equals Accounts.WalletSeed)
                        )
                    ]
            )
        , Spec.scenario "User navigates to Backup"
            (Spec.given
                (Spec.Setup.initWithModel accountsInitialModel
                    |> Spec.Setup.withView Accounts.view
                    |> Spec.Setup.withUpdate Accounts.update
                )
                |> Spec.when "User clicks Backup"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "backupButton" ]
                    , Spec.Markup.Event.click
                    ]
                |> Spec.observeThat
                    [ Spec.it "updates the model to show Backup"
                        (Observer.observeModel .currentView
                            |> Spec.expect (BddStepDefinitions.Extra.equals Accounts.Backup)
                        )
                    ]
            )
        , Spec.scenario "5. Displays 'There are no accounts set up yet' when the list is empty"
            (Spec.given
                (Spec.Setup.initWithModel accountsInitialModel
                    |> Spec.Setup.withView Accounts.view
                    |> Spec.Setup.withUpdate Accounts.update
                )
                |> Spec.when "User clicks Cryptocurrency Accounts"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "cryptocurrencyAccountsButton" ]
                    , Spec.Markup.Event.click
                    ]
                |> Spec.observeThat
                    [ Spec.it "displays the message correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "accounts-listOfExistingCryptoAccounts" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "There are no accounts set up yet"
                                )
                        )
                    ]
            )
        , Spec.scenario "6. Displays existing accounts when the list is not empty"
            (Spec.given
                (Spec.Setup.initWithModel { accountsInitialModel | status = Accounts.Loaded, listOfExistingCryptoAccounts = [ "Account 1", "Account 2" ] }
                    |> Spec.Setup.withView Accounts.view
                    |> Spec.Setup.withUpdate Accounts.update
                )
                |> Spec.when "User clicks Cryptocurrency Accounts"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "cryptocurrencyAccountsButton" ]
                    , Spec.Markup.Event.click
                    ]
                |> Spec.observeThat
                    [ it "has status as Loaded"
                        (Observer.observeModel .status
                            |> Spec.expect (equals Accounts.Loaded)
                        )
                    , Spec.it "displays the accounts correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "accounts-listOfExistingCryptoAccounts" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "Account 1"
                                )
                        )
                    , Spec.it "displays the accounts correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "accounts-listOfExistingCryptoAccounts" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "Account 2"
                                )
                        )
                    ]
            )
        , BddStepDefinitions.Runner.skip <| scenario "User clicks VIEW BTC ACCOUNTS button and sends the expected message to the port"
            (given
                (Spec.Setup.initWithModel accountsInitialModel
                    |> Spec.Setup.withView Accounts.view
                    |> Spec.Setup.withUpdate Accounts.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "User clicks Cryptocurrency Accounts"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "cryptocurrencyAccountsButton" ]
                    , Spec.Markup.Event.click
                    ]
                 |> when "User clicks BTC Accounts"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "btcAccountsButton" ]
                    , Spec.Markup.Event.click
                    ]
                
                |> Spec.observeThat
                    [ it "is on the DisplayStoredBTCAddresses view"
                        (Observer.observeModel .currentView
                            |> Spec.expect (equals Accounts.DisplayStoredBTCAddresses)
                        )
                    , it "displays stored and unencrypted BTC address(es) correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.class "btc-account-item" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v"
                                )
                        )
                    ]
            )
        , scenario "User clicks SAVE NEW BTC ACCOUNT button and sends the expected message to the port"
            (given
                (Spec.Setup.initWithModel accountsInitialModel
                    |> Spec.Setup.withView Accounts.view
                    |> Spec.Setup.withUpdate Accounts.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "User clicks Cryptocurrency Accounts"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "cryptocurrencyAccountsButton" ]
                    , Spec.Markup.Event.click
                    ]
                |> when "User clicks Add New BTC Account"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "addnewBTCaccountViewbutton" ]
                    , Spec.Markup.Event.click
                    ]
                |> when "User enters a new BTC address"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "bitcoin-address-input" ]
                    , Spec.Markup.Event.input "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                    ]
                |> when "User clicks SAVE NEW BTC ACCOUNT button"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "save-new-BTC-account-button" ]
                    , Spec.Markup.Event.click
                    ]
                |> Spec.observeThat
                    [ it "sends the expected message to the port"
                        (Spec.Port.observe "encryptedMsg" Json.Decode.string
                            |> Spec.expect (equals [ "{\"type\":\"encryptionMsg\",\"currency\":\"BTC\",\"address\":\"1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v\"}" ])
                        )
                    , it "is on the DisplayStoredBTCAddresses view"
                        (Observer.observeModel .currentView
                            |> Spec.expect (equals Accounts.DisplayStoredBTCAddresses)
                        )
                    , it "displays the newly added BTC address correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.class "btc-account-item" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v"
                                )
                        )
                    ]
            )
        ]


main : Program Flags (Spec.Model Accounts.Model Accounts.Msg) (Spec.Msg Accounts.Msg)
main =
    BddStepDefinitions.Runner.browserProgram [ runSpecTests ]
