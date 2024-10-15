module BddStepDefinitions.HardwareSpec exposing (main)

--import Spec.Setup exposing (Setup, init, withView, withSubscriptions)

import BddStepDefinitions.Extra exposing (..)
import BddStepDefinitions.MainSpec exposing (jsonNanoSNOTDetected)
import BddStepDefinitions.Runner as Runner exposing (..)
import Expect exposing (equal)
import Extras.TestData as TestData exposing (placeholderUrl)
import Json.Decode as D
import Json.Encode as E
import Pages.Hardware exposing (Model, Msg, hardwareSubscriptions, init, view)
import Spec exposing (..)
import Spec.Claim as Claim exposing (Claim)
import Spec.Command exposing (..)
import Spec.Http
import Spec.Http.Route as Route exposing (HttpRoute)
import Spec.Http.Stub as Stub
import Spec.Markup as Markup
import Spec.Markup.Selector exposing (..)
import Spec.Port exposing (..)
import Spec.Report exposing (note)
import Spec.Setup as Setup
import Spec.Step exposing (log)
import Time exposing (..)


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


validXMRWalletAddress : E.Value
validXMRWalletAddress =
    E.object
        [ ( "operationEventMsg", E.string "BceiPLaX7YDevCfKvgXFq8Tk1BGkQvtfAWCWJGgZfb6kBju1rDUCPzfDbHmffHMC5AZ6TxbgVVkyDFAnD2AVzLNp37DFz32" )
        ]


runSpecTests : Spec Pages.Hardware.Model Pages.Hardware.Msg
runSpecTests =
    describe
        "Scenarios based on a Haveno Web App MVP"
        [ --Runner.pick <|
          --,
          --Runner.skip <|
          scenario "1. Warning that the hardware wallet is NOT connected"
            (given
                (Setup.init
                    (Pages.Hardware.init { time = Nothing, flagUrl = placeholderUrl })
                    |> Setup.withView Pages.Hardware.view
                    |> Setup.withUpdate Pages.Hardware.update
                    |> Setup.withSubscriptions Pages.Hardware.hardwareSubscriptions
                )
                |> when "the user clicks the 'Connect Hardware Device' feature"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            Pages.Hardware.ClickedHardwareDeviceConnect
                    ]
                |> when "the web app should detect the hardware device is NOT connected"
                    [ --sendMessageToJs is the other way
                      -- NOTE: 'send' here means send from js to elm
                      Spec.Port.send "receiveMessageFromJs" jsonNanoSNOTDetected
                    ]
                |> Spec.observeThat
                    [ it "it should display a message informing the user not connected"
                        (Markup.observeElement
                            |> Markup.query
                            -- NOTE: It appears that the test ONLY matches on the first element that matches the selector
                            << by [ tag "h6" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Not connected yet"
                                )
                        )
                    ]
            )

        --Runner.skip <|
        , --Runner.pick <|
            scenario "2. The Hardware Device IS Connected"
                (given
                    (Setup.init
                        (Pages.Hardware.init { time = Nothing, flagUrl = placeholderUrl })
                        |> Setup.withView Pages.Hardware.view
                        |> Setup.withUpdate Pages.Hardware.update
                        |> Setup.withSubscriptions Pages.Hardware.hardwareSubscriptions
                    )
                    |> when "the user clicks the 'Connect Hardware Device' feature"
                        [ Spec.Command.send <|
                            Spec.Command.fake
                                Pages.Hardware.ClickedHardwareDeviceConnect
                        ]
                    |> when "it should detect the connected hardware device"
                        [ Spec.Port.send "receiveMessageFromJs" jsonNanoXDetected
                        ]
                    |> Spec.observeThat
                        [ it "displays a message indicating the app is on the Dashboard page"
                            (Markup.observeElement
                                |> Markup.query
                                -- NOTE: It appears that the test ONLY matches on the first element that matches the selector
                                << by [ tag "h1" ]
                                |> Spec.expect
                                    (Claim.isSomethingWhere <|
                                        Markup.text <|
                                            Claim.isStringContaining 1 "Haveno Web - Dashboard"
                                    )
                            )
                        , it "should display a confirmation message indicating successful hardware device connection"
                            (Markup.observeElement
                                |> Markup.query
                                -- NOTE: It appears that the test ONLY matches on the first element that matches the selector
                                << by [ tag "text" ]
                                |> Spec.expect
                                    (Claim.isSomethingWhere <|
                                        Markup.text <|
                                            Claim.isStringContaining 1 "Connected"
                                    )
                            )
                        ]
                )
        , --Runner.pick <|
          scenario "2. Connecting the XMR Hardware Wallet"
            (given
                (Setup.init
                    (Pages.Hardware.init { time = Nothing, flagUrl = placeholderUrl })
                    |> Setup.withView Pages.Hardware.view
                    |> Setup.withUpdate Pages.Hardware.update
                    |> Setup.withSubscriptions Pages.Hardware.hardwareSubscriptions
                )
                |> when "the user clicks the 'Connect XMR Wallet' feature"
                    [ Spec.Command.send <|
                        Spec.Command.fake
                            Pages.Hardware.ClickedXMRWalletConnect
                    ]
                |> when "the hardware XMR wallet is connected"
                    [ Spec.Port.send "receiveMessageFromJs" validXMRWalletAddress
                    ]
                |> Spec.observeThat
                    [ it "displays a message indicating the app is on the Dashboard page"
                        (Markup.observeElement
                            |> Markup.query
                            -- NOTE: It appears that the test ONLY matches on the first element that matches the selector
                            << by [ tag "h1" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Haveno Web - Dashboard"
                                )
                        )
                    , it "should display a confirmation message indicating successful XMR wallet connection"
                        (Markup.observeElement
                            |> Markup.query
                            -- NOTE: It appears that the test ONLY matches on the first element that matches the selector
                            << by [ tag "text" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Connected"
                                )
                        )
                    ]
            )

        {- #### **Scenario 2: Initiating a Transaction**

           **Given** the user has connected their hardware wallet to the mobile web app
           **When** the user initiates a transaction in the web app (e.g., sending Monero)
           **When** the web app sends the transaction request to the backend service (via HTTPS)
           **Then** the backend service (APK) should receive the transaction request
           **When** the APK should relay the transaction request to the Haveno daemon for processing
           **Then** the APK should return the transaction status to the web app
        -}
        --Runner.pick <|
        --, Runner.skip <|
        {- ,
           scenario "3. Initiating a Transaction"
              (given
                  (Setup.init
                      (Pages.Hardware.init { time = Nothing, flagUrl = TestData.placeholderUrl })
                      |> Setup.withView Pages.Hardware.view
                      |> Setup.withUpdate Pages.Hardware.update
                      |> Stub.serve
                          [ TestData.successfullLocationFetch
                          , TestData.successfullLoginFetch
                          , TestData.successfullProfileFetch
                          , TestData.successfullCallResponse
                          ]
                  )
                  |> when "the user initiates a transaction in the web app"
                      [ Spec.Command.send <| Spec.Command.fake (Pages.Hardware.ClickedXMRInitiateTransaction "0.01") ]
                  {- |> Spec.when "we log the http requests"
                     [ Spec.Http.logRequests
                     ]
                  -}
                  |> Spec.observeThat
                      [ it "requests the realm server location"
                          (Spec.Http.observeRequests
                              -- NOTE: Copy the route from the logRequest above (assuming app actually makes the correct request)
                              -- to ensure it matches the request the app attempts.
                              -- otherwise, you would get a 404 response code if your program attempts to make a request that is not stubbed
                              -- NOTE: The route only appears in RED in the test results in terminal if it's correctly specified here:
                              (Route.get TestData.loginRequestLocationURL)
                              |> expect
                                  (Claim.isListWhere
                                      [ Spec.Http.url <|
                                          -- HACK: These are not good tests currently:
                                          Claim.isStringContaining 1 ""
                                      ]
                                  )
                          )
                      , it "makes the login request"
                          (Spec.Http.observeRequests
                              (Route.post TestData.loginRequestURL)
                              |> expect
                                  (Claim.isListWhere
                                      [ Spec.Http.url <|
                                          Claim.isStringContaining 1 "local-userpass/login"
                                      ]
                                  )
                          )
                      , it "sends the access token in the profile request"
                          (Spec.Http.observeRequests
                              (Route.get TestData.loginRequestProfileURL)
                              |> expect
                                  (Claim.isListWhere
                                      [ Spec.Http.header "Authorization" <|
                                          Claim.isSomethingWhere <|
                                              Claim.isStringContaining 1 "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjY2MmEyMjFiNDc1Yzk3YWY2YTFlYmRiNCIsImJhYXNfZG9tYWluX2lkIjoiNjJmNDgxNWNkZjJiYmVlOWYxMGNkMTBhIiwiZXhwIjoxNzE0MTIwMTY5LCJpYXQiOjE3MTQxMTgzNjksImlzcyI6IjY2MmI1ZWUxMjBlMTVmMDNhOTVjMWM4NyIsImp0aSI6IjY2MmI1ZWUxMjBlMTVmMDNhOTVjMWM4OSIsInN0aXRjaF9kZXZJZCI6IjY2MmEyMjFiNDc1Yzk3YWY2YTFlYmRiNCIsInN0aXRjaF9kb21haW5JZCI6IjYyZjQ4MTVjZGYyYmJlZTlmMTBjZDEwYSIsInN1YiI6IjY1MWZhMDA2YjE1YTUzNGM2OWIxMTllZiIsInR5cCI6ImFjY2VzcyJ9.DpiBqSs8bPuanHw9VqHeSkqjSc84SLCQN-OWcePHQ8g"
                                      ]
                                  )
                          )
                      , it "sends the access token in the call request"
                          (Spec.Http.observeRequests
                              (Route.post TestData.loginRequestCallURL)
                              |> expect
                                  (Claim.isListWhere
                                      [ Spec.Http.header "Authorization" <|
                                          Claim.isSomethingWhere <|
                                              Claim.isStringContaining 1 "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjY2MmEyMjFiNDc1Yzk3YWY2YTFlYmRiNCIsImJhYXNfZG9tYWluX2lkIjoiNjJmNDgxNWNkZjJiYmVlOWYxMGNkMTBhIiwiZXhwIjoxNzE0MTIwMTY5LCJpYXQiOjE3MTQxMTgzNjksImlzcyI6IjY2MmI1ZWUxMjBlMTVmMDNhOTVjMWM4NyIsImp0aSI6IjY2MmI1ZWUxMjBlMTVmMDNhOTVjMWM4OSIsInN0aXRjaF9kZXZJZCI6IjY2MmEyMjFiNDc1Yzk3YWY2YTFlYmRiNCIsInN0aXRjaF9kb21haW5JZCI6IjYyZjQ4MTVjZGYyYmJlZTlmMTBjZDEwYSIsInN1YiI6IjY1MWZhMDA2YjE1YTUzNGM2OWIxMTllZiIsInR5cCI6ImFjY2VzcyJ9.DpiBqSs8bPuanHw9VqHeSkqjSc84SLCQN-OWcePHQ8g"
                                      ]
                                  )
                          )
                      , it "correctly formats selected fields in the json in the POST request"
                          (Spec.Http.observeRequests (Route.post TestData.loginRequestCallURL)
                              |> expect
                                  -- NOTE: list each POST request i.e. token validation and then booking request
                                  (Claim.isListWhere
                                      [ Spec.Http.body
                                          (Spec.Http.asJson <| D.at [ "arguments", "0", "pipeline", "0", "$match", "_id", "$oid" ] D.string)
                                          (Claim.isStringContaining 1 "651fa006b15a534c69b119ef")

                                      {- , Spec.Http.body
                                         (Spec.Http.asJson <| D.at [ "arguments", "0"] D.string)
                                             D.field "collection" D.string
                                         )
                                         (Claim.isStringContaining 1 "users")
                                      -}
                                      ]
                                  )
                          )
                      , it "the page should display the user's rankings and details (global view)"
                          (Markup.observeElement
                              |> Markup.query
                              -- NOTE: It appears that the test ONLY matches on the first element that matches the selector
                              << by [ tag "h5" ]
                              |> Spec.expect
                                  (Claim.isSomethingWhere <|
                                      Markup.text <|
                                          Claim.isStringContaining 1 "SportRank - Welcome Back - Dave"
                                  )
                          )
                      ]
              )
        -}
        ]



--main : Program Flags (Spec.Model Main.Model Main.Msg) (Spec.Msg Main.Msg)


main : Program Flags (Spec.Model Pages.Hardware.Model Pages.Hardware.Msg) (Spec.Msg Pages.Hardware.Msg)
main =
    -- NOTE: By using the browserProgram function, developers can specify configurations such as how the application's initial state is initialized
    -- , how the view is rendered, how updates are handled, and how subscriptions and browser events are managed during test execution
    --Runner.browserProgram { flags = \_ -> (), init = App.init, update = App.update, subscriptions = App.subscriptions, view = App.view }
    Runner.browserProgram [ runSpecTests ]



-- NAV: Helper functions:


equals : a -> Claim a
equals =
    Claim.isEqual Debug.toString



{- viewToHtml : Main.Model -> Html Main.Msg
   viewToHtml model =
       let

           document =
               Main.view model
       in
       Html.div [] document.body
-}
