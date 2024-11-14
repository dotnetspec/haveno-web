module BddStepDefinitions.WalletSpec exposing (..)

import BddStepDefinitions.Extra exposing (..)
import BddStepDefinitions.Runner as Runner exposing (..)
import Browser
import Browser.Navigation as Nav exposing (Key)
import Expect exposing (equal)
import Extras.TestData as TestData exposing (..)
import Html exposing (Html, div, i)
import Json.Encode as E
import Pages.Blank
import Pages.Dashboard as Dashboard exposing (..)
import Pages.Hardware as Hardware exposing (..)
import Pages.Wallet as Wallet exposing (Model, Msg, init, update, view)
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


runSpecTests : Spec Wallet.Model Wallet.Msg
runSpecTests =
    describe
        "Haveno Web App Wallet Tests"
        [ --Runner.skip <|
          --Runner.pick <|
          
          scenario "1: Accessing the Wallet page"
            (given
                (Spec.Setup.init (Wallet.init "http://localhost:1234")
                    |> Spec.Setup.withView Wallet.view
                    |> Spec.Setup.withUpdate Wallet.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                
                |> Spec.observeThat
                    [ it "displays the Wallet page correctly"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ tag "h1" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Wallet"
                                )
                        )
                    ]
            )
        , 
        --Runner.skip <|
        Runner.pick <|
        scenario "2: Show available balance and reserved balance correctly in the UI"
            (given
                (Spec.Setup.init (Wallet.init "http://localhost:1234")
                    |> Spec.Setup.withView Wallet.view
                    |> Spec.Setup.withUpdate Wallet.update
                    |> Spec.Setup.withLocation placeholderUrl
                    |> Stub.serve [ TestData.successfulWalletWithBalancesFetch]
                )
                
                |> Spec.observeThat
                    [ it "displays the available balance correctly"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ id "balance" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Available Balance: 100.00 XMR"
                                )
                        )
                    , it "displays the reserved balance correctly"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ id "reservedBalance" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "Reserved Balance: 50.0 XMR"
                                )
                        )
                    ]
            )
        , scenario "3: Generating a New Subaddress"
            (given
                (Spec.Setup.init (Wallet.init "http://localhost:1234")
                    |> Spec.Setup.withView Wallet.view
                    |> Spec.Setup.withUpdate Wallet.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the user requests a new subaddress"
                    [ Spec.Port.send "receiveMessageFromJs" jsonRequestNewSubaddress ]
                |> Spec.observeThat
                    [ it "displays the new subaddress"
                        (Markup.observeElement
                            |> Markup.query
                            << by [ id "newSubaddress" ]
                            |> Spec.expect
                                (Claim.isSomethingWhere <|
                                    Markup.text <|
                                        Claim.isStringContaining 1 "New Subaddress"
                                )
                        )
                    ]
            )
        , scenario "4: Retrieving the Primary Address"
            (given
                (Spec.Setup.init (Wallet.init "http://localhost:1234")
                    |> Spec.Setup.withView Wallet.view
                    |> Spec.Setup.withUpdate Wallet.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the app retrieves the primary address"
                    [ Spec.Port.send "receiveMessageFromJs" jsonRequestPrimaryAddress ]
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
        , scenario "5: Checking Address Balance"
            (given
                (Spec.Setup.init (Wallet.init "http://localhost:1234")
                    |> Spec.Setup.withView Wallet.view
                    |> Spec.Setup.withUpdate Wallet.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the app queries the address balance"
                    [ Spec.Port.send "receiveMessageFromJs" (jsonRequestAddressBalance "someAddress") ]
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
        , scenario "6: Viewing Funding Addresses"
            (given
                (Spec.Setup.init (Wallet.init "http://localhost:1234")
                    |> Spec.Setup.withView Wallet.view
                    |> Spec.Setup.withUpdate Wallet.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the app retrieves the funding addresses"
                    [ Spec.Port.send "receiveMessageFromJs" jsonRequestFundingAddresses ]
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
        , scenario "7: Unlocking the Wallet"
            (given
                (Spec.Setup.init (Wallet.init "http://localhost:1234")
                    |> Spec.Setup.withView Wallet.view
                    |> Spec.Setup.withUpdate Wallet.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the user attempts to unlock the wallet"
                    [ Spec.Port.send "receiveMessageFromJs" jsonUnlockWalletRequest ]
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
        , scenario "8: Locking the Wallet"
            (given
                (Spec.Setup.init (Wallet.init "http://localhost:1234")
                    |> Spec.Setup.withView Wallet.view
                    |> Spec.Setup.withUpdate Wallet.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the user requests to lock the wallet"
                    [ Spec.Port.send "receiveMessageFromJs" jsonLockWalletRequest ]
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
        , scenario "9: Setting a Wallet Password"
            (given
                (Spec.Setup.init (Wallet.init "http://localhost:1234")
                    |> Spec.Setup.withView Wallet.view
                    |> Spec.Setup.withUpdate Wallet.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the user sets a password for the wallet"
                    [ Spec.Port.send "receiveMessageFromJs" jsonSetWalletPassword ]
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
        , scenario "10: Removing the Wallet Password"
            (given
                (Spec.Setup.init (Wallet.init "http://localhost:1234")
                    |> Spec.Setup.withView Wallet.view
                    |> Spec.Setup.withUpdate Wallet.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the user removes the wallet password"
                    [ Spec.Port.send "receiveMessageFromJs" jsonRemoveWalletPassword ]
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
        , scenario "11: Relaying a Monero Transaction"
            (given
                (Spec.Setup.init (Wallet.init "http://localhost:1234")
                    |> Spec.Setup.withView Wallet.view
                    |> Spec.Setup.withUpdate Wallet.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the user requests to relay a transaction"
                    [ Spec.Port.send "receiveMessageFromJs" jsonRelayTransaction ]
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
        , scenario "12: Creating a New Monero Transaction"
            (given
                (Spec.Setup.init (Wallet.init "http://localhost:1234")
                    |> Spec.Setup.withView Wallet.view
                    |> Spec.Setup.withUpdate Wallet.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the user initiates a new transaction"
                    [ Spec.Port.send "receiveMessageFromJs" jsonCreateTransaction ]
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
        , scenario "2: Show pending balance correctly when a transaction is initiated"
            (given
                (Spec.Setup.init (Wallet.init "http://localhost:1234")
                    |> Spec.Setup.withView Wallet.view
                    |> Spec.Setup.withUpdate Wallet.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the user initiates a transaction"
                    [ Spec.Port.send "receiveMessageFromJs" jsonTransactionInitiated ]
                |> when "the transaction enters pending status"
                    [ Spec.Port.send "receiveMessageFromJs" jsonTransactionPending ]
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
        , scenario "3: Display warning when attempting to send more than available balance"
            (given
                (Spec.Setup.init (Wallet.init "http://localhost:1234")
                    |> Spec.Setup.withView Wallet.view
                    |> Spec.Setup.withUpdate Wallet.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the user attempts to send more than the available balance"
                    [ Spec.Port.send "receiveMessageFromJs" jsonExceedsAvailableBalance ]
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
        , scenario "5: Show wallet balance updates after successful deposit"
            (given
                (Spec.Setup.init (Wallet.init "http://localhost:1234")
                    |> Spec.Setup.withView Wallet.view
                    |> Spec.Setup.withUpdate Wallet.update
                    |> Spec.Setup.withLocation placeholderUrl
                )
                |> when "the user successfully deposits funds into the wallet"
                    [ Spec.Port.send "receiveMessageFromJs" jsonDepositSuccess ]
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
        ]



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



-- JSON-like structure for navigating to the Wallet page


jsonNavigateToWalletPage : E.Value
jsonNavigateToWalletPage =
    E.object
        [ ( "action", E.string "navigateToWalletPage" ) ]



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


{- jsonWalletWithBalances : E.Value
jsonWalletWithBalances =
    E.object
        [ ( "availableBalance", E.float 100.0 )
        , ( "reservedBalance", E.float 50.0 )
        ] -}





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

main : Program Flags (Spec.Model Wallet.Model Wallet.Msg) (Spec.Msg Wallet.Msg)
main =
   Runner.browserProgram [ runSpecTests ]