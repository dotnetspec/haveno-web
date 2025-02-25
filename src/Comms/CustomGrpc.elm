module Comms.CustomGrpc exposing (gotAvailableBalances)

import Grpc
import Proto.Io.Haveno.Protobuffer as Protobuf
import Proto.Io.Haveno.Protobuffer.Wallets as Wallets
import Types.Msg exposing (Msg(..))


gotAvailableBalances : Grpc.RpcRequest Protobuf.GetBalancesRequest Protobuf.GetBalancesReply
gotAvailableBalances =
    Grpc.new Wallets.getBalances Protobuf.defaultGetBalancesRequest
        |> Grpc.addHeader "password" "apitest"
        |> Grpc.setHost "http://localhost:8080"
