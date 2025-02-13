module BddStepDefinitions.WalletSpec exposing (..)

import BddStepDefinitions.Extra exposing (..)
import BddStepDefinitions.Runner as Runner exposing (..)
import Browser
import Browser.Navigation as Nav exposing (Key)
import Expect exposing (equal)
import Extras.TestData as TestData exposing (..)
import Grpc
import Html exposing (Html, div, i)
import Json.Encode as E
import Pages.Dashboard as Dashboard exposing (..)
import Pages.Funds as Funds exposing (Model, Msg, init, update, view)
import Proto.Io.Haveno.Protobuffer as Protobuf exposing (BalancesInfo)
import Protobuf.Types.Int64 exposing (fromInts)
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


gotXmrBalance : Maybe BalancesInfo -> ( Int, Int )
gotXmrBalance balances =
    case balances of
        Just balancesInfo ->
            case balancesInfo.xmr of
                Just xmrrec ->
                    Protobuf.Types.Int64.toInts xmrrec.balance

                Nothing ->
                    ( 0, 0 )

        _ ->
            ( 0, 0 )



-- NAV: Test scenarios


runSpecTests : Spec Funds.Model Funds.Msg
runSpecTests =
    describe
        "Haveno Web App Funds Tests"
        [ --Runner.skip <|
          --Runner.pick <|
          scenario "1: Accessing the Funds page with valid balance data"
            (given
                (Spec.Setup.init (Funds.init "http://localhost:1234")
                    |> Spec.Setup.withView Funds.view
                    |> Spec.Setup.withUpdate Funds.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the user has already clicked the Continue button and triggered the Funds page"
                    [ Spec.Command.send (Spec.Command.fake <| Funds.GotBalances (Ok Protobuf.defaultGetBalancesReply)) ]
                |> Spec.observeThat
                    [ it "has status as Loaded"
                        (Observer.observeModel .status
                            |> Spec.expect (equals Funds.Loaded)
                        )
                    , it "displays the Funds page correctly"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "h1" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Funds"
                                )
                        )
                    ]
            )
        , --Runner.skip <|
          --Runner.pick <|
          scenario "2: Handling the Funds page with INvalid balance data"
            (given
                (Spec.Setup.init (Funds.init "http://localhost:1234")
                    |> Spec.Setup.withView Funds.view
                    |> Spec.Setup.withUpdate Funds.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the user has already clicked the Continue button and triggered the Funds page"
                    [ Spec.Command.send (Spec.Command.fake <| Funds.GotBalances (Result.Err <| Grpc.UnknownGrpcStatus "unknown")) ]
                |> Spec.observeThat
                    [ it "has status as Loaded"
                        (Observer.observeModel .status
                            |> Spec.expect (equals Funds.Errored)
                        )
                    , it "displays the Funds page correctly"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ Spec.Markup.Selector.id "funds-error-message" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Error: Unable to retrieve relevant data. Please try again later."
                                )
                        )
                    ]
            )

        --, --Runner.skip <|
        --Runner.pick <|
        , scenario "2a: Show available balance and reserved balance correctly in the UI"
            (given
                (Spec.Setup.init (Funds.init "http://localhost:1234")
                    |> Spec.Setup.withView Funds.view
                    |> Spec.Setup.withUpdate Funds.update
                    |> Spec.Setup.withLocation placeholderUrl
                    |> Stub.serve [ TestData.successfulWalletWithBalancesFetch ]
                )
                |> Spec.when "we log the http requests"
                    [ Spec.Http.logRequests
                    ]
                |> Spec.observeThat
                    [ it "displays the available balance correctly"
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
        , --Runner.skip <|
          --Runner.pick <|
          scenario "3: Generating a New Subaddress"
            (given
                (Spec.Setup.init ( getSubAddrInitModel, Spec.Command.fake <| Funds.ClickedGotNewSubaddress )
                    --(Funds.init "http://localhost:1234")
                    |> Spec.Setup.withView Funds.view
                    |> Spec.Setup.withUpdate Funds.update
                    |> Spec.Setup.withLocation placeholderUrl
                    |> Stub.serve [ TestData.successfullSubAddressFetch ]
                )
                |> Spec.when "we log the http requests"
                    [ Spec.Http.logRequests
                    ]
                |> when "the user ClickedGotNewSubaddress to simulte an new subaddress retrieval"
                    [ Spec.Command.send (Spec.Command.fake <| Funds.ClickedGotNewSubaddress) ]
                -- NOTE: Use this to bypass need to go via Main.elm, which is what will happen in the real app
                -- via GotFundsMsg
                |> when "the response triggers GotNewSubaddress in Funds.update"
                    [ Spec.Command.send
                        (Spec.Command.fake <|
                            (Funds.GotXmrNewSubaddress
                                (Ok { subaddress = TestData.subAddress })
                             -- Simulate the successful response
                            )
                        )
                    ]
                |> Spec.observeThat
                    [ it "should have status as SubAddressView"
                        (Observer.observeModel .status
                            |> Spec.expect (equals Funds.Loaded)
                        )
                    , it "should have currentView as SubAddressView"
                        (Observer.observeModel .currentView
                            |> Spec.expect (equals Funds.SubAddressView)
                        )
                    , it "displays the new subaddress"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ id "newSubaddress" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 TestData.subAddress
                                )
                        )
                    ]
            )

        -- NOTE: Uncomment these tests one at a time to maintain managability
        {-
           scenario "4: Retrieving the Primary Address"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation placeholderUrl
                   )
                   |> when "the app retrieves the primary address"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotPrimaryAddress (Ok "Primary Address")) ]
                   |> Spec.observeThat
                       [ it "displays the primary address"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "primaryAddress" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Primary Address"
                                   )
                           )
                       ]
               )

           scenario "5: Checking Address Balance"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation placeholderUrl
                   )
                   |> when "the app queries the address balance"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotAddressBalance (Ok "Address Balance: 0.0 XMR")) ]
                   |> Spec.observeThat
                       [ it "displays the address balance"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "addressBalance" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Address Balance: 0.0 XMR"
                                   )
                           )
                       ]
               )

           scenario "6: Viewing Funding Addresses"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation placeholderUrl
                   )
                   |> when "the app retrieves the funding addresses"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotFundingAddresses (Ok "Funding Address")) ]
                   |> Spec.observeThat
                       [ it "displays the funding addresses"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "fundingAddresses" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Funding Address"
                                   )
                           )
                       ]
               )

           scenario "7: Unlocking the Wallet"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation placeholderUrl
                   )
                   |> when "the user attempts to unlock the wallet"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotUnlockWallet (Ok "Wallet Unlocked")) ]
                   |> Spec.observeThat
                       [ it "updates the Wallet page to reflect the unlocked state"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "walletUnlocked" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Wallet Unlocked"
                                   )
                           )
                       ]
               )

           scenario "8: Locking the Wallet"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation placeholderUrl
                   )
                   |> when "the user requests to lock the wallet"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotLockWallet (Ok "Wallet Locked")) ]
                   |> Spec.observeThat
                       [ it "updates the Wallet page to reflect the locked state"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "walletLocked" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Wallet Locked"
                                   )
                           )
                       ]
               )

           scenario "9: Setting a Wallet Password"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation placeholderUrl
                   )
                   |> when "the user sets a password for the wallet"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotSetWalletPassword (Ok "Password successfully set")) ]
                   |> Spec.observeThat
                       [ it "confirms the wallet password was successfully set"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "passwordSetConfirmation" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Password successfully set"
                                   )
                           )
                       ]
               )

           scenario "10: Removing the Wallet Password"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation placeholderUrl
                   )
                   |> when "the user removes the wallet password"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotRemoveWalletPassword (Ok "Password successfully removed")) ]
                   |> Spec.observeThat
                       [ it "confirms the password was successfully removed"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "passwordRemovedConfirmation" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Password successfully removed"
                                   )
                           )
                       ]
               )

           scenario "11: Relaying a Monero Transaction"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation placeholderUrl
                   )
                   |> when "the user requests to relay a transaction"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotRelayTransaction (Ok "Transaction Relayed")) ]
                   |> Spec.observeThat
                       [ it "broadcasts the transaction to the Monero network"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "transactionStatus" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Transaction Relayed"
                                   )
                           )
                       ]
               )

           scenario "12: Creating a New Monero Transaction"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation placeholderUrl
                   )
                   |> when "the user initiates a new transaction"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotCreateTransaction (Ok "Transaction Pending")) ]
                   |> Spec.observeThat
                       [ it "displays the pending transaction status"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "transactionPending" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Transaction Pending"
                                   )
                           )
                       ]
               )

           scenario "13: Show pending balance correctly when a transaction is initiated"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation placeholderUrl
                   )
                   |> when "the user initiates a transaction"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotTransactionInitiated (Ok "Transaction Initiated")) ]
                   |> when "the transaction enters pending status"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotTransactionPending (Ok "Pending Balance: 20.0 XMR")) ]
                   |> Spec.observeThat
                       [ it "displays the pending balance correctly"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "pendingBalance" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Pending Balance: 20.0 XMR"
                                   )
                           )
                       ]
               )

           scenario "14: Display warning when attempting to send more than available balance"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation placeholderUrl
                   )
                   |> when "the user attempts to send more than the available balance"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotExceedsAvailableBalance (Ok "Insufficient funds")) ]
                   |> Spec.observeThat
                       [ it "displays an error message about insufficient funds"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "errorMessage" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Insufficient funds"
                                   )
                           )
                       ]
               )

           scenario "15: Show wallet balance updates after successful deposit"
               (given
                   (Spec.Setup.init (Wallet.init "http://localhost:1234")
                       |> Spec.Setup.withView Wallet.view
                       |> Spec.Setup.withUpdate Wallet.update
                       |> Spec.Setup.withLocation placeholderUrl
                   )
                   |> when "the user successfully deposits funds into the wallet"
                       [ Spec.Command.send (Spec.Command.fake <| Wallet.GotDepositSuccess (Ok "Available Balance: 200.0 XMR")) ]
                   |> Spec.observeThat
                       [ it "updates the available balance after deposit"
                           (Markup.observeElement
                               |> Markup.query
                               << by [ id "availableBalance" ]
                               |> Spec.expect
                                   (Claim.isSomethingWhere <|
                                       Markup.text <|
                                           Claim.isStringContaining 1 "Available Balance: 200.0 XMR"
                                   )
                           )
                       ]
               )
        -}
        ]



-- NAV: Initial test models - we can't get from Main unless it's a MainSpec test - so these are expected
-- state at the start of each test


getSubAddrInitModel : Funds.Model
getSubAddrInitModel =
    { status = Funds.Loaded
    , pagetitle = "Haveno Web Funds"
    , balances = Just Protobuf.defaultBalancesInfo

   
    , primaryaddress = ""
    , errors = []
    , subaddress = ""
    , currentView = Funds.SubAddressView
    }



-- JSON-like structure for creating a new transaction


jsonCreateTransaction : E.Value
jsonCreateTransaction =
    E.object
        [ ( "action", E.string "createTransaction" )
        , ( "recipientAddress", E.string "45CFCVh6w2p7A...." ) -- The recipient's Monero address
        , ( "amount", E.float 0.5 ) -- Amount in XMR
        , ( "fee", E.float 0.001 ) -- Transaction fee in XMR
        , ( "paymentId", E.string "abcd1234" ) -- Optional: Monero payment ID
        , ( "priority", E.int 2 ) -- Optional: Priority of the transaction
        ]



-- JSON-like structure for navigating to the Funds page


jsonNavigateToFundsPage : E.Value
jsonNavigateToFundsPage =
    E.object
        [ ( "action", E.string "navigateToFundsPage" ) ]



-- Action type to navigate
-- JSON-like structure for requesting a new Monero subaddress


jsonRequestNewSubaddress : E.Value
jsonRequestNewSubaddress =
    E.object
        [ ( "action", E.string "requestNewSubaddress" ) ]



-- Action type to request a new subaddress
-- JSON-like structure for requesting the primary Monero address


jsonRequestPrimaryAddress : E.Value
jsonRequestPrimaryAddress =
    E.object
        [ ( "action", E.string "requestPrimaryAddress" ) ]



-- Action type to request the primary Monero address


jsonRequestAddressBalance : String -> E.Value
jsonRequestAddressBalance address =
    E.object
        [ ( "action", E.string "requestAddressBalance" ) -- Action type to request the balance
        , ( "address", E.string address ) -- The address for which balance is requested
        ]


jsonRequestFundingAddresses : E.Value
jsonRequestFundingAddresses =
    E.object
        [ ( "action", E.string "requestFundingAddresses" ) -- Action type for requesting funding addresses
        ]


jsonUnlockWalletRequest : E.Value
jsonUnlockWalletRequest =
    E.object
        [ ( "action", E.string "unlockWallet" ) -- Action type for unlocking the wallet
        ]


jsonLockWalletRequest : E.Value
jsonLockWalletRequest =
    E.object
        [ ( "action", E.string "lockWallet" ) -- Action type for locking the wallet
        ]


jsonSetWalletPassword : E.Value
jsonSetWalletPassword =
    E.object
        [ ( "action", E.string "setWalletPassword" ) -- Action type for setting the wallet password
        ]


jsonRemoveWalletPassword : E.Value
jsonRemoveWalletPassword =
    E.object
        [ ( "action", E.string "removeWalletPassword" ) -- Action type for removing the wallet password
        ]


jsonRelayTransaction : E.Value
jsonRelayTransaction =
    E.object
        [ ( "action", E.string "relayXmrTx" ) -- Action type for relaying a transaction
        ]


jsonTransactionInitiated : E.Value
jsonTransactionInitiated =
    E.object
        [ ( "transactionStatus", E.string "initiated" ) ]


jsonTransactionPending : E.Value
jsonTransactionPending =
    E.object
        [ ( "pendingBalance", E.float 20.0 )
        ]


jsonExceedsAvailableBalance : E.Value
jsonExceedsAvailableBalance =
    E.object
        [ ( "error", E.string "Insufficient funds" ) ]


jsonNoWalletConnected : E.Value
jsonNoWalletConnected =
    E.object
        [ ( "walletStatus", E.string "No Wallet Connected" ) ]


jsonDepositSuccess : E.Value
jsonDepositSuccess =
    E.object
        [ ( "availableBalance", E.float 200.0 )
        ]


main : Program Flags (Spec.Model Funds.Model Funds.Msg) (Spec.Msg Funds.Msg)
main =
    Runner.browserProgram [ runSpecTests ]
