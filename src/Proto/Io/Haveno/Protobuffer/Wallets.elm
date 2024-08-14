{- !!! DO NOT EDIT THIS FILE MANUALLY !!! -}

module Proto.Io.Haveno.Protobuffer.Wallets exposing (createXmrTx, getAddressBalance, getBalances, getFundingAddresses, getXmrNewSubaddress, getXmrPrimaryAddress, getXmrSeed, getXmrTxs, lockWallet, relayXmrTx, removeWalletPassword, setWalletPassword, unlockWallet)

{-| 
This file was automatically generated by
- [`protoc-gen-elm`](https://www.npmjs.com/package/protoc-gen-elm) 4.0.3
- `protoc` 3.12.4
- the following specification files: `grpc.proto`

To run it, add a dependency via `elm install` on [`elm-protocol-buffers`](https://package.elm-lang.org/packages/eriktim/elm-protocol-buffers/1.2.0) version latest or higher.

/////////////////////////////////////////////////////////////////////////////////////////
 Wallets
/////////////////////////////////////////////////////////////////////////////////////////


@docs createXmrTx, getAddressBalance, getBalances, getFundingAddresses, getXmrNewSubaddress, getXmrPrimaryAddress, getXmrSeed, getXmrTxs

@docs lockWallet, relayXmrTx, removeWalletPassword, setWalletPassword, unlockWallet

-}

import Grpc.Internal
import Proto.Io.Haveno.Protobuffer


{-| A template for a gRPC call to the method 'UnlockWallet' sending a `UnlockWalletRequest` to get back a `UnlockWalletReply`.

-}
unlockWallet :
    Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.UnlockWalletRequest Proto.Io.Haveno.Protobuffer.UnlockWalletReply
unlockWallet =
    Grpc.Internal.Rpc
        { service = "Wallets"
        , package = "io.haveno.protobuffer"
        , rpcName = "UnlockWallet"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeUnlockWalletRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeUnlockWalletReply
        }


{-| A template for a gRPC call to the method 'LockWallet' sending a `LockWalletRequest` to get back a `LockWalletReply`.

-}
lockWallet : Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.LockWalletRequest Proto.Io.Haveno.Protobuffer.LockWalletReply
lockWallet =
    Grpc.Internal.Rpc
        { service = "Wallets"
        , package = "io.haveno.protobuffer"
        , rpcName = "LockWallet"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeLockWalletRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeLockWalletReply
        }


{-| A template for a gRPC call to the method 'RemoveWalletPassword' sending a `RemoveWalletPasswordRequest` to get back a `RemoveWalletPasswordReply`.

-}
removeWalletPassword :
    Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.RemoveWalletPasswordRequest Proto.Io.Haveno.Protobuffer.RemoveWalletPasswordReply
removeWalletPassword =
    Grpc.Internal.Rpc
        { service = "Wallets"
        , package = "io.haveno.protobuffer"
        , rpcName = "RemoveWalletPassword"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeRemoveWalletPasswordRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeRemoveWalletPasswordReply
        }


{-| A template for a gRPC call to the method 'SetWalletPassword' sending a `SetWalletPasswordRequest` to get back a `SetWalletPasswordReply`.

-}
setWalletPassword :
    Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.SetWalletPasswordRequest Proto.Io.Haveno.Protobuffer.SetWalletPasswordReply
setWalletPassword =
    Grpc.Internal.Rpc
        { service = "Wallets"
        , package = "io.haveno.protobuffer"
        , rpcName = "SetWalletPassword"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeSetWalletPasswordRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeSetWalletPasswordReply
        }


{-| A template for a gRPC call to the method 'GetFundingAddresses' sending a `GetFundingAddressesRequest` to get back a `GetFundingAddressesReply`.

-}
getFundingAddresses :
    Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.GetFundingAddressesRequest Proto.Io.Haveno.Protobuffer.GetFundingAddressesReply
getFundingAddresses =
    Grpc.Internal.Rpc
        { service = "Wallets"
        , package = "io.haveno.protobuffer"
        , rpcName = "GetFundingAddresses"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeGetFundingAddressesRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeGetFundingAddressesReply
        }


{-| A template for a gRPC call to the method 'GetAddressBalance' sending a `GetAddressBalanceRequest` to get back a `GetAddressBalanceReply`.

-}
getAddressBalance :
    Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.GetAddressBalanceRequest Proto.Io.Haveno.Protobuffer.GetAddressBalanceReply
getAddressBalance =
    Grpc.Internal.Rpc
        { service = "Wallets"
        , package = "io.haveno.protobuffer"
        , rpcName = "GetAddressBalance"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeGetAddressBalanceRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeGetAddressBalanceReply
        }


{-| A template for a gRPC call to the method 'relayXmrTx' sending a `RelayXmrTxRequest` to get back a `RelayXmrTxReply`.

-}
relayXmrTx : Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.RelayXmrTxRequest Proto.Io.Haveno.Protobuffer.RelayXmrTxReply
relayXmrTx =
    Grpc.Internal.Rpc
        { service = "Wallets"
        , package = "io.haveno.protobuffer"
        , rpcName = "relayXmrTx"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeRelayXmrTxRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeRelayXmrTxReply
        }


{-| A template for a gRPC call to the method 'CreateXmrTx' sending a `CreateXmrTxRequest` to get back a `CreateXmrTxReply`.

-}
createXmrTx :
    Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.CreateXmrTxRequest Proto.Io.Haveno.Protobuffer.CreateXmrTxReply
createXmrTx =
    Grpc.Internal.Rpc
        { service = "Wallets"
        , package = "io.haveno.protobuffer"
        , rpcName = "CreateXmrTx"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeCreateXmrTxRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeCreateXmrTxReply
        }


{-| A template for a gRPC call to the method 'GetXmrTxs' sending a `GetXmrTxsRequest` to get back a `GetXmrTxsReply`.

-}
getXmrTxs : Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.GetXmrTxsRequest Proto.Io.Haveno.Protobuffer.GetXmrTxsReply
getXmrTxs =
    Grpc.Internal.Rpc
        { service = "Wallets"
        , package = "io.haveno.protobuffer"
        , rpcName = "GetXmrTxs"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeGetXmrTxsRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeGetXmrTxsReply
        }


{-| A template for a gRPC call to the method 'GetXmrNewSubaddress' sending a `GetXmrNewSubaddressRequest` to get back a `GetXmrNewSubaddressReply`.

-}
getXmrNewSubaddress :
    Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.GetXmrNewSubaddressRequest Proto.Io.Haveno.Protobuffer.GetXmrNewSubaddressReply
getXmrNewSubaddress =
    Grpc.Internal.Rpc
        { service = "Wallets"
        , package = "io.haveno.protobuffer"
        , rpcName = "GetXmrNewSubaddress"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeGetXmrNewSubaddressRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeGetXmrNewSubaddressReply
        }


{-| A template for a gRPC call to the method 'GetXmrPrimaryAddress' sending a `GetXmrPrimaryAddressRequest` to get back a `GetXmrPrimaryAddressReply`.

-}
getXmrPrimaryAddress :
    Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.GetXmrPrimaryAddressRequest Proto.Io.Haveno.Protobuffer.GetXmrPrimaryAddressReply
getXmrPrimaryAddress =
    Grpc.Internal.Rpc
        { service = "Wallets"
        , package = "io.haveno.protobuffer"
        , rpcName = "GetXmrPrimaryAddress"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeGetXmrPrimaryAddressRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeGetXmrPrimaryAddressReply
        }


{-| A template for a gRPC call to the method 'GetXmrSeed' sending a `GetXmrSeedRequest` to get back a `GetXmrSeedReply`.

-}
getXmrSeed : Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.GetXmrSeedRequest Proto.Io.Haveno.Protobuffer.GetXmrSeedReply
getXmrSeed =
    Grpc.Internal.Rpc
        { service = "Wallets"
        , package = "io.haveno.protobuffer"
        , rpcName = "GetXmrSeed"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeGetXmrSeedRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeGetXmrSeedReply
        }


{-| A template for a gRPC call to the method 'GetBalances' sending a `GetBalancesRequest` to get back a `GetBalancesReply`.

-}
getBalances :
    Grpc.Internal.Rpc Proto.Io.Haveno.Protobuffer.GetBalancesRequest Proto.Io.Haveno.Protobuffer.GetBalancesReply
getBalances =
    Grpc.Internal.Rpc
        { service = "Wallets"
        , package = "io.haveno.protobuffer"
        , rpcName = "GetBalances"
        , encoder = Proto.Io.Haveno.Protobuffer.encodeGetBalancesRequest
        , decoder = Proto.Io.Haveno.Protobuffer.decodeGetBalancesReply
        }
