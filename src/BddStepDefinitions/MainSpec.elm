module BddStepDefinitions.MainSpec exposing (main)

{- -- NOTE: 'Main' here refers to settings that hold throughout the app, e.g. isLNSConnected, not just on a given page, so the tests
   might switch to particular pages and check that 'global' settings (Main's model) are correct

   -- NOTE: This MainSpec file is for INTEGRATION tests, not unit or modular tests.
   -- It's for testing the app as a whole, not individual functions. Try to limit tests here to logic, not specifics.
   -- Other modules like WalletSpec are MODULAR tests, limited to the given page alone.
-}

import BddStepDefinitions.Extra exposing (equals)
import BddStepDefinitions.Runner
import Browser
import Browser.Navigation
import Expect
import Extras.TestData as TestData
import Html

import Json.Encode as E
import Main

import Pages.Dashboard
import Pages.Funds as Funds
import Pages.Sell
import Proto.Io.Haveno.Protobuffer as Protobuf
import Protobuf.Types.Int64
import Spec exposing (describe, scenario, given, when, it)
import Spec.Claim as Claim
import Spec.Command
import Spec.Http
import Spec.Http.Stub as Stub
import Spec.Markup as Markup
import Spec.Markup.Selector exposing (id, by)
import Spec.Navigator
import Spec.Observer
import Spec.Port
import Spec.Report
import Spec.Setup
import Spec.Step
import Url exposing (Protocol(..), Url)



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
                    |> Stub.serve [ TestData.successfullXmrPrimaryAddressFetch, TestData.successfullVersionFetch, TestData.successfullBalancesFetch   ]
                   
                    


                )
                
               
                |> Spec.observeThat
                    [ it "a. primaryaddress obtained"
                        (Spec.Observer.observeModel .primaryaddress
                            |> Spec.expect
                                (Claim.isEqual Debug.toString <|
                                    TestData.primaryAddress
                                )
                        )
                        ,
                        it "should display a message indicating whether the connection to the Haveno API was successful or not"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "connectionStatus" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
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
                {- |> Spec.when "we log the http requests"
                   [ Spec.Http.logRequests
                   ]
                -}
                |> Spec.observeThat
                    [ it "should display a message indicating whether the connection to the Haveno API was successful or not"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "connectionStatus" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Haveno node not connected"
                                )
                        )
                    ]
            )
        , --Runner.skip <|
          --Runner.pick <|
          scenario "7: Display the Haveno core app version number"
            (given
                (Spec.Setup.initForApplication (Main.init "http://localhost:1234")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Spec.Setup.withLocation (Url Http "localhost" (Just 1234) "/dashboard" Nothing Nothing)
                    |> Stub.serve [ TestData.successfullVersionFetch ]
                )
                {- |> Spec.when "we log the http requests"
                   [ Spec.Http.logRequests
                   ]
                -}
                |> Spec.observeThat
                    [ it
                        "a. the app location should be dashboard "
                        (Spec.Navigator.observe
                            |> Spec.expect
                                (Spec.Navigator.location <|
                                    Claim.isEqual Debug.toString
                                        "http://localhost:1234/dashboard"
                                )
                        )
                    , it "c. displays Haveno version number on the Dashboard page"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "versiondisplay" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "1.0.7"
                                )
                        )
                    , it "d. displays Haveno version number in the footer"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "havenofooterver" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "1.0.7"
                                )
                        )
                   
                    ]
            )
        , --Runner.skip <|
          --Runner.pick <|
          scenario "11: Menu Closes After Using NavLink"
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

        {-
           , --Runner.skip <|
             --Runner.pick <|
             scenario "13: Checking the Menu nav links work"
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
                   )
                   -- Simulate user clicking the Sell href navLink in the simple menu
                   |> when "the user clicks the Sell navLink in the menu"
                       [ Spec.Command.send <| Spec.Command.fake (Main.ClickedLink (Browser.Internal <| Url Http "localhost" (Just 1234) "/sell" Nothing Nothing)) ]
                   {- |> Spec.when "we log the http requests"
                      [ Spec.Http.logRequests
                      ]
                   -}
                   |> Spec.observeThat
                       [ it "b.is on the Sell page"
                           -- NOTE: Cos connected with valid XMR address
                           (Observer.observeModel .page
                               |> Spec.expect (Claim.isEqual Debug.toString <| Main.SellPage Sell.initialModel)
                           )
                       , it "should display the menu"
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
                       ]
               )
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
                   {- |> Spec.when "we log the http requests"
                      [ Spec.Http.logRequests
                      ]
                   -}
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
    BddStepDefinitions.Runner.browserProgram  [ runSpecTests ]



-- NAV: Helper functions:


jsonNanoSDetected : E.Value
jsonNanoSDetected =
    E.object
        [ ( "operationEventMsg", E.string "nanoS" )
        ]


jsonDeviceNeedsPermission : E.Value
jsonDeviceNeedsPermission =
    E.object
        [ ( "operationEventMsg", E.string "Must be handling a user gesture to show a permission request" )
        ]


jsonXMRWalletClosed : E.Value
jsonXMRWalletClosed =
    E.object
        [ ( "operationEventMsg", E.string "UNKNOWN_APDU" )
        ]


jsonNanoXDetected : E.Value
jsonNanoXDetected =
    E.object
        [ ( "operationEventMsg", E.string "nanoX" )
        ]


jsonNoDeviceDetectedInFirefox : E.Value
jsonNoDeviceDetectedInFirefox =
    E.object
        [ ( "operationEventMsg", E.string "navigator.usb is undefined" )
        ]


noDeviceSelectedInBrowser : E.Value
noDeviceSelectedInBrowser =
    E.object
        [ ( "operationEventMsg", E.string "No device selected" )
        ]


validXMRWalletAddress : E.Value
validXMRWalletAddress =
    E.object
        [ ( "operationEventMsg", E.string TestData.subAddress )
        ]


errorGettingXMRWalletAddress : E.Value
errorGettingXMRWalletAddress =
    E.object
        [ ( "operationEventMsg", E.string "Error getting Monero address" )
        ]


documentToHtml : Browser.Document msg -> Html.Html msg
documentToHtml document =
    Html.div [] document.body


expectedBalances : Protobuf.BalancesInfo
expectedBalances =
    { btc =
        Just
            { availableBalance = Protobuf.Types.Int64.fromInts 10000 0
            , lockedBalance = Protobuf.Types.Int64.fromInts 10000 0
            , reservedBalance = Protobuf.Types.Int64.fromInts 10000 0
            , totalAvailableBalance = Protobuf.Types.Int64.fromInts 10000 0
            }
    , xmr =
        Just
            { availableBalance = Protobuf.Types.Int64.fromInts 10000 0
            , balance = Protobuf.Types.Int64.fromInts 10000 0
            , pendingBalance = Protobuf.Types.Int64.fromInts 2000 0
            , reservedOfferBalance = Protobuf.Types.Int64.fromInts 5000 0
            , reservedTradeBalance = Protobuf.Types.Int64.fromInts 3000 0
            }
    }
