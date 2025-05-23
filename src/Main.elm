port module Main exposing (FromMainToSchedule, JsMessage, MessageTypeJs(..), Model, Msg(..), OperationEventMsg, Page(..), PageTypeJs(..), QueryParams, QueryStringParser, Route(..), Status(..), codeParser, connectionStatusView, errorMessages, footerContent, fromJsonToString, gotAvailableBalances, gotCodeFromUrl, init, isActive, isValidXMRAddress, isXMRWalletConnected, jsMessageDecoder, justmsgFieldFromJsonDecoder, main, menu, msgFromMain, navLinks, okButton, only2Decimals, receiveMsgsFromJs, sendVersionRequest, setSplashHavenoVersion, subscriptions, toAccounts, toConnect, toDonate, toFunds, toMarket, toPortfolio, toPricing, toSell, toSplash, toSupport, topLogo, update, updateUrl, urlAsPageParser, urlDecoder, view, viewErrors)

-- NOTE: A working Main module that handles URLs and maintains a conceptual Page - i.e. makes an SPA possible
-- NOTE: exposing Url exposes a different type of Url to
-- just import Url

import Browser
import Browser.Navigation as Nav
import Comms.CustomGrpc
import Data.AddressValidity as R
import Erl
import Grpc
import Html
import Html.Attributes as Attr
import Html.Events exposing (onClick)
import Json.Decode
import Json.Decode.Pipeline exposing (required)
import Json.Encode
import Pages.Accounts
import Pages.Buy
import Pages.Connect exposing (Model)
import Pages.Donate
import Pages.Funds
import Pages.Market
import Pages.Portfolio
import Pages.Sell
import Pages.Splash
import Pages.Support
import Parser
import Process
import Proto.Io.Haveno.Protobuffer as Protobuf exposing (..)
import Proto.Io.Haveno.Protobuffer.GetVersion exposing (getVersion)
import Proto.Io.Haveno.Protobuffer.Offers as Offers
import Proto.Io.Haveno.Protobuffer.Wallets as Wallets
import Task
import Time
import Types.DateType exposing (DateTime)
import Url exposing (Protocol(..), Url)
import Url.Parser exposing (oneOf, s)
import Url.Parser.Query as Query
import Utils.MyUtils exposing (gotBalancesReplyAsTypeAlias)



{- -- NOTE: String here is coming from the flag in index.html. Change String to
   whatever type the flag is if necessary
-}
{- -- NOTE: All the functions in Browser.application must be assigned functions that match
   their annotations (hover 'application' to see)

   'Model' is the one on this page. Can't mix with 'Model' on other pages
-}
-- NOTE: Url.Url here comes from flags


main : Program String Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = ChangedUrl
        , onUrlRequest = ClickedLink
        }



-- NAV: Model
-- NOTE: define a Page type to represent the different states
-- we care about, and add it to Model .
-- NOTE: Changes like displaying some links as active depending on the current page—
-- requires a change to Model, not just view


type alias Model =
    { page : Page
    , key : Nav.Key
    , flag : Url
    , time : Time.Posix
    , zone : Maybe Time.Zone
    , errors : List String
    , isApiConnected : Bool
    , version : String
    , accountsDataFromJs : List String
    , initialized : Bool
    , isMenuOpen : Bool
    , balances : Maybe Protobuf.BalancesInfo
    , offersReply : Maybe Protobuf.GetOffersReply
    , primaryaddress : String
    , status : Status
    , timeoutId : Maybe Time.Posix
    , pword : String
    }



-- NAV: Init
-- NOTE: This is used to initialize the model in init and spec tests
-- WARN: The app sees Url.Url as 'elm-spec' when testing


init : String -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flag _ key =
    let
        decodedJsonFromSetupElmjs =
            case Json.Decode.decodeString urlDecoder flag of
                Ok urLAfterFlagDecode ->
                    { urLAfterFlagDecode | path = "/" }

                Err _ ->
                    Url.Url Https "haveno-web-dev.netlify.app" Nothing "" Nothing Nothing

        -- NOTE: Initialize the whole model here so that can assign Nav.Key
        initialModel =
            { page = SplashPage Pages.Splash.initialModel
            , flag = decodedJsonFromSetupElmjs
            , key = key
            , time = Time.millisToPosix 0
            , zone = Nothing -- Replace with the actual time zone if available
            , errors = []
            , isApiConnected = False
            , version = "No Haveno version available"
            , accountsDataFromJs = [ "" ]
            , initialized = False
            , isMenuOpen = False
            , balances = Just Protobuf.defaultBalancesInfo
            , offersReply = Just Protobuf.defaultGetOffersReply
            , primaryaddress = ""
            , status = Loading
            , timeoutId = Nothing
            , pword = ""
            }
    in
    -- NOTE: We go via the SplashRoute, but arrive on the Accounts page, as per initial model
    updateUrl decodedJsonFromSetupElmjs initialModel



-- NAV: Msg
-- NOTE: Each variant here is a constructor for the Msg type.
-- NOTE: The 'Got' Msgs are the sub pages talking to Main
-- The to<FunctionName> functions are Main talking to the sub pages


type Msg
    = ClickedLink Browser.UrlRequest
      -- NOTE: the type of GotSplashMsg is (Pages.Splash.Msg -> Msg)
    | GotSplashMsg Pages.Splash.Msg
    | GotSellMsg Pages.Sell.Msg
    | GotPortfolioMsg Pages.Portfolio.Msg
    | GotFundsMsg Pages.Funds.Msg
    | GotSupportMsg Pages.Support.Msg
    | GotBuyMsg Pages.Buy.Msg
    | GotMarketMsg Pages.Market.Msg
    | GotAccountsMsg Pages.Accounts.Msg
    | GotDonateMsg Pages.Donate.Msg
    | GotConnectMsg Pages.Connect.Msg
    | ChangedUrl Url.Url
    | ReceivedFromJs Json.Decode.Value
    | GotVersion (Result Grpc.Error GetVersionReply)
    | ToggleMenu
    | GotBalances (Result Grpc.Error Protobuf.GetBalancesReply)
    | GotOffers (Result Grpc.Error Protobuf.GetOffersReply)
    | GotXmrPrimaryAddress (Result Grpc.Error Protobuf.GetXmrPrimaryAddressReply)
    | Timeout



-- ...
-- NAV: Update
-- NOTE: See GotHardwareMsg for example of how data that depended on Main (due to use of subscription)
-- was handled before sending the page model where it could be used
-- NOTE: Roughly ordered in terms of importance


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        -- Assume success after applying
        -- NOTE: GotVersion also used as an API Connection indicator
        GotVersion (Ok versionResp) ->
            let
                verResp =
                    case versionResp of
                        { version } ->
                            version

                updatedModel =
                    { model | isApiConnected = True, version = verResp, status = Loaded }
            in
            -- REVIEW: Correct way to go to Accounts?
            toAccounts updatedModel (Pages.Accounts.init ())

        GotVersion (Err _) ->
            ( { model | version = "Error obtaining version", isApiConnected = False }, Cmd.none )

        GotXmrPrimaryAddress (Ok primaryAddresponse) ->
            let
                updatedModel =
                    { model | isApiConnected = True, primaryaddress = primaryAddresponse.primaryAddress, status = Loaded }
            in
            toAccounts updatedModel
                (Pages.Accounts.init ())

        GotXmrPrimaryAddress (Err _) ->
            ( model, Cmd.none )

        GotBalances (Ok response) ->
            let
                updatedModel =
                    { model | balances = response.balances, status = Loaded }
            in
            ( updatedModel, Cmd.none )

        GotBalances (Err _) ->
            ( model, Cmd.none )

        GotOffers (Ok response) ->
            let
                updatedModel =
                    { model | offersReply = Just { offers = response.offers }, status = Loaded }
            in
            ( updatedModel, Cmd.none )

        GotOffers (Err _) ->
            ( { model | errors = model.errors ++ [ "GotOffers error " ] }, Cmd.none )

        ClickedLink urlRequest ->
            case urlRequest of
                Browser.External href ->
                    ( model, Nav.load href )

                -- NOTE: simpleMenu has internal hrefs, so updates here
                Browser.Internal url ->
                    let
                        modelWithMenuClosed =
                            { model | isMenuOpen = False }
                    in
                    -- NOTE: If site isn't explicitly branched like
                    -- this, it is parsed as an internal link. We
                    -- need to load it as if it were an external link
                    -- (using Nav.load) for it to work on production server
                    -- this isn't currently used and points nowhere
                    case Url.toString url of
                        "https://haveno-web-dev.netlify.app//" ->
                            ( modelWithMenuClosed, Nav.load (Url.toString url) )

                        -- NOTE: Nav.pushUrl only manipulates the address bar
                        -- and triggers ChangedUrl
                        _ ->
                            updateUrl url modelWithMenuClosed

        -- NOTE: translate URL (e.g. Back btn) into a Page and store it in our Model
        -- this is the place to handle transitions. This is where we can get more fancy
        -- with clicked links (use Erl package on the links e.g. Erl.extractPath)
        {- It looks like we're supposed to use this instead of Browser.onUrlChange in Subscriptions (as per older docs) -}
        -- NOTE: The only way this is triggered currently is by the js menu code clicks
        ChangedUrl url ->
            updateUrl url model

        ToggleMenu ->
            ( { model | isMenuOpen = not model.isMenuOpen }, Cmd.none )

        -- NAV: ReceivedFromJs
        -- NOTE: This is where we can branch and handle data according to whichever page js intends
        -- it's message to reach
        ReceivedFromJs message ->
            case Json.Decode.decodeValue jsMessageDecoder message of
                Ok jsMsg ->
                    case jsMsg.page of
                        AccountsPageJs ->
                            case jsMsg.typeOfMsg of
                                EncryptCryptoAccountMsgRequestJs ->
                                    case jsMsg.currency of
                                        Pages.Accounts.BTC ->
                                            case model.page of
                                                AccountsPage accountsModel ->
                                                    toAccounts model (Pages.Accounts.update (Pages.Accounts.EncryptNewBTCAddress (Maybe.withDefault "No BTC address" (List.head jsMsg.accountsData))) accountsModel)

                                                _ ->
                                                    ( model, Cmd.none )

                                        -- TODO: Handle other currencies
                                        Pages.Accounts.AllCrypto ->
                                            case model.page of
                                                AccountsPage accountsModel ->
                                                    toAccounts model (Pages.Accounts.update (Pages.Accounts.EncryptNewBTCAddress (Maybe.withDefault "No BTC address" (List.head jsMsg.accountsData))) accountsModel)

                                                _ ->
                                                    ( model, Cmd.none )

                                DecryptedCryptoAccountsResponseJs ->
                                    case jsMsg.currency of
                                        Pages.Accounts.BTC ->
                                            case model.page of
                                                AccountsPage accountsModel ->
                                                    toAccounts { model | accountsDataFromJs = jsMsg.accountsData } (Pages.Accounts.update (Pages.Accounts.DecryptedBTCAddresses jsMsg.accountsData) accountsModel)

                                                SellPage sellModel ->
                                                    toSell { model | accountsDataFromJs = jsMsg.accountsData } (Pages.Sell.update Pages.Sell.NoOp sellModel)

                                                _ ->
                                                    ( model, Cmd.none )

                                        Pages.Accounts.AllCrypto ->
                                            case model.page of
                                                AccountsPage accountsModel ->
                                                    toAccounts { model | accountsDataFromJs = jsMsg.accountsData } (Pages.Accounts.update (Pages.Accounts.AllCryptoCurrencies jsMsg.accountsData) accountsModel)

                                                _ ->
                                                    ( model, Cmd.none )

                                _ ->
                                    ( { model | errors = model.errors ++ [ "Third Case", "in ReceivedFromJs" ] }, Cmd.none )

                        _ ->
                            ( { model | errors = model.errors ++ [ "Second Case", "Not accounts page" ] }, Cmd.none )

                Err errmsg ->
                    ( { model | errors = model.errors ++ [ "First Case", Json.Decode.errorToString errmsg ] }, Cmd.none )

        GotSplashMsg dashboardMsg ->
            case model.page of
                SplashPage dashboard ->
                    let
                        updatedSplashModel =
                            { dashboard | version = model.version }
                    in
                    toSplash model (Pages.Splash.update dashboardMsg updatedSplashModel)

                _ ->
                    ( model, Cmd.none )

        GotSellMsg sellMsg ->
            case model.page of
                SellPage sell ->
                    toSell model (Pages.Sell.update sellMsg sell)

                _ ->
                    ( model, Cmd.none )

        GotPortfolioMsg termsMsg ->
            case model.page of
                PortfolioPage terms ->
                    toPortfolio model (Pages.Portfolio.update termsMsg terms)

                _ ->
                    ( model, Cmd.none )

        GotFundsMsg fundsMsg ->
            case model.page of
                FundsPage fundsModel ->
                    case fundsMsg of
                        Pages.Funds.ToggleFundsVisibility ->
                            let
                                newFundsModel =
                                    { fundsModel | primaryaddress = model.primaryaddress }
                            in
                            toFunds model (Pages.Funds.update fundsMsg newFundsModel)

                        Pages.Funds.ClickedGotNewSubaddress ->
                            let
                                newFundsModel =
                                    { fundsModel | currentView = Pages.Funds.SubAddressView, status = Pages.Funds.Loaded }
                            in
                            toFunds model (Pages.Funds.update fundsMsg newFundsModel)

                        _ ->
                            toFunds model (Pages.Funds.update fundsMsg fundsModel)

                _ ->
                    ( model, Cmd.none )

        GotSupportMsg supportMsg ->
            case model.page of
                SupportPage support ->
                    toSupport model (Pages.Support.update supportMsg support)

                _ ->
                    ( model, Cmd.none )

        GotBuyMsg pricingMsg ->
            case model.page of
                BuyPage pricing ->
                    toPricing model (Pages.Buy.update pricingMsg pricing)

                _ ->
                    ( model, Cmd.none )

        GotMarketMsg aboutMsg ->
            case model.page of
                MarketPage about ->
                    toMarket model (Pages.Market.update aboutMsg about)

                _ ->
                    ( model, Cmd.none )

        GotAccountsMsg accountsMsg ->
            case model.page of
                AccountsPage accountsModel ->
                    let
                        ( updatedAccountsModel, accountsCmd ) =
                            Pages.Accounts.update accountsMsg accountsModel
                    in
                    ( { model | page = AccountsPage updatedAccountsModel }
                    , Cmd.map GotAccountsMsg accountsCmd
                    )

                _ ->
                    ( model, Cmd.none )

        GotDonateMsg donateMsg ->
            case model.page of
                DonatePage donate ->
                    toDonate model (Pages.Donate.update donateMsg donate)

                _ ->
                    ( model, Cmd.none )

        GotConnectMsg connectMsg ->
            case model.page of
                ConnectPage connect ->
                    toConnect model (Pages.Connect.update connectMsg connect)

                _ ->
                    ( model, Cmd.none )

        Timeout ->
            if not model.isApiConnected then
                toConnect model (Pages.Connect.init ())

            else
                ( model, Cmd.none )



-- NAV: View


view : Model -> Browser.Document Msg
view model =
    -- NAV : View Page Content
    -- TODO: Make this content's naming conventions closely match the
    -- related css.
    -- NOTE: 'pagetitle' or 'title' in pages is not the same as 'title' in the document
    { title = "Haveno-Web"
    , body =
        case model.status of
            Loading ->
                [ Html.div
                    [ Attr.class "split-col"
                    , Attr.class "spinner"
                    ]
                    []
                ]

            Loaded ->
                [ viewContainer model
                , Html.div [ Attr.class "main-nav-flex-container" ] [ menu model ]
                , Html.div [ Attr.class "contentByPage" ] [ contentByPage model ]
                , Html.div [ Attr.class "footerContent" ] [ footerContent model ]
                ]
    }


contentByPage : Model -> Html.Html Msg
contentByPage model =
    {- -- NOTE:  We are 'delegating' views to Splash.view and Sell.view etc.
       Something similar can be done with subscriptions if required
    -}
    case model.page of
        SplashPage dashboard ->
            Pages.Splash.view dashboard
                -- NOTE: Go from Html Pages.Splash.Msg value to Html Msg value using Html.map.
                {- Conceptually, what Html.map is doing for us here is wrapping a Pages.Splash.Msg or
                   Pages.Sell.Msg in a Main.Msg , because Main.update knows how to deal with only
                   Main.Msg values. Those wrapped messages will prove useful later when we handle
                   these new messages inside update .

                   We're actually using Pages.Splash.view
                   -- NOTE: Html.map is essential to wrap the Splash.elm view and convert Splash.Msg into Main.Msg
                -}
                |> Html.map GotSplashMsg

        SellPage dashboard ->
            Pages.Sell.view dashboard
                |> Html.map GotSellMsg

        PortfolioPage terms ->
            Pages.Portfolio.view terms
                |> Html.map GotPortfolioMsg

        FundsPage privacy ->
            Pages.Funds.view privacy
                |> Html.map GotFundsMsg

        SupportPage support ->
            Pages.Support.view support
                |> Html.map GotSupportMsg

        BuyPage buy ->
            Pages.Buy.view buy
                |> Html.map GotBuyMsg

        MarketPage market ->
            Pages.Market.view market
                |> Html.map GotMarketMsg

        AccountsPage accounts ->
            Pages.Accounts.view accounts
                |> Html.map GotAccountsMsg

        DonatePage donate ->
            Pages.Donate.view donate
                |> Html.map GotDonateMsg

        ConnectPage connect ->
            Pages.Connect.view connect
                |> Html.map GotConnectMsg


viewContainer : Model -> Html.Html Msg
viewContainer model =
    Html.div [ Attr.class "dashboard-container" ]
        [ Html.div [ Attr.class "item1" ] [ topLogo ]
        , Html.div [ Attr.class "item2" ] [ connectionStatusView model ]
        , Html.div [ Attr.class "item3" ] [ dashboardContainer model ]
        ]



-- TYPES
-- NOTE: Splash.elm is the equivalent of PhotoFolders.elm or 'Folders' in the code
{- -- NOTE: Two data structures for use cases that were similar but ended up NOT being the same. If you're
   getting complicated knock-on effects consider that you may need to split data structures like this.
   Here prompted by 'What’s the problem here? Why isn’t Page working well
   everywhere it used to, now that we’ve expanded it to hold onto more information?'
   Page was an 'overloaded' data structure
-}
{- -- NOTE: Representing a parsed route. Similar, but NOT the same as Page -}
-- NAV: Route
-- TODO: Complete the AllCrypto as '...Route'


type Route
    = SplashRoute
    | SellRoute
    | PortfolioRoute
    | FundsRoute
    | Support
    | Buy
    | Market
    | AccountsRoute
    | DonateRoute
    | ConnectRoute



-- NOTE: Storing different models. Similar, but NOT the same as Route


type
    Page
    -- NOTE: Be able to access the model in the selected page so that it can
    -- be passed to the view for that page:
    = SplashPage Pages.Splash.Model
    | SellPage Pages.Sell.Model
    | PortfolioPage Pages.Portfolio.Model
    | FundsPage Pages.Funds.Model
    | SupportPage Pages.Support.Model
    | BuyPage Pages.Buy.Model
    | MarketPage Pages.Market.Model
    | AccountsPage Pages.Accounts.Model
    | DonatePage Pages.Donate.Model
    | ConnectPage Pages.Connect.Model



--| SetAuthorizationCode (Maybe String)


type alias QueryStringParser a =
    Query.Parser a



-- NAV: Json decoders


pageTypeJsDecoder : Json.Decode.Decoder PageTypeJs
pageTypeJsDecoder =
    Json.Decode.string
        |> Json.Decode.andThen
            (\pageReferencedByJs ->
                case pageReferencedByJs of
                    "AccountsPage" ->
                        Json.Decode.succeed AccountsPageJs

                    "SplashPage" ->
                        Json.Decode.succeed SplashPageJs

                    "SellPage" ->
                        Json.Decode.succeed SellPageJs

                    "PortfolioPage" ->
                        Json.Decode.succeed PortfolioPageJs

                    "FundsPage" ->
                        Json.Decode.succeed FundsPageJs

                    "SupportPage" ->
                        Json.Decode.succeed SupportPageJs

                    "BuyPage" ->
                        Json.Decode.succeed BuyPageJs

                    "MarketPage" ->
                        Json.Decode.succeed MarketPageJs

                    "DonatePage" ->
                        Json.Decode.succeed DonatePageJs

                    "ConnectPage" ->
                        Json.Decode.succeed ConnectPageJs

                    _ ->
                        Json.Decode.fail ("Unknown page type: " ++ pageReferencedByJs)
            )


messageTypeJsDecoder : Json.Decode.Decoder MessageTypeJs
messageTypeJsDecoder =
    Json.Decode.string
        |> Json.Decode.andThen
            (\msgType ->
                case msgType of
                    "encryptCryptoAccountMsgRequest" ->
                        Json.Decode.succeed EncryptCryptoAccountMsgRequestJs

                    "decryptedCryptoAccountsResponse" ->
                        Json.Decode.succeed DecryptedCryptoAccountsResponseJs

                    "ElmReady" ->
                        Json.Decode.succeed ElmReady

                    _ ->
                        Json.Decode.succeed UnknownMessageJs
            )


currencyJsDecoder : Json.Decode.Decoder Pages.Accounts.CryptoAccount
currencyJsDecoder =
    Json.Decode.string
        |> Json.Decode.andThen
            (\currency ->
                case currency of
                    "BTC" ->
                        Json.Decode.succeed Pages.Accounts.BTC

                    "AllCrypto" ->
                        Json.Decode.succeed Pages.Accounts.AllCrypto

                    _ ->
                        Json.Decode.fail ("Unknown currency: " ++ currency)
            )



-- Decode the URL from JSON-encoded string


jsMessageDecoder : Json.Decode.Decoder JsMessage
jsMessageDecoder =
    Json.Decode.succeed JsMessage
        |> required "page" pageTypeJsDecoder
        |> required "typeOfMsg" messageTypeJsDecoder
        |> required "accountsData" (Json.Decode.list Json.Decode.string)
        |> required "currency" currencyJsDecoder


justmsgFieldFromJsonDecoder : Json.Decode.Decoder OperationEventMsg
justmsgFieldFromJsonDecoder =
    Json.Decode.map OperationEventMsg
        (Json.Decode.field "operationEventMsg" Json.Decode.string)


urlDecoder : Json.Decode.Decoder Url
urlDecoder =
    Json.Decode.string
        |> Json.Decode.andThen
            (\s ->
                case Url.fromString s of
                    Just url ->
                        Json.Decode.succeed url

                    Nothing ->
                        Json.Decode.fail "Invalid URL"
            )



-- NOTE: Now that we support the Page type, we’re all set up to parse some URLs into it:
-- NOTE: Parsers are functions that take an input string and
-- try to extract a specific piece of information from it,
-- or to verify that it has a certain structure.
-- Similarly to the way a JSON Decoder value describes how to translate a JSON string
-- into a different type, this Parser value describes how to translate a URL into a Page.
-- So we're asking the parser if it recognizes the string in the URL.
-- NOTE: Where we have Page type now, we could have used 'Route' type name instead
-- NOTE: Parser helps us to transform from one type (URL) to another (an Elm Page)
-- NOTE: This parser transforms Strings into Pages
-- NAV: Parser
-- NOTE: This parser is only used by updateUrl


urlAsPageParser : Url.Parser.Parser (Route -> a) a
urlAsPageParser =
    -- NOTE: The </> operator expects a Parser value on each side, and the
    -- Parser.s function turns a hardcoded string into a parser for that string
    -- NOTE: Without this call to Parser.map , our Parser
    -- would output a plain old String whenever it succeeds. Thanks to Parser.map , that
    -- String will instead be passed along to eg. Sell , so the resulting parser will
    -- output a Sell Page we can store in our model.
    -- (Route -> a) is the type of the function that the parser produces.
    -- It is a function that takes a Route value as input and produces a value of type a.
    -- If a Route value representing a Page is sent as input to the parser function,
    -- the resulting 'a' will be a Page (or whatever type Page represents in your specific code).
    oneOf
        [ Url.Parser.map SplashRoute (s "index.html")
        , Url.Parser.map SplashRoute Url.Parser.top
        , Url.Parser.map SellRoute (Url.Parser.s "sell")
        , Url.Parser.map PortfolioRoute (Url.Parser.s "portfolio")
        , Url.Parser.map FundsRoute (Url.Parser.s "funds")
        , Url.Parser.map Support (Url.Parser.s "support")
        , Url.Parser.map Buy (Url.Parser.s "buy")
        , Url.Parser.map Market (Url.Parser.s "market")
        , Url.Parser.map AccountsRoute (Url.Parser.s "accounts")
        , Url.Parser.map DonateRoute (Url.Parser.s "donate")
        , Url.Parser.map ConnectRoute (Url.Parser.s "connect")
        ]


type alias QueryParams =
    { code : Maybe String

    --, location : Maybe String
    --, accountsServer : Maybe String
    }


codeParser : Query.Parser (Maybe String)
codeParser =
    Query.string "code"



-- Define a parser for the query parameters in the URL
{- -- NOTE: The docs specify the 'string' function. Make sure to realize the 'string' function
   is in Parser.Query.string. So Parser.string won't work
-}
-- queryParser : QueryStringParser (Maybe String)
-- queryParser =
--     Query.string "code"
{- -- NOTE: Getting Model.Splash and Model.Sell values exactly where we need them.
   Replaces (eventually) urlToPage used in most of the book: "KEEPING
   BOTH MODEL AND CMD FOR INIT
   Without having their init commands run, our pages’ initial HTTP requests aren’t
   being sent to the server to load the pages’ initial data."
   Actually, we don't e.g. do Http.get currently, but this is the right pattern for future ref.
-}
-- NOTE: Data you want to pass fom Main to another module's model can be done in the to<functions>
-- updateUrl is a helper function to init
-- NAV: UpdateUrl - update sub-modules from Main AND update Main from the sub-modules
-- NOTE: Triggered by ChangedUrl


updateUrl : Url.Url -> Model -> ( Model, Cmd Msg )
updateUrl url model =
    -- NOTE: The urlAsPageParser here describes how to translate a URL into a Page.
    -- Parser.parse is a function that uses the description to do it.
    let
        urlMinusQueryStr =
            { url | query = Just "" }
    in
    -- NOTE: Parse the url to get a ROUTE type
    case Url.Parser.parse urlAsPageParser urlMinusQueryStr of
        Just AccountsRoute ->
            Pages.Accounts.init ()
                |> toAccounts model

        Just SplashRoute ->
            Pages.Splash.init { time = Nothing, havenoVersion = model.version }
                |> toSplash model

        Just SellRoute ->
            Pages.Sell.init ()
                |> toSell model

        Just PortfolioRoute ->
            Pages.Portfolio.init ()
                |> toPortfolio model

        Just FundsRoute ->
            Pages.Funds.init ""
                |> toFunds model

        Just Support ->
            Pages.Support.init ()
                |> toSupport model

        Just Buy ->
            Pages.Buy.init ()
                |> toPricing model

        Just Market ->
            Pages.Market.init ()
                |> toMarket model

        Just DonateRoute ->
            Pages.Donate.init ()
                |> toDonate model

        Just ConnectRoute ->
            Pages.Connect.init ()
                |> toConnect model

        Nothing ->
            Pages.Splash.init { time = Nothing, havenoVersion = model.version }
                |> toSplash model



-- NOTE: This is where we can update Pages's model
{- Let's break down the `toPages` function step by step:

   1. **Function Name and Purpose**:
      - Its job is to translate information from the `Pages` module into a format that the main application (`Main`) can understand.

   2. **Input Parameters**:
      - It takes two inputs:
        - `model`: Information about the current state of the application in Main's model.
        - `(Pages, cmd)`: Information from the `Pages` module, including Pages data and commands.

   3. **What it Does**:
      - It takes the existing Main `model` and updates it to include the `Pages` data, indicating that the current page is the "Pages" page.
      - It translates the commands (`cmd`) coming from the `Pages` module to a format that `Main` understands.

   4. **Output**:
      - It produces two things:
        - An updated Main `model` that now includes the `Pages` data and indicates the current page is the "Pages" page.
        - Commands that have been translated to a format that `Main` can use.

   In simpler terms, this function helps the main part of the app (`Main`) understand and work with the Pages information provided by the `Pages` module.
   It's like translating a message into a language that both parts of the app can understand and use effectively.
-}


toSplash : Model -> ( Pages.Splash.Model, Cmd Pages.Splash.Msg ) -> ( Model, Cmd Msg )
toSplash model ( dashboard, cmd ) =
    ( { model | page = SplashPage dashboard }
      -- NOTE: Cmd.map is a way to manipulate the result of a command
    , Cmd.batch
        [ sendVersionRequest Protobuf.defaultGetVersionRequest
        , gotAvailableBalances
        , gotOffers
        , Comms.CustomGrpc.gotPrimaryAddress |> Grpc.toCmd GotXmrPrimaryAddress
        , startTimeout
        , notifyJsReady
        ]
    )


toSell : Model -> ( Pages.Sell.Model, Cmd Pages.Sell.Msg ) -> ( Model, Cmd Msg )
toSell model ( sell, cmd ) =
    ( { model | page = SellPage { sell | listOfExistingCryptoAccounts = model.accountsDataFromJs, offersReply = model.offersReply } }
      {- -- NOTE: In your example, Cmd.map GotSellMsg cmd, GotSellMsg is indeed a function,
         but you're not explicitly applying it. Cmd.map will take care of applying GotSellMsg to each value that the command produces.
      -}
    , Cmd.map GotSellMsg cmd
    )


toPortfolio : Model -> ( Pages.Portfolio.Model, Cmd Pages.Portfolio.Msg ) -> ( Model, Cmd Msg )
toPortfolio model ( portfolio, cmd ) =
    ( { model | page = PortfolioPage portfolio }
    , Cmd.map GotPortfolioMsg cmd
    )


toFunds : Model -> ( Pages.Funds.Model, Cmd Pages.Funds.Msg ) -> ( Model, Cmd Msg )
toFunds model ( funds, cmd ) =
    let
        newFundsModel =
            { funds | balances = model.balances }
    in
    ( { model | page = FundsPage newFundsModel }
    , Cmd.map GotFundsMsg cmd
    )


toSupport : Model -> ( Pages.Support.Model, Cmd Pages.Support.Msg ) -> ( Model, Cmd Msg )
toSupport model ( support, cmd ) =
    ( { model | page = SupportPage support }
    , Cmd.map GotSupportMsg cmd
    )


toPricing : Model -> ( Pages.Buy.Model, Cmd Pages.Buy.Msg ) -> ( Model, Cmd Msg )
toPricing model ( pricing, cmd ) =
    ( { model | page = BuyPage pricing }
    , Cmd.map GotBuyMsg cmd
    )


toMarket : Model -> ( Pages.Market.Model, Cmd Pages.Market.Msg ) -> ( Model, Cmd Msg )
toMarket model ( market, cmd ) =
    ( { model | page = MarketPage market }
    , Cmd.map GotMarketMsg cmd
    )


toAccounts : Model -> ( Pages.Accounts.Model, Cmd Pages.Accounts.Msg ) -> ( Model, Cmd Msg )
toAccounts model ( accounts, cmd ) =
    ( { model | page = AccountsPage { accounts | balances = model.balances } }
      -- NOTE: Cmd.map is a way to manipulate the result of a command
    , Cmd.map GotAccountsMsg cmd
    )


toDonate : Model -> ( Pages.Donate.Model, Cmd Pages.Donate.Msg ) -> ( Model, Cmd Msg )
toDonate model ( donate, cmd ) =
    ( { model | page = DonatePage donate }
    , Cmd.map GotDonateMsg cmd
    )


toConnect : Model -> ( Pages.Connect.Model, Cmd Pages.Connect.Msg ) -> ( Model, Cmd Msg )
toConnect model ( connect, cmd ) =
    ( { model | page = ConnectPage { connect | havenoConnected = model.isApiConnected, walletConnected = isXMRWalletConnected model }, status = Loaded }
    , Cmd.map GotConnectMsg cmd
    )



-- NAV : Types


type PageTypeJs
    = AccountsPageJs
    | SplashPageJs
    | SellPageJs
    | PortfolioPageJs
    | FundsPageJs
    | SupportPageJs
    | BuyPageJs
    | MarketPageJs
    | DonatePageJs
    | ConnectPageJs


type MessageTypeJs
    = EncryptCryptoAccountMsgRequestJs
    | DecryptedCryptoAccountsResponseJs
    | ElmReady
    | UnknownMessageJs


type Status
    = Loading
    | Loaded



-- NAV: Type aliases


type alias JsMessage =
    { page : PageTypeJs
    , typeOfMsg : MessageTypeJs
    , accountsData : List String
    , currency : Pages.Accounts.CryptoAccount
    }


type alias OperationEventMsg =
    { operationEventMsg : String
    }


type alias FromMainToSchedule =
    { time : Maybe DateTime
    , flagUrl : Url.Url
    }



-- NAV: gRPC commands
-- NOTE: This causes 'Error: Uncaught [TypeError: First argument to DataView constructor must be an ArrayBuffer]' in test
-- whilst still passing the test (cos response is stubbed). Issue has been logged here: -- REF: https://github.com/brian-watkins/elm-spec/issues/75


sendVersionRequest : GetVersionRequest -> Cmd Msg
sendVersionRequest request =
    let
        grpcRequest =
            Grpc.new getVersion request
                |> Grpc.addHeader "password" "apitest"
                -- NOTE: "Content-Type" "application/grpc-web+proto" is already part of the request
                -- NOTE: this is referencing the user1_listener via Envoy - in dev that is haveno-ts/config/envoy.test.yaml
                |> Grpc.setHost "http://localhost:8080"
    in
    Grpc.toCmd GotVersion grpcRequest


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


gotOffers : Cmd Msg
gotOffers =
    let
        grpcRequest =
            Grpc.new Offers.getOffers Protobuf.defaultGetOffersRequest
                |> Grpc.addHeader "password" "apitest"
                -- NOTE: "Content-Type" "application/grpc-web+proto" is already part of the request
                |> Grpc.setHost "http://localhost:8080"
    in
    Grpc.toCmd GotOffers grpcRequest



-- NAV: Helper functions


only2Decimals : String -> String
only2Decimals str =
    case String.split "." str of
        [ intPart, decPart ] ->
            let
                truncatedDecPart =
                    String.left 2 decPart
            in
            intPart ++ "." ++ truncatedDecPart

        _ ->
            str



-- NOTE: For prod timeout can be 5 *


startTimeout : Cmd Msg
startTimeout =
    Process.sleep (1 * 1000) |> Task.perform (\_ -> Timeout)



-- TODO: Improve the validation here:isXMRWalletConnected : Model -> Bool


isXMRWalletConnected : { a | primaryaddress : String } -> Bool
isXMRWalletConnected model =
    if not <| model.primaryaddress == "" then
        True

    else
        False


connectionStatusView : Model -> Html.Html Msg
connectionStatusView model =
    Html.div [ Attr.class "connection-status", Attr.id "connectionStatus" ]
        [ Html.div
            [ Attr.class
                (if isXMRWalletConnected model && model.isApiConnected then
                    "status-dot green"

                 else
                    "status-dot red"
                )
            ]
            []
        , Html.text <|
            if isXMRWalletConnected model && model.isApiConnected then
                "Connected"

            else if not <| isXMRWalletConnected model then
                "Wallet not connected"

            else
                "Haveno node not connected"

        -- Link to Connect Page
        , Html.a [ Attr.href "/connect", Attr.class "status-link" ] [ Html.text "Fix" ]
        ]


dashboardContainer : Model -> Html.Html Msg
dashboardContainer model =
    Html.div [ Attr.class "dashboard-panel" ]
        [ Html.div [ Attr.class "dashboard-section" ]
            [ Html.div [ Attr.class "large-text", Attr.id "dashboard-container-xmrAvailableBalance" ] [ Html.text <| (only2Decimals <| Pages.Funds.xmrAvailableBalanceAsString model.balances) ++ " XMR" ]
            , Html.div [ Attr.class "small-text" ] [ Html.text "Available Balance" ]
            ]
        , Html.div [ Attr.class "dashboard-section" ]
            [ Html.div [ Attr.class "large-text", Attr.id "pendingBalance" ] [ Html.text <| (gotBalancesReplyAsTypeAlias <| model.balances).pending ++ " XMR" ]
            , Html.div [ Attr.class "small-text" ] [ Html.text "Pending" ]
            ]
        , Html.div [ Attr.class "dashboard-section" ]
            [ Html.div [ Attr.class "large-text", Attr.id "reservedOfferBalance" ] [ Html.text <| (gotBalancesReplyAsTypeAlias <| model.balances).reserved ++ " XMR" ]
            , Html.div [ Attr.class "small-text" ] [ Html.text "Reserved" ]
            ]
        , Html.div [ Attr.class "dashboard-section" ]
            [ Html.div [ Attr.class "large-text" ] [ Html.text "XMR/USD: " ]
            , Html.div [ Attr.class "small-text" ] [ Html.text "Market price by Haveno Price Index" ]
            ]
        ]


setSplashHavenoVersion : Pages.Splash.Model -> Model -> Pages.Splash.Model
setSplashHavenoVersion dashboardModel model =
    { dashboardModel | version = model.version }


isValidXMRAddress : String -> Bool
isValidXMRAddress str =
    case Parser.run R.validXMRAddressParser str of
        Ok _ ->
            True

        Err _ ->
            False



-- HACK: Using string ops instead of parser, due to Url etc. parser difficulties.let
-- TODO: Create own url parser to eventually replace this:


fromJsonToString : Json.Encode.Value -> String
fromJsonToString value =
    Json.Encode.encode 0 value


gotCodeFromUrl : Url.Url -> Maybe String
gotCodeFromUrl url =
    {- -- NOTE: Converting from a Url package to Erl package url due to difficulties working with Url.Query package -}
    Just <| String.join "" (Erl.getQueryValuesForKey "code" <| Erl.parse <| Url.toString url)



-- NAV: Subscriptions
-- NOTE: ReceivedFromJs has no String here cos receiveMsgsFromJs wants a function that takes a String
-- and returns a Msg. This is what ReceivedFromJs was 'constructed' to be


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ receiveMsgsFromJs ReceivedFromJs
        ]



-- NAV: Ports
-- NOTE: once defined here they can be used in js with app.ports.
-- <portname>.send/subscribe(<data>)
-- WARN: Use the port(s) somewhere in the code or it won't initialize on document load


port msgFromMain : Json.Encode.Value -> Cmd msg



-- XXX: Don't use receiveMsgsFromJs to send msgs to JS


port receiveMsgsFromJs : (Json.Decode.Value -> msg) -> Sub msg



{- -- NOTE: This type can be Html.Html msg instead
   of Html.Html Msg because footerContent
   has no event handlers.
-}


topLogo : Html.Html msg
topLogo =
    Html.div
        []
        [ Html.img
            [ Attr.src "assets/resources/images/logo-splash100X33.png"

            -- NOTE: always define the width and height of images. This reduces flickering,
            -- because the browser can reserve space for the image before loading.
            , Attr.width 75
            , Attr.height 22
            , Attr.alt "Haveno Logo"
            , Attr.title "Haveno Logo"
            , Attr.id "topLogoId"
            , Attr.class "topLogo"
            ]
            []
        ]


menu : Model -> Html.Html Msg
menu model =
    Html.div []
        [ Html.button
            [ Attr.classList [ ( "menu-btn", True ), ( "open", model.isMenuOpen ) ]
            , onClick ToggleMenu
            , Attr.name "menubutton"
            , Attr.attribute "data-testid" "menu-Html.button"
            ]
            [ Html.text
                (if model.isMenuOpen then
                    "✖"

                 else
                    "☰"
                )
            ]
        , Html.div
            [ Attr.classList [ ( "menu", True ), ( "open", model.isMenuOpen ) ] ]
            [ navLinks model.page ]
        ]


navLinks : Page -> Html.Html msg
navLinks page =
    let
        -- NOTE: A key function in that it takes a Route and a { url, caption } and returns an Html.Html msg
        -- which when clicked will send a message to the update function (ChangedUrl) with the relevant url
        -- Route and page are also there for isActive.
        navLink : Route -> { url : String, caption : String } -> Html.Html msg
        navLink route { url, caption } =
            Html.li [ Attr.classList [ ( "active", isActive { link = route, page = page } ), ( "navLink", True ) ] ]
                [ Html.a [ Attr.href url ] [ Html.text caption ] ]

        links =
            Html.ul
                [-- NOTE: img is now managed separately so is can be shrunk etc. withouth affecting the links
                ]
                [ Html.li [ Attr.class "logoInNavLinks" ] [ Html.a [ Attr.href "https://haveno-web-dev.netlify.app/", Attr.class "topLogoShrink" ] [ topLogo ] ]
                , navLink FundsRoute { url = "funds", caption = "Funds" }
                , navLink Market { url = "market", caption = "Market" }
                , navLink Support { url = "support", caption = "Support" }
                , navLink SellRoute { url = "sell", caption = "Sell" }
                , navLink Buy { url = "buy", caption = "Buy" }
                , navLink PortfolioRoute { url = "portfolio", caption = "Portfolio" }
                , navLink AccountsRoute { url = "accounts", caption = "Accounts" }
                , navLink ConnectRoute { url = "connect", caption = "Connect" }
                , navLink DonateRoute { url = "donate", caption = "Donate" }
                ]
    in
    links



-- NAV: Cmd Msgs
-- these might e.g. be sent to ports etc.


notifyJsReady : Cmd Msg
notifyJsReady =
    let
        sendMessage =
            Json.Encode.object [ ( "typeOfMsg", Json.Encode.string "ElmReady" ), ( "currency", Json.Encode.string "BTC" ), ( "page", Json.Encode.string "AccountsPage" ), ( "accountsData", Json.Encode.list Json.Encode.string [ "", "" ] ), ( "password", Json.Encode.string "test-password" ) ]
    in
    msgFromMain sendMessage



-- NAV: Main Persistent


footerContent : Model -> Html.Html msg
footerContent model =
    Html.footer []
        [ Html.div [ Attr.class "footer", Attr.style "text-align" "center" ]
            [ Html.br []
                []
            , Html.span []
                [ Html.text ""
                , Html.a [ Attr.href "https://github.com/haveno-dex/haveno" ] [ Html.text "Haveno-Web" ]
                , Html.br []
                    []
                , Html.text "Open source code & design"
                , Html.p [] [ Html.text "Version 0.9.80" ]
                , Html.text "Haveno Version"
                , Html.p [ Attr.id "havenofooterver" ]
                    [ Html.text
                        model.version
                    ]
                ]
            ]
        ]


isActive : { link : Route, page : Page } -> Bool
isActive { link, page } =
    case
        ( link
        , page
        )
    of
        ( SplashRoute, SplashPage _ ) ->
            True

        ( SplashRoute, _ ) ->
            False

        ( SellRoute, SellPage _ ) ->
            True

        ( SellRoute, _ ) ->
            False

        ( PortfolioRoute, PortfolioPage _ ) ->
            True

        ( PortfolioRoute, _ ) ->
            False

        ( FundsRoute, FundsPage _ ) ->
            True

        ( FundsRoute, _ ) ->
            False

        ( Support, SupportPage _ ) ->
            True

        ( Support, _ ) ->
            False

        ( Buy, BuyPage _ ) ->
            True

        ( Buy, _ ) ->
            False

        ( Market, MarketPage _ ) ->
            True

        ( Market, _ ) ->
            False

        ( AccountsRoute, AccountsPage _ ) ->
            True

        ( AccountsRoute, _ ) ->
            False

        ( DonateRoute, DonatePage _ ) ->
            True

        ( DonateRoute, _ ) ->
            False

        ( ConnectRoute, ConnectPage _ ) ->
            True

        ( ConnectRoute, _ ) ->
            False


{-| -- NOTE: Render dismissable errors. We use this all over the place!
I think it needs a dismissErrors function to go with it ...
-}



-- NOTE: Did this as an example of currying and partial application:


errorMessages : List String -> List (Html.Html msg)
errorMessages errors =
    List.map (\error -> Html.p [] [ Html.text error ]) errors


okButton : msg -> Html.Html msg
okButton dismissErrors =
    Html.button [ onClick dismissErrors ] [ Html.text "Ok" ]


viewErrors : msg -> List String -> Html.Html msg
viewErrors dismissErrors errors =
    if List.isEmpty errors then
        Html.text ""

    else
        Html.div
            [ Attr.class "error-messages"
            ]
        <|
            errorMessages errors
                ++ [ okButton dismissErrors ]
