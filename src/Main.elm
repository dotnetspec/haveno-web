port module Main exposing (..)

-- NOTE: A working Main module that handles URLs and maintains a conceptual Page - i.e. makes an SPA possible
-- Main loads Home initially.
-- NOTE: exposing Url exposes a different type of Url to
-- just import Url

import Browser
import Browser.Navigation as Nav exposing (..)
import Data.Ranking as R
import Data.User as U exposing (User(..))
import Erl exposing (..)
import Extras.Constants as Consts
import Html exposing (Html, a, br, button, div, footer, header, i, img, li, nav, node, p, source, span, text, ul, video)
import Html.Attributes as Attr exposing (..)
import Html.Events exposing (onClick)
import Json.Decode as JD
import Json.Encode as JE
import Pages.About
import Pages.Contact
import Pages.Home
import Pages.Location
import Pages.Pricing
import Pages.Privacy
import Pages.Rankings
import Pages.Terms
import Pages.Testimonials
import Task
import Time
import Types.DateType exposing (DateTime(..))
import Url exposing (Protocol(..), Url)
import Url.Parser exposing ((</>), (<?>), oneOf, s)
import Url.Parser.Query as Query exposing (..)



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
-- NOTE: Nav.Key is a special Elm type to avoid bugs - just pass, and leave, it
{- -- NOTE: we need to populate Pages.Home.Model values in our init function. How can
   we obtain a Pages.Home.Model value? By calling Home.init .

   Change the type (here and in Main) of any flag you pass in if necessary.

   We're using init to store data in our top level Model where data that needs to be
   persisted ACROSS 'pages' is held
-}
{- init : String -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
   init flag url maybeKey =

       case maybeKey of
           Just key ->
               actualInit flag url key

           Nothing ->
               testInit flag url
       updateUrl url { page = NotFound, key = key, flag = decodedJsonFromIndexjs, time = Time.millisToPosix 0, zone = Just Time.utc, errors = [ "" ] }
-}


init : String -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flag url key =
    let
        decodedJsonFromIndexjs =
            case JD.decodeString urlDecoder flag of
                Ok urL ->
                    urL

                Err _ ->
                    -- Handle the case where decoding fails
                    Url.Url Https "squashpassion.com" Nothing "" Nothing Nothing

        navigate newUrl =
            Nav.pushUrl key (Url.toString newUrl)
    in
    updateUrl url { page = NotFound, key = navigate, flag = decodedJsonFromIndexjs, time = Time.millisToPosix 0, zone = Just Time.utc, errors = [ "" ] }



-- HACK: Shouldn't have to change the code to accommodate the tests, but only way to avoid the Nav.Key issues:


testInit : String -> Url.Url -> ( Model, Cmd Msg )
testInit flag url =
    let
        decodedJsonFromIndexjs =
            case JD.decodeString urlDecoder flag of
                Ok urLDecode ->
                    urLDecode

                Err _ ->
                    -- Handle the case where decoding fails
                    Url.Url Https "squashpassion.com" Nothing "" Nothing Nothing

        -- NOTE: AI suggested. Don't know how works:
        navigate newUrl =
            Cmd.none
    in
    updateUrl url { page = NotFound, key = navigate, flag = decodedJsonFromIndexjs, time = Time.millisToPosix 0, zone = Just Time.utc, errors = [ "" ] }



-- NAV: Model
-- NOTE: define a Page type to represent the different states
-- we care about, and add it to Model .
-- NOTE: Changes like displaying some links as active depending on the current page—
-- requires a change to Model, not just view


type alias Model =
    { page : Page, key : Url -> Cmd Msg, flag : Url, time : Time.Posix, zone : Maybe Time.Zone, errors : List String }



-- NAV: Msg
-- We 'talk' (e.g. send time to schedule) to the other pages via the Msgs defined here and in those pages.
{- -- NOTE: each variant of a custom type can be considered a type constructor. They are not functions in the
   traditional sense, but they behave similarly in that they take arguments and produce a value of the custom type.
   All the below are creating a value of type Msg. The value is a constructor for the Msg type.
   e.g. ClickedLink Browser.UrlRequest is a constructor for the Msg type. It takes a Browser.UrlRequest value as input

   In practical terms, you would use a type constructor when you want to create a new value of a specific type,
   and you would use a function when you want to perform some computation or operation.
-}


type Msg
    = ClickedLink Browser.UrlRequest
      -- NOTE: the type of GotHomeMsg is (Pages.Home.Msg -> Msg)
    | GotHomeMsg Pages.Home.Msg
    | GotTestimonialsMsg Pages.Testimonials.Msg
    | GotTermsMsg Pages.Terms.Msg
    | GotPrivacyMsg Pages.Privacy.Msg
    | GotLocationMsg Pages.Location.Msg
    | GotContactMsg Pages.Contact.Msg
    | GotPricingMsg Pages.Pricing.Msg
    | GotAboutMsg Pages.About.Msg
    | GotRankingsMsg Pages.Rankings.Msg
    | ChangedUrl Url.Url
    | Tick Time.Posix
    | AdjustTimeZone Time.Zone
    | Recv JD.Value
    | RecvText String



--| MsgToSpecMsg Msg
-- ...
-- NAV: Update
-- NOTE: See GotRankingsMsg for example of how data that depended on Main (due to use of subscription)
-- was handled before sending the page model where it could be used


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    
    case msg of
        
        RecvText textMessageFromJs ->
            
            ( model, Cmd.none )

        -- NAV: Recv rawJsonMessage
        -- NOTE: This is updated when a message from js (mongo) is received
        Recv rawJsonMessage ->
            -- NOTE: rawJsonMessage is a Json value that is ready to be decoded. It does not need to be
            -- converted to a string.
            {- let
                   -- NOTE: You can only see the rawJsonMessage in the console if you use JE.encode 2
                   -- but you can't decode it if you do that
                   _ =
                       Debug.log "rawJsonMessage in Main" (JE.encode 2 rawJsonMessage)
               in
            -}
            if String.contains "Problem" (fromJsonToString rawJsonMessage) then
                ( { model | errors = model.errors ++ [ "Problem fetching data" ] }, Cmd.none )

            else if String.contains "LOGINDENIED" (fromJsonToString rawJsonMessage) then
                
                ( { model | errors = model.errors ++ [ "Login Denied - Please try again ..." ] }, Cmd.none )

            else
                case model.page of
                    RankingsPage rankings ->
                        toRankings model (Pages.Rankings.update (Pages.Rankings.ResponseDataFromMain rawJsonMessage) rankings)

                    _ ->
                        ( model, Cmd.none )

        Tick newTime ->
            ( { model
                | time = newTime
              }
            , Task.perform AdjustTimeZone Time.here
            )

        AdjustTimeZone newZone ->
            ( { model | zone = Just newZone }
            , Cmd.none
            )

        ClickedLink urlRequest ->
            case urlRequest of
                Browser.External href ->
                    ( model, Nav.load href )

                Browser.Internal url ->
                    -- NOTE: If partnerbb isn't explicitly branched like
                    -- this, it is parsed as an internal link. We
                    -- need to load it as if it were an external link
                    -- (using Nav.load) for it to work on production server
                    case Url.toString url of
                        "https://squashpassion.com/partnerbb/" ->
                            ( model, Nav.load (Url.toString url) )

                        -- NOTE: Nav.pushUrl only manipulates the address bar
                        -- and triggers ChangedUrl
                        _ ->
                            ( model, model.key url )

        -- NOTE: translate URL (e.g. Back btn) into a Page and store it in our Model
        -- this is the place to handle transitions. This is where we can get more fancy
        -- with clicked links (use Erl package on the links e.g. Erl.extractPath)
        {- It looks like we're supposed to use this instead of Browser.onUrlChange in Subscriptions (as per older docs) -}
        ChangedUrl url ->
            updateUrl url model

        GotHomeMsg homeMsg ->
            case model.page of
                HomePage home ->
                    toHome model (Pages.Home.update homeMsg home)

                _ ->
                    ( model, Cmd.none )

        GotTestimonialsMsg testimonialsMsg ->
            case model.page of
                TestimonialsPage testimonials ->
                    toTestimonials model (Pages.Testimonials.update testimonialsMsg testimonials)

                _ ->
                    ( model, Cmd.none )

        GotTermsMsg termsMsg ->
            case model.page of
                TermsPage terms ->
                    toTerms model (Pages.Terms.update termsMsg terms)

                _ ->
                    ( model, Cmd.none )

        GotPrivacyMsg privacyMsg ->
            case model.page of
                PrivacyPage privacy ->
                    toPrivacy model (Pages.Privacy.update privacyMsg privacy)

                _ ->
                    ( model, Cmd.none )

        GotLocationMsg locationMsg ->
            case model.page of
                LocationPage location ->
                    toLocation model (Pages.Location.update locationMsg location)

                _ ->
                    ( model, Cmd.none )

        GotContactMsg activeSGNoMsg ->
            case model.page of
                ContactPage activeSGNo ->
                    toContact model (Pages.Contact.update activeSGNoMsg activeSGNo)

                _ ->
                    ( model, Cmd.none )

        GotPricingMsg pricingMsg ->
            case model.page of
                PricingPage pricing ->
                    toPricing model (Pages.Pricing.update pricingMsg pricing)

                _ ->
                    ( model, Cmd.none )

        GotAboutMsg aboutMsg ->
            case model.page of
                AboutPage about ->
                    toAbout model (Pages.About.update aboutMsg about)

                _ ->
                    ( model, Cmd.none )

        -- NOTE: GotRankingsMsg is triggered by toRankings, which is triggered by updateUrl
        -- which is triggered by init. updateUrl is sent the url and uses the parser to parse it.
        -- The parser outputs the Rankings page so that the case in updateUrl can branch on Rankings.
        -- Rankings.init can then be run to init the page and the page can, through toRankings, be added
        -- to the model in Main (as the current page).
        -- NOTE: Make changes to the Rankings model, cmds etc. in toRankings (more options)
        GotRankingsMsg rankingsMsg ->
            case model.page of
                RankingsPage rankings ->
                    -- NOTE: Example of handling data coming from sub module to main
                    -- If the message is one that needs to be handled in Main (e.g. sends message to port)
                    -- then handle it here:
                    case rankingsMsg of
                        Pages.Rankings.ConfirmNewRanking ranking user ->
                            let
                                -- rankings is the model. Need to update here:
                                newRankingsModel =
                                    { rankings | queryType = Pages.Rankings.LoggedInUser }
                            in
                            -- WARN: Password currently hard coded
                            ( { model | page = RankingsPage newRankingsModel }
                            , --Debug.log "Sending new ranking details"
                              sendMessage
                                ("createRanking"
                                    ++ "~^&"
                                    ++ ranking.name
                                    ++ "~^&"
                                    -- NOTE: these cannot be "" for mongodb
                                    ++ (if ranking.baseaddress.street == "" then
                                            "Unspecified"

                                        else
                                            ranking.baseaddress.street
                                       )
                                    ++ "~^&"
                                    ++ (if ranking.baseaddress.city == "" then
                                            "Unspecified"

                                        else
                                            ranking.baseaddress.city
                                       )
                                )
                            )

                        

                        Pages.Rankings.FetchOwned ownedRanking ->
                            -- NOTE: when this message returns, we will have full Ranking with all the details
                            ( { model | page = RankingsPage { rankings | queryType = Pages.Rankings.OwnedSelectedView } }
                            , --Debug.log "Sending message"
                              sendMessage ("fetchRanking" ++ "~^&" ++ ownedRanking.id ++ "~^&ownedranking")
                            )

                        Pages.Rankings.FetchMember memberRanking ->
                            -- NOTE: when this message returns, we will have full Ranking with all the details
                            ( { model | page = RankingsPage { rankings | queryType = Pages.Rankings.MemberSelectedView } }
                            , --Debug.log "Sending message"
                              sendMessage ("fetchRanking" ++ "~^&" ++ memberRanking.id ++ "~^&memberranking")
                            )

                        Pages.Rankings.ConfirmJoin rankingWantToJoin userid lastRank ->
                            let
                                newRank =
                                    { rank = lastRank + 1
                                    , player = { id = userid, nickname = U.gotNickName rankings.user } -- Replace with actual player data

                                    -- RF: hard coded for now
                                    , challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" } -- Replace with actual challenger data
                                    }

                                updatedRanking =
                                    { rankingWantToJoin | ladder = rankingWantToJoin.ladder ++ [ newRank ] }

                                updatedUser =
                                    U.addNewLadderToMemberRankings rankings.user rankingWantToJoin
                            in
                            -- NOTE: when this message returns, we will have full Ranking with all the details
                            ( { model
                                | page =
                                    RankingsPage
                                        { rankings
                                            | queryType = Pages.Rankings.MemberSelectedView
                                            , selectedranking = R.Member { rankingWantToJoin | ladder = updatedRanking.ladder }
                                            , user = updatedUser
                                            , searchterm = ""
                                            , searchResults = []
                                        }
                              }
                            , --Debug.log "Sending message"
                              sendMessage
                                ("joinRanking"
                                    ++ "~^&"
                                    ++ rankingWantToJoin.id
                                    ++ "~^&"
                                    -- NOTE: + 1 to lastRank, to make the new member the LAST in the list, before sending to js
                                    ++ userid
                                    ++ "~^&"
                                    ++ String.fromInt (lastRank + 1)
                                )
                            )

                        -- REVIEW: Can rankingWantToLeave be replaced with rankings.selectedranking?
                        -- and userid from model.user?
                        Pages.Rankings.ConfirmLeaveMemberRanking rankingWantToLeave userid ->
                            let
                                updatedRankingList =
                                    U.deleteRankingFromMemberRankings rankings.user rankingWantToLeave.id

                                updatedUserInfo =
                                    U.updatedMemberRankings (U.gotUserInfo rankings.user) updatedRankingList

                                rankingWithAnyCurrentChallengesRemoved =
                                    R.abandonSingleUserChallenge userid rankingWantToLeave.ladder

                                updatedRanking =
                                    { rankingWantToLeave | ladder = R.removeRank userid rankingWithAnyCurrentChallengesRemoved }

                                --_ =
                                --  Debug.log "encoded updatedRanking" (JE.encode 0 <| R.jsonUpdatedRanking updatedRanking)
                            in
                            -- NOTE: update the UI selectedranking and user (list of rankings) immediately
                            ( { model
                                | page =
                                    RankingsPage
                                        { rankings
                                            | queryType = Pages.Rankings.SpectatorSelectedView
                                            , selectedranking = R.Spectator updatedRanking
                                            , user = Registered updatedUserInfo
                                        }
                              }
                            , --Debug.log "Sending message"
                              sendMessage
                                ("leaveRanking"
                                    ++ "~^&"
                                    ++ rankingWantToLeave.id
                                    ++ "~^&"
                                    ++ userid
                                    ++ "~^&"
                                    ++ (JE.encode 0 <| R.jsonUpdatedRanking updatedRanking)
                                )
                            )

                        -- NOTE: Spectator rankings will be fetched via mongodb middleware
                        {- Pages.Rankings.ConfirmChallenge ranking rank ->
                           -- RF: Potential to send/recieve data to/from js as Json:
                           {- let
                                  data =
                                      JE.object
                                          [ ( "action", JE.string "updateForChallenge" )
                                          , ( "rankingId", JE.string ranking.id )
                                          , ( "userId", JE.string (U.gotId rankings.user) )
                                          , ( "playerId", JE.string rank.player.id )
                                          , ( "rank", JE.int rank.rank )
                                          ]
                              in
                           -}
                           --( { model | page = RankingsPage { rankings | queryType = Pages.Rankings.LoggedInUser } }
                           --, sendMessage (JE.encode 0 data))
                           -- NOTE: when this message returns, we will have full Ranking with all the details
                           -- REVIEW: we are SUBSTITUTING the current challenger.id (...191 -- unchallenged) for the user.id (the new challenger)
                           -- This is fragile - if an incorrect userid sent at this point - not good.
                           ( { model | page = RankingsPage { rankings | queryType = Pages.Rankings.MemberSelectedView ranking  } }
                           , Debug.log "Sending message"
                               (sendMessage ("updateForChallenge" ++ "~^&" ++ ranking.id ++ "~^&" ++ U.gotId rankings.user ++ "~^&" ++ rank.player.id ++ "~^&" ++ String.fromInt rank.rank))
                           )
                        -}
                        Pages.Rankings.ConfirmChallenge selectedRanking rank ->
                            let
                                -- TODO: Handle the default
                                gotRankBelow =
                                    Maybe.withDefault R.emptyRank (R.gotRankBelow rank selectedRanking.ladder)

                                updatedRanks =
                                    R.createSingleUserChallenge rank.player.id gotRankBelow.player selectedRanking.ladder

                                updatedRanking =
                                    { selectedRanking | ladder = updatedRanks }

                                {- updatedUserInfo =
                                   U.updatedMemberRankings (U.gotUserInfo rankings.user) updatedRanking
                                -}
                                --_ =
                                --  Debug.log "encoded updatedRanking" (JE.encode 0 <| R.jsonUpdatedRanking updatedRanking)
                            in
                            -- NOTE: update the UI selectedranking and user (list of rankings) immediately
                            ( { model
                                | page =
                                    RankingsPage
                                        { rankings
                                            | queryType = Pages.Rankings.MemberSelectedView
                                            , selectedranking = R.Member updatedRanking

                                            --, user = newUserMemberRankingListWithUpdatedRankingAdded
                                        }
                              }
                            , --Debug.log "Sending message"
                              sendMessage
                                -- REVIEW: It may become possible to have a more generic 'updateRanking' message
                                ("updateRanking"
                                    ++ "~^&"
                                    ++ selectedRanking.id
                                    ++ "~^&"
                                    ++ (JE.encode 0 <| R.jsonUpdatedRanking updatedRanking)
                                )
                            )

                        Pages.Rankings.ConfirmResult result ->
                            let
                                -- TODO: We have to update the user's List of Rankings here
                                selectedRanking =
                                    R.gotRanking rankings.selectedranking

                                updatedRanks =
                                    R.handleResult result (U.gotId rankings.user) selectedRanking.ladder

                                updatedRanking =
                                    { selectedRanking | ladder = updatedRanks }

                                --_ =
                                --  Debug.log "encoded updatedRanking" (JE.encode 0 <| R.jsonUpdatedRanking updatedRanking)
                            in
                            -- NOTE: update the UI selectedranking and user (list of rankings) immediately
                            ( { model
                                | page =
                                    RankingsPage
                                        { rankings
                                            | queryType = Pages.Rankings.MemberSelectedView
                                            , selectedranking = R.Member updatedRanking
                                        }
                              }
                            , --Debug.log "Sending message"
                              sendMessage
                                -- REVIEW: It may become possible to have a more generic 'updateRanking' message
                                ("updateRanking"
                                    ++ "~^&"
                                    ++ selectedRanking.id
                                    ++ "~^&"
                                    ++ (JE.encode 0 <| R.jsonUpdatedRanking updatedRanking)
                                )
                            )

                        Pages.Rankings.LogOut ->
                            -- REVIEW: do we need apispecs for this app? or just queryType at top level?
                            ( { model | page = RankingsPage { rankings | queryType = Pages.Rankings.Login Consts.emptyEmailPassword } }
                            , --Debug.log "Sending message"
                              sendMessage "logout"
                            )

                        --updateForChallenge
                        Pages.Rankings.RegisUser newUserRegistrationDetails ->
                            ( { model | page = RankingsPage { rankings | queryType = Pages.Rankings.RegisterUser newUserRegistrationDetails } }
                            , --Debug.log "Sending registration details"
                              sendMessage ("register" ++ "~^&" ++ Maybe.withDefault "" newUserRegistrationDetails.email ++ "~^&" ++ newUserRegistrationDetails.password ++ "~^&" ++ newUserRegistrationDetails.nickname)
                            )

                        -- REVIEW: This will be implemented if it is not possible to implement delete via API
                        Pages.Rankings.DeleteOwnedRanking ->
                            let
                                ownedRanking =
                                    case rankings.selectedranking of
                                        R.Owned ownedRnking ->
                                            ownedRnking

                                        _ ->
                                            R.emptyRanking

                                newUser =
                                    U.deleteRankingFromOwnedRankings rankings.user ownedRanking.id
                            in
                            ( { model | page = RankingsPage { rankings | queryType = Pages.Rankings.LoggedInUser, user = newUser } }
                            , --Debug.log "Sending message"
                              sendMessage ("deleteRanking" ++ "~^&" ++ R.gotRankingId (R.gotRanking rankings.selectedranking))
                            )

                        Pages.Rankings.DeleteAccount ->
                            ( { model | page = RankingsPage { rankings | queryType = Pages.Rankings.Login Consts.emptyEmailPassword } }
                            , --Debug.log "Sending message"
                              sendMessage ("deleteAccount" ++ "~^&" ++ U.gotId rankings.user)
                            )

                        _ ->
                            
                            -- otherwise operate within the Rankings sub module:
                            toRankings model (Pages.Rankings.update rankingsMsg rankings)

                _ ->
                    ( model, Cmd.none )



-- NAV: View


{-| Take a page's Html and frames it with a header and footer.

The caller provides the current user, so we can display in either
"signed in" (rendering username) or "signed out" mode.

isLoading is for determining whether we should show a loading spinner
in the header. (This comes up during slow page transitions.)

-}



-- NOTE: Just to illustrate that model can be clarified by explicitly
-- exposing it in annotation


view : Model -> Browser.Document Msg
view model =
    let
        contentByPage =
            {- -- NOTE:  We are 'delegating' views to Home.view and Testimonials.view etc.
               Something similar can be done with subscriptions if required
            -}
            case model.page of
                HomePage home ->
                    Pages.Home.view home
                        -- NOTE: Go from Html Pages.Home.Msg value to Html Msg value using Html.map.
                        {- Conceptually, what Html.map is doing for us here is wrapping a Pages.Home.Msg or
                           Pages.Testimonials.Msg in a Main.Msg , because Main.update knows how to deal with only
                           Main.Msg values. Those wrapped messages will prove useful later when we handle
                           these new messages inside update .
                        -}
                        |> Html.map GotHomeMsg

                TestimonialsPage home ->
                    Pages.Testimonials.view home
                        |> Html.map GotTestimonialsMsg

                TermsPage terms ->
                    Pages.Terms.view terms
                        |> Html.map GotTermsMsg

                PrivacyPage privacy ->
                    Pages.Privacy.view privacy
                        |> Html.map GotPrivacyMsg

                LocationPage location ->
                    Pages.Location.view location
                        |> Html.map GotLocationMsg

                ContactPage contact ->
                    Pages.Contact.view contact
                        |> Html.map GotContactMsg

                PricingPage pricing ->
                    Pages.Pricing.view pricing
                        |> Html.map GotPricingMsg

                AboutPage about ->
                    Pages.About.view about
                        |> Html.map GotAboutMsg

                RankingsPage rankings ->
                    Pages.Rankings.view rankings
                        |> Html.map GotRankingsMsg

                NotFound ->
                    text "Not Found"
    in
    -- NAV : Page Content
    -- TODO: Make this content's naming conventions closely match the
    -- related css.
    { title = "Squash Passion - Singapore Squash Partner"
    , body =
        [ pageHeader model.page
        , showVideoOrBanner model.page
        , contentByPage
        , footerContent
        ]
    }



-- TYPES
-- NOTE: Home.elm is the equivalent of PhotoFolders.elm or 'Folders' in the code
{- -- NOTE: Two data structures for use cases that were similar but ended up NOT being the same. If you're
   getting complicated knock-on effects consider that you may need to split data structures like this.
   Here prompted by 'What’s the problem here? Why isn’t Page working well
   everywhere it used to, now that we’ve expanded it to hold onto more information?'
   Page was an 'overloaded' data structure
-}
{- -- NOTE: Representing a parsed route. Similar, but NOT the same as Page -}
-- NAV: Route


type Route
    = Home
    | Testimonials
    | Terms
    | Privacy
    | Location
    | Contact
    | Pricing
    | About
    | Rankings



-- NOTE: Storing different models. Similar, but NOT the same as Route


type
    Page
    -- NOTE: Be able to access the model in the selected page so that it can
    -- be passed to the view for that page:
    = HomePage Pages.Home.Model
    | TestimonialsPage Pages.Testimonials.Model
    | TermsPage Pages.Terms.Model
    | PrivacyPage Pages.Privacy.Model
    | LocationPage Pages.Location.Model
    | ContactPage Pages.Contact.Model
    | PricingPage Pages.Pricing.Model
    | AboutPage Pages.About.Model
    | RankingsPage Pages.Rankings.Model
    | NotFound



--| SetAuthorizationCode (Maybe String)


type alias QueryStringParser a =
    Query.Parser a



-- NAV: Json decoders
-- Decode the URL from JSON-encoded string


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
    -- String will instead be passed along to eg. Testimonials , so the resulting parser will
    -- output a Page we can store in our model.
    -- (Route -> a) is the type of the function that the parser produces.
    -- It is a function that takes a Route value as input and produces a value of type a.
    -- If a Route value representing a Page is sent as input to the parser function,
    -- the resulting 'a' will be a Page (or whatever type Page represents in your specific code).
    oneOf
        [ Url.Parser.map Home (s "index.html")
        , Url.Parser.map Home Url.Parser.top
        , Url.Parser.map Testimonials (Url.Parser.s "testimonials")
        , Url.Parser.map Terms (Url.Parser.s "terms")
        , Url.Parser.map Privacy (Url.Parser.s "privacy")
        , Url.Parser.map Location (Url.Parser.s "location")
        , Url.Parser.map Contact (Url.Parser.s "contact")
        , Url.Parser.map Pricing (Url.Parser.s "pricing")
        , Url.Parser.map About (Url.Parser.s "about")
        , Url.Parser.map Rankings (Url.Parser.s "rankings")
        ]


type alias QueryParams =
    { code : Maybe String

    --, location : Maybe String
    --, accountsServer : Maybe String
    }


codeParser : Query.Parser (Maybe String)
codeParser =
    Query.string "code"



-- codeParser : SimpleParser.Parser (Maybe String)
-- codeParser =
--   succeed QueryParams
--     |. symbol "?"
--     |. spaces
--     |= "code"
--     |. spaces
--     |. equals
--     |. spaces
--
-- NOTE: parsers don't process or manipulate, but they do output
-- queryParamsParser : Parser a c
-- queryParamsParser =
--     Query.map3 (\code location accountsServer ->
--         -- Here you can use the `code`, `location`, and `accountsServer`
--         -- values to construct your desired output of type `c`
--         -- and return it as the final result of the parser
--         -- Note: Replace `a` and `c` with the actual types you need
--         -- for your specific use case
--         c code location accountsServer
--     )
--     (Query.string "code")
--     (Query.string "location")
--     (Query.string "accounts-server")
-- Define a parser for the query parameters in the URL
{- -- NOTE: The docs specify the 'string' function. Make sure to realize the 'string' function
   is in Parser.Query.string. So Parser.string won't work
-}
-- queryParser : QueryStringParser (Maybe String)
-- queryParser =
--     Query.string "code"
{- -- NOTE: Getting Model.Home and Model.Testimonials values exactly where we need them.
   Replaces (eventually) urlToPage used in most of the book: "KEEPING
   BOTH MODEL AND CMD FOR INIT
   Without having their init commands run, our pages’ initial HTTP requests aren’t
   being sent to the server to load the pages’ initial data."
   Actually, we don't e.g. do Http.get currently, but this is the right pattern for future ref.
-}
-- NOTE: Data you want to pass fom Main to another module's model can be done in the to<functions>
-- updateUrl is a helper function to init


updateUrl : Url.Url -> Model -> ( Model, Cmd Msg )
updateUrl url model =
    -- NOTE: The urlAsPageParser here describes how to translate a URL into a Page.
    -- Parser.parse is a function that uses the description to do it.
    let
        urlMinusQueryStr =
            { url | query = Just "" }

        oauthCode =
            gotCodeFromUrl url

        
    in
    case Url.Parser.parse urlAsPageParser urlMinusQueryStr of
        Just Home ->
            
            -- TODO: Review below as we don't use Oauth.Callback any more:
            -- NOTE: When we get an oauth code we want to move program control to Oauth.Callback
            -- so that we can manage the UI with the user separately from Main.elm.
            -- Specifying /oauth/callback in Zoho URI config is more tricky than letting it return
            -- to root and then switching here according to whether or not a code has been received
            -- REVIEW: We're no longer using oathcode
            case oauthCode of
                Nothing ->
                    -- NOTE: Unlike in book, we're not sending filenames etc. to init. Just ().
                    -- If you wanted info in this page to e.g. be based on an Http.get then
                    -- follow book to setup here:
                    Pages.Home.init ()
                        |> toHome model

                Just "" ->
                    Pages.Home.init ()
                        |> toHome model

                -- HACK: -- FIX?
                Just _ ->
                    Pages.Home.init ()
                        |> toHome model

        Just Testimonials ->
            Pages.Testimonials.init ()
                |> toTestimonials model

        Just Terms ->
            Pages.Terms.init ()
                |> toTerms model

        Just Privacy ->
            Pages.Privacy.init ()
                |> toPrivacy model

        Just Location ->
            Pages.Location.init ()
                |> toLocation model

        Just Contact ->
            Pages.Contact.init ()
                |> toContact model

        Just Pricing ->
            Pages.Pricing.init ()
                |> toPricing model

        Just About ->
            Pages.About.init ()
                |> toAbout model

        Just Rankings ->
            -- NOTE: This is the only place we can pass args from Main.elm into
            -- the sub module for initialization
            -- REVIEW: Time is sent through here as it may speed up the slots fetch in Rankings - tbc
            -- RF: Change name flagUrl to domainUrl
            Pages.Rankings.init { time = Nothing, flagUrl = model.flag }
                |> toRankings model

                

        Nothing ->
            ( { model | page = NotFound }, Cmd.none )


toHome : Model -> ( Pages.Home.Model, Cmd Pages.Home.Msg ) -> ( Model, Cmd Msg )
toHome model ( home, cmd ) =
    ( { model | page = HomePage home }
      -- NOTE: Cmd.map is a way to manipulate the result of a command
    , Cmd.batch [ Cmd.map GotHomeMsg cmd, Task.perform AdjustTimeZone Time.here ]
    )


toTestimonials : Model -> ( Pages.Testimonials.Model, Cmd Pages.Testimonials.Msg ) -> ( Model, Cmd Msg )
toTestimonials model ( testimonials, cmd ) =
    ( { model | page = TestimonialsPage testimonials }
      {- -- NOTE: In your example, Cmd.map GotTestimonialsMsg cmd, GotTestimonialsMsg is indeed a function,
         but you're not explicitly applying it. Cmd.map will take care of applying GotTestimonialsMsg to each value that the command produces.
      -}
    , Cmd.map GotTestimonialsMsg cmd
    )


toTerms : Model -> ( Pages.Terms.Model, Cmd Pages.Terms.Msg ) -> ( Model, Cmd Msg )
toTerms model ( terms, cmd ) =
    ( { model | page = TermsPage terms }
    , Cmd.map GotTermsMsg cmd
    )


toPrivacy : Model -> ( Pages.Privacy.Model, Cmd Pages.Privacy.Msg ) -> ( Model, Cmd Msg )
toPrivacy model ( terms, cmd ) =
    ( { model | page = PrivacyPage terms }
    , Cmd.map GotPrivacyMsg cmd
    )


toLocation : Model -> ( Pages.Location.Model, Cmd Pages.Location.Msg ) -> ( Model, Cmd Msg )
toLocation model ( location, cmd ) =
    ( { model | page = LocationPage location }
    , Cmd.map GotLocationMsg cmd
    )


toContact : Model -> ( Pages.Contact.Model, Cmd Pages.Contact.Msg ) -> ( Model, Cmd Msg )
toContact model ( contact, cmd ) =
    ( { model | page = ContactPage contact }
    , Cmd.map GotContactMsg cmd
    )


toPricing : Model -> ( Pages.Pricing.Model, Cmd Pages.Pricing.Msg ) -> ( Model, Cmd Msg )
toPricing model ( pricing, cmd ) =
    ( { model | page = PricingPage pricing }
    , Cmd.map GotPricingMsg cmd
    )


toAbout : Model -> ( Pages.About.Model, Cmd Pages.About.Msg ) -> ( Model, Cmd Msg )
toAbout model ( about, cmd ) =
    ( { model | page = AboutPage about }
    , Cmd.map GotAboutMsg cmd
    )



{- Let's break down the `toRankings` function step by step in simple terms:

   1. **Function Name and Purpose**:
      - The function is called `toRankings`.
      - Its job is to translate information from the `Rankings` module into a format that the main application (`Main`) can understand.

   2. **Input Parameters**:
      - It takes two inputs:
        - `model`: Information about the current state of the application in Main's model.
        - `(rankings, cmd)`: Information from the `Rankings` module, including rankings data and commands.

   3. **What it Does**:
      - It takes the existing Main `model` and updates it to include the `rankings` data, indicating that the current page is the "Rankings" page.
      - It translates the commands (`cmd`) coming from the `Rankings` module to a format that `Main` understands.

   4. **Output**:
      - It produces two things:
        - An updated Main `model` that now includes the `rankings` data and indicates the current page is the "Rankings" page.
        - Commands that have been translated to a format that `Main` can use.

   In simpler terms, this function helps the main part of the app (`Main`) understand and work with the rankings information provided by the `Rankings` module.
   It's like translating a message into a language that both parts of the app can understand and use effectively.
-}


toRankings : Model -> ( Pages.Rankings.Model, Cmd Pages.Rankings.Msg ) -> ( Model, Cmd Msg )
toRankings model ( rankings, cmd ) =
    ( { model | page = RankingsPage rankings }
      {- -- NOTE: Cmd.map is applying the GotRankingsMsg constructor to the message in the command.
         In Elm, GotRankingsMsg is a type constructor for the Msg type. It's used to create a new Msg value. When you use
         GotRankingsMsg with Cmd.map, you're telling Elm to take the message that results from the command and wrap it in GotRankingsMsg.
         In this code, cmd is a command that will produce a Pages.Rankings.Msg when it's executed. Cmd.map GotRankingsMsg cmd creates a new
         command that, when executed, will produce a Msg that wraps the Pages.Rankings.Msg in GotRankingsMsg.

         So, while GotRankingsMsg is not a function in the traditional sense, it's a type constructor that can be used like a
         function to create new values.
      -}
    , Cmd.map GotRankingsMsg cmd
    
    )



-- NAV: Type aliases


type alias FromMainToSchedule =
    { time : Maybe DateTime
    , flagUrl : Url.Url
    }



-- NAV: Helper functions
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
-- You have to get time from Main, cos only Main has subscription.


subscriptions : Model -> Sub Msg
subscriptions _ =
    --Time.every 10000 Tick
    -- Update Rankings model on every Tick
    --15 minutes in seconds = 15 minutes * 60 seconds/minute = 900 seconds
    -- NOTE: You have to get time from main, cos only main has subscription.
    -- It is anyway best practice to send data top down
    Sub.batch [ Time.every 900000 (\posixTime -> GotRankingsMsg (Pages.Rankings.Tick posixTime)), messageReceiver Recv ]



-- NAV: Ports


port sendMessage : String -> Cmd msg



{- -- NOTE: messageReceiver: You could have just recieved a string here (String -> msg),
   but now we're getting a JSON object from js, created like this in the js:

     msgToElm = {
       operationEventMsg: "Update for challenge done"
     }
     msg has a handle function that extracts it using a decoder

-}
-- NOTE: messageReceiver handled above in subscriptions via update Recv


port messageReceiver : (JD.Value -> msg) -> Sub msg


port setStorage : JE.Value -> Cmd msg



{--HACK: Since only Home page no banner, use below. But with more page etc. can add bool banner property to 
each page model and match against-}


showVideoOrBanner : Page -> Html msg
showVideoOrBanner page =
    {- case page of
       HomePage _ ->
           videoClip

       _ ->
    -}
    img [ Attr.class "banner", src "resources/Banners/racketandball3_1918X494.png", alt "Squash Racket And Ball", width 1918, height 494, title "Squash Partner Banner" ]
        []



-- NOTE: This keeps the header links on the same row
{- topLinks : Html msg
   topLinks =
          div [ Attr.class "topLinks" ]
              [ topLinksLeft
              , div [ Attr.class "topLinksLogo" ] [ hrefLogoImage ]
              , socialsLinks
              ]
-}
{- -- NOTE: This type can be Html msg instead
   of Html Msg because footerContent
   has no event handlers.
-}


topLinksLogo : Html msg
topLinksLogo =
    div [ Attr.class "topLinksLogo" ] [ a [ Attr.href "https://squashpassion.com" ] [ topLinksLogoImage ] ]


topLinksLogoImage : Html msg
topLinksLogoImage =
    img
        [ Attr.src "resources/Logos/SP-V-Logo2.png"

        -- NOTE: always define the width and height of images. This reduces flickering,
        -- because the browser can reserve space for the image before loading.
        , Attr.width 100
        , Attr.height 33
        , Attr.alt "Squash Passion Logo"
        , Attr.title "Squash Passion Logo"
        ]
        []


logoImage : Html msg
logoImage =
    img
        [ Attr.src "resources/Logos/SP-V-Logo2.png"

        -- NOTE: always define the width and height of images. This reduces flickering,
        -- because the browser can reserve space for the image before loading.
        , Attr.width 200
        , Attr.height 67
        , Attr.alt "Squash Passion Logo"
        , Attr.title "Squash Passion Logo"
        ]
        []


socialsLinks : Html msg
socialsLinks =
    div
        [ Attr.class "socials-main-container"
        ]
        [ {- -- NOTE: Only turn these on when they exist.
             The green b/ground is cos whatsapp is at the .md.hydrated:hover (low) level
             See css notes for further info
          -}
          --     div
          --     [ Attr.class "socials-sub-container socials-sub-container-facebook"
          --     ]
          --     [ i
          --         [{- NOTE: all elements are nodes, but not all nodes are elements -}]
          --         [ node "ion-icon"
          --             [ Attr.name "logo-facebook"
          --             ]
          --             []
          --         ]
          --     ]
          -- , div
          --     [ Attr.class "socials-sub-container socials-sub-container-youtube"
          --     ]
          --     [ i
          --         []
          --         [ node "ion-icon"
          --             [ Attr.name "logo-youtube"
          --             ]
          --             []
          --         ]
          --     ]
          -- , div
          --     [ Attr.class "socials-sub-container socials-sub-container-instagram"
          --     ]
          --     [ i
          --         []
          --         [ node "ion-icon"
          --             [ Attr.name "logo-instagram"
          --             ]
          --             []
          --         ]
          --     ]
          -- ,
          div
            [ Attr.class "socials-sub-container socials-sub-container-whatsapp"
            ]
            [ i
                []
                [ a
                    [ Attr.href "https://chat.whatsapp.com/KIEF0OD3ICm5vHMdf6iD0A"
                    , Attr.target "_blank"
                    ]
                    [ node "ion-icon"
                        [ Attr.name "logo-whatsapp"
                        ]
                        []
                    ]
                ]
            ]
        ]



{- -- NOTE: What gets displayed here is heavily dependent on css -}


pageHeader : Page -> Html msg
pageHeader page =
    let
        pageheader =
            header []
                [ div [ Attr.class "topLinks-flex-container" ]
                    {- -- NOTE: When, how and/or if burgerMenu, topLinksLogo or topLinksLeft is displayed is determined by the .css -}
                    [ burgerMenu page
                    , topLinksLogo
                    , topLinksLeft
                    , socialsLinks
                    ]

                {- -- NOTE: When main-nav-flex-container is displayed is determined by the .css -}
                , div [ Attr.class "main-nav-flex-container" ]
                    [ div [ class "section" ]
                        [{- input [ type_ "checkbox", id "nav-toggle", class "nav-toggle" ] []
                            , nav [ class "navlinks" ] [ navLinks page ]
                            , label [ for "nav-toggle", Attr.classList [ ( "nav-toggle-label", True ), ( "header-left-element", False ) ] ]
                                [ div []
                                    []
                                ]
                         -}
                         --nav [ class "navlinks" ] [ navLinks page ]
                        ]

                    --,
                    , div [ class "nav-section-above800px" ]
                        [ --div [ Attr.class "topLinksLogo" ] [ hrefLogoImage ]
                          nav [ class "above800pxnavlinks" ] [ navLinks page ]
                        ]
                    , div [ class "section" ]
                        [--socialsLinks
                        ]
                    ]
                ]

        --]
    in
    pageheader


burgerMenu : Page -> Html msg
burgerMenu page =
    div [ class "menu-btn" ]
        [ div [ class "menu-btn_burger" ]
            []
        , nav [ class "below800pxnavlinks" ] [ navLinks page ]
        ]


navLinks : Page -> Html msg
navLinks page =
    let
        links =
            ul
                [-- NOTE: img is now managed separately so is can be shrunk etc. withouth affecting the links
                ]
                [ li [ class "logo" ] [ a [ Attr.href "https://squashpassion.com", Attr.class "logoImageShrink" ] [ logoImage ] ]
                , navLink Home { url = "/", caption = "Home" }
                , navLink About { url = "about", caption = "About" }
                , navLink Location { url = "location", caption = "Location" }
                , navLink Testimonials { url = "testimonials", caption = "Testimonials" }
                , navLink Pricing { url = "pricing", caption = "Pricing" }
                , navLink Rankings { url = "rankings", caption = "Rankings" }
                , navLink Contact { url = "contact", caption = "Contact" }
                , navLink Terms { url = "terms", caption = "Terms" }
                ]

        -- NOTE: route and page are only there for isActive.
        -- navLink just writes out some html and helps us manage isActive
        -- it doesn't parse routes etc.
        navLink : Route -> { url : String, caption : String } -> Html msg
        navLink route { url, caption } =
            li [ classList [ ( "active", isActive { link = route, page = page } ), ( "navLink", True ) ] ]
                [ a [ href url ] [ text caption ] ]
    in
    links


topLinksLeft : Html msg
topLinksLeft =
    let
        links =
            div
                [ Attr.class "topLinksLeft"
                ]
                -- FIX: make into mailto:
                [ Html.i
                    [ Attr.class "material-icons"
                    ]
                    [ text "email" ]
                , navLink { url = "/", caption = "pmo@squashpassion.com    " }
                , Html.i
                    [ Attr.class "material-icons"
                    ]
                    [ text "phone" ]
                , navLink { url = "contact", caption = "+(65) 8835 0839" }
                ]

        -- NOTE: We just want to display these on every page, so no route required
        navLink : { url : String, caption : String } -> Html msg
        navLink { url, caption } =
            li [ class "emailphone" ]
                [ a [ href url ] [ text caption ] ]
    in
    links



-- NAV: Cmd Msgs
-- these might e.g. be sent to ports etc.


logOutUser : Cmd Msg
logOutUser =
    sendMessage "logOut"



-- NAV: Video


videoClip : Html msg
videoClip =
    video
        [ Attr.width 320
        , Attr.height 240
        , Attr.autoplay True
        , Attr.loop True
        , Attr.property "muted" (JE.bool True)
        , Attr.property "contentUrl" (JE.string "https://squashpassion.com/resources/Video/SP_Squash_Partner_4.mp4")
        , Attr.class "video-container"
        , Attr.poster "https://squashpassion.com/resources/Video/SP_Squash_Partner_4.mp4#t=0.5&poster=http://squashpassion.com/resources/Video/SP_video.png"
        ]
        [ -- TODO: Add more alternative video formats as fallbacks:
          source
            [ Attr.src "../resources/Video/SP_Squash_Partner_4.mp4"
            , Attr.type_ "video/mp4"
            ]
            []
        , source
            [ Attr.src "../resources/Video/test.webm"
            , Attr.type_ "video/webm"
            ]
            []
        , text "Your browser does not support the video tag."
        ]


footerContent : Html msg
footerContent =
    footer []
        [ div [ Attr.class "footer", Attr.style "text-align" "center" ]
            [ a [ href "/" ] [ text "Singapore Squash Sessions" ]
            , br []
                []
            , span []
                [ text "All Rights Reserved "
                , a [ href "https://squashpassion.com" ] [ text "Squash Passion" ]
                , br []
                    []
                , text "Proprietary code & design"
                , p [] [ text "Version 1.6.2" ]
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
        ( Home, HomePage _ ) ->
            True

        ( Home, _ ) ->
            False

        ( Testimonials, TestimonialsPage _ ) ->
            True

        ( Testimonials, _ ) ->
            False

        ( Terms, TermsPage _ ) ->
            True

        ( Terms, _ ) ->
            False

        ( Privacy, PrivacyPage _ ) ->
            True

        ( Privacy, _ ) ->
            False

        ( Location, LocationPage _ ) ->
            True

        ( Location, _ ) ->
            False

        ( Contact, ContactPage _ ) ->
            True

        ( Contact, _ ) ->
            False

        ( Pricing, PricingPage _ ) ->
            True

        ( Pricing, _ ) ->
            False

        ( About, AboutPage _ ) ->
            True

        ( About, _ ) ->
            False

        ( Rankings, RankingsPage _ ) ->
            True

        ( Rankings, _ ) ->
            False


{-| -- NOTE: Render dismissable errors. We use this all over the place!
I think it needs a dismissErrors function to go with it ...
-}
viewErrors : msg -> List String -> Html msg
viewErrors dismissErrors errors =
    if List.isEmpty errors then
        Html.text ""

    else
        div
            [ class "error-messages"
            ]
        <|
            List.map (\error -> p [] [ text error ]) errors
                ++ [ button [ onClick dismissErrors ] [ text "Ok" ] ]
