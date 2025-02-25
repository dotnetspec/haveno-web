module Pages.Funds exposing (Model, Msg(..), Status(..), View(..), btcBalanceAsString, custodialFundsView, errorView, formatBalance, gotAvailableBalances, gotNewSubAddress, gotPrimaryAddress, init, initialModel, primaryAddressView, reservedOfferBalanceAsString, subAddressView, update, view, xmrAvailableBalanceAsString, xmrBalView)

import Extras.Constants as Constants exposing (xmrConversionConstant)
import Grpc
import Html exposing (Html, div, section)
import Html.Attributes as Attr exposing (class)
import Proto.Io.Haveno.Protobuffer as Protobuf
import Proto.Io.Haveno.Protobuffer.Wallets as Wallets
import Protobuf.Types.Int64 exposing (toInts)
import UInt64
import Utils.MyUtils as MyUtils



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
    { status = Loading
    , pagetitle = "Funds"
    , balances = Just Protobuf.defaultBalancesInfo
    , isAddressVisible = False
    , primaryaddress = ""
    , errors = []
    , subaddress = ""
    , currentView = FundsView
    }


type Status
    = Loading
    | Loaded
    | Errored


type View
    = FundsView
    | ErrorView
    | SubAddressView



-- NAV: Init


init : String -> ( Model, Cmd Msg )
init _ =
    ( initialModel
    , Cmd.batch [ gotPrimaryAddress, gotAvailableBalances ]
    )



-- NAV: Msg


type Msg
    = GotBalances (Result Grpc.Error Protobuf.GetBalancesReply)
    | GotXmrPrimaryAddress (Result Grpc.Error Protobuf.GetXmrPrimaryAddressReply)
    | GotXmrNewSubaddress (Result Grpc.Error Protobuf.GetXmrNewSubaddressReply)
    | ClickedGotNewSubaddress
    | ChangeView View
    | ToggleVisibility



-- NAV: Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ToggleVisibility ->
            ( { model | isAddressVisible = not model.isAddressVisible }, Cmd.none )

        ClickedGotNewSubaddress ->
            ( model, gotNewSubAddress )

        GotXmrPrimaryAddress (Ok primaryAddresponse) ->
            ( { model | primaryaddress = primaryAddresponse.primaryAddress, status = Loaded, currentView = FundsView }, Cmd.none )

        GotXmrPrimaryAddress (Err error) ->
            ( { model | status = Errored }, Cmd.none )

        GotXmrNewSubaddress (Ok subAddresponse) ->
            ( { model | subaddress = subAddresponse.subaddress, status = Loaded, currentView = SubAddressView }, Cmd.none )

        GotXmrNewSubaddress (Err error) ->
            ( { model | status = Errored }, Cmd.none )

        GotBalances (Ok response) ->
            ( { model | balances = response.balances, status = Loaded }, Cmd.none )

        GotBalances (Err error) ->
            ( { model | status = Errored }, Cmd.none )

        ChangeView uiView ->
            ( { model | currentView = uiView }, Cmd.none )



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
                Loading ->
                    div
                        []
                        [ div
                            [ class "spinner"
                            ]
                            []
                        ]

                Errored ->
                    div [ class "split-col" ] [ errorView ]

                Loaded ->
                    div
                        [ class "split-col"
                        ]
                        [ case model.currentView of
                            FundsView ->
                                custodialFundsView model

                            SubAddressView ->
                                subAddressView model.subaddress

                            ErrorView ->
                                errorView
                        ]
            , div
                [ class "split-col"
                ]
                []
            ]
        ]



-- NAV: View helpers:


custodialFundsView : Model -> Html Msg
custodialFundsView model =
    Html.div [ Attr.class "funds-container", Attr.id "custodialFundsView" ]
        [ Html.h1 [ Attr.class "funds-title" ] [ Html.text "Funds" ]
        , primaryAddressView model
        , xmrBalView model
        , Html.div [ Attr.id "btcbalance", Attr.class "balance-text" ]
            [ Html.text ("Available BTC Balance: " ++ btcBalanceAsString model.balances ++ " BTC") ]
        , Html.div [ Attr.id "reservedOfferBalance", Attr.class "balance-text" ]
            [ Html.text ("Reserved Offer Balance: " ++ reservedOfferBalanceAsString model.balances ++ " XMR") ]
        , MyUtils.infoBtn "New Sub Address" <| ClickedGotNewSubaddress
        ]


primaryAddressView : Model -> Html Msg
primaryAddressView model =
    Html.div [ Attr.id "primaryaddress", Attr.class "address-container" ]
        [ MyUtils.infoBtn
            (if model.isAddressVisible then
                "Hide"

             else
                "Show"
            )
            ToggleVisibility
        , Html.div [ Attr.class "address-text" ]
            [ Html.span [ Attr.class "address-label" ] [ Html.text "Primary address: " ]
            , Html.span [ Attr.class "address-value" ]
                [ Html.text
                    (if model.isAddressVisible then
                        model.primaryaddress

                     else
                        Constants.blankAddress
                    )
                ]
            ]
        ]


xmrBalView : Model -> Html Msg
xmrBalView model =
    Html.div [ Attr.id "xmrAvailableBalance", Attr.class "balance-text" ]
        [ Html.text ("Available Balance: " ++ xmrAvailableBalanceAsString model.balances ++ " XMR") ]


errorView : Html Msg
errorView =
    Html.div [ Attr.class "funds-container" ]
        [ Html.h1 [ Attr.class "funds-title" ] [ Html.text "Funds" ]
        , Html.div [ Attr.class "error-message", Attr.id "funds-error-message" ]
            [ Html.text "Error: Unable to retrieve relevant data. Please try again later." ]
        ]


subAddressView : String -> Html Msg
subAddressView newSubaddress =
    Html.div [ Attr.class "funds-container" ]
        [ Html.h1 [ Attr.class "funds-title" ] [ Html.text "Funds" ]
        , Html.div [ Attr.class "address-text", Attr.id "newSubaddress" ]
            [ Html.text ("New Subaddress: " ++ newSubaddress) ]
        ]


xmrAvailableBalanceAsString : Maybe Protobuf.BalancesInfo -> String
xmrAvailableBalanceAsString balInfo =
    case balInfo of
        Just blInfo ->
            case blInfo.xmr of
                Nothing ->
                    "0.00"

                Just xmrbalViewinfo ->
                    let
                        ( firstInt, secondInt ) =
                            toInts xmrbalViewinfo.availableBalance
                    in
                    --String.fromInt firstInt ++ "." ++ String.fromInt secondInt
                    formatBalance { higher = firstInt, lower = secondInt }

        Nothing ->
            "0.00"


btcBalanceAsString : Maybe Protobuf.BalancesInfo -> String
btcBalanceAsString balInfo =
    case balInfo of
        Just blInfo ->
            case blInfo.btc of
                Nothing ->
                    "0.00"

                Just btcbalinfo ->
                    let
                        ( firstInt, secondInt ) =
                            toInts btcbalinfo.availableBalance
                    in
                    formatBalance { higher = firstInt, lower = secondInt }

        Nothing ->
            ""


reservedOfferBalanceAsString : Maybe Protobuf.BalancesInfo -> String
reservedOfferBalanceAsString balInfo =
    case balInfo of
        Just blInfo ->
            case blInfo.xmr of
                Nothing ->
                    "0.00"

                Just xmrbalViewinfo ->
                    let
                        ( firstInt, secondInt ) =
                            toInts xmrbalViewinfo.reservedOfferBalance
                    in
                    String.fromInt firstInt ++ "." ++ String.fromInt secondInt

        Nothing ->
            ""



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


formatBalance : { higher : Int, lower : Int } -> String
formatBalance int64 =
    let
        -- Convert higher and lower into a full 64-bit integer
        fullUInt64 : UInt64.UInt64
        fullUInt64 =
            let
                highPart =
                    UInt64.fromInt int64.higher |> UInt64.mul (UInt64.fromInt xmrConversionConstant)

                lowPart =
                    if int64.lower < 0 then
                        UInt64.fromInt (int64.lower + xmrConversionConstant)

                    else
                        UInt64.fromInt int64.lower
            in
            UInt64.add highPart lowPart

        -- Convert UInt64 to Float
        fullFloat : Float
        fullFloat =
            UInt64.toFloat fullUInt64

        -- Convert piconero to XMR
        xmrAmount : Float
        xmrAmount =
            fullFloat / 1000000000000

        -- Ensure proper rounding to 11 decimal places
        scale : Float
        scale =
            toFloat (10 ^ 11)

        roundedXmr : Float
        roundedXmr =
            toFloat (round (xmrAmount * scale)) / scale
    in
    String.fromFloat roundedXmr
