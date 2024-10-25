module BddStepDefinitions.MainSpec exposing (..)

{- -- NOTE: 'Main' here refers to settings that hold throughout the app, e.g. isLNSConnected, not just on a given page, so the tests
   might switch to particular pages and check that 'global' settings (Main's model) are correct
-}
{- import Extras.Constants as Consts exposing (..)
   import Extras.TestData as TestData
   import Html exposing (Html, div)
   import Http
   import Json.Decode as D
   import Json.Encode as E
   import Main
   import Spec exposing (Flags, Spec, describe, expect, given, it, scenario, when)
   import Spec.Claim as Claim exposing (Claim, Verdict)
   import Spec.Command exposing (..)
   import Spec.Http.Stub as Stub
   import Spec.Markup as Markup
   import Spec.Markup.Event as Event
   import Spec.Markup.Selector exposing (..)
   import Spec.Observer as Observer exposing (Observer)

   import Spec.Report as Report exposing (Report)
   import Spec.Setup as Setup
   import Spec.Step as Step exposing (Step)

   import Time exposing (..)

   import Url exposing (Protocol(..), Url)
-}

import BddStepDefinitions.Extra exposing (..)
import BddStepDefinitions.Runner as Runner exposing (..)
import Browser
import Browser.Navigation as Nav exposing (Key)
import Expect exposing (equal)
import Extras.TestData as TestData exposing (placeholderUrl)
import Html exposing (Html, div)
import Json.Encode as E
import Main exposing (Model, Msg, Page(..), Route(..), init, navigate, subscriptions, update, view, viewPopUp)
import Pages.Dashboard as Dashboard exposing (..)
import Pages.Hardware as Hardware exposing (..)
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
import Spec.Time
import Url exposing (Protocol(..), Url)



-- NOTE: App.Model and App.Msg are type paramters for the Spec type
-- They make Spec type more flexible as it can be used with any model and msg types

{- #### **Scenario 1: Popup warning that the hardware wallet is NOT connected on application start**

**Given** the web app is opened
**And** the LNS hww is NOT detected
**And** it should ensure the navigation menu is disabled
**Then** it should display a message informing the user not connected
**And** it should not display the 'Connected' indicator in the background -}


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
                {- |> when "the LNS hww is NOT detected"
                    [ -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" jsonNanoSNOTDetected
                    ] -}
                -- NOTE: Each 'it' block resolves to an Elm-spec Plan type and receives a Script from 'given' and 'when' blocks
                |> Spec.observeThat
                    [ -- TODO: Sort the logic around disabling the menu so it doesn't interfere with the necessary display of pages
                      {- it "it should ensure the navigation menu is disabled"
                             (Observer.observeModel .isNavMenuActive
                                 |> Spec.expect
                                     Claim.isFalse
                             )
                         ,
                      -}
                      it "should display a message informing the user not connected"
                        (Observer.observeModel .isPopUpVisible
                            |> Spec.expect
                                Claim.isTrue
                        )
                    , it "displays a message indicating the LNS hardware device is NOT connected"
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
                            << by [ tag "h3" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "_"
                                )
                        )
                    ]
            )
        , --Runner.skip <|
          --Runner.pick <|
          scenario "2: hww NOT connected, user clicks the 'Connect Hardware' button, navs to Hardware page"
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
                |> when "the LNS hww is NOT detected"
                    [ Spec.Port.send "receiveMessageFromJs" jsonNanoSNOTDetected
                    ]
                |> when "the user clicks the Connect Hardware button"
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
                                        Claim.isStringContaining 1 "Welcome - Unconnected User"
                                )
                        )
                    , it "should display the 'Connected' indicator as Disconnected (red)"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "h3" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Disconnected"
                                )
                        )
                    ]
            )

        {- #### **Scenario 3: Confirming that the LNS hardware wallet is connected**
           **Given** the web app is opened
           **When** the LNS hww is detected
           **Then** the popup should not be visible
           **And** it should determine the LNS hww type
           **And** it should display a constant (no matter which page on) text indicator that the LNS is connected
           **Then** it should display the dashboard
        -}
        , --Runner.skip <|
          --Runner.pick <|
          scenario "3: If the the LNS hardware wallet is already connected, indicate this and nav to Dashboard page"
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
                -- NOTE: Bypass the popup
                |> when "the user clicks the Connect Hardware button"
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
                    , it "c. sets isHardwareLNSConnected to true"
                        (Observer.observeModel .isHardwareLNSConnected
                            |> Spec.expect
                                Claim.isTrue
                        )
                    , it "d. should display a constant (no matter which page on) text indicator that the LNS is connected"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "span" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Connected"
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
          scenario "4: Display the XMR wallet address"
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
                |> when "the user clicks the Connect Hardware button"
                    [ Spec.Command.send (Spec.Command.fake Main.HidePopUp) ]
                |> when "the LNX hww is detected"
                    [ -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" jsonNanoXDetected
                    ]
                |> when "the hardware XMR wallet returns a valid XMR address"
                    [ Spec.Port.send "receiveMessageFromJs" validXMRWalletAddress
                    ]
                |> Spec.observeThat
                    [ it "a. is on the Dashboard page"
                        (Observer.observeModel .page
                            |> Spec.expect (Claim.isEqual Debug.toString <| Main.DashboardPage Dashboard.initialModel)
                        )
                    , it "displays a message indicating the XMR wallet is connected"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "h6" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "XMR Wallet Connected"
                                )
                        )
                    , it "should display a confirmation message indicating successful discovery of XMR wallet address"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "h5" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "XMR Wallet Address: BceiPLaX7YDevCfKvgXFq8Tk1BGkQvtfAWCWJGgZfb6kBju1rDUCPzfDbHmffHMC5AZ6TxbgVVkyDFAnD2AVzLNp37DFz32"
                                )
                        )
                    ]
            )
        , --Runner.skip <|
          --Runner.pick <|
          scenario "5: Display a message that the Haveno core app is not yet connected"
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
                |> when "the user clicks the Connect Hardware button"
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
                        "b. has the correct web app location"
                        (Navigator.observe
                            |> Spec.expect
                                (Navigator.location <|
                                    Claim.isEqual Debug.toString
                                        -- NOTE: I think this is location according to Nav.Key rather than page(?)
                                        "http://localhost:1234/"
                                )
                        )
                    , it "c. sets isHardwareLNSConnected to true"
                        (Observer.observeModel .isHardwareLNSConnected
                            |> Spec.expect
                                Claim.isTrue
                        )
                    , it "displays Haveno version number in the footer"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "havenoversion" ]
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
          scenario "6: Display the Haveno core app version number"
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
                |> Spec.when "we log the http requests"
                    [ Spec.Http.logRequests
                    ]
                |> when "the user clicks the Connect Hardware button"
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
                |> Spec.observeThat
                    [ it
                        "b. has the correct web app location"
                        (Navigator.observe
                            |> Spec.expect
                                (Navigator.location <|
                                    Claim.isEqual Debug.toString
                                        -- NOTE: I think this is location according to Nav.Key rather than page(?)
                                        "http://localhost:1234/"
                                )
                        )

                    {- , it "is on the Hardware page"
                       (Observer.observeModel .page
                           |> Spec.expect (Claim.isEqual Debug.toString <| Main.HardwarePage Hardware.initialModel)

                       )
                    -}
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
                    , it "displays Haveno version number in the footer"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "havenoversion" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "1.0.7"
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


jsonNanoXDetected : E.Value
jsonNanoXDetected =
    E.object
        [ ( "operationEventMsg", E.string "nanoX" )
        ]


jsonNanoSNOTDetected : E.Value
jsonNanoSNOTDetected =
    E.object
        [ ( "operationEventMsg", E.string "" )
        ]


validXMRWalletAddress : E.Value
validXMRWalletAddress =
    E.object
        [ ( "operationEventMsg", E.string "BceiPLaX7YDevCfKvgXFq8Tk1BGkQvtfAWCWJGgZfb6kBju1rDUCPzfDbHmffHMC5AZ6TxbgVVkyDFAnD2AVzLNp37DFz32" )
        ]



-- Helper function to convert Browser.Document to Html


documentToHtml : Browser.Document msg -> Html msg
documentToHtml document =
    div [] document.body



{- viewToHtml : Main.Model -> Html Main.Msg
   viewToHtml model =
       let

           document =
               Main.view model
       in
       Html.div [] document.body
-}
