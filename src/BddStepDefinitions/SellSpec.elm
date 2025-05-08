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
import Spec.Markup.Event
import Spec.Markup.Selector exposing (by)
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
        , scenario "3: Display Sell XMR for BTC, current offers panel and Sell BTC Offer button"
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
                    , it "current view is Bitcoin"
                        (Observer.observeModel .currentView
                            |> Spec.expect (equals Sell.Bitcoin)
                        )
                    , it "displays the CREATE NEW OFFER TO SELL BTC button correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "create-new-offer-sell-BTC-button" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "CREATE NEW OFFER TO SELL BTC"
                                )
                        )
                    , Spec.it "displays the Sell Offers table"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "sell-offers-table" ]
                            |> Spec.expect Claim.isSomething
                        )
                    , Spec.it "displays the Price column"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "column-price" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "Price (XMR)"
                                )
                        )
                    , Spec.it "displays the XMR Range column"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "column-xmr-range" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "XMR Range"
                                )
                        )
                    , Spec.it "displays the BTC Range column"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "column-btc-range" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "BTC Range"
                                )
                        )
                    , Spec.it "displays the Payment column"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "column-payment" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "Payment"
                                )
                        )
                    , Spec.it "displays the Deposit column"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "column-deposit" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "Deposit %"
                                )
                        )

                    -- REVIEW: Add a column-actions test?
                    , Spec.it "displays the Buyer column"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "column-buyer" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "Buyer"
                                )
                        )
                    ]
            )
        , scenario "4: If NO BTC addresses exist, display the setup Accounts button"
            (given
                (Spec.Setup.initWithModel
                    { sellInitialModel
                        | currentView = Sell.ManageSell
                        , status = Sell.Loaded
                        , listOfExistingCryptoAccounts = []
                        , listOfBTCAddresses = []
                    }
                    |> Spec.Setup.withView Sell.view
                    |> Spec.Setup.withUpdate Sell.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> Spec.when "User clicks Bitcoin button"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "bitcoin-sell-button" ]
                    , Spec.Markup.Event.click
                    ]
                |> Spec.when "User clicks CREATE NEW OFFER TO SELL BTC button"
                    [ Spec.Markup.target << Spec.Markup.Selector.by [ Spec.Markup.Selector.id "create-new-offer-sell-BTC-button" ]
                    , Spec.Markup.Event.click
                    ]
                |> Spec.observeThat
                    [ it "has status as Loaded"
                        (Observer.observeModel .status
                            |> Spec.expect (equals Sell.Loaded)
                        )
                    , it "current view is OfferToSellBTC"
                        (Observer.observeModel .currentView
                            |> Spec.expect (equals Sell.OfferToSellBTC)
                        )
                    , it "informs user needs to setup a BTC account"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.class "btc-address-item" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1
                                            "You don't have a payment account set up for the selected currency."
                                )
                        )
                    , it "displays the CREATE NEW OFFER TO SELL BTC button correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "back-to-manage-accounts-from-sell-button" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1
                                            "SETUP A NEW TRADING ACCOUNT"
                                )
                        )
                    ]
            )
        ]


main : Program Flags (Spec.Model Sell.Model Sell.Msg) (Spec.Msg Sell.Msg)
main =
    BddStepDefinitions.Runner.browserProgram [ runSpecTests ]
