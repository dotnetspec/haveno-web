module BddStepDefinitions.MainSpec exposing (main)

{- -- NOTE: 'Main' here refers to settings that hold throughout the app, e.g. isLNSConnected, not just on a given page, so the tests
   might switch to particular pages and check that 'global' settings (Main's model) are correct

   -- NOTE: This MainSpec file is for INTEGRATION tests, not unit or modular tests.
   -- It's for testing the app as a whole, not individual functions. Try to limit tests here to logic, not specifics.
   -- Other modules like WalletSpec are MODULAR tests, limited to the given page alone.
-}

import BddStepDefinitions.Runner
import BddStepDefinitions.Extra
import Browser
import Extras.TestData as TestData
import Main
import Pages.Connect as Connect
import Pages.Dashboard
import Pages.Funds as Funds
import Spec exposing (describe, given, it, scenario, when)
import Spec.Claim as Claim
import Spec.Command
import Spec.Http.Stub as Stub
import Spec.Markup
import Spec.Markup.Selector exposing (by)
import Spec.Navigator
import Spec.Observer
import Spec.Setup
import Url exposing (Protocol(..), Url)


initialDashboardModel : Pages.Dashboard.Model
initialDashboardModel =
    { status = Pages.Dashboard.Loaded
    , pagetitle = "Dashboard"
    , root = Pages.Dashboard.Dashboard { name = "Loading..." }
    , balances = TestData.testBalanceInfo
    , primaryaddress = TestData.primaryAddress
    , version = "1.0.7"
    , errors = []
    }



--{ balances = Just { btc = Just { availableBalance = Int64 { higher = 10000, lower = 0 }, lockedBalance = Int64 { higher = 10000, lower = 0 }, reservedBalance = Int64 { higher = 10000, lower = 0 }, totalAvailableBalance = Int64 { higher = 10000, lower = 0 } }, xmr = Just { availableBalance = Int64 { higher = 10000, lower = 0 }, balance = Int64 { higher = 10000, lower = 0 }, pendingBalance = Int64 { higher = 2000, lower = 0 }, reservedOfferBalance = Int64 { higher = 5000, lower = 0 }, reservedTradeBalance = Int64 { higher = 3000, lower = 0 } } }, errors = [], flagUrl = { fragment = Nothing, host = "localhost", path = "/dashboard", port_ = Nothing, protocol = Http, query = Nothing }, havenoAPKHttpRequest = Nothing, pagetitle = "Dashboard", primaryaddress = "9yLbftcD2cMDA5poVPBJQ5KuwADFRXhe28AtqfeTExaubeMAyiEGBYJ8a8T3kwzoqi6ZuScziHxKqBCToa2m3wuZScc2gJh", root = Dashboard { name = "Loading..." }, status = Loaded, version = "1.0.7" }
-- NOTE: App.Model and App.Msg are type paramters for the Spec type
-- They make Spec type more flexible as it can be used with any model and msg types
-- NOTE: Any test involving subscriptions will need to be specified here using withSubscriptions


runSpecTests : Spec.Spec Main.Model Main.Msg
runSpecTests =
    describe
        "Scenarios based on a Haveno Web App MVP"
        [ --Runner.skip <|
          --Runner.pick <|
          scenario "1: Display successful API connection status"
            (given
                -- NOTE: The URL is passed from js as JSON.stringified
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
                |> Spec.observeThat
                    [ it "a. primaryaddress obtained"
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
        , scenario "3: When app first loads it should be on the dashboard page if all the required data is successfully fetched"
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
                    |> Stub.serve [ TestData.successfullXmrPrimaryAddressFetch, TestData.successfullVersionFetch, TestData.successfullBalancesFetch ]
                )
                |> Spec.observeThat
                    [ it
                        "a. the app NAV location should be root "
                        (Spec.Navigator.observe
                            |> Spec.expect
                                (Spec.Navigator.location <|
                                    Claim.isEqual Debug.toString
                                        "http://localhost:1234/"
                                )
                        )
                    , it "b.is on the Dashboard page"
                        (Spec.Observer.observeModel .page
                            |> Spec.expect
                                (Claim.isEqual Debug.toString <|
                                    Main.DashboardPage <|
                                        initialDashboardModel
                                )
                        )
                    ]
            )
        , scenario "7: Display the Haveno core app version number"
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
                    |> Stub.serve [ TestData.successfullXmrPrimaryAddressFetch, TestData.successfullVersionFetch, TestData.successfullBalancesFetch ]
                )
                |> Spec.observeThat
                    [ it
                        "a. the app NAV location should be root "
                        (Spec.Navigator.observe
                            |> Spec.expect
                                (Spec.Navigator.location <|
                                    Claim.isEqual Debug.toString
                                        "http://localhost:1234/"
                                )
                        )
                    , it "b.is on the Dashboard page"
                        (Spec.Observer.observeModel .page
                            |> Spec.expect
                                (Claim.isEqual Debug.toString <|
                                    Main.DashboardPage <|
                                        initialDashboardModel
                                )
                        )
                    , it "c. displays Haveno version number on the Dashboard page"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id "versiondisplay" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "1.0.7"
                                )
                        )
                    , it "d. displays Haveno version number in the footer"
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
                (Spec.Setup.initForApplication (Main.init "http://localhost:1234")
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
                (Spec.Setup.initForApplication (Main.init "http://localhost:1234")
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
        , scenario "2a: Show available, pending and reserved balances correctly in the UI"
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
                    |> Stub.serve [ TestData.successfullBalancesFetch, TestData.successfullXmrPrimaryAddressFetch ]
                )

                |> Spec.observeThat
                    [it "should have balances in the model"
                        (Spec.Observer.observeModel .balances
                            |> Spec.expect (BddStepDefinitions.Extra.equals <| TestData.testBalanceInfo)
                        )
                    , it "displays the available balance correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id  "xmrAvailableBalance" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "10000 XMR"
                                )
                        )
                    , it "displays the pending balance correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id  "pendingBalance" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "2000 XMR"
                                )
                        )
                    , it "displays the reserved balance correctly"
                        (Spec.Markup.observeElement
                            |> Spec.Markup.query
                            << by [ Spec.Markup.Selector.id  "reservedOfferBalance" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Spec.Markup.text <|
                                        Claim.isStringContaining 1 "5000 XMR"
                                )
                        )
                    ]
            )

        {-

           , --Runner.skip <|
             --Runner.pick <|
             scenario "14: Checking the Wallet page has initialized after using navlink to Wallet"
               (given
                   (Spec.Setup.initForApplication (Main.init "http://localhost:1234")
                       |> Spec.Setup.withDocument Main.view
                       |> Spec.Setup.withUpdate Main.update
                       |> Spec.Setup.withSubscriptions Main.subscriptions
                       |> Spec.Setup.forNavigation
                           { onUrlRequest = Main.ClickedLink
                           , onUrlChange = Main.ChangedUrl
                           }
                       -- NOTE: Currently believe this is equivalent to the user clicking a link
                       |> Spec.Setup.withLocation (Url Http "localhost" (Just 1234) "/" Nothing Nothing)
                       |> Stub.serve [ TestData.successfullBalancesFetch ]
                       |> Stub.serve [ TestData.successfullXmrPrimaryAddressFetch ]
                   )
                   |> when "the user navigates to another navLink in the menu"
                       [ Spec.Command.send <| Spec.Command.fake (Main.ClickedLink (Browser.Internal <| Url Http "localhost" (Just 1234) "/sell" Nothing Nothing)) ]
                   -- Simulate user clicking the Wallet href navLink in the simple menu
                   |> when "the user then clicks the Wallet navLink in the menu"
                       [ Spec.Command.send <| Spec.Command.fake (Main.ClickedLink (Browser.Internal <| Url Http "localhost" (Just 1234) "/wallet" Nothing Nothing)) ]

                   |> Spec.observeThat
                       [ it "should display the menu"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ tag "button" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.attribute "class" <|
                                           Claim.isSomethingWhere <|
                                               Claim.isStringContaining 1 "menu-btn"
                                   )
                           )
                       , it "b.is on the Wallet page with an updated inital wallet model"
                           -- NOTE: Cos connected with valid XMR address
                           (Observer.observeModel .page
                               |> Spec.expect
                                   (Claim.isEqual Debug.toString <|
                                       Main.WalletPage <|
                                           { primaryaddress = ""
                                           , balances = Just expectedBalances
                                           , errors = []
                                           , pagetitle = "Haveno Web Wallet"
                                           , status = Wallet.Loaded
                                           , subaddress = "" --TestData.subAddress
                                           , currentView = Wallet.WalletView
                                           }
                                   )
                           )
                       , it "displays the available balance correctly"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "xmrbalance" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Available Balance: 10000.0 XMR"
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


main : Program Spec.Flags (Spec.Model Main.Model Main.Msg) (Spec.Msg Main.Msg)
main =
    -- NOTE: By using the BddStepDefinitions.Runner.browserProgram  function, developers can specify configurations such as how the application's initial state is initialized
    -- , how the view is rendered, how updates are handled, and how subscriptions and browser events are managed during test execution
    --Runner.BddStepDefinitions.Runner.browserProgram  { flags = \_ -> (), init = App.init, update = App.update, subscriptions = App.subscriptions, view = App.view }
    BddStepDefinitions.Runner.browserProgram [ runSpecTests ]



-- NAV: Helper functions:
