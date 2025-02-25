module Types.Msg exposing (Msg(..))

import Grpc
import Proto.Io.Haveno.Protobuffer as Protobuf

type Msg
    = GotBalances (Result Grpc.Error Protobuf.GetBalancesReply)
    | RequestBalances
    | RetryWalletConnection
    | RetryHavenoConnection
    | SetCustomMoneroNode String
    | ApplyCustomMoneroNode String
    | NoOp
