module BddStepDefinitions.SellSpec exposing (main)

--import Grpc
--import Json.Decode
--import Spec.Port

import BddStepDefinitions.Extra exposing (equals)
import BddStepDefinitions.Runner
import Extras.TestData as TestData exposing (placeholderUrl, testBalanceInfo)
import Pages.Sell as Sell
import Spec exposing (Flags, Spec, describe, given, it, scenario)
import Spec.Claim as Claim
import Spec.Markup
import Spec.Markup.Selector exposing (by)
import Spec.Markup.Event
import Spec.Observer as Observer
import Spec.Setup



-- NAV: Test scenarios
-- NOTE: Override the initial model in the module under test where necessary using
-- using this:


sellInitialModel : Sell.Model
sellInitialModel =
    Sell.initialModel



{- typeOfMsgDecoder : Json.Decode.Decoder String
   typeOfMsgDecoder =
       Json.Decode.field "typeOfMsg" Json.Decode.string
-}


runSpecTests : Spec Sell.Model Sell.Msg
runSpecTests =
    describe
        "Haveno Web App Sell Tests"
        [ scenario "1: Accessing the Sell page with valid balance data and primary address which would get from Main"
            (given
                (Spec.Setup.initWithModel { sellInitialModel | balances = testBalanceInfo, primaryaddress = TestData.primaryAddress }
                    |> Spec.Setup.withView Sell.view
                    |> Spec.Setup.withUpdate Sell.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                {- |> Spec.when "we log the http requests"
                   [ Spec.Http.logRequests
                   ]
                -}
                |> Spec.observeThat
                    [ it "has status as Loaded"
                        (Observer.observeModel .status
                            |> Spec.expect (equals Sell.Loaded)
                        )
                    , it "pagetitle is Sell"
                        (Observer.observeModel .pagetitle
                            |> Spec.expect (equals "Sell")
                        )
                    , it "should have balances in the model"
                        (Observer.observeModel .balances
                            |> Spec.expect (equals <| testBalanceInfo)
                        )
                    , it "should receive primary address"
                        (Observer.observeModel .primaryaddress
                            |> Spec.expect (equals TestData.primaryAddress)
                        )
                    , it "has view ManageSell"
                        (Observer.observeModel .currentView
                            |> Spec.expect (equals Sell.ManageSell)
                        )
                    , it "displays the Monero button correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "bitcoin-sell-button" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "BITCOIN"
                                )
                        )
                    ]
            )
        , scenario "2: Display the Crypto Sell options"
            (given
                (Spec.Setup.initWithModel
                    { sellInitialModel
                        | currentView = Sell.ManageSell
                        , status = Sell.Loaded
                        , listOfExistingCryptoAccounts = [ "Account 1", "Account 2" ]
                    }
                    |> Spec.Setup.withView Sell.view
                    |> Spec.Setup.withUpdate Sell.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> Spec.observeThat
                    [ Spec.it "has status as Loaded"
                        (Observer.observeModel .status
                            |> Spec.expect (equals Sell.Loaded)
                        )
                    , Spec.it "updates the model to show MangeSell"
                        (Observer.observeModel .currentView
                            |> Spec.expect (BddStepDefinitions.Extra.equals Sell.ManageSell)
                        )
                    , it "displays the Monero button correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "monero-sell-button" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "MONERO"
                                )
                        )
                    , it "displays the Bitcoin button correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "bitcoin-sell-button" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "BITCOIN"
                                )
                        )
                    , it "displays the Others button correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "others-sell-button" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "OTHERS"
                                )
                        )
                    ]
            )

        , scenario "3: Display Sell BTC for XMR and Sell BTC Offer button"
            (given
                (Spec.Setup.initWithModel
                    { sellInitialModel
                        | currentView = Sell.ManageSell
                        , status = Sell.Loaded
                        , listOfExistingCryptoAccounts = [ "Account 1", "Account 2" ]
                    }
                    |> Spec.Setup.withView Sell.view
                    |> Spec.Setup.withUpdate Sell.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> Spec.when "User clicks Bitcoin button"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "bitcoin-sell-button" ]
                    , Spec.Markup.Event.click
                    ]

                |> Spec.observeThat
                    [ it "has status as Loaded"
                       (Observer.observeModel .status
                           |> Spec.expect (equals Sell.Loaded)
                       )
                   , it "displays the Sell page correctly"
                       (Spec.Markup.observeElement
                           |> Spec.Markup.query
                           << by [ Spec.Markup.Selector.class "bitcoin-sell-subtitle" ]
                           |> Spec.expect
                               (Claim.isSomethingWhere <|
                                   Spec.Markup.text <|
                                       Claim.isStringContaining 1
                                       "Sell BTC for XMR"
                               )
                       )
                   ]
           )
       
        {- , --skip <|
             --pick <|
             scenario "2: Handling the Sell page with INvalid balance data"
               (given
                   (Spec.Setup.init (Sell.init ())
                       |> Spec.Setup.withView Sell.view
                       |> Spec.Setup.withUpdate Sell.update
                       |> Spec.Setup.withLocation placeholderUrl
                   )
                   |> when "the page attempts to load Balances"
                       [ Spec.Command.send (Spec.Command.fake <| Sell.GotBalances (Result.Err <| Grpc.UnknownGrpcStatus "unknown")) ]
                   |> Spec.observeThat
                       [ it "has status as Loaded"
                           (Observer.observeModel .status
                               |> Spec.expect (equals Sell.Errored)
                           )
                       , it "displays the Sell page correctly"
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
           , Spec.scenario "3. User navigates to Traditional Currency Sell"
               (Spec.given
                   (Spec.Setup.initWithModel sellInitialModel
                       |> Spec.Setup.withView Sell.view
                       |> Spec.Setup.withUpdate Sell.update
                   )
                   |> Spec.when "User clicks Traditional Currency Sell"
                       [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "traditionalCurrencyAccountsButton" ]
                       , Spec.Markup.Event.click
                       ]
                   |> Spec.observeThat
                       [ it "has status as Loaded"
                           (Observer.observeModel .status
                               |> Spec.expect (equals Sell.Loaded)
                           )
                       , Spec.it "updates the model to show Traditional Currency Sell"
                           (Observer.observeModel .currentView
                               |> Spec.expect (BddStepDefinitions.Extra.equals Sell.TraditionalCurrencyAccounts)
                           )
                       ]
               )
           , Spec.scenario "4. User navigates to Cryptocurrency Sell"
               (Spec.given
                   (Spec.Setup.initWithModel sellInitialModel
                       |> Spec.Setup.withView Sell.view
                       |> Spec.Setup.withUpdate Sell.update
                   )
                   |> Spec.when "User clicks Cryptocurrency Sell"
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
                               |> Spec.expect (equals Sell.Loaded)
                           )
                       , Spec.it "has cryptoAccount as BTC"
                           (Observer.observeModel .cryptoAccountType
                               |> Spec.expect (equals Sell.BTC)
                           )
                       , Spec.it "updates the model to show Create new BTC Account"
                           (Observer.observeModel .currentView
                               |> Spec.expect (BddStepDefinitions.Extra.equals Sell.CreateNewBTCAccountView)
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
                   (Spec.Setup.initWithModel sellInitialModel
                       |> Spec.Setup.withView Sell.view
                       |> Spec.Setup.withUpdate Sell.update
                   )
                   |> Spec.when "User clicks Wallet Password"
                       [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "walletPasswordButton" ]
                       , Spec.Markup.Event.click
                       ]
                   |> Spec.observeThat
                       [ Spec.it "updates the model to show Wallet Password"
                           (Observer.observeModel .currentView
                               |> Spec.expect (BddStepDefinitions.Extra.equals Sell.WalletPassword)
                           )
                       ]
               )
           , Spec.scenario "User navigates to Wallet Seed"
               (Spec.given
                   (Spec.Setup.initWithModel sellInitialModel
                       |> Spec.Setup.withView Sell.view
                       |> Spec.Setup.withUpdate Sell.update
                   )
                   |> Spec.when "User clicks Wallet Seed"
                       [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "walletSeedButton" ]
                       , Spec.Markup.Event.click
                       ]
                   |> Spec.observeThat
                       [ Spec.it "updates the model to show Wallet Seed"
                           (Observer.observeModel .currentView
                               |> Spec.expect (BddStepDefinitions.Extra.equals Sell.WalletSeed)
                           )
                       ]
               )
           , Spec.scenario "User navigates to Backup"
               (Spec.given
                   (Spec.Setup.initWithModel sellInitialModel
                       |> Spec.Setup.withView Sell.view
                       |> Spec.Setup.withUpdate Sell.update
                   )
                   |> Spec.when "User clicks Backup"
                       [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "backupButton" ]
                       , Spec.Markup.Event.click
                       ]
                   |> Spec.observeThat
                       [ Spec.it "updates the model to show Backup"
                           (Observer.observeModel .currentView
                               |> Spec.expect (BddStepDefinitions.Extra.equals Sell.Backup)
                           )
                       ]
               )
           , Spec.scenario "5. Displays 'There are no accounts set up yet' when the list is empty"
               (Spec.given
                   (Spec.Setup.initWithModel sellInitialModel
                       |> Spec.Setup.withView Sell.view
                       |> Spec.Setup.withUpdate Sell.update
                   )
                   |> Spec.when "User clicks Cryptocurrency Sell"
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
           , Spec.scenario "6. Displays existing accounts when the list is not empty - ONLY TESTING VIEW and PORT, not localstorage"
               (Spec.given
                   (Spec.Setup.initWithModel
                       { sellInitialModel
                           | status = Sell.Loaded
                           , listOfExistingCryptoAccounts = [ "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v", "1GK6XMLmzFVj8ALj6mfBsbifRoD4miY36o" ]
                           , savedPassword = "test-password"
                       }
                       |> Spec.Setup.withView Sell.view
                       |> Spec.Setup.withUpdate Sell.update
                   )
                   |> Spec.when "User clicks Cryptocurrency Sell"
                       [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "cryptocurrencyAccountsButton" ]
                       , Spec.Markup.Event.click
                       ]
                   |> Spec.observeThat
                       [ it "has status as Loaded"
                           (Observer.observeModel .status
                               |> Spec.expect (equals Sell.Loaded)
                           )
                       , it "is on the CryptoAccounts view"
                           (Observer.observeModel .currentView
                               |> Spec.expect (equals Sell.CryptoAccounts)
                           )

                       -- NOTE: Can only test the request going to the port, response is returned via Main.elm
                       , Spec.it "sends the expected message to the port"
                           (Spec.Port.observe "msgFromAccounts" typeOfMsgDecoder
                               -- NOTE: Spec.Port.observe always returns a LIST of messages received through the port.
                               |> Spec.expect (equals <| [ "decryptCryptoAccountsMsgRequest" ])
                           )
                       , Spec.it "displays the accounts correctly"
                           (Spec.Markup.observeElement
                               |> Spec.Markup.query
                               << by [ Spec.Markup.Selector.id "accounts-listOfExistingCryptoAccounts" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Spec.Markup.text <|
                                           Claim.isStringContaining 1 "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v"
                                   )
                           )
                       , Spec.it "displays the accounts correctly"
                           (Spec.Markup.observeElement
                               |> Spec.Markup.query
                               << by [ Spec.Markup.Selector.id "accounts-listOfExistingCryptoAccounts" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Spec.Markup.text <|
                                           Claim.isStringContaining 1 "1GK6XMLmzFVj8ALj6mfBsbifRoD4miY36o"
                                   )
                           )
                       ]
               )
           , scenario "User clicks VIEW BTC ACCOUNTS button and sends the expected message to the port"
               (given
                   (Spec.Setup.initWithModel
                       { sellInitialModel
                           | listOfBTCAddresses =
                               [ "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v"
                               , "1GK6XMLmzFVj8ALj6mfBsbifRoD4miY36o"
                               ]
                       }
                       |> Spec.Setup.withView Sell.view
                       |> Spec.Setup.withUpdate Sell.update
                       |> Spec.Setup.withLocation placeholderUrl
                   )
                   |> when "User clicks Cryptocurrency Sell"
                       [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "cryptocurrencyAccountsButton" ]
                       , Spec.Markup.Event.click
                       ]
                   |> when "User clicks View BTC Sell"
                       [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "btcAccountsButton" ]
                       , Spec.Markup.Event.click
                       ]
                   |> Spec.observeThat
                       [ it "is on the DisplayStoredBTCAddresses view"
                           (Observer.observeModel .currentView
                               |> Spec.expect (equals Sell.DisplayStoredBTCAddresses)
                           )
                       , it "displays stored and unencrypted BTC address(es) correctly"
                           (Spec.Markup.observeElements
                               |> Spec.Markup.query
                               << by [ Spec.Markup.Selector.class "btc-address-item" ]
                               |> Spec.expect
                                   (Claim.isListWhere
                                       [ Spec.Markup.text (equals "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v")
                                       , Spec.Markup.text (equals "1GK6XMLmzFVj8ALj6mfBsbifRoD4miY36o")
                                       ]
                                   )
                           )
                       ]
               )
           , scenario "User clicks SAVE NEW BTC ACCOUNT button and sends the expected message to the port"
               (given
                   (Spec.Setup.initWithModel { sellInitialModel | savedPassword = "test-password" }
                       |> Spec.Setup.withView Sell.view
                       |> Spec.Setup.withUpdate Sell.update
                       |> Spec.Setup.withLocation placeholderUrl
                   )
                   |> when "User clicks Cryptocurrency Sell"
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
                           (Spec.Port.observe "msgFromAccounts" typeOfMsgDecoder
                               |> Spec.expect (equals <| [ "decryptCryptoAccountsMsgRequest", "encryptCryptoAccountMsgRequest" ])
                           )
                       , it "is on the DisplayStoredBTCAddresses view"
                           (Observer.observeModel .currentView
                               |> Spec.expect (equals Sell.DisplayStoredBTCAddresses)
                           )
                       , it "displays the newly added BTC address correctly"
                           (Spec.Markup.observeElement
                               |> Spec.Markup.query
                               << by [ Spec.Markup.Selector.class "btc-address-item" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Spec.Markup.text <|
                                           Claim.isStringContaining 1 "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                                   )
                           )
                       ]
               )
        -}
        ]


main : Program Flags (Spec.Model Sell.Model Sell.Msg) (Spec.Msg Sell.Msg)
main =
    BddStepDefinitions.Runner.browserProgram [ runSpecTests ]
