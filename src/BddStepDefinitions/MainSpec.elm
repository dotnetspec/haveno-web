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
import Main exposing (Model, Msg, init, mainInitModel, subscriptions, update, view, viewPopUp)
import Spec exposing (..)
import Spec.Claim as Claim exposing (Claim, Verdict)
import Spec.Command exposing (send)
import Spec.Http.Stub as Stub
import Spec.Markup as Markup
import Spec.Markup.Selector exposing (..)
import Spec.Observer as Observer exposing (Observer)
import Spec.Port exposing (..)
import Spec.Report exposing (note)
import Spec.Setup exposing (Setup, init, withSubscriptions, withUpdate, withView)
import Spec.Step exposing (log)
import Url exposing (Protocol(..), Url)



-- NOTE: Local test setup
-- NOTE: App.Model and App.Msg are type paramters for the Spec type
-- They make Spec type more flexible as it can be used with any model and msg types
-- NOTE: placeholderURL is used to load the rankings page
-- FromMainToRankings is particular to the Hardware page
{- #### **Scenario 1: Warning that the hardware wallet is NOT connected**

   **Given** the web app is opened
   **And** the LNS hww is NOT connected
   **Then** it should display a message informing the user not connected (splash page)
   **And** the web app should display a constant indicator as red for not connected
   **And** the user should have option to continue without trading
-}


runSpecTests : Spec Main.Model Main.Msg
runSpecTests =
    describe
        "Scenarios based on a Haveno Web App MVP"
        [ --Runner.skip <|
          --Runner.pick <|
            --,
            scenario "1: Warning that the hardware wallet is NOT connected"
                (given
                    (Spec.Setup.initWithModel Main.mainInitModel
                        |> Spec.Setup.withView (\model -> documentToHtml (Main.view model))
                        |> Spec.Setup.withUpdate Main.update
                        |> Spec.Setup.withSubscriptions Main.subscriptions
                    )
                    |> when "the LNS hww is NOT detected"
                        [ -- NOTE: 'send' here means send from js to elm
                          Spec.Port.send "receiveMessageFromJs" jsonNanoSNOTDetected
                        ]
                    |> Spec.observeThat
                        [ it "the popup should be visible"
                            (Observer.observeModel .isPopUpVisible
                                |> Spec.expect
                                    Claim.isTrue
                            )
                        , it "displays a message indicating the LNS hardware device is NOT connected"
                            (Markup.observeElement
                                |> Markup.query
                                << by [ tag "div" ]
                                |> Spec.expect
                                    (Claim.isSomethingWhere <|
                                        Markup.text <|
                                            Claim.isStringContaining 1 "Please connect your hardware device to continue"
                                    )
                            )
                        ]
                )
        , --Runner.skip <|
          Runner.pick <|
          scenario "2: hww NOT connected, user clicks the 'Connect Hardware' button, navs to Hardware page"
            (given
                (Spec.Setup.initWithModel Main.mainInitModel
                    |> Spec.Setup.withView (\model -> documentToHtml (Main.view model))
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                )
                |> when "the LNS hww is NOT detected"
                    [ Spec.Port.send "receiveMessageFromJs" jsonNanoSNOTDetected
                    ]
                |> when "the user clicks the Close button"
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
                                        Claim.isStringContaining 1 "Haveno Web - Connect Hardware"
                                )
                        )
                    ]
            )
        , --Runner.skip <|
          --Runner.pick <|
          --,
          scenario "3: Confirming that the LNS hardware wallet is connected"
            (given
                (Spec.Setup.initWithModel Main.mainInitModel
                    |> Spec.Setup.withView (\model -> documentToHtml (Main.view model))
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                )
                |> when "the LNS hww is detected"
                    [ -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" jsonNanoSDetected
                    ]
                |> Spec.observeThat
                    [ it "the popup should not be visible"
                        (Observer.observeModel .isPopUpVisible
                            |> Spec.expect
                                Claim.isFalse
                        )
                    , it "displays a message indicating the LNS hardware device is connected"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "div" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Nano S Connected"
                                )
                        )
                    , it "it should display the dashboard"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "h1" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Haveno Web - Dashboard"
                                )
                        )
                    ]
             {- |> when "the user clicks the Close button"
                    [ Spec.Command.send (Spec.Command.fake Main.HidePopUp) ]
                |> Spec.observeThat
                    [ it "the popup should be hidden"
                        (Observer.observeModel .isPopUpVisible
                            |> Spec.expect
                                Claim.isFalse
                        )
                    ]
             -}
            )

        {- , --Runner.pick <|
           scenario "2. Connecting the XMR Hardware Wallet"
               (given
                   (Spec.Setup.initWithModel Main.mainInitModel
                           |> Spec.Setup.withView (\model -> documentToHtml (Main.view model))
                           |> Spec.Setup.withUpdate Main.update
                           |> Spec.Setup.withSubscriptions Main.subscriptions
                       )
                   |> when "the user clicks the 'Connect XMR Wallet' feature"
                       [ Spec.Command.send <|
                           Spec.Command.fake
                               Main.ClickedXMRWalletConnect
                       ]
                   |> when "the hardware XMR wallet is connected"
                       [ Spec.Port.send "receiveMessageFromJs" validXMRWalletAddress
                       ]
                   |> Spec.observeThat
                       [ it "should display a confirmation message indicating successful XMR wallet connection"
                           (Markup.observeElement
                               |> Markup.query
                               -- NOTE: It appears that the test ONLY matches on the first element that matches the selector
                               << by [ tag "h6" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "XMR Wallet Connected"
                                   )
                           )
                       ]
               )
        -}
        , scenario "3: Display the Haveno core app version number"
            (given
                (Spec.Setup.initWithModel Main.mainInitModel
                    |> Spec.Setup.withView (\model -> documentToHtml (Main.view model))
                    |> Spec.Setup.withUpdate Main.update
                    |> Spec.Setup.withSubscriptions Main.subscriptions
                )
                {- |> Spec.when "we log the http requests"
                   [ Spec.Http.logRequests
                   ]
                -}
                |> Spec.observeThat
                    [ it "displays Haveno version number on the Dashboard page"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "h6" ]
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
