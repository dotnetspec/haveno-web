module Comms.CustomGrpc exposing (gotAvailableBalances, gotPrimaryAddress)

import Grpc
import Proto.Io.Haveno.Protobuffer as Protobuf
import Proto.Io.Haveno.Protobuffer.Wallets as Wallets


gotAvailableBalances : Grpc.RpcRequest Protobuf.GetBalancesRequest Protobuf.GetBalancesReply
gotAvailableBalances =
    Grpc.new Wallets.getBalances Protobuf.defaultGetBalancesRequest
        |> Grpc.addHeader "password" "apitest"
        |> Grpc.setHost "http://localhost:8080"


gotPrimaryAddress : Grpc.RpcRequest Protobuf.GetXmrPrimaryAddressRequest Protobuf.GetXmrPrimaryAddressReply
gotPrimaryAddress =
    Grpc.new Wallets.getXmrPrimaryAddress Protobuf.defaultGetXmrPrimaryAddressRequest
        |> Grpc.addHeader "password" "apitest"
        |> Grpc.setHost "http://localhost:8080"
