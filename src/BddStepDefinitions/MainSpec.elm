module BddStepDefinitions.MainSpec exposing (..)

{- -- NOTE: 'Main' here refers to settings that hold throughout the app, e.g. isLNSConnected, not just on a given page, so the tests
   might switch to particular pages and check that 'global' settings (Main's model) are correct
-}
--import Pages.Wallet as Wallet exposing (..)
--import Pages.Wallet as Wallet exposing (..)

import BddStepDefinitions.Extra exposing (..)
import BddStepDefinitions.Runner as Runner exposing (..)
import Browser
import Browser.Navigation as Nav exposing (Key)
import Expect exposing (equal)
import Extras.TestData as TestData exposing (placeholderUrl)
import Html exposing (Html, div, i)
import Json.Decode as D
import Json.Encode as E
import Main exposing (Model, Msg, Page(..), Route(..), init, navigate, subscriptions, update, view, viewPopUp)
import Pages.Blank
import Pages.Dashboard as Dashboard exposing (..)
import Pages.Hardware as Hardware exposing (..)
import Pages.Wallet as Wallet exposing (..)
import Spec exposing (..)
import Spec.Claim as Claim exposing (Claim, Verdict)
import Spec.Command exposing (send)
import Spec.Http
import Spec.Http.Stub as Stub
import Spec.Markup as Markup
import Spec.Markup.Selector exposing (..)
import Spec.Navigator as Navigator exposing (Navigator)
import Spec.Observer as Observer exposing (Observer)
import Spec.Port exposing (..)
import Spec.Report exposing (note)
import Spec.Setup exposing (Setup, init, withSubscriptions, withUpdate, withView)
import Spec.Step exposing (log)
import Url exposing (Protocol(..), Url)




-- NOTE: App.Model and App.Msg are type paramters for the Spec type
-- They make Spec type more flexible as it can be used with any model and msg types
-- NOTE: Any test involving subscriptions will need to be specified here using withSubscriptions

placeholderUrl = Url Http "localhost" (Just 1234) "/" Nothing Nothing


runSpecTests : Spec Main.Model Main.Msg
runSpecTests =
    describe
        "Scenarios based on a Haveno Web App MVP"
        [ --Runner.skip <|
          --Runner.pick <|
          --,
          scenario "1: Popup warning that the hardware wallet is NOT connected on application start"
            (given
                (Spec.Setup.initForApplication (Main.init "http://localhost:1234")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Spec.Setup.withLocation placeholderUrl
                )
                -- NOTE: problem is that the Edge browser error for
                -- no device at all is same as error for device connected but no user permission.
                |> when "the hwd is NOT detected"
                    [ -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" jsonDeviceNeedsPermission
                    ]
                -- NOTE: Each 'it' block resolves to an Elm-spec Plan type and receives a Script from 'given' and 'when' blocks
                |> Spec.observeThat
                    [ Spec.observeThat
                        [ it "a. should register that no device is detected"
                            (Observer.observeModel .xmrHardwareWalletAddressError
                                |> Spec.expect (equals (Just Main.DeviceNeedsPermission))
                            )
                        ]
                    , it "b. should show the popup"
                        (Observer.observeModel .isPopUpVisible
                            |> Spec.expect
                                Claim.isTrue
                        )
                    , it "displays a message indicating the hardware device is NOT connected"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "p" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "No Hardware Device Detected!"
                                )
                        )
                    , it "should NOT display the 'Connected' indicator in the background"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "connectionIndicator" ]
                            |> Spec.expect
                                Claim.isNothing
                        )
                    , it "should NOT display the 'XMR Wallet address' indicator in the background"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "xmrwalletaddress" ]
                            |> Spec.expect
                                Claim.isNothing
                        )

                    -- TODO: Sort the logic around disabling the menu so it doesn't interfere with the necessary display of pages
                    , it "should NOT be possible to use the Menu"
                        (Observer.observeModel .isNavMenuActive
                            |> Spec.expect
                                Claim.isFalse
                        )
                    , it "is on the Blank page"
                        (Observer.observeModel .page
                            -- NOTE: This is the model's page, not the page in the browser - Dashboard.initialModel is a placeholder for the test only here
                            |> Spec.expect (Claim.isEqual Debug.toString <| Main.BlankPage Pages.Blank.initialModel)
                        )
                    , it "should find the logo image"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ id "logoImage" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.attribute "src" <|
                                        Claim.isSomethingWhere <|
                                            Claim.isStringContaining 1 "assets/resources/images/logo-splash100X33.png"
                                )
                        )
                    ]
            )
        , --Runner.skip <|
          --Runner.pick <|
          scenario "2: hwd NOT connected, user clicks the 'Continue' button, navs to Hardware page"
            (given
                (Spec.Setup.initForApplication (Main.init "http://localhost:1234")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the hwd is NOT detected by the browser"
                    [ Spec.Port.send "receiveMessageFromJs" noDeviceSelectedInBrowser
                    ]
                |> when "the user clicks the Continue button"
                    [ Spec.Command.send (Spec.Command.fake Main.HidePopUp) ]
                |> Spec.observeThat
                    [ it "hides the popup"
                        (Observer.observeModel .isPopUpVisible
                            |> Spec.expect
                                Claim.isFalse
                        )
                    , it "should display the Hardware page"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "h5" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Welcome - Please Connect Your Hardware Device"
                                )
                        )
                    , it "should display the 'Connected' indicator as Disconnected (red)"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "h4" ]
                           
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Please connect to a Chrome based mobile browser"
                                        
                                )
                        )
                    , it "should NOT be possible to use the Menu"
                        (Observer.observeModel .isNavMenuActive
                            |> Spec.expect
                                Claim.isFalse
                        )
                    , it "should NOT be possible to see any nav links"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "ul" ]
                            |> Spec.expect
                                Claim.isNothing
                        )
                    , it "should find the topLinksLogoImage image"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ id "logoImage" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.attribute "src" <|
                                        Claim.isSomethingWhere <|
                                            Claim.isStringContaining 1 "assets/resources/images/logo-splash100X33.png"
                                )
                        )
                    , it "should NOT be possible to use the Menu"
                        (Observer.observeModel .isNavMenuActive
                            |> Spec.expect
                                Claim.isFalse
                        )
              
                    , it "should NOT be possible to use the Menu"
                        (Observer.observeModel .isNavMenuActive
                            |> Spec.expect
                                Claim.isFalse
                        )
                    , it "should NOT be possible to see any nav links"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "ul" ]
                            |> Spec.expect
                                Claim.isNothing
                        )
                    , it "should find the topLinksLogoImage image"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ id "logoImage" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.attribute "src" <|
                                        Claim.isSomethingWhere <|
                                            Claim.isStringContaining 1 "assets/resources/images/logo-splash100X33.png"
                                )
                        )
                    , it "should NOT be possible to use the Menu"
                        (Observer.observeModel .isNavMenuActive
                            |> Spec.expect
                                Claim.isFalse
                        )
                    ]
            )
        , --Runner.skip <|
          --Runner.pick <|
          scenario """3: If the hardware device IS connected but needs user permission,
           indicate this and nav to Hardware page"""
            (given
                (Spec.Setup.initForApplication (Main.init "http://localhost:1234")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the hardware device indicates it needs user permission"
                    [ Spec.Port.send "receiveMessageFromJs" jsonDeviceNeedsPermission
                    ]
                |> when "the user clicks the Continue button"
                    [ Spec.Command.send (Spec.Command.fake Main.HidePopUp) ]
                |> when "the user clicks the Grant Browser Permissions button"
                    [ Spec.Command.send (Spec.Command.fake <| Main.GotHardwareMsg Hardware.ClickedHardwareDeviceConnect) ]
                |> when "the LNS hww is detected"
                    [ -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" jsonNanoSDetected
                    ]
                |> Spec.observeThat
                    [ it "a.hides the popup"
                        (Observer.observeModel .isPopUpVisible
                            |> Spec.expect
                                Claim.isFalse
                        )
                    , it "c. sets isHardwareDeviceConnected to true"
                        (Observer.observeModel .isHardwareDeviceConnected
                            |> Spec.expect
                                Claim.isTrue
                        )
                    , it "d. should display a constant (no matter which page on) text indicator that the device is connected"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "span" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Connected"
                                )
                        )
                    , it "e. should display the hardware page"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "h5" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Welcome - Please Connect Your Hardware Device"
                                )
                        )
                    , it "should NOT be possible to use the Menu"
                        (Observer.observeModel .isNavMenuActive
                            |> Spec.expect
                                Claim.isFalse
                        )
                    ]
            )
        , --Runner.skip <|
          --Runner.pick <|
          scenario "4: Before the XMR Hardware Wallet Is Connected"
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
                |> when "the LNS hwd is detected"
                    [ -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" jsonNanoSDetected
                    ]
                |> when "the device is detected, but the XMR wallet is NOT connected"
                    [ Spec.Port.send "receiveMessageFromJs" jsonXMRWalletClosed
                    ]
                |> Spec.observeThat
                    [ it "a.hides the popup"
                        (Observer.observeModel .isPopUpVisible
                            |> Spec.expect
                                Claim.isFalse
                        )
                    , it "e. should display the hardware page"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "h5" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Welcome - Please Connect Your Hardware Device"
                                )
                        )
                    , it "models the hardware device as connected"
                        (Observer.observeModel .isHardwareDeviceConnected
                            |> Spec.expect
                                Claim.isTrue
                        )
                    , it "models the XMR wallt as NOT connected"
                        (Observer.observeModel .isXMRWalletConnected
                            |> Spec.expect
                                Claim.isFalse
                        )
                    , it "displays a message indicating the XMR wallet is NOT connected"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "xmrwalletconnection" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "XMR Wallet Not Connected"
                                )
                        )
                    , it "should NOT be possible to use the Menu"
                        (Observer.observeModel .isNavMenuActive
                            |> Spec.expect
                                Claim.isFalse
                        )
                    ]
            )
        , --Runner.skip <|
          --Runner.pick <|
          scenario "5a: Fetching an XMR address from the Hardware Wallet - success"
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
                -- NOTE: You need to do this to get away from 'Blank' page
                |> when "the user clicks the Continue button"
                    [ Spec.Command.send (Spec.Command.fake Main.HidePopUp) ]
                |> when "the LNX hww is detected"
                    [ -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" jsonNanoXDetected
                    ]
                |> when "the hardware XMR wallet returns a valid XMR address"
                    [ Spec.Port.send "receiveMessageFromJs" validXMRWalletAddress
                    ]
                |> Spec.observeThat
                    [ it "a.hides the popup"
                        (Observer.observeModel .isPopUpVisible
                            |> Spec.expect
                                Claim.isFalse
                        )
                    , it "c. confirms the hardware LNX is connected"
                        (Observer.observeModel .isHardwareDeviceConnected
                            |> Spec.expect
                                Claim.isTrue
                        )
                    , it "d. displays a message indicating the XMR wallet is connected"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "xmrwalletconnection" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "XMR Wallet Connected"
                                )
                        )
                    , it "e. should display a confirmation message indicating successful discovery of XMR wallet address"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "xmrwalletaddress" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "XMR Wallet Address: BceiPLaX7YDevCfKvgXFq8Tk1BGkQvtfAWCWJGgZfb6kBju1rDUCPzfDbHmffHMC5AZ6TxbgVVkyDFAnD2AVzLNp37DFz32"
                                )
                        )
                    , it "b.is on the Dashboard page"
                        -- NOTE: Cos connected with valid XMR address
                        (Observer.observeModel .page
                            -- NOTE: This is the model's page, not the page in the browser - Dashboard.initialModel is a placeholder for the test only here
                            |> Spec.expect (Claim.isEqual Debug.toString <| Main.DashboardPage Dashboard.initialModel)
                        )
                    , it "should be possible to use the Menu"
                        (Observer.observeModel .isNavMenuActive
                            |> Spec.expect
                                Claim.isTrue
                        )
                    ]
            )
        , --Runner.skip <|
          --Runner.pick <|
          scenario "5b: Fetching an XMR address from the Hardware Wallet - failure"
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
                -- NOTE: You need to do this to get away from 'Blank' page
                |> when "the user clicks the Continue button"
                    [ Spec.Command.send (Spec.Command.fake Main.HidePopUp) ]
                |> when "the hardware XMR wallet returns an error attempting to get XMR address"
                    [ Spec.Port.send "receiveMessageFromJs" errorGettingXMRWalletAddress
                    ]
                |> Spec.observeThat
                    [ it "a.hides the popup"
                        (Observer.observeModel .isPopUpVisible
                            |> Spec.expect
                                Claim.isFalse
                        )
                    , it "c. confirms the hardware LNX is connected"
                        (Observer.observeModel .isHardwareDeviceConnected
                            |> Spec.expect
                                Claim.isTrue
                        )
                    , it "d. displays a message indicating the XMR wallet is NOT connected"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "xmrwalletconnection" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "XMR Wallet Not Connected"
                                )
                        )
                    , it "b.is on the Hardware page"
                        -- NOTE: Cos connected with valid XMR address
                        (Observer.observeModel .page
                            -- NOTE: This is the model's page, not the page in the browser - Hardware.initialModel is a placeholder for the test only here
                            |> Spec.expect (Claim.isEqual Debug.toString <| Main.HardwarePage Hardware.initialModel)
                        )
                    , it "should be possible to use the Menu"
                        (Observer.observeModel .isNavMenuActive
                            |> Spec.expect
                                Claim.isFalse
                        )
                    ]
            )
        , --Runner.skip <|
          --Runner.pick <|
          scenario "6: Display a message that the Haveno core app is not yet connected"
            (given
                (Spec.Setup.initForApplication (Main.init "http://localhost:1234")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Spec.Setup.withLocation placeholderUrl
                )
                {- |> Spec.when "we log the http requests"
                   [ Spec.Http.logRequests
                   ]
                -}
                |> when "the user clicks the Continue button"
                    [ Spec.Command.send (Spec.Command.fake Main.HidePopUp) ]
                |> when "the LNS hww is detected"
                    [ -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" jsonNanoSDetected
                    ]
                |> when "the Monero wallet address is retrieved from hardware device"
                    [ -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" validXMRWalletAddress
                    ]
                |> Spec.observeThat
                    [ it "a.hides the popup"
                        (Observer.observeModel .isPopUpVisible
                            |> Spec.expect
                                Claim.isFalse
                        )
                    , it
                        "b. the app location should be root "
                        (Navigator.observe
                            |> Spec.expect
                                (Navigator.location <|
                                    Claim.isEqual Debug.toString
                                        -- NOTE: I think this is location according to Nav.Key rather than page(?)
                                        "http://localhost:1234/"
                                )
                        )
                    , it "c. sets isHardwareDeviceConnected to true"
                        (Observer.observeModel .isHardwareDeviceConnected
                            |> Spec.expect
                                Claim.isTrue
                        )
                    , it "d. displays Haveno version number in the footer"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "havenofooterver" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "No Haveno version available"
                                )
                        )
                    , it "e. should display a dashboard page"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "h1" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Haveno Web - Dashboard"
                                )
                        )

                    -- NOTE: It appears that we can check that the page is the Dashboard page by checking the model
                    -- but we cannot check the text in the page, without an update e.g. from button click,
                    -- because it's not the setup module's (Main) responsibility
                    , it "f.is on the Dashboard page"
                        (Observer.observeModel .page
                            |> Spec.expect (Claim.isEqual Debug.toString <| Main.DashboardPage Dashboard.initialModel)
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
                    |> Spec.Setup.withLocation placeholderUrl
                    |> Stub.serve [ TestData.successfullVersionFetch ]
                )
                |> when "the user clicks the Continue button"
                    [ Spec.Command.send (Spec.Command.fake Main.HidePopUp) ]
                -- NOTE: These shouldn't be necessary to get the version number:
                |> when "the LNS hww is detected"
                    [ -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" jsonNanoSDetected
                    ]
                |> when "the Monero wallet address is retrieved from hardware device"
                    [ -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" validXMRWalletAddress
                    ]
                |> Spec.when "we log the http requests"
                    [ Spec.Http.logRequests
                    ]
                |> Spec.observeThat
                    [ it
                        "a. the app location should be root "
                        (Navigator.observe
                            |> Spec.expect
                                (Navigator.location <|
                                    Claim.isEqual Debug.toString
                                        "http://localhost:1234/"
                                )
                        )
                    , it "b. should display a dashboard page"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "h1" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Haveno Web - Dashboard"
                                )
                        )
                    , it "d. makes the Haveno version visible to the user on the Dashboard page"
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
          scenario "8: User confirms hware device connection in browser"
            (given
                (Spec.Setup.initForApplication (Main.init "http://localhost:1234")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Spec.Setup.withLocation placeholderUrl
                )
                {- |> Spec.when "we log the http requests"
                   [ Spec.Http.logRequests
                   ]
                -}
                |> when "the user clicks the Continue button"
                    [ Spec.Command.send (Spec.Command.fake Main.HidePopUp) ]
                |> when "the LNS hww is not detected"
                    [ -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" jsonDeviceNeedsPermission
                    ]
                |> when "the user clicks the Continue button"
                    [ Spec.Command.send (Spec.Command.fake Main.HidePopUp) ]
                |> when "the user clicks the Grant Browser Permissions button"
                    [ Spec.Command.send (Spec.Command.fake <| Main.GotHardwareMsg Hardware.ClickedHardwareDeviceConnect) ]
                |> when "the LNS hww is detected"
                    [ -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" jsonNanoSDetected
                    ]
                |> Spec.observeThat
                    [ it "a.hides the popup"
                        (Observer.observeModel .isPopUpVisible
                            |> Spec.expect
                                Claim.isFalse
                        )
                    , it "the hardware wallet is not detected"
                        (Observer.observeModel .isHardwareDeviceConnected
                            |> Spec.expect
                                Claim.isTrue
                        )
                    , it "it should display a message informing the user connected"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "connectionIndicator" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Connected"
                                )
                        )

                    -- NOTE: It appears that we can check that the page is the Dashboard page by checking the model
                    -- but we cannot check the text in the page, without an update e.g. from button click,
                    -- because it's not the setup module's (Main) responsibility
                    , it "f.is on the Hardware page"
                        (Observer.observeModel .page
                            |> Spec.expect (Claim.isEqual Debug.toString <| Main.HardwarePage Hardware.initialModel)
                        )
                    ]
            )
        , --Runner.skip <|
          --Runner.pick <|
          scenario "9: User unable to confirm hware device connection in browser"
            (given
                (Spec.Setup.initForApplication (Main.init "http://localhost:1234")
                    |> Spec.Setup.withDocument Main.view
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                    |> Spec.Setup.forNavigation
                        { onUrlRequest = Main.ClickedLink
                        , onUrlChange = Main.ChangedUrl
                        }
                    |> Spec.Setup.withLocation placeholderUrl
                )
                {- |> Spec.when "we log the http requests"
                   [ Spec.Http.logRequests
                   ]
                -}
                |> when "the user clicks the Continue button"
                    [ Spec.Command.send (Spec.Command.fake Main.HidePopUp) ]
                |> when "the hwd is not detected"
                    [ -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" jsonDeviceNeedsPermission
                    ]
                |> when "the user clicks the Continue button"
                    [ Spec.Command.send (Spec.Command.fake Main.HidePopUp) ]
                |> when "the user clicks the Grant Browser Permissions button"
                    [ Spec.Command.send (Spec.Command.fake <| Main.GotHardwareMsg Hardware.ClickedHardwareDeviceConnect) ]
                |> when "the browser does not grant permission"
                    [ -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" noDeviceSelectedInBrowser
                    ]
                |> Spec.observeThat
                    [ it "is on the Hardware page"
                        (Observer.observeModel .page
                            |> Spec.expect (Claim.isEqual Debug.toString <| Main.HardwarePage Hardware.initialModel)
                        )
                    , it "a.hides the popup"
                        (Observer.observeModel .isPopUpVisible
                            |> Spec.expect
                                Claim.isFalse
                        )
                    , it "displays the hardware device as NOT detected"
                        (Observer.observeModel .isHardwareDeviceConnected
                            |> Spec.expect
                                Claim.isFalse
                        )
                    , it "should display a message informing the user should switch to another browser type"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "connectionIndicator" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Please connect to a Chrome based mobile browser"
                                )
                        )
                    ]
            )
        , --Runner.skip <|
          --Runner.pick <|
          scenario "10: Fetching an XMR address from the Hardware Wallet - success"
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
                -- NOTE: You need to do this to get away from 'Blank' page
                |> when "the user clicks the Continue button"
                    [ Spec.Command.send (Spec.Command.fake Main.HidePopUp) ]
                |> when "the LNX hww is detected"
                    [ -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" jsonNanoXDetected
                    ]
                {- |> when "the hardware XMR wallet returns a valid XMR address"
                   [ Spec.Port.send "receiveMessageFromJs" validXMRWalletAddress
                   ]
                -}
                -- HACK: This gives us a valid XMR address for testing from the UI
                |> when "the user clicks the Grant Browser Permissions button"
                    [ Spec.Command.send (Spec.Command.fake <| Main.GotHardwareMsg Hardware.ClickedTempXMRAddr) ]
                |> Spec.observeThat
                    [ it "a.hides the popup"
                        (Observer.observeModel .isPopUpVisible
                            |> Spec.expect
                                Claim.isFalse
                        )
                    , it "c. confirms the hardware LNX is connected"
                        (Observer.observeModel .isHardwareDeviceConnected
                            |> Spec.expect
                                Claim.isTrue
                        )
                    , it "d. displays a message indicating the XMR wallet is connected"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "xmrwalletconnection" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "XMR Wallet Connected"
                                )
                        )
                    , it "e. should display a confirmation message indicating successful discovery of XMR wallet address"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "xmrwalletaddress" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "XMR Wallet Address: BceiPLaX7YDevCfKvgXFq8Tk1BGkQvtfAWCWJGgZfb6kBju1rDUCPzfDbHmffHMC5AZ6TxbgVVkyDFAnD2AVzLNp37DFz32"
                                )
                        )
                    , it "is on the Wallet page"
                        -- NOTE: Cos connected with valid XMR address
                        (Observer.observeModel .page
                            -- NOTE: This is the model's page, not the page in the browser - Wallet.initialModel is a placeholder for the test only here
                            |> Spec.expect (Claim.isEqual Debug.toString <| Main.WalletPage Wallet.initialModel)
                        )
                    , it "should be possible to use the Menu"
                        (Observer.observeModel .isNavMenuActive
                            |> Spec.expect
                                Claim.isTrue
                        )
                    ]
            )
        , --Runner.skip <|
          --Runner.pick <|
          scenario "11: Checking the Menu is active on the Wallet page"
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
                -- NOTE: You need to do this to get away from 'Blank' page
                |> when "the user clicks the Continue button"
                    [ Spec.Command.send (Spec.Command.fake Main.HidePopUp) ]
                |> when "the LNX hww is detected"
                    [ -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" jsonNanoXDetected
                    ]
                {- |> when "the hardware XMR wallet returns a valid XMR address"
                   [ Spec.Port.send "receiveMessageFromJs" validXMRWalletAddress
                   ]
                -}
                -- HACK: This gives us a valid XMR address for testing from the UI, so use for now:
               
                |> when "the user uses the menu to nav to the Wallet page"
                    [ Spec.Command.send (Spec.Command.fake <| Main.GotHardwareMsg Hardware.ClickedTempXMRAddr) ]
                -- Simulate user clicking the Wallet navLink in the burger menu
                |> when "the user clicks the Wallet navLink in the burger menu"
                    [ Spec.Command.send <| Spec.Command.fake (Main.ClickedLink (Browser.Internal <| Url Http "localhost" (Just 1234) "/wallet" Nothing Nothing)) ]
                |> Spec.when "we log the http requests"
                    [ Spec.Http.logRequests
                    ]
                |> Spec.observeThat
                    [ it "a. should be possible to use the Menu"
                        (Observer.observeModel .isNavMenuActive
                            |> Spec.expect
                                Claim.isTrue
                        )
                    , it "b.is on the Wallet page"
                        -- NOTE: Cos connected with valid XMR address
                        (Observer.observeModel .page
                            |> Spec.expect (Claim.isEqual Debug.toString <| Main.WalletPage Wallet.initialModel)
                        )
                    ]
            )
        , --Runner.skip <|
          --Runner.pick <|
            scenario "12. sendMessageToJs sends 'ElmReady' on init"
                (given
                    (Spec.Setup.initForApplication (Main.init "http://localhost:1234")
                        |> Spec.Setup.withDocument Main.view
                        |> Spec.Setup.withUpdate Main.update
                        |> Spec.Setup.withSubscriptions Main.subscriptions
                        |> Spec.Setup.forNavigation
                            { onUrlRequest = Main.ClickedLink
                            , onUrlChange = Main.ChangedUrl
                            }
                    )
                    |> Spec.observeThat
                        [ it "should send 'ElmReady' through sendMessageToJs"
                            (Spec.Port.observe "sendMessageToJs" D.string
                                |> Spec.expect
                                    (Claim.isListWhere
                                        [ Claim.isEqual Debug.toString "ElmReady"
                                        , Claim.isEqual Debug.toString "connectLNS"
                                        ]
                                    )
                            )
                        ]
                )
        ]


main : Program Flags (Spec.Model Main.Model Main.Msg) (Spec.Msg Main.Msg)
main =
    -- NOTE: By using the browserProgram function, developers can specify configurations such as how the application's initial state is initialized
    -- , how the view is rendered, how updates are handled, and how subscriptions and browser events are managed during test execution
    --Runner.browserProgram { flags = \_ -> (), init = App.init, update = App.update, subscriptions = App.subscriptions, view = App.view }
    Runner.browserProgram [ runSpecTests ]



-- NAV: Helper functions:


equals : a -> Claim a
equals =
    Claim.isEqual Debug.toString


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
        [ ( "operationEventMsg", E.string "BceiPLaX7YDevCfKvgXFq8Tk1BGkQvtfAWCWJGgZfb6kBju1rDUCPzfDbHmffHMC5AZ6TxbgVVkyDFAnD2AVzLNp37DFz32" )
        ]


errorGettingXMRWalletAddress : E.Value
errorGettingXMRWalletAddress =
    E.object
        [ ( "operationEventMsg", E.string "Error getting Monero address" )
        ]


documentToHtml : Browser.Document msg -> Html msg
documentToHtml document =
    div [] document.body
