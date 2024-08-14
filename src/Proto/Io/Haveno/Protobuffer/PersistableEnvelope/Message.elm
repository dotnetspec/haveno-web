{- !!! DO NOT EDIT THIS FILE MANUALLY !!! -}

module Proto.Io.Haveno.Protobuffer.PersistableEnvelope.Message exposing (Message(..))

{-| 
This file was automatically generated by
- [`protoc-gen-elm`](https://www.npmjs.com/package/protoc-gen-elm) 4.0.3
- `protoc` 3.12.4
- the following specification files: `pb.proto`

To run it, add a dependency via `elm install` on [`elm-protocol-buffers`](https://package.elm-lang.org/packages/eriktim/elm-protocol-buffers/1.2.0) version latest or higher.

@docs Message

-}


{-| ## Options

### SequenceNumberMap

### PeerList

### AddressEntryList

### NavigationPath

### TradableList

### ArbitrationDisputeList

### PreferencesPayload

### UserPayload

### PaymentAccountList

### AccountAgeWitnessStore

### SignedWitnessStore

### MediationDisputeList

### RefundDisputeList

### TradeStatistics3Store

### MailboxMessageList

### IgnoredMailboxMap

### RemovedPayloadsMap

### XmrAddressEntryList

### SignedOfferList

### EncryptedConnectionList

-}
type Message a0 a1 a2 a3 a4 a5 a6 a7 a8 a9 a10 a11 a12 a13 a14 a15 a16 a17 a18 a19
    = SequenceNumberMap a0
    | PeerList a1
    | AddressEntryList a2
    | NavigationPath a3
    | TradableList a4
    | ArbitrationDisputeList a5
    | PreferencesPayload a6
    | UserPayload a7
    | PaymentAccountList a8
    | AccountAgeWitnessStore a9
    | SignedWitnessStore a10
    | MediationDisputeList a11
    | RefundDisputeList a12
    | TradeStatistics3Store a13
    | MailboxMessageList a14
    | IgnoredMailboxMap a15
    | RemovedPayloadsMap a16
    | XmrAddressEntryList a17
    | SignedOfferList a18
    | EncryptedConnectionList a19
