module Pages.Donate exposing (Model, Msg(..), Status(..), View(..), errorView, gotAvailableBalances, gotNewSubAddress, gotPrimaryAddress, init, initialModel, manageDonateView, update, view)

import Extras.Constants as Consts
import Grpc
import Html exposing (Html, div, section)
import Html.Attributes as Attr exposing (class)
import Proto.Io.Haveno.Protobuffer as Protobuf
import Proto.Io.Haveno.Protobuffer.Wallets as Wallets



-- NAV: Model


type alias Model =
    { status : Status
    , pagetitle : String
    , balances : Maybe Protobuf.BalancesInfo
    , isAddressVisible : Bool
    , primaryaddress : String
    , errors : List String
    , subaddress : String
    , currentView : View
    }


initialModel : Model
initialModel =
    { status = Loaded
    , pagetitle = "Donate"
    , balances = Just Protobuf.defaultBalancesInfo
    , isAddressVisible = False
    , primaryaddress = ""
    , errors = []
    , subaddress = ""
    , currentView = DonateView
    }


type Status
    = Loaded
    | Errored


type View
    = DonateView
    | ManageDonateView



-- NAV: Init


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel
    , Cmd.none
    )



-- NAV: Msg


type Msg
    = GotBalances (Result Grpc.Error Protobuf.GetBalancesReply)
    | GotXmrPrimaryAddress (Result Grpc.Error Protobuf.GetXmrPrimaryAddressReply)
    | GotXmrNewSubaddress (Result Grpc.Error Protobuf.GetXmrNewSubaddressReply)
    | AddNewAccount



-- NAV: Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        AddNewAccount ->
            ( { model | currentView = ManageDonateView }, Cmd.none )

        GotXmrPrimaryAddress (Ok primaryAddresponse) ->
            ( { model | primaryaddress = primaryAddresponse.primaryAddress, status = Loaded, currentView = DonateView }, Cmd.none )

        GotXmrPrimaryAddress (Err _) ->
            ( { model | status = Errored }, Cmd.none )

        GotXmrNewSubaddress (Ok subAddresponse) ->
            ( { model | subaddress = subAddresponse.subaddress, status = Loaded, currentView = ManageDonateView }, Cmd.none )

        GotXmrNewSubaddress (Err _) ->
            ( { model | status = Errored }, Cmd.none )

        GotBalances (Ok response) ->
            ( { model | balances = response.balances, status = Loaded }, Cmd.none )

        GotBalances (Err _) ->
            ( { model | status = Errored }, Cmd.none )



-- NAV: View


view : Model -> Html Msg
view model =
    section
        [ Attr.id "page"
        , class "section-background"
        , class "text-center"
        ]
        [ div [ class "split" ]
            [ div
                [ class "split-col"
                ]
                []
            , case model.status of
                Errored ->
                    div [ class "split-col" ] [ errorView ]

                Loaded ->
                    div
                        [ class "split-col"
                        ]
                        [ case model.currentView of
                            DonateView ->
                                manageDonateView

                            ManageDonateView ->
                                manageDonateView
                        ]
            , div
                [ class "split-col"
                ]
                []
            ]
        ]



-- NAV: View helpers:


errorView : Html Msg
errorView =
    Html.div [ Attr.class "accounts-container" ]
        [ Html.h1 [ Attr.class "accounts-title" ] [ Html.text "Donate" ]
        , Html.div [ Attr.class "error-message", Attr.id "accounts-error-message" ]
            [ Html.text "Error: Unable to retrieve relevant data. Please try again later." ]
        ]


manageDonateView : Html Msg
manageDonateView =
    Html.div [ Attr.class "accounts-container" ]
        [ Html.h1 [ Attr.class "accounts-title" ] [ Html.text "Donate" ]
        , Html.div [ Attr.class "address-text" ]
            [ Html.span [ Attr.class "address-label" ] [ Html.text "Thank you for your support. Every bit helps. Please send your donation to: " ]
            , Html.p [ Attr.id "donationaddress", Attr.class "address-value" ] [ Html.text Consts.donationAddress ]
            , Html.p [ Attr.class "address-label" ] [ Html.text "Thank you. It is much appreciated" ]
            ]
        ]



-- NAV: gRPC calls


gotAvailableBalances : Cmd Msg
gotAvailableBalances =
    let
        grpcRequest =
            Grpc.new Wallets.getBalances Protobuf.defaultGetBalancesRequest
                |> Grpc.addHeader "password" "apitest"
                -- NOTE: "Content-Type" "application/grpc-web+proto" is already part of the request
                |> Grpc.setHost "http://localhost:8080"
    in
    Grpc.toCmd GotBalances grpcRequest


gotPrimaryAddress : Cmd Msg
gotPrimaryAddress =
    let
        grpcRequest =
            Grpc.new Wallets.getXmrPrimaryAddress Protobuf.defaultGetXmrPrimaryAddressRequest
                |> Grpc.addHeader "password" "apitest"
                -- NOTE: "Content-Type" "application/grpc-web+proto" is already part of the request
                |> Grpc.setHost "http://localhost:8080"
    in
    Grpc.toCmd GotXmrPrimaryAddress grpcRequest


gotNewSubAddress : Cmd Msg
gotNewSubAddress =
    let
        grpcRequest =
            Grpc.new Wallets.getXmrNewSubaddress Protobuf.defaultGetXmrNewSubaddressRequest
                |> Grpc.addHeader "password" "apitest"
                -- NOTE: "Content-Type" "application/grpc-web+proto" is already part of the request
                |> Grpc.setHost "http://localhost:8080"
    in
    Grpc.toCmd GotXmrNewSubaddress grpcRequest



-- NAV: Helper functions
