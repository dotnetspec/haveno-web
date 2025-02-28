port module Main exposing (FromMainToSchedule, Model, Msg(..), OperationEventMsg, Page(..), QueryParams, QueryStringParser, Route(..), codeParser, connectionStatusView, errorMessages, footerContent, fromJsonToString, gotAvailableBalances, gotCodeFromUrl, init, isActive, isValidXMRAddress, isXMRWalletConnected, justmsgFieldFromJsonDecoder, main, menu, navLinks, navigate, okButton, receiveMessageFromJs, sendMessageToJs, sendVersionRequest, setDashboardHavenoVersion, subscriptions, toAccounts, toBlank, toConnect, toDashboard, toDonate, toFunds, toMarket, toPortfolio, toPricing, toSell, toSupport, topLogo, update, updateUrl, urlAsPageParser, urlDecoder, view, viewErrors)

-- NOTE: A working Main module that handles URLs and maintains a conceptual Page - i.e. makes an SPA possible
-- Main loads Blank initially.
-- and uses a top level Model where data that needs to be persisted ACROSS pages is held
-- NOTE: exposing Url exposes a different type of Url to
-- just import Url

import Browser
import Browser.Navigation as Nav
import Comms.CustomGrpc
import Data.AddressValidity as R
import Erl
import Extras.TestData exposing (placeholderUrl)
import Grpc
import Html
import Html.Attributes as Attr
import Html.Events exposing (onClick)
import Json.Decode as JD
import Json.Encode as JE
import Pages.Accounts
import Pages.Blank
import Pages.Buy
import Pages.Connect exposing (Model)
import Pages.Dashboard
import Pages.Donate
import Pages.Funds
import Pages.Market
import Pages.Portfolio
import Pages.Sell
import Pages.Support
import Parser
import Proto.Io.Haveno.Protobuffer as Protobuf exposing (..)
import Proto.Io.Haveno.Protobuffer.GetVersion exposing (getVersion)
import Proto.Io.Haveno.Protobuffer.Wallets as Wallets
import Task
import Time
import Types.DateType exposing (DateTime)
import Url exposing (Protocol(..), Url)
import Url.Parser exposing (oneOf, s)
import Url.Parser.Query as Query



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



-- NAV: Init
-- NOTE: This is used to initialize the model in init and spec tests
-- WARN: The app sees Url.Url as 'elm-spec' when testing


init : String -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flag _ key =
    let
        decodedJsonFromSetupElmmjs =
            case JD.decodeString urlDecoder flag of
                Ok urLAfterFlagDecode ->
                    urLAfterFlagDecode

                Err _ ->
                    Url.Url Https "haveno-web.squashpassion.com" Nothing "" Nothing Nothing

        urlWithDashboardPath =
            { decodedJsonFromSetupElmmjs | path = "/dashboard" }

        initialDashboardModel : Pages.Dashboard.Model
        initialDashboardModel =
            { status = Pages.Dashboard.Loading
            , pagetitle = "Dashboard"
            , root = Pages.Dashboard.Dashboard { name = "Loading..." }
            , balances = Nothing
            , primaryaddress = ""
            , version = ""
            , errors = []
            }

        -- NOTE: Initialize the whole model here so that can assign Nav.Key
        updatedModel =
            { page = DashboardPage initialDashboardModel
            , flag = urlWithDashboardPath --decodedJsonFromSetupElmmjs
            , key = key
            , time = Time.millisToPosix 0
            , zone = Nothing -- Replace with the actual time zone if available
            , errors = []
            , isApiConnected = False
            , version = "No Haveno version available"
            , currentJsMessage = ""
            , initialized = False
            , isMenuOpen = False
            , balances = Just Protobuf.defaultBalancesInfo
            , primaryaddress = ""
            }
    in
    updateUrl urlWithDashboardPath updatedModel



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
    , currentJsMessage : String
    , initialized : Bool
    , isMenuOpen : Bool
    , balances : Maybe Protobuf.BalancesInfo
    , primaryaddress : String
    }


navigate : Nav.Key -> Cmd Msg
navigate thekey =
    Nav.pushUrl thekey (Url.toString placeholderUrl)



-- forNavigation needs this to be:
--  #{ onUrlChange : Url -> msg, onUrlRequest : Browser.UrlRequest -> msg }#
-- NAV: Msg
-- REVIEW: Move these notes to a separate file somewhere?
-- We 'talk' (e.g. send time to schedule) to the other pages via the Msgs defined here and in those pages.
{- -- NOTE: each variant of a custom type can be considered a type constructor. They are not functions in the
   traditional sense, but they behave similarly in that they take arguments and produce a value of the custom type.
   All the below are creating a value of type Msg. The value is a constructor for the Msg type.
   e.g. ClickedLink Browser.UrlRequest is a constructor for the Msg type. It takes a Browser.UrlRequest value as input

   In practical terms, you would use a type constructor when you want to create a new value of a SPECIFIC type,
   and you would use a function when you want to perform some computation or operation.

   All the below are constructor functions for the Msg type. They are not functions in the traditional sense,
   e.g.
   port receiveMessageFromJs : (String -> msg) -> Sub msg
   ReceivedFromJs String

   subscriptions : Model -> Sub Msg
    subscriptions _ =
    -- NOTE: ReceivedFromJs has no String here cos receiveMessageFromJs wants a function that takes a String
    -- and returns a Msg. This is what ReceivedFromJs was 'constructed' to be
    receiveMessageFromJs ReceivedFromJs



    update : Msg -> Model -> (Model, Cmd Msg)
    update msg model =
    case msg of
        ReceivedFromJs message ->
            -- Handle the message from JavaScript
            (model, Cmd.none)
-}


type Msg
    = ClickedLink Browser.UrlRequest
      -- NOTE: the type of GotDashboardMsg is (Pages.Dashboard.Msg -> Msg)
    | GotDashboardMsg Pages.Dashboard.Msg
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
    | AdjustTimeZone Time.Zone
    | Recv JD.Value
    | GotVersion (Result Grpc.Error GetVersionReply)
    | ToggleMenu
    | GotBalances (Result Grpc.Error Protobuf.GetBalancesReply)
    | GotXmrPrimaryAddress (Result Grpc.Error Protobuf.GetXmrPrimaryAddressReply)



-- ...
-- NAV: Update
-- NOTE: See GotHardwareMsg for example of how data that depended on Main (due to use of subscription)
-- was handled before sending the page model where it could be used
-- NOTE: Roughly ordered in terms of importance


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotXmrPrimaryAddress (Ok primaryAddresponse) ->
            ( { model | primaryaddress = primaryAddresponse.primaryAddress }, Cmd.none )

        GotXmrPrimaryAddress (Err _) ->
            ( model, Cmd.none )

        GotBalances (Ok response) ->
            ( { model | balances = response.balances }, Cmd.none )

        GotBalances (Err _) ->
            ( model, Cmd.none )

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

        -- Assume success after applying
        -- NOTE: GotVersion also used as an API Connection indicator
        GotVersion (Ok versionResp) ->
            let
                verResp =
                    case versionResp of
                        { version } ->
                            version

                {- newDashBoardModel =
                   case model.page of
                       DashboardPage dashboard ->
                           { dashboard | version = verResp }

                       _ ->
                           Pages.Dashboard.initialModel
                -}
            in
            ( { model | isApiConnected = True, version = verResp }, Cmd.none )

        GotVersion (Err _) ->
            ( { model | version = "Error obtaining version", isApiConnected = False }, Cmd.none )

        -- NAV: Recv rawJsonMessage
        -- NOTE: This is updated when a message from js is received
        Recv _ ->
            ( model, Cmd.none )

        AdjustTimeZone newZone ->
            ( { model | zone = Just newZone }
            , Cmd.none
            )

        GotDashboardMsg dashboardMsg ->
            case model.page of
                DashboardPage dashboard ->
                    let
                        updatedDashboardModel =
                            { dashboard | version = model.version }
                    in
                    toDashboard model (Pages.Dashboard.update dashboardMsg updatedDashboardModel)

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

        GotAccountsMsg aboutMsg ->
            case model.page of
                AccountsPage about ->
                    toAccounts model (Pages.Accounts.update aboutMsg about)

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



-- NAV: View


view : Model -> Browser.Document Msg
view model =
    let
        contentByPage =
            {- -- NOTE:  We are 'delegating' views to Dashboard.view and Sell.view etc.
               Something similar can be done with subscriptions if required
            -}
            case model.page of
                DashboardPage dashboard ->
                    Pages.Dashboard.view dashboard
                        -- NOTE: Go from Html Pages.Dashboard.Msg value to Html Msg value using Html.map.
                        {- Conceptually, what Html.map is doing for us here is wrapping a Pages.Dashboard.Msg or
                           Pages.Sell.Msg in a Main.Msg , because Main.update knows how to deal with only
                           Main.Msg values. Those wrapped messages will prove useful later when we handle
                           these new messages inside update .

                           We're actually using Pages.Dashboard.view
                           -- NOTE: Html.map is essential to wrap the Dashboard.elm view and convert Dashboard.Msg into Main.Msg
                        -}
                        |> Html.map GotDashboardMsg

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
                    let
                        accountsModel =
                            { accounts
                                | status = Pages.Accounts.Loaded
                                , pagetitle = "Accounts"
                                , balances = model.balances
                                , isAddressVisible = False
                                , primaryaddress = model.primaryaddress
                                , errors = []
                                , subaddress = ""
                                , currentView = Pages.Accounts.ManageAccounts
                            }
                    in
                    Pages.Accounts.view accountsModel
                        |> Html.map GotAccountsMsg

                DonatePage donate ->
                    Pages.Donate.view donate
                        |> Html.map GotDonateMsg

                ConnectPage _ ->
                    {- -- NOTE: Advantages of This Approach: ✅ Keeps Main.elm responsible for global state but avoids redundancy.
                       ✅ Ensures Connect.elm always receives the latest connection status.
                       ✅ Still allows Pages.Connect to manage its own additional state (like retry attempts).
                    -}
                    let
                        connectModel =
                            { moneroNode = "default.node.address:18081"
                            , customMoneroNode = ""
                            , havenoConnected = model.isApiConnected
                            , walletConnected = isXMRWalletConnected model
                            , retryingWallet = False
                            , retryingHaveno = False
                            , connectionAttempts = 0
                            , primaryaddress = ""
                            }
                    in
                    Pages.Connect.view connectModel
                        |> Html.map GotConnectMsg
    in
    -- NAV : View Page Content
    -- TODO: Make this content's naming conventions closely match the
    -- related css.
    -- NOTE: 'pagetitle' or 'title' in pages is not the same as 'title' in the document
    { title = "Haveno-Web"
    , body =
        [ connectionStatusView model
        , Html.div [ Attr.class "main-nav-flex-container" ] [ menu model ]
        , Html.div [ Attr.class "topLogoContainer" ] [ topLogo ]
        , Html.div [ Attr.class "contentByPage" ] [ contentByPage ]
        , Html.div [ Attr.class "footerContent" ] [ footerContent model ]
        ]
    }



-- TYPES
-- NOTE: Dashboard.elm is the equivalent of PhotoFolders.elm or 'Folders' in the code
{- -- NOTE: Two data structures for use cases that were similar but ended up NOT being the same. If you're
   getting complicated knock-on effects consider that you may need to split data structures like this.
   Here prompted by 'What’s the problem here? Why isn’t Page working well
   everywhere it used to, now that we’ve expanded it to hold onto more information?'
   Page was an 'overloaded' data structure
-}
{- -- NOTE: Representing a parsed route. Similar, but NOT the same as Page -}
-- NAV: Route
-- TODO: Complete the others as '...Route'


type Route
    = DashboardRoute
    | SellRoute
    | PortfolioRoute
    | FundsRoute
    | Support
    | Buy
    | Market
    | BlankRoute
    | AccountsRoute
    | DonateRoute
    | ConnectRoute



-- NOTE: Storing different models. Similar, but NOT the same as Route


type
    Page
    -- NOTE: Be able to access the model in the selected page so that it can
    -- be passed to the view for that page:
    = DashboardPage Pages.Dashboard.Model
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
-- Decode the URL from JSON-encoded string


justmsgFieldFromJsonDecoder : JD.Decoder OperationEventMsg
justmsgFieldFromJsonDecoder =
    JD.map OperationEventMsg
        (JD.field "operationEventMsg" JD.string)


urlDecoder : JD.Decoder Url
urlDecoder =
    JD.string
        |> JD.andThen
            (\s ->
                case Url.fromString s of
                    Just url ->
                        JD.succeed url

                    Nothing ->
                        JD.fail "Invalid URL"
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
        [ Url.Parser.map BlankRoute (s "index.html")
        , Url.Parser.map BlankRoute Url.Parser.top
        , Url.Parser.map DashboardRoute (Url.Parser.s "dashboard")
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
{- -- NOTE: Getting Model.Dashboard and Model.Sell values exactly where we need them.
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
        Just BlankRoute ->
            Pages.Blank.init ()
                |> toBlank model

        Just DashboardRoute ->
            Pages.Dashboard.init { time = Nothing, havenoVersion = model.version }
                |> toDashboard model

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

        Just AccountsRoute ->
            Pages.Accounts.init ()
                |> toAccounts model

        Just DonateRoute ->
            Pages.Donate.init ()
                |> toDonate model

        Just ConnectRoute ->
            Pages.Connect.init ()
                |> toConnect model

        Nothing ->
            Pages.Dashboard.init { time = Nothing, havenoVersion = model.version }
                |> toDashboard model



-- NOTE: This is where we can update Pages's model
{- Let's break down the `toPages` function step by step in simple terms:

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


toDashboard : Model -> ( Pages.Dashboard.Model, Cmd Pages.Dashboard.Msg ) -> ( Model, Cmd Msg )
toDashboard model ( dashboard, cmd ) =
    ( { model | page = DashboardPage dashboard }
      -- NOTE: Cmd.map is a way to manipulate the result of a command
      -- WARN: sendMessageToJs "msgFromElm" is redundant here but if it isn't actually used somewhere the port won't be recognized on document load
    , Cmd.batch
        [ Cmd.map GotDashboardMsg cmd
        , sendVersionRequest Protobuf.defaultGetVersionRequest
        , gotAvailableBalances
        , Comms.CustomGrpc.gotPrimaryAddress |> Grpc.toCmd GotXmrPrimaryAddress
        , Task.perform AdjustTimeZone Time.here
        , sendMessageToJs "msgFromElm"
        ]
    )


toSell : Model -> ( Pages.Sell.Model, Cmd Pages.Sell.Msg ) -> ( Model, Cmd Msg )
toSell model ( sell, cmd ) =
    ( { model | page = SellPage sell }
      {- -- NOTE: In your example, Cmd.map GotSellMsg cmd, GotSellMsg is indeed a function,
         but you're not explicitly applying it. Cmd.map will take care of applying GotSellMsg to each value that the command produces.
      -}
    , Cmd.map GotSellMsg cmd
    )


toBlank : Model -> ( Pages.Blank.Model, Cmd Pages.Blank.Msg ) -> ( Model, Cmd Msg )
toBlank model ( blankmodel, blankcmd ) =
    ( model
    , Cmd.none
    )


toPortfolio : Model -> ( Pages.Portfolio.Model, Cmd Pages.Portfolio.Msg ) -> ( Model, Cmd Msg )
toPortfolio model ( portfolio, cmd ) =
    ( { model | page = PortfolioPage portfolio }
    , Cmd.map GotPortfolioMsg cmd
    )


toFunds : Model -> ( Pages.Funds.Model, Cmd Pages.Funds.Msg ) -> ( Model, Cmd Msg )
toFunds model ( funds, cmd ) =
    ( { model | page = FundsPage funds }
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
    ( { model | page = AccountsPage accounts }
    , Cmd.map GotAccountsMsg cmd
    )


toDonate : Model -> ( Pages.Donate.Model, Cmd Pages.Donate.Msg ) -> ( Model, Cmd Msg )
toDonate model ( donate, cmd ) =
    ( { model | page = DonatePage donate }
    , Cmd.map GotDonateMsg cmd
    )


toConnect : Model -> ( Pages.Connect.Model, Cmd Pages.Connect.Msg ) -> ( Model, Cmd Msg )
toConnect model ( connect, cmd ) =
    ( { model | page = ConnectPage { connect | havenoConnected = model.isApiConnected, walletConnected = isXMRWalletConnected model } }
    , Cmd.map GotConnectMsg cmd
    )



-- NAV : Types
-- NAV: Type aliases


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



-- NAV: Helper functions
-- TODO: Improve the validation here:


isXMRWalletConnected : Model -> Bool
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


setDashboardHavenoVersion : Pages.Dashboard.Model -> Model -> Pages.Dashboard.Model
setDashboardHavenoVersion dashboardModel model =
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


fromJsonToString : JE.Value -> String
fromJsonToString value =
    JE.encode 0 value


gotCodeFromUrl : Url.Url -> Maybe String
gotCodeFromUrl url =
    {- -- NOTE: Converting from a Url package to Erl package url due to difficulties working with Url.Query package -}
    Just <| String.join "" (Erl.getQueryValuesForKey "code" <| Erl.parse <| Url.toString url)



-- NAV: Subscriptions:


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ receiveMessageFromJs Recv
        ]



-- NAV: Ports - once defined here they can be used in js with app.ports.
-- <portname>.send/subscribe(<data>)
-- WARN: Use the port somewhere in the code or it won't initialize on document load


port sendMessageToJs : String -> Cmd msg


port receiveMessageFromJs : (JD.Value -> msg) -> Sub msg



{- port initializeLedger : (Int -> msg) -> Sub msg
   port getAccountInfoFromLNS : (Int -> msg) -> Sub msg

   -- Handle the responses from the ports
   port ledgerInitialized : (JD.Value -> msg) -> Sub msg
   port accountInfoReceived : (JD.Value -> msg) -> Sub msg
-}
{- -- NOTE: messageReceiver: You could have just recieved a string here (String -> msg),
   but now we're getting a JSON object from js, created like this in the js:

     msgToElm = {
       operationEventMsg: "Update for challenge done"
     }
     msg has a handle function that extracts it using a decoder

-}
{- -- NOTE: This type can be Html.Html msg instead
   of Html.Html Msg because footerContent
   has no event handlers.
-}


topLogo : Html.Html msg
topLogo =
    Html.div
        [ Attr.class "topLogoContainer"
        ]
        [ Html.div [ Attr.class "topLogo-content" ]
            [ Html.img
                [ Attr.src "assets/resources/images/logo-splash100X33.png"

                -- NOTE: always define the width and height of images. This reduces flickering,
                -- because the browser can reserve space for the image before loading.
                , Attr.width 100
                , Attr.height 33
                , Attr.alt "Haveno Logo"
                , Attr.title "Haveno Logo"
                , Attr.id "topLogoId"
                , Attr.class "topLogo"
                ]
                []
            ]
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
                , navLink BlankRoute { url = "/", caption = "" }
                , navLink DashboardRoute { url = "dashboard", caption = "Dashboard" }
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
{- notifyJsReady : Cmd Msg
   notifyJsReady =
       sendMessageToJs "ElmReady"


   logOutUser : Cmd Msg
   logOutUser =
       sendMessageToJs "logOut"
-}
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
                , Html.p [] [ Html.text "Version 0.4.50" ]
                , Html.text "Haveno Version"
                , Html.p [ Attr.id "havenofooterver" ]
                    [ Html.text
                        model.version
                    ]
                ]
            ]
        ]



-- FIX:


isActive : { link : Route, page : Page } -> Bool
isActive { link, page } =
    case
        ( link
        , page
        )
    of
        ( DashboardRoute, DashboardPage _ ) ->
            True

        ( DashboardRoute, _ ) ->
            False

        ( SellRoute, SellPage _ ) ->
            True

        ( SellRoute, _ ) ->
            False

        ( BlankRoute, _ ) ->
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
