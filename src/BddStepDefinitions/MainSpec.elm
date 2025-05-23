module BddStepDefinitions.MainSpec exposing (main)

{- -- NOTE: 'Main' here refers to settings that hold throughout the app, e.g. isLNSConnected, not just on a given page, so the tests
   might switch to particular pages and check that 'global' settings (Main's model) are correct

   -- NOTE: This MainSpec file is for INTEGRATION tests, not unit or modular tests.
   -- It's for testing the app as a whole, not individual functions. Try to limit tests here to logic, not specifics.
   -- Other modules like WalletSpec are MODULAR tests, limited to the given page alone.
-}
--import Spec.Http

import BddStepDefinitions.Extra
import BddStepDefinitions.Runner
import Browser
import Extras.TestData as TestData
import Json.Decode
import Json.Encode
import Main
import Pages.Accounts as Accounts
import Pages.Connect as Connect
import Pages.Funds as Funds
import Pages.Sell as Sell
import Spec exposing (describe, given, it, scenario, when)
import Spec.Claim as Claim
import Spec.Command
import Spec.Http.Stub as Stub
import Spec.Markup
import Spec.Markup.Selector exposing (by)
import Spec.Navigator
import Spec.Observer
import Spec.Port
import Spec.Setup
import Spec.Time
import Url exposing (Protocol(..), Url)



--import Spec.Http
-- NAV: Initial test models
-- TODO: Use initWithModel - we can't get from Main unless it's a MainSpec test - so these are expected
-- state at the start of each test


fundsInitialModel : Funds.Model
fundsInitialModel =
    Funds.initialModel


accountsInitialModel : Accounts.Model
accountsInitialModel =
    Accounts.initialModel


sellInitialModel : Sell.Model
sellInitialModel =
    Sell.initialModel


decryptedAllCryptoAccountsResponseMessage : Json.Decode.Value
decryptedAllCryptoAccountsResponseMessage =
    Json.Encode.object
        [ ( "page", Json.Encode.string "AccountsPage" )
        , ( "typeOfMsg", Json.Encode.string "decryptedCryptoAccountsResponse" )
        , ( "accountsData", Json.Encode.list Json.Encode.string [ "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v", "1GK6XMLmzFVj8ALj6mfBsbifRoD4miY36o", "0x1234567890abcdef1234567890abcdef12345678" ] )
        , ( "currency", Json.Encode.string "AllCrypto" )
        ]


decryptedBTCAccountsResponseMessage : Json.Decode.Value
decryptedBTCAccountsResponseMessage =
    Json.Encode.object
        [ ( "page", Json.Encode.string "AccountsPage" )
        , ( "typeOfMsg", Json.Encode.string "decryptedCryptoAccountsResponse" )
        , ( "accountsData", Json.Encode.list Json.Encode.string [ "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v", "1GK6XMLmzFVj8ALj6mfBsbifRoD4miY36o" ] )
        , ( "currency", Json.Encode.string "BTC" )
        ]



-- NOTE: App.Model and App.Msg are type paramters for the Spec type
-- They make Spec type more flexible as it can be used with any model and msg types
-- NOTE: Any test involving subscriptions will need to be specified here using withSubscriptions


runSpecTests : Spec.Spec Main.Model Main.Msg
runSpecTests =
    describe
        "Scenarios based on a Haveno Web App MVP"
        [ --BddStepDefinitions.Runner.pick <|
          scenario "1: Display successful API connection status"
            (given
                -- NOTE: The URL is passed from js as JSON.stringified
                -- it could also be "\"http://elm-spec/\""
                (Spec.Setup.initForApplication (Main.init "\"http://localhost:1234/\"")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Stub.serve [ TestData.successfullXmrPrimaryAddressFetch, TestData.successfullVersionFetch, TestData.successfullBalancesFetch ]
                )
                {- |> Spec.when "we log the http requests"
                   [ Spec.Http.logRequests
                   ]
                -}
                |> Spec.observeThat
                    [ it "is on the Accounts page (after Splash page) and has received balances info"
                        (Spec.Observer.observeModel .page
                            |> Spec.expect
                                (Claim.isEqual Debug.toString <|
                                    Main.AccountsPage <|
                                        { accountsInitialModel | balances = TestData.testBalanceInfo }
                                )
                        )
                    , it "has status as Loaded"
                        (Spec.Observer.observeModel .status
                            |> Spec.expect (BddStepDefinitions.Extra.equals Main.Loaded)
                        )
                    , it "a. primaryaddress obtained"
                        (Spec.Observer.observeModel .primaryaddress
                            |> Spec.expect
                                (Claim.isEqual Debug.toString <|
                                    TestData.primaryAddress
                                )
                        )
                    , it "should display a message indicating whether the connection to the Haveno API was successful or not"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "connectionStatus" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "Connected"
                                )
                        )
                    ]
            )
        , --Runner.skip <|
          --Runner.pick <|
          scenario "2: Display UNsuccessful API connection status on startup"
            (given
                (Spec.Setup.initForApplication (Main.init "\"http://localhost:1234/\"")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Stub.serve [ TestData.successfullXmrPrimaryAddressFetch, TestData.unsuccessfullVersionFetch ]
                )
                |> Spec.observeThat
                    [ it "should display a message indicating whether the connection to the Haveno API was successful or not"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "connectionStatus" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "Haveno node not connected"
                                )
                        )
                    ]
            )
        , scenario "UNsuccessful API connection on startup - there should be no errors in error list"
            (given
                (Spec.Setup.initForApplication (Main.init "\"http://localhost:1234/\"")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Stub.serve [ TestData.unsuccessfullVersionFetch, TestData.unsuccessfullBalancesFetch, TestData.unSuccessfullXmrPrimaryAddressFetch ]
                )
                |> Spec.observeThat
                    [ it "there should be no errors"
                        (Spec.Observer.observeModel (.errors >> List.length)
                            |> Spec.expect
                                (Claim.isEqual Debug.toString 0)
                        )
                    ]
            )
        , scenario """When app first loads it should be on the accounts page if all the required 
        data is successfully fetched from gRPC server and the correct request for decrypted crypto accont data 
        is made to the js interop port"""
            (given
                (Spec.Setup.initForApplication (Main.init "\"http://localhost:1234/\"")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Stub.serve
                        [ TestData.successfullXmrPrimaryAddressFetch
                        , TestData.successfullVersionFetch
                        , TestData.successfullBalancesFetch
                        ]
                )
                |> Spec.observeThat
                    [ it "a.is on the Accounts page"
                        (Spec.Observer.observeModel .page
                            |> Spec.expect
                                (Claim.isEqual Debug.toString <|
                                    Main.AccountsPage <|
                                        { accountsInitialModel | balances = TestData.testBalanceInfo }
                                )
                        )
                    , it
                        "b. the app NAV location should be root "
                        (Spec.Navigator.observe
                            |> Spec.expect
                                (Spec.Navigator.location <|
                                    Claim.isEqual Debug.toString
                                        "http://elm-spec/"
                                )
                        )
                    , it
                        "sent the right message over the port"
                        (Spec.Port.observe "msgFromMain" Main.jsMessageDecoder
                            |> Spec.expect
                                (BddStepDefinitions.Extra.equals
                                    [ { typeOfMsg = Main.ElmReady
                                      , currency = Accounts.BTC
                                      , page = Main.AccountsPageJs
                                      , accountsData = [ "", "" ]
                                      }
                                    ]
                                )
                        )
                    ]
            )
        , scenario "7: Display the Haveno core app version number"
            (given
                (Spec.Setup.initForApplication (Main.init "\"http://localhost:1234/\"")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Spec.Setup.withLocation (Url Http "localhost" (Just 1234) "/" Nothing Nothing)
                    |> Stub.serve [ TestData.successfullXmrPrimaryAddressFetch, TestData.successfullVersionFetch, TestData.successfullBalancesFetch ]
                )
                |> Spec.observeThat
                    [ it "d. displays Haveno version number in the footer"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "havenofooterver" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "1.0.7"
                                )
                        )
                    ]
            )
        , scenario "11: Menu Closes After Using NavLink"
            (given
                (Spec.Setup.initForApplication (Main.init "\"http://localhost:1234/\"")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Spec.Setup.withLocation (Url Http "localhost" (Just 1234) "/" Nothing Nothing)
                )
                |> when "the user opens the menu"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            Main.ToggleMenu
                    ]
                |> when "the user clicks the Funds navLink in the burger menu"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            (Main.ClickedLink (Browser.Internal <| Url Http "localhost" (Just 1234) "/funds" Nothing Nothing))
                    ]
                |> Spec.observeThat
                    [ it "a.is on the Funds page"
                        (Spec.Observer.observeModel .page
                            |> Spec.expect
                                (Claim.isEqual Debug.toString <|
                                    Main.FundsPage <|
                                        Funds.initialModel
                                )
                        )
                    , it "b. the menu should be closed"
                        (Spec.Observer.observeModel .isMenuOpen
                            |> Spec.expect
                                Claim.isFalse
                        )
                    ]
            )
        , scenario "12: Connect page exists and can be navigated to via menu"
            (given
                (Spec.Setup.initForApplication (Main.init "\"http://localhost:1234/\"")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Spec.Setup.withLocation (Url Http "localhost" (Just 1234) "/" Nothing Nothing)
                )
                |> when "the user opens the menu"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            Main.ToggleMenu
                    ]
                |> when "the user clicks the Connect navLink in the burger menu"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            (Main.ClickedLink (Browser.Internal <| Url Http "localhost" (Just 1234) "/connect" Nothing Nothing))
                    ]
                |> Spec.observeThat
                    [ it "a.is on the Connect page"
                        (Spec.Observer.observeModel .page
                            |> Spec.expect
                                (Claim.isEqual Debug.toString <|
                                    Main.ConnectPage <|
                                        Connect.initialModel
                                )
                        )
                    , it "b. the menu should be closed"
                        (Spec.Observer.observeModel .isMenuOpen
                            |> Spec.expect
                                Claim.isFalse
                        )
                    ]
            )
        , scenario "12a: Dashboard Container - Show available, pending and reserved balances correctly in the UI"
            (given
                (Spec.Setup.initForApplication (Main.init "\"http://localhost:1234/\"")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Spec.Setup.withLocation (Url Http "localhost" (Just 1234) "/" Nothing Nothing)
                    |> Stub.serve [ TestData.successfullBalancesFetch, TestData.successfullXmrPrimaryAddressFetch ]
                )
                |> Spec.observeThat
                    [ it "should have balances in the model"
                        (Spec.Observer.observeModel .balances
                            |> Spec.expect (BddStepDefinitions.Extra.equals <| TestData.testBalanceInfo)
                        )
                    , it "displays the available balance correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "dashboard-container-xmrAvailableBalance" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "42.94 XMR"
                                )
                        )
                    , it "displays the pending balance correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "pendingBalance" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "2000 XMR"
                                )
                        )
                    , it "displays the reserved balance correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "reservedOfferBalance" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "5000 XMR"
                                )
                        )
                    ]
            )
        , scenario "13a: Connection Issues: Balance and Address data is hidden initially on the Funds page"
            (given
                (Spec.Setup.initForApplication (Main.init "\"http://localhost:1234/\"")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Spec.Setup.withLocation (Url Http "localhost" (Just 1234) "/" Nothing Nothing)
                    |> Stub.serve
                        [ TestData.unSuccessfullXmrPrimaryAddressFetch
                        , TestData.unsuccessfullVersionFetch
                        , TestData.unsuccessfullBalancesFetch
                        ]
                )
                |> when "we wait for possible server timeout"
                    [ Spec.Time.tick 6000
                    ]
                |> when "the user opens the menu"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            Main.ToggleMenu
                    ]
                |> when "the user clicks the Funds navLink in the burger menu"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            (Main.ClickedLink (Browser.Internal <| Url Http "localhost" (Just 1234) "/funds" Nothing Nothing))
                    ]
                |> Spec.observeThat
                    [ it "a.is on the Funds page"
                        (Spec.Observer.observeModel .page
                            |> Spec.expect
                                (Claim.isEqual Debug.toString <|
                                    Main.FundsPage <|
                                        { fundsInitialModel | isAddressVisible = False, status = Funds.Loaded }
                                )
                        )
                    , it "b. the menu should be closed"
                        (Spec.Observer.observeModel .isMenuOpen
                            |> Spec.expect
                                Claim.isFalse
                        )
                    , it "displays the primary address correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "primaryaddress" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "************************"
                                )
                        )
                    , it "displays the XMR avail balance correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "xmrAvailableBalance" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "************************"
                                )
                        )

                    {- , it "displays the BTC balance correctly"
                           (Spec.Markup.observeElement
                               |> Spec.Markup.query
                               << by [ Spec.Markup.Selector.id "btcbalance" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Spec.Markup.text <|
                                           Claim.isStringContaining 1 "Available BTC Balance: 42.94967296 BTC"
                                   )
                           )
                       , it "displays the reservedOffer balance correctly"
                           (Spec.Markup.observeElement
                               |> Spec.Markup.query
                               << by [ Spec.Markup.Selector.id "reservedOfferBalance" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Spec.Markup.text <|
                                           Claim.isStringContaining 1 "5000 XMR"
                                   )
                           )
                    -}
                    ]
            )
        , scenario "13b: No Connection Issues: Balance and Address data is successfully passed down to Funds page and shown on button click"
            (given
                (Spec.Setup.initForApplication (Main.init "\"http://localhost:1234/\"")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Spec.Setup.withLocation (Url Http "localhost" (Just 1234) "/" Nothing Nothing)
                    |> Stub.serve
                        [ TestData.successfullXmrPrimaryAddressFetch
                        , TestData.successfullVersionFetch
                        , TestData.successfullBalancesFetch
                        ]
                )
                |> when "the user opens the menu"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            Main.ToggleMenu
                    ]
                |> when "the user clicks the Funds navLink in the burger menu"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            (Main.ClickedLink (Browser.Internal <| Url Http "localhost" (Just 1234) "/funds" Nothing Nothing))
                    ]
                |> when "the user toggles the primary address button"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            (Main.GotFundsMsg Funds.ToggleFundsVisibility)
                    ]
                |> Spec.observeThat
                    [ it "a.is on the Funds page"
                        (Spec.Observer.observeModel .page
                            |> Spec.expect
                                (Claim.isEqual Debug.toString <|
                                    Main.FundsPage <|
                                        { fundsInitialModel | isAddressVisible = True, balances = TestData.testBalanceInfo, primaryaddress = TestData.primaryAddress, status = Funds.Loaded }
                                )
                        )
                    , it "b. the menu should be closed"
                        (Spec.Observer.observeModel .isMenuOpen
                            |> Spec.expect
                                Claim.isFalse
                        )
                    , it "displays the primary address correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "primaryaddress" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 TestData.primaryAddress
                                )
                        )
                    , it "displays the main page XMR avail balance correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "xmrAvailableBalance" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "42.94967296 XMR"
                                )
                        )
                    , it "displays the BTC balance correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "btcbalance" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "Available BTC Balance: 42.94967296 BTC"
                                )
                        )
                    , it "displays the reservedOffer balance correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "reservedOfferBalance" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "5000 XMR"
                                )
                        )
                    ]
            )
        , scenario "14: Load Connect page if not connected to API server after 5 seconds"
            (given
                (Spec.Setup.initForApplication (Main.init "http://localhost:1234")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Spec.Setup.withLocation (Url Http "localhost" (Just 1234) "/" Nothing Nothing)
                    |> Stub.serve [ TestData.unsuccessfullVersionFetch ]
                )
                |> when "we wait for possible server timeout"
                    [ Spec.Time.tick 6000
                    ]
                |> Spec.observeThat
                    [ it "should navigate to the Connect page"
                        (Spec.Observer.observeModel .page
                            |> Spec.expect
                                (Claim.isEqual Debug.toString <|
                                    Main.ConnectPage Connect.initialModel
                                )
                        )
                    ]
            )
        , scenario "15: List all BTC addresses"
            (given
                (Spec.Setup.initForApplication
                    (Main.init "http://localhost:1234")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Stub.serve [ TestData.successfullVersionFetch ]
                )
                |> when "receiving decryptedCryptoAccountsResponse message"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            (Main.ReceivedFromJs decryptedBTCAccountsResponseMessage)
                    ]
                -- NOTE: It appears that cos we use Spec.Setup.withDocument Main.view we cannot see the rendering of
                -- data on the Accounts page from Main. We're confined to ensuring the Accounts model is correct from
                -- here. Rendering can be tested in AccountsSpec
                |> Spec.observeThat
                    [ it "adds BTC address to listOfBTCAddresses"
                        (Spec.Observer.observeModel .page
                            |> Spec.expect
                                (Claim.isEqual Debug.toString <|
                                    Main.AccountsPage <|
                                        { accountsInitialModel
                                            | listOfBTCAddresses = [ "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v", "1GK6XMLmzFVj8ALj6mfBsbifRoD4miY36o" ]
                                            , currentView = Accounts.DisplayStoredBTCAddresses
                                            , isAddressVisible = True
                                            , cryptoAccountType = Accounts.BTC
                                            , errors = []
                                        }
                                )
                        )
                    ]
            )
        , scenario "15a: List ALL Crypto addresses"
            (given
                (Spec.Setup.initForApplication
                    (Main.init "http://localhost:1234")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Stub.serve [ TestData.successfullVersionFetch ]
                )
                |> when "receiving decryptedCryptoAccountsResponse message"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            (Main.ReceivedFromJs decryptedAllCryptoAccountsResponseMessage)
                    ]
                -- NOTE: It appears that cos we use Spec.Setup.withDocument Main.view we cannot see the rendering of
                -- data on the Accounts page from Main. We're confined to ensuring the Accounts model is correct from
                -- here. Rendering can be tested in AccountsSpec
                |> Spec.observeThat
                    [ it "adds ALL crypto address to listOfExistingCryptoAccounts"
                        (Spec.Observer.observeModel .page
                            |> Spec.expect
                                (Claim.isEqual Debug.toString <|
                                    Main.AccountsPage <|
                                        { accountsInitialModel
                                            | listOfExistingCryptoAccounts = [ "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v", "1GK6XMLmzFVj8ALj6mfBsbifRoD4miY36o", "0x1234567890abcdef1234567890abcdef12345678" ]
                                            , currentView = Accounts.CryptoAccounts
                                            , isAddressVisible = True
                                            , cryptoAccountType = Accounts.AllCrypto
                                            , errors = []
                                        }
                                )
                        )
                    ]
            )
        , scenario "16: should trigger ReceivedFromJs when a message is received from the receiveMsgsFromJs port"
            (given
                (Spec.Setup.initForApplication (Main.init "http://localhost:1234")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Stub.serve [ TestData.successfullVersionFetch ]
                )
                |> when "a message is sent to the receiveMsgsFromJs port"
                    [ Spec.Port.send "receiveMsgsFromJs"
                        (Json.Encode.object
                            [ ( "page", Json.Encode.string "AccountsPage" )
                            , ( "typeOfMsg", Json.Encode.string "decryptedCryptoAccountsResponse" )
                            , ( "accountsData", Json.Encode.list Json.Encode.string [ "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v", "1GK6XMLmzFVj8ALj6mfBsbifRoD4miY36o" ] )
                            , ( "currency", Json.Encode.string "BTC" )
                            ]
                        )
                    ]
                |> Spec.observeThat
                    [ it "should trigger the ReceivedFromJs message"
                        (Spec.Observer.observeModel .accountsDataFromJs
                            |> Spec.expect
                                (Claim.isEqual Debug.toString [ "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v", "1GK6XMLmzFVj8ALj6mfBsbifRoD4miY36o" ])
                        )
                    ]
            )
        , scenario "17: Fetch offers successfully"
            (given
                (Spec.Setup.initForApplication (Main.init "\"http://localhost:1234/\"")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Stub.serve
                        [ TestData.successfullXmrPrimaryAddressFetch
                        , TestData.successfullVersionFetch
                        , TestData.successfullBalancesFetch
                        , TestData.successfullOffersFetch
                        ]
                )
                |> when "the user opens the menu"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            Main.ToggleMenu
                    ]
                |> when "the user clicks the Sell navLink in the burger menu"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            (Main.ClickedLink (Browser.Internal <| Url Http "localhost" (Just 1234) "/sell" Nothing Nothing))
                    ]
                |> when "the user toggles the Sell Bitcoin button"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            (Main.GotSellMsg <| Sell.ChangeView Sell.Bitcoin)
                    ]
                {- |> Spec.when "we log the http requests"
                   [ Spec.Http.logRequests
                   ]
                -}
                |> Spec.observeThat
                    [ it "is on the Accounts page and has received the offers data"
                        (Spec.Observer.observeModel .page
                            |> Spec.expect
                                (Claim.isEqual Debug.toString <|
                                    Main.SellPage <|
                                        { sellInitialModel | offersReply = Just TestData.testGetOffersReply, currentView = Sell.Bitcoin }
                                )
                        )
                    , it "displays the first offer in the table" <|
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "offerRow" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "0.0510000 - 00.06SEPA0.5actionnode1"
                                )
                        )
                    ]
            )
            , scenario "18: Handle no offers correctly"
            (given
                (Spec.Setup.initForApplication (Main.init "\"http://localhost:1234/\"")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Stub.serve
                        [ TestData.successfullXmrPrimaryAddressFetch
                        , TestData.successfullVersionFetch
                        , TestData.successfullBalancesFetch
                        --, TestData.successfullOffersFetch
                        ]
                )
                |> when "the user opens the menu"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            Main.ToggleMenu
                    ]
                |> when "the user clicks the Sell navLink in the burger menu"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            (Main.ClickedLink (Browser.Internal <| Url Http "localhost" (Just 1234) "/sell" Nothing Nothing))
                    ]
                |> when "the user toggles the Sell Bitcoin button"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            (Main.GotSellMsg <| Sell.ChangeView Sell.Bitcoin)
                    ]
                {- |> Spec.when "we log the http requests"
                   [ Spec.Http.logRequests
                   ]
                -}
                |> Spec.observeThat
                    [ it "is on the Accounts page and has received the offers data"
                        (Spec.Observer.observeModel .page
                            |> Spec.expect
                                (Claim.isEqual Debug.toString <|
                                    Main.SellPage <|
                                        { sellInitialModel | offersReply = Just { offers = [] }, currentView = Sell.Bitcoin }
                                )
                        )
                    , it "displays the first offer in the table" <|
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "offerRow" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "No offers available."
                                )
                        )
                    ]
            )
        ]


main : Program Spec.Flags (Spec.Model Main.Model Main.Msg) (Spec.Msg Main.Msg)
main =
    -- NOTE: By using the BddStepDefinitions.Runner.browserProgram  function, developers can specify configurations such as how the application's initial state is initialized
    -- , how the view is rendered, how updates are handled, and how subscriptions and browser events are managed during test execution
    --Runner.BddStepDefinitions.Runner.browserProgram  { flags = \_ -> (), init = App.init, update = App.update, subscriptions = App.subscriptions, view = App.view }
    BddStepDefinitions.Runner.browserProgram [ runSpecTests ]



-- NAV: Helper functions:
