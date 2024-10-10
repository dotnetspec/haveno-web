module Pages.Hardware exposing (..)

--import Task
-- REVIEW: Either here or DateType, but not both?

import Array exposing (empty)
import Buttons.Default
import Data.Hardware as R exposing (rankingDecoder, rankingSearchResultDecoder, validXMRAddressParser)
import Data.User as U
import Derberos.Date.Core as DD
import Dict exposing (Dict)
import Element exposing (Element, el)
import Element.Font as Font
import Element.Input as Input
import Extras.Constants as Consts
import Framework
import Framework.Button as Button
import Framework.Card as Card
import Framework.Color as Color
import Framework.Grid as Grid
import Framework.Heading as Heading
import Framework.Input as Input
import Html exposing (..)
import Html.Attributes as Attr exposing (..)
import Html.Events exposing (onBlur, onCheck, onClick, onFocus, onInput)
import Http exposing (..)
import Json.Decode as D exposing (..)
import Json.Decode.Pipeline exposing (optional, required)
import Json.Encode as E exposing (..)
import Maybe exposing (withDefault)
import Parser exposing (Parser, andThen, chompWhile, end, getChompedString, map, run, succeed)
import Regex exposing (contains)
import SR.Elements as El
import String.Extra as StringExtra
import Task
import Time
import Tuple
import Types.DateType as DateType exposing (DateTime(..))
import Url exposing (Protocol(..), Url)
import Utils.Validation.Validate as V



-- NOTE: To determine. What is the relationship between this model and the one in Main?
{- Generally, the Model should include data that:

   Is necessary for rendering the view: This could be anything from text strings to complex data structures like lists or trees.

   Is necessary for responding to user actions: This could include information about the current state of a form, the selected item in a list, or the progress of an ongoing operation.

   In general, the Model should contain just enough data to represent the current state of your application, but not so much that it becomes unwieldy or difficult to manage

   Is the data part of the current state of the application and necessary for rendering the view correctly? Yes, then it goes in the model

   Yes - different types of query parameter, such as "?category=books" or "?category=music"
-}
{- Type aliases are useful for representing data structures that don't have any behavior associated with them,
   such as JSON payloads, database records, or other types of data.
-}
-- NAV: Init
-- Loading the page also uses the refresh token to obtain a new access_token (Zoho-oauthtoken)
-- which will last an hour after which user will need to nav off/back to page. If give user
-- option to 'refresh' page token they might keep unnecessarily request tokens just for an availability
-- update, which only needs an 'availability' request.
-- NOTE: Can config server type prod/dev here:
-- Anything that needed to be initialized before this point (e.g. datetime) can be done in Main updateUrl
-- which is runs from Main's init function.
-- NOTE: CORS err may be due to wrong dev/prod setting


init : FromMainToRankings -> ( Model, Cmd Msg )
init fromMainToRankings =
    let
        -- RF
        updatedFlagUrlToIncludeMongoDBMWSvr =
            if String.contains Consts.localorproductionServerAutoCheck fromMainToRankings.flagUrl.host then
                Url fromMainToRankings.flagUrl.protocol fromMainToRankings.flagUrl.host Nothing Consts.productionProxyConfig Nothing Nothing

            else
                Url fromMainToRankings.flagUrl.protocol fromMainToRankings.flagUrl.host (Just 3000) Consts.middleWarePath Nothing Nothing
    in
    -- NOTE: these api's are in mongodbMW.js currently - mabye they will be sent through from elm at a later point
    -- Use the refresh token to obtain a new access token
    ( Model Loaded
        "Hardware"
        (Hardware { name = "Loading ..." })
        fromMainToRankings.flagUrl
        -- NOTE: Datetime updated in Main
        (Maybe.withDefault Nothing (Just fromMainToRankings.time))
        apiSpecsPlaceHolder
        (Login Consts.emptyEmailPassword)
        (Just (ToMongoDBMWConfig Consts.post [] (Url.toString updatedFlagUrlToIncludeMongoDBMWSvr) Http.emptyBody Nothing Nothing))
        False
        False
        False
        False
        [ "" ]
        [ Nothing ]
        False
        False
        { email = "", password = "" }
        U.emptySpectator
        ""
        []
        Nothing
    , Cmd.none
    )



-- NAV: Model


type alias Model =
    { status : Status
    , title : String
    , root : Hardware
    , flagUrl : Url

    -- NOTE: Use a Maybe so that can specify Nothing in init
    , datetimeFromMain : Maybe DateTime
    , apiSpecifics : ApiSpecifics
    , queryType : QueryType
    , toMongoDBMWConfig : Maybe ToMongoDBMWConfig
    , isValidNewAccessToken : Bool
    , isHardwareLNSConnected : Bool
    , isHardwareLNXConnected : Bool
    , isXMRWalletConnected : Bool
    , errors : List String
    , availableSlots : List (Maybe String)

    -- REVIEW: Same as Status?
    , isWaitingForResponse : Bool
    , isReturnUser : Bool
    , emailpassword : EmailPasswordLogin

    --, selectedranking : R.RankingStatus
    --, selectedSingleRank : R.Rank
    , user : U.User

    --, result : R.ResultOfMatch
    , searchterm : String
    , searchResults : List R.RankingSearchResult
    , objectJSONfromJSPort : Maybe JsonMsgFromJs
    }



-- Define your initialModel with default values


initialModel : Model
initialModel =
    { status = Loading
    , title = "Hardware"
    , root = Hardware { name = "Loading..." }
    , flagUrl = Url Https "example.com" Nothing "" Nothing Nothing
    , datetimeFromMain = Nothing
    , apiSpecifics = { maxResults = "10", accessToken = Nothing }
    , queryType = LoggedInUser
    , toMongoDBMWConfig = Nothing
    , isValidNewAccessToken = False
    , isHardwareLNSConnected = False
    , isHardwareLNXConnected = False
    , isXMRWalletConnected = False
    , errors = []
    , availableSlots = []
    , isWaitingForResponse = False
    , isReturnUser = False
    , emailpassword = { email = "", password = "" }

    --, selectedranking = R.DefaultRankingStatus
    --, selectedSingleRank = R.DefaultRank
    , user = U.emptySpectator

    --, result = R.DefaultResultOfMatch
    , searchterm = ""
    , searchResults = []
    , objectJSONfromJSPort = Nothing
    }



-- NAV: Type definitions
-- NOTE: Use a User to register,
--not userInfo, cos want to send
-- User to User module generally
-- for updates etc.
-- NAV: Msg
-- NOTE:Don't forget that you originally, for one time only, used an AuthorizationRequest/Response in
-- a similar way to how now use Access/Refresh token to get the refresh token (which is now hard coded)


type Msg
    = BookingForm RegisterUserDetails
    | UpdateAge Int
    | UpdateGender String
    | UpdateEmail String
    | UpdatePassword String
    | UpdateNickName String
    | UpdateLevel String
    | UpdateComment String
    | UpdateMobile String
    | UpdatePhone String
    | CondoNameInput String
    | CondoAddressInput String
    | AddInfoInput String
    | ConfirmBookingForm
    | NoOp
    | DismissErrors
    | Tick Time.Posix
    | InputFocused String
    | InputBlurred String
    | SelDateTime String
    | ToggleReturnUser
      -- NOTE: Start of new Msg variants from espa1
    | UserLoginEmailInputChg String
    | UserLoginPasswordInputChg String
    | ClickedHardwareDeviceConnect
    | ClickedXMRWalletConnect
    | ClickedXMRInitiateTransaction String
      -- NOTE: ResponseDataFromMain is a Msg from the port
    | ResponseDataFromMain D.Value
    | LogOut
    | Create
    | CreateNewRanking U.UserInfo
    | Cancel --U.UserInfo
    | CancelFetchedOwned U.UserInfo
    | CancelFetchedMember
    | CancelFetchedSpectator
    | CancelCreateNewRanking
    | CancelRegistration
    | Confirm
    | FetchOwned R.Ranking
    | FetchMember R.Ranking
    | ListSpectator R.RankingSearchResult
    | ViewMember U.MemberRanking
      -- REVIEW: Why do you have QueryType and Msg type if they
      -- do the same thing? Should you just adjust view to handle
      -- Msg instead of Query types?
    | RegisUser U.UserInfo
    | RankingNameChg String
    | StreetAddressChg String
    | CityAddressChg String
      -- REVIEW: Complex variant assoc data not good design -> model?
    | ConfirmNewRanking R.Ranking U.User
    | DialogDeleteOwnedRanking
    | DeleteOwnedRanking
    | ViewRank R.Rank
    | ConfirmChallenge R.Ranking R.Rank
    | ConfirmResult R.ResultOfMatch
    | CancelDialoguePrepareResultView
    | SearchInputChg String
    | FetchSpectatorRanking String
    | SpectatorRankingResponse (Result Http.Error R.Ranking)
    | SpectatorJoin
    | RegisteredUserJoin
    | ConfirmJoin R.Ranking String Int
    | ConfirmLeaveMemberRanking R.Ranking String
    | DialogueConfirmJoinView
    | DialogueConfirmLeaveView
    | DialogueConfirmDeleteAccount
    | DeleteAccount
    | LoginResponse (Result Http.Error SuccessfulLoginResult)
    | LNSConnectResponse (Result Http.Error SuccessfullLNSConnectResult)
    | ProfileResponse (Result Http.Error SuccessfullProfileResult)
    | CallResponse (Result Http.Error U.UserInfo)



-- add more message types here as needed
{- -- NOTE: Anything specified in type Msg + returns from Cmds -}
{- If state needs to change. Make it happen here -}
-- NAV: Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    -- NOTE: (msg, model) as per espa1 can be tricky. If you use helper functions like
    -- handleCancel you get flexibility and precision (can deal with specific model state in handleCancel)
    case msg of
        NoOp ->
            ( model, Cmd.none )

        CancelDialoguePrepareResultView ->
            ( { model
                | queryType = MemberSelectedView
              }
            , Cmd.none
            )

        DialogueConfirmDeleteAccount ->
            ( { model
                | queryType = ConfirmDeleteUserView
              }
            , Cmd.none
            )

        DeleteAccount ->
            ( { model
                | queryType = Login Consts.emptyEmailPassword
              }
            , Cmd.none
            )

        ConfirmLeaveMemberRanking _ _ ->
            -- NOTE: Remove the ranking from the user's memberRankings in the UI
            {- let
                   newUser =
                       U.gotUserInfo model.user

                   newMemberRankings =
                       case model.selectedranking of
                           R.Member ranking ->
                               U.deleteRankingFromMemberRankings model.user ranking.id

                           _ ->
                               [ R.emptyRanking ]

                   newUserInfo =
                       { newUser | memberRankings = newMemberRankings }
               in
            -}
            ( {- { model
                   | queryType = LoggedInUser
                   , user = U.Registered newUserInfo
                 }
              -}
              model
            , Cmd.none
            )

        RegisteredUserJoin ->
            -- TODO: Code the user join
            ( { model
                | queryType = LoggedInUser
              }
            , Cmd.none
            )

        DialogueConfirmJoinView ->
            ( model
            , Cmd.none
            )

        DialogueConfirmLeaveView ->
            ( { model
                | queryType = ConfirmLeaveMemberView
              }
            , Cmd.none
            )

        ConfirmJoin _ _ _ ->
            ( { model
                | queryType = SpectatorSelectedView
              }
            , Cmd.none
            )

        SpectatorJoin ->
            case model.user of
                U.Registered userInfo ->
                    ( { model
                        | queryType = ConfirmJoinMemberView
                      }
                    , Cmd.none
                    )

                _ ->
                    ( { model
                        | queryType = RegisterUser U.emptyUserInfo
                      }
                    , Cmd.none
                    )

        CancelRegistration ->
            ( { model
                | queryType = Login Consts.emptyEmailPassword
              }
            , Cmd.none
            )

        ConfirmChallenge _ _ ->
            ( model
            , Cmd.none
            )

        -- NOTE: Logic here controlled in Main - no point in making assignments here
        ConfirmResult _ ->
            ( model
            , Cmd.none
            )

        ViewRank rank ->
            {- let
               ranking =
                   case model.selectedranking of
                       R.Owned rankng ->
                           rankng

                       R.Member rankng ->
                           rankng

                       R.Spectator rankng ->
                           rankng

                       R.None ->
                           R.emptyRanking

               qType =
                   if R.isCurrentlyInAChallenge rank then
                       PrepareResult

                   else
                       CreateChallengeView rank ranking
            -}
            -- NOTE: update the selected rank with this user's player details
            {- newRank =
               R.Rank rank.rank rank.player { id = U.gotId model.user, nickname = U.gotNickName model.user } True
            -}
            --in
            ( {- { model
                   | selectedSingleRank = rank
                   , queryType = qType
                 }
              -}
              model
            , Cmd.none
            )

        -- REVIEW: Cancel code repitition
        CancelCreateNewRanking ->
            ( { model
                | queryType = LoggedInUser
              }
            , Cmd.none
            )

        CancelFetchedMember ->
            ( { model
                | queryType = LoggedInUser
              }
            , Cmd.none
            )

        CancelFetchedOwned _ ->
            ( { model
                | queryType = LoggedInUser
              }
            , Cmd.none
            )

        CancelFetchedSpectator ->
            ( { model
                | queryType = LoggedInUser
              }
            , Cmd.none
            )

        DeleteOwnedRanking ->
            {- Handled in Main -}
            ( model, Cmd.none )

        DialogDeleteOwnedRanking ->
            ( { model
                | queryType = ConfirmDeleteOwnedRanking
              }
            , Cmd.none
            )

        RankingNameChg value ->
            ( model, Cmd.none )

        -- NOTE: Updates can only occur on Owned rankings
        --( { model | selectedranking = R.Owned (R.updatedRankingName (R.gotRanking model.selectedranking) value) }, Cmd.none )
        StreetAddressChg value ->
            ( model, Cmd.none )

        --( { model | selectedranking = R.Owned (R.updatedStreet (R.gotRanking model.selectedranking) value) }, Cmd.none )
        CityAddressChg value ->
            ( model, Cmd.none )

        --( { model | selectedranking = R.Owned (R.updatedCity (R.gotRanking model.selectedranking) value) }, Cmd.none )
        CreateNewRanking userInfo ->
            let
                newRanking =
                    R.emptyRanking

                --R.gotRanking <| model.selectedranking
                -- REVIEW: Most these values are also set in createRanking.js
                -- at some point we may become more Elm centric
                newRank =
                    R.Rank 1 { id = userInfo.userid, nickname = userInfo.nickname } { id = Consts.noCurrentChallengerId, nickname = "Challenger" }
            in
            ( {- { model
                   | queryType = CreatingNewLadder userInfo

                   -- NOTE: the ranking id will be created by mongodb, so not added here
                   , selectedranking = R.Owned { newRanking | owner_id = userInfo.userid, active = True, player_count = 1, owner_name = userInfo.nickname, ladder = [ newRank ] }
                 }
              -}
              model
            , Cmd.none
            )

        -- TODO: This will probably be rm
        ViewMember _ ->
            ( model, Cmd.none )

        -- NOTE: Will be handled in Main/GotRankingsMsg
        -- because needs data from the port
        FetchMember _ ->
            ( model, Cmd.none )

        ListSpectator _ ->
            ( model, Cmd.none )

        -- NOTE: arg is a U.OwnedRanking, so use emptyRanking for now in model, fetchedOwnedRanking will fill
        {- ( ViewOwned ownedranking, AppOps (Fetched user (Global _)) ) ->
           ( AppOps (Fetched user (Selected (R.Ladder (R.Owned R.emptyRanking) R.View))), fetchedOwnedRanking ownedranking )
        -}
        -- NOTE: Will be handled in Main/GotRankingsMsg
        -- because needs data from the port
        FetchOwned _ ->
            ( model, Cmd.none )

        -- NAV: ResponseDataFromMain - key function
        -- NOTE: All the branching here is configuring the model according to
        -- the json being returned from mondodb and the .js files
        -- NOTE: receivedJson is always a D.Value, stringified ws issue are dealt
        -- with in dataFromMongo
        ResponseDataFromMain receivedJson ->
            let
                -- NOTE: You can only see the rawJsonMessage in the console if you use JE.encode 2
                -- but you can't decode it if you use it that way
                --_ = Debug.log "receivedJson" (E.encode 0 receivedJson)
                decodedHardwareDeviceMsg =
                    case D.decodeValue justmsgFieldFromJsonDecoder receivedJson of
                        Ok message ->
                            message.operationEventMsg

                        Err err ->
                            --JsonMsgFromJs "ERROR" (JsonData (E.object [])) <| { userid = D.errorToString err, nickname = D.errorToString err }
                            "error in decodedHardwareDeviceMsg"

                updatedIsLNSConnected =
                    if decodedHardwareDeviceMsg == "nanoS" then
                        True

                    else
                        False

                updatedIsLNXConnected =
                    if decodedHardwareDeviceMsg == "nanoX" then
                        True

                    else
                        False

                updatedIsXMRConnected =
                    if isValidXMRAddress decodedHardwareDeviceMsg then
                        True

                    else
                        False
            in
            ( { model
                | --user = newUser
                  --, queryType = updatedquerytype
                  --,
                  isHardwareLNSConnected = updatedIsLNSConnected
                , isHardwareLNXConnected = updatedIsLNXConnected
                , isXMRWalletConnected = updatedIsXMRConnected

                --, selectedranking = newRanking
                --, objectJSONfromJSPort = Just decodedJsObj
                --, errors = errors
              }
            , Cmd.none
            )

        Confirm ->
            ( model, Cmd.none )

        -- NOTE: Will be handled in Main/GotRankingsMsg
        -- because needs data from the port
        ConfirmNewRanking _ _ ->
            ( model, Cmd.none )

        Cancel ->
            -- RF: You can make the cancel context specific to the query type
            ( case model.queryType of
                ConfirmDeleteOwnedRanking ->
                    { model
                        | queryType = OwnedSelectedView
                    }

                ConfirmChallengeView _ _ ->
                    { model
                        | queryType = MemberSelectedView
                    }

                CreateChallengeView _ _ ->
                    { model
                        | queryType = LoggedInUser
                    }

                _ ->
                    { model
                        | queryType = Login Consts.emptyEmailPassword
                    }
            , Cmd.none
            )

        --handleCancel msg model
        -- NOTE: Will be handled in Main/GotRankingsMsg
        LogOut ->
            ( model, Cmd.none )

        -- NOTE: Will be handled in Main/GotHardwareMsg
        -- because needs data from the port
        ClickedHardwareDeviceConnect ->
            ( model
            , Cmd.none
            )

        ClickedXMRWalletConnect ->
            ( model
            , Cmd.none
            )

        ClickedXMRInitiateTransaction _ ->
            ( model
            , Cmd.none
            )

        -- NOTE: Will be handled in Main/GotRankingsMsg
        -- because needs data from the port
        RegisUser _ ->
            ( model, Cmd.none )

        Create ->
            ( { model
                | queryType = RegisterUser U.emptyUserInfo
              }
            , Cmd.none
            )

        SearchInputChg searchTerm ->
            ( { model | searchterm = searchTerm }, Cmd.none )

        -- NOTE: Initial login deliberately has separate email/pwrd to registration (where these fields are buried in user details)
        UserLoginEmailInputChg newemail ->
            ( { model | emailpassword = { email = newemail, password = model.emailpassword.password } }, Cmd.none )

        UserLoginPasswordInputChg newPwrd ->
            ( { model | emailpassword = { email = model.emailpassword.email, password = newPwrd } }, Cmd.none )

        -- NOTE: Start of old Haveno-Web-blahblahZoho code:
        ToggleReturnUser ->
            ( { model | isReturnUser = not model.isReturnUser }, Cmd.none )

        -- NOTE: Start of old Haveno-Web-blahblahZoho code:
        SelDateTime selectedHour ->
            ( model
            , Cmd.none
            )

        InputFocused inputElement ->
            case model.queryType of
                RegisterUser bkaapt ->
                    let
                        newApiSpecs =
                            model.apiSpecifics
                    in
                    --( { model | apiSpecifics = { newApiSpecs | queryType = RegisterUser { bkaapt | user_details = updateFocus bkaapt.user_details inputElement } } }, Cmd.none )
                    -- HACK:
                    ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        InputBlurred inputElement ->
            case model.queryType of
                RegisterUser bkaapt ->
                    let
                        newApiSpecs =
                            model.apiSpecifics
                    in
                    -- HACK: ( { model | apiSpecifics = { newApiSpecs | queryType = RegisterUser { bkaapt | user_details = updateFocus bkaapt.user_details inputElement } } }, Cmd.none )
                    ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        -- NOTE: This Tick is prompted by Main - Subscriptions
        Tick newTime ->
            let
                -- NOTE: This does pattern match despite the warning
                dateTimeOnlyUpdatedIfNotSelected =
                    case model.datetimeFromMain of
                        Just (CurrentDateTime _ _) ->
                            Just (CurrentDateTime newTime Time.utc)

                        Just (SelectedDateTime dt zone) ->
                            Just (SelectedDateTime dt zone)

                        Nothing ->
                            Just (CurrentDateTime newTime Time.utc)
            in
            ( { model | datetimeFromMain = dateTimeOnlyUpdatedIfNotSelected }, Cmd.none )

        DismissErrors ->
            ( { model | errors = [] }, Cmd.none )

        CallResponse (Ok auth) ->
            let
                headers =
                    -- HACK: I don't know if need 'typeOfData here
                    [ Http.header "Authorization" ("Bearer " ++ withDefault "No access token" auth.token) ]

                -- incorporate new header with access token and update middleware port
                flagUrlWithMongoDBMWAndPortUpdate =
                    if String.contains Consts.localorproductionServerAutoCheck model.flagUrl.host then
                        Url.toString <| Url model.flagUrl.protocol model.flagUrl.host Nothing Consts.middleWarePath Nothing Nothing

                    else
                        Url.toString <| Url.Url model.flagUrl.protocol model.flagUrl.host (Just 3000) Consts.middleWarePath Nothing Nothing

                newHttpParams =
                    ToMongoDBMWConfig Consts.get headers flagUrlWithMongoDBMWAndPortUpdate Http.emptyBody Nothing Nothing

                apiSpecs =
                    model.apiSpecifics

                -- HACK:
                newModel =
                    { model
                        | toMongoDBMWConfig = Just newHttpParams
                        , isValidNewAccessToken = True
                        , user = U.Registered auth

                        --, apiSpecifics = { apiSpecs | accessToken = Just auth.access_token }
                        , queryType = LoggedInUser
                    }

                --}
            in
            ( newModel
            , Cmd.none
            )

        CallResponse (Err responseErr) ->
            let
                respErr =
                    Consts.httpErrorToString responseErr

                apiSpecs =
                    model.apiSpecifics

                newapiSpecs =
                    { apiSpecs | accessToken = Nothing }
            in
            ( { model | isValidNewAccessToken = False, apiSpecifics = newapiSpecs, errors = model.errors ++ [ respErr ] }
            , Cmd.none
            )

        ProfileResponse (Ok auth) ->
            let
                headers =
                    -- HACK: I don't know if need 'typeOfData here
                    [ Http.header "Authorization" ("Bearer " ++ withDefault "No access token 2" (Just auth.typeOfData)) ]

                -- incorporate new header with access token and update middleware port
                flagUrlWithMongoDBMWAndPortUpdate =
                    if String.contains Consts.localorproductionServerAutoCheck model.flagUrl.host then
                        Url.toString <| Url model.flagUrl.protocol model.flagUrl.host Nothing Consts.middleWarePath Nothing Nothing

                    else
                        Url.toString <| Url.Url model.flagUrl.protocol model.flagUrl.host (Just 3000) Consts.middleWarePath Nothing Nothing

                newHttpParams =
                    ToMongoDBMWConfig Consts.get headers flagUrlWithMongoDBMWAndPortUpdate Http.emptyBody Nothing Nothing

                apiSpecs =
                    model.apiSpecifics

                -- HACK:
                newModel =
                    { model
                        | toMongoDBMWConfig = Just newHttpParams
                        , isValidNewAccessToken = True

                        --, apiSpecifics = { apiSpecs | accessToken = Just auth.access_token }
                        --, queryType = LoggedInUser
                    }

                --}
            in
            ( newModel
            , callRequest newModel
            )

        ProfileResponse (Err responseErr) ->
            let
                respErr =
                    Consts.httpErrorToString responseErr

                apiSpecs =
                    model.apiSpecifics

                newapiSpecs =
                    { apiSpecs | accessToken = Nothing }
            in
            ( { model | isValidNewAccessToken = False, apiSpecifics = newapiSpecs, errors = model.errors ++ [ respErr ] }
            , Cmd.none
            )

        LNSConnectResponse (Ok auth) ->
            let
                headers =
                    []

                -- NOTE: the 'Zoho-oauthtoken' sent at this point is the access token received after refresh
                --[ Http.header "Authorization" ("Bearer " ++ withDefault "No access token 2" (Just auth.deployment_model)) ]
                -- incorporate new header with access token and update middleware port
                flagUrlWithMongoDBMWAndPortUpdate =
                    if String.contains Consts.localorproductionServerAutoCheck model.flagUrl.host then
                        Url.toString <| Url model.flagUrl.protocol model.flagUrl.host Nothing Consts.middleWarePath Nothing Nothing

                    else
                        Url.toString <| Url.Url model.flagUrl.protocol model.flagUrl.host (Just 3000) Consts.middleWarePath Nothing Nothing

                newHttpParams =
                    ToMongoDBMWConfig Consts.get headers flagUrlWithMongoDBMWAndPortUpdate Http.emptyBody Nothing Nothing

                apiSpecs =
                    model.apiSpecifics

                -- HACK:
                newModel =
                    { model
                        | toMongoDBMWConfig = Just newHttpParams
                        , queryType = LoggedInUser
                    }
            in
            ( newModel
            , -- NOTE: if you want to run a function based on the response can here:
              Cmd.none
              --loginRequest newModel
              --sendPostDataToMongoDBMW newModel
            )

        LNSConnectResponse (Err responseErr) ->
            let
                respErr =
                    Consts.httpErrorToString responseErr

                apiSpecs =
                    model.apiSpecifics

                newapiSpecs =
                    { apiSpecs | accessToken = Nothing }
            in
            ( { model | isValidNewAccessToken = False, apiSpecifics = newapiSpecs, errors = model.errors ++ [ respErr ] }
            , Cmd.none
            )

        -- NOTE: A successfull login gives a new valid access token
        -- which is immediately used to fetch the user's rankings details or general rankings for a Spectator
        -- NOTE: Prepare Booking Form
        BookingForm separatePosixDateandTimeCombined ->
            let
                apiSpecs =
                    model.apiSpecifics
            in
            ( model
            , Cmd.none
            )

        LoginResponse (Ok auth) ->
            let
                headers =
                    -- NOTE: the 'Zoho-oauthtoken' sent at this point is the access token received after refresh
                    [ Http.header "Authorization" ("Bearer " ++ withDefault "No access token 2" (Just auth.access_token)) ]

                -- incorporate new header with access token and update middleware port
                flagUrlWithMongoDBMWAndPortUpdate =
                    if String.contains Consts.localorproductionServerAutoCheck model.flagUrl.host then
                        Url.toString <| Url model.flagUrl.protocol model.flagUrl.host Nothing Consts.middleWarePath Nothing Nothing

                    else
                        Url.toString <| Url.Url model.flagUrl.protocol model.flagUrl.host (Just 3000) Consts.middleWarePath Nothing Nothing

                newHttpParams =
                    ToMongoDBMWConfig Consts.get headers flagUrlWithMongoDBMWAndPortUpdate Http.emptyBody Nothing Nothing

                apiSpecs =
                    model.apiSpecifics

                -- HACK:
                newModel =
                    { model
                        | toMongoDBMWConfig = Just newHttpParams
                        , isValidNewAccessToken = True
                        , apiSpecifics = { apiSpecs | accessToken = Just auth.access_token }
                        , queryType = LoggedInUser
                    }

                --}
            in
            ( { newModel
                -- REVIEW: Maybe handle specRankingResult differently?
                | isWaitingForResponse = False

                --, selectedranking = R.Spectator specRankingResult
              }
            , profileRequest newModel
            )

        LoginResponse (Err responseErr) ->
            let
                -- REVIEW: We can make more specific error messages here
                newFailedErr =
                    case responseErr of
                        Http.BadStatus 401 ->
                            "Login Denied - Please try again ..."

                        _ ->
                            "Login Denied - Please try again ..."

                newModel =
                    { model | errors = [ newFailedErr ] }
            in
            ( newModel
            , Cmd.none
            )

        SpectatorRankingResponse (Ok specRankingResult) ->
            ( {- { model
                   -- REVIEW: Maybe handle specRankingResult differently?
                   | isWaitingForResponse = False
                   , selectedranking = R.Spectator specRankingResult
                 }
              -}
              model
            , Cmd.none
            )

        SpectatorRankingResponse (Err responseErr) ->
            ( model
            , Cmd.none
            )

        -- NAV: Update - User registration form fields
        UpdateNickName value ->
            let
                newModel =
                    -- NOTE: Use updateNewUserRegistrationFormField cos have to dig deep into model to update cust details?
                    -- REVIEW: Send name age etc. as Msg value args
                    updateNewUserRegistrationFormField (UpdateNickName value) model.queryType model
            in
            -- NOTE: Clear top level error msg
            ( { newModel | errors = [ "" ] }, Cmd.none )

        -- REVIEW: These fields may be optional for users
        UpdateAge value ->
            ( model
            , Cmd.none
            )

        UpdateGender value ->
            ( model
            , Cmd.none
            )

        UpdateEmail email ->
            ( updateNewUserRegistrationFormField (UpdateEmail email) model.queryType model
            , Cmd.none
            )

        UpdatePassword pword ->
            ( updateNewUserRegistrationFormField (UpdatePassword pword) model.queryType model
            , Cmd.none
            )

        UpdateLevel lvel ->
            ( updateNewUserRegistrationFormField (UpdateLevel lvel) model.queryType model
            , Cmd.none
            )

        UpdateComment comment ->
            ( updateNewUserRegistrationFormField (UpdateComment comment) model.queryType model
            , Cmd.none
            )

        UpdateMobile mobile ->
            ( updateNewUserRegistrationFormField (UpdateMobile mobile) model.queryType model
            , Cmd.none
            )

        UpdatePhone phone ->
            ( updateNewUserRegistrationFormField (UpdatePhone phone) model.queryType model
            , Cmd.none
            )

        CondoNameInput value ->
            ( model
            , Cmd.none
            )

        CondoAddressInput value ->
            ( model
            , Cmd.none
            )

        AddInfoInput value ->
            ( model
            , Cmd.none
            )

        -- NAV: Update - SubmitSearchForm
        -- NOTE: If, in future updates/releases, you want to do a lot of validation
        -- at this point can -- REF: Haveno-Web-Responsive-Zoho app. Don't need here.
        FetchSpectatorRanking rankingId ->
            {- let
                   -- NOTE: Build the json body
                   postDataForMongoDBMWSvr : E.Value
                   postDataForMongoDBMWSvr =
                       E.object
                           [ -- NOTE: Sending to API url
                             ( "apiUrl"
                             , E.string <|
                                   Url.toString Consts.placeholderUrl
                             )
                           , ( "query_type", E.string "fetch" )
                           , ( "rankingid", E.string <| rankingId )
                           ]

                   -- NOTE: Update the model with the new postDataForMongoDBMWSvr
                   -- RF
                   updatedFlagUrlToIncludeMongoDBMWSvr =
                       -- TODO: Replace with sportsrank for production:
                       if String.contains Consts.localorproductionServerAutoCheck model.flagUrl.host then
                           Url.toString <| Url model.flagUrl.protocol model.flagUrl.host Nothing Consts.productionProxyConfig Nothing Nothing

                       else
                           Url.toString <| Url model.flagUrl.protocol model.flagUrl.host (Just 3000) Consts.middleWarePath Nothing Nothing

                   updatModelWithNewPostData =
                       { model
                           | toMongoDBMWConfig = Just (ToMongoDBMWConfig Consts.post [] updatedFlagUrlToIncludeMongoDBMWSvr (Http.jsonBody postDataForMongoDBMWSvr) Nothing Nothing)
                           , queryType = SpectatorSelectedView
                           , isWaitingForResponse = True
                           , errors = [ "" ]
                           , selectedranking = R.Spectator R.emptyRanking
                       }
               in
            -}
            -- NOTE: set isWaitingForResponse to disable button in case user presses submit multiple times
            -- NOTE: rankingId - straight from the UI into the model
            ( --updatModelWithNewPostData
              model
            , -- NOTE: Until figure out why browsers are prejudiced against elm (cors), although this Msg enables updating the model
              -- the 'work' is done in sendMessageToJs in Main as usual.
              Cmd.none
            )

        ConfirmBookingForm ->
            ( model
            , Cmd.none
            )



-- handle error case here if needed
-- add more message handlers here as needed
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
                    div [] [ text "error" ]

                Loaded ->
                    div
                        [ class "split-col"
                        ]
                        [ hardwareWalletView model
                        ]
            , div
                [ class "split-col"
                ]
                []
            ]
        ]



-- NAV: View helpers
-- REVIEW: This function needs to be split into more relevant categories separating ranking btns from login
-- NOTE: Only a Registered user can do this:


createChallengeView : U.UserInfo -> R.Rank -> R.Ranking -> Html Msg
createChallengeView uinfo rank ranking =
    -- NOTE: Can't challenge yourself
    if rank.player.id /= uinfo.userid then
        -- REVIEW: Can't challenge below yourself. This is an application constraint currently. For UI and DB reasons
        -- If player is no.1 then, unfortunately, nothing can do currently
        if not (isUserRankedHigher uinfo ranking) then
            Framework.responsiveLayout [] <|
                Element.column Grid.section <|
                    [ Element.el Heading.h6 <| Element.text <| " Your opponent's details: "
                    , Element.paragraph (Card.fill ++ Color.info) <|
                        [ Element.el [] <| Element.text <| uinfo.nickname ++ " you are challenging " ++ rank.player.nickname
                        ]
                    , Element.el [] <| Element.text <| "Email: "
                    , Element.paragraph (Card.fill ++ Color.info) <|
                        [ Element.el [] <| Element.text <| "challenger@c.com"
                        ]
                    , Element.el [] <| Element.text <| "Mobile: "
                    , Element.paragraph (Card.fill ++ Color.info) <|
                        [ Element.el [] <| Element.text <| "challenger mobile"
                        ]
                    , Element.column (Card.simple ++ Grid.simple) <|
                        [ Element.wrappedRow Grid.simple <|
                            [ Input.button (Button.simple ++ Color.simple) <|
                                { onPress = Just <| Cancel
                                , label = Element.text "Cancel"
                                }
                            , Input.button (Button.simple ++ Color.info) <|
                                { onPress = Just <| ConfirmChallenge ranking rank
                                , label = Element.text "Confirm"
                                }
                            ]
                        ]
                    ]

        else
            Framework.responsiveLayout [] <|
                Element.column Grid.section <|
                    [ Element.paragraph (Card.fill ++ Color.info) <|
                        [ Element.el [] <| Element.text <| uinfo.nickname ++ " aim high! Challenge up "
                        ]
                    , Element.column (Card.simple ++ Grid.simple) <|
                        [ Element.wrappedRow Grid.simple <|
                            [ Input.button (Button.simple ++ Color.simple) <|
                                { onPress = Just <| Cancel
                                , label = Element.text "Cancel"
                                }
                            ]
                        ]
                    ]

    else
        Framework.responsiveLayout [] <|
            Element.column Grid.section <|
                [ Element.paragraph (Card.fill ++ Color.info) <|
                    [ Element.el [] <| Element.text <| rank.player.nickname ++ " you can't challenge yourself! "
                    ]
                , Element.column (Card.simple ++ Grid.simple) <|
                    [ Element.wrappedRow Grid.simple <|
                        [ Input.button (Button.simple ++ Color.simple) <|
                            { onPress = Just <| Cancel
                            , label = Element.text "Cancel"
                            }
                        ]
                    ]
                ]



-- REVIEW: Combine these views into 1?


ownedSelectedView : U.UserInfo -> R.Ranking -> Html Msg
ownedSelectedView u r =
    Framework.responsiveLayout [] <|
        Element.column
            Framework.container
            -- HACK:
            [ Element.wrappedRow [] <| [ El.ownedSelectedRankingHeaderEl r ]

            -- NOTE: Put the Element.width attribute into the list (using cons ::)
            -- Card.simple is a LIST!
            , Element.column (Element.width Element.fill :: Card.simple ++ Grid.simple)
                [ infoBtn "Delete" <| DialogDeleteOwnedRanking
                , infoBtn "Cancel" <| CancelFetchedOwned u
                , playerbuttons r u
                ]
            ]


memberSelectedView : U.UserInfo -> R.Ranking -> Html Msg
memberSelectedView u r =
    Framework.responsiveLayout [] <|
        Element.column
            Framework.container
            [ Element.wrappedRow [] <| [ El.memberSelectedRankingHeaderEl u r ]

            -- NOTE: Put the Element.width attribute into the list (using cons ::)
            -- Card.simple is a LIST!
            , Element.column (Element.width Element.fill :: Card.simple ++ Grid.simple)
                [ infoBtn "Leave" DialogueConfirmLeaveView
                , infoBtn "Cancel" <| CancelFetchedMember
                , playerbuttons r u
                ]
            ]


spectatorSelectedView : U.UserInfo -> R.Ranking -> Html Msg
spectatorSelectedView u r =
    Framework.responsiveLayout [] <|
        Element.column
            Framework.container
            [ Element.wrappedRow [] <| [ El.spectatorSelectedRankingHeaderEl u r ]

            -- NOTE: Put the Element.width attribute into the list (using cons ::)
            -- Card.simple is a LIST!
            , Element.column (Element.width Element.fill :: Card.simple ++ Grid.simple)
                [ infoBtn "Join This Ladder?" SpectatorJoin
                , infoBtn "Cancel" <| CancelFetchedSpectator
                , playerbuttons r u
                ]
            ]



-- NOTE: You're always a spectator until you actually join a ranking


confirmJoinView : U.UserInfo -> R.Ranking -> Html Msg
confirmJoinView userInfo ranking =
    Framework.responsiveLayout [] <|
        Element.column
            Framework.container
            [ Element.wrappedRow [] <| [ El.spectatorSelectedRankingHeaderEl userInfo ranking ]
            , Element.el Heading.h5 <| Element.text <| userInfo.nickname ++ " - Are you sure you want to join" ++ ranking.owner_name ++ "'s  ranking?"

            -- NOTE: Put the Element.width attribute into the list (using cons ::)
            -- Card.simple is a LIST!
            , Element.column (Element.width Element.fill :: Card.simple ++ Grid.simple)
                [ infoBtn "Join" <| ConfirmJoin ranking userInfo.userid (Maybe.withDefault R.emptyRank (R.gotLowestRank ranking.ladder)).rank
                , infoBtn "Cancel" <| CancelFetchedSpectator
                ]
            ]


confirmLeaveView : U.UserInfo -> R.Ranking -> Html Msg
confirmLeaveView userInfo ranking =
    Framework.responsiveLayout [] <|
        Element.column
            Framework.container
            [ Element.wrappedRow [] <| [ El.memberSelectedRankingHeaderEl userInfo ranking ]
            , Element.el Heading.h5 <| Element.text <| userInfo.nickname ++ " - Are you sure you want to leave " ++ ranking.owner_name ++ "'s  ranking?"

            -- NOTE: Put the Element.width attribute into the list (using cons ::)
            -- Card.simple is a LIST!
            , Element.column (Element.width Element.fill :: Card.simple ++ Grid.simple)
                [ infoBtn "Leave" <| ConfirmLeaveMemberRanking ranking userInfo.userid
                , infoBtn "Cancel" <| CancelFetchedMember
                ]
            ]


confirmDeleteUserView : U.UserInfo -> Html Msg
confirmDeleteUserView userInfo =
    Framework.responsiveLayout [] <|
        Element.column
            Framework.container
            [ Element.el Heading.h5 <| Element.text <| userInfo.nickname ++ """ - Are you sure you want to delete your account?
            Please note that this will delete all your AND THE RANKING MEMBER'S rankings and is IRREVERSIBLE!
            (You may wish to inform them before deleting)"""
            , Element.column (Element.width Element.fill :: Card.simple ++ Grid.simple)
                [ infoBtn "Delete User Account" <| DeleteAccount
                , infoBtn "Cancel" <| CancelFetchedMember
                ]
            ]


dialogueDeleteOwnedView : U.UserInfo -> R.Ranking -> Html Msg
dialogueDeleteOwnedView uinfo ranking =
    Framework.responsiveLayout [] <|
        Element.column
            Framework.container
            -- HACK:
            [ Element.el Heading.h6 <|
                Element.text <|
                    ranking.owner_name
                        ++ """ - Are you sure you want to delete this ranking?
            Please note that this will delete all your AND THE 
            RANKING MEMBER'S rankings and is IRREVERSIBLE!
            (You may wish to inform them before deleting)"""
            , Element.wrappedRow [] <| [ El.ownedSelectedRankingHeaderEl ranking ]

            -- NOTE: Put the Element.width attribute into the list (using cons ::)
            -- Card.simple is a LIST!
            , Element.column (Element.width Element.fill :: Card.simple ++ Grid.simple)
                [ infoBtn "Delete" <| DeleteOwnedRanking
                , infoBtn "Cancel" <| Cancel

                --, playerbuttons ranking
                ]
            ]


dialogueConfirmChallengeView : U.UserInfo -> R.Rank -> R.Ranking -> Html Msg
dialogueConfirmChallengeView uinfo rank ranking =
    Framework.responsiveLayout [] <|
        Element.column
            Framework.container
            -- HACK:
            [ Element.el Heading.h5 <| Element.text <| ranking.owner_name ++ " - Are you sure you want to challenge " ++ rank.player.nickname ++ "?"
            , Element.wrappedRow [] <| [ El.ownedSelectedRankingHeaderEl ranking ]

            -- NOTE: Put the Element.width attribute into the list (using cons ::)
            -- Card.simple is a LIST!
            , Element.column (Element.width Element.fill :: Card.simple ++ Grid.simple)
                [ infoBtn "Confirm" <| ConfirmChallenge ranking rank
                , infoBtn "Cancel" <| Cancel
                ]
            ]


dialoguePrepareResultView : U.UserInfo -> R.Rank -> R.Ranking -> Html Msg
dialoguePrepareResultView uinfo rank ranking =
    Framework.responsiveLayout [] <|
        Element.column
            Framework.container
            -- HACK:
            [ Element.el Heading.h5 <| Element.text <| uinfo.nickname ++ " - Are you ready to enter your result vs " ++ rank.challenger.nickname ++ "?"

            -- REVIEW: This depends on ranking type
            , if R.isUserOwnerOfRankning uinfo.userid ranking then
                Element.wrappedRow [] <| [ El.memberSelectedRankingHeaderEl uinfo ranking ]

              else
                Element.wrappedRow [] <| [ El.memberSelectedRankingHeaderEl uinfo ranking ]

            -- NOTE: Put the Element.width attribute into the list (using cons ::)
            -- Card.simple is a LIST!
            , Element.column (Element.width Element.fill :: Card.simple ++ Grid.simple)
                [ infoBtn "Win" <| ConfirmResult R.Won
                , infoBtn "Lose" <| ConfirmResult R.Lost
                , infoBtn "Abandon Challenge" <| ConfirmResult R.Undecided
                , infoBtn "Cancel" <| CancelDialoguePrepareResultView
                ]
            ]



-- NAV: Buttons


playerbuttons : R.Ranking -> U.UserInfo -> Element Msg
playerbuttons r u =
    let
        currentUserRank =
            Maybe.withDefault R.emptyRank <| findUserRank u.userid r.ladder
    in
    Element.column Grid.section <|
        [ Element.column (Card.simple ++ Grid.simple) <|
            List.map (configureThenAddPlayerRankingBtns currentUserRank)
                r.ladder
        ]


findUserRank : String -> List R.Rank -> Maybe R.Rank
findUserRank userid ladder =
    List.filter (\r -> r.player.id == userid) ladder
        |> List.head


singlePlayerBtnEnabled : R.Rank -> Element Msg
singlePlayerBtnEnabled r =
    Element.column Grid.simple <|
        [ Input.button (Button.fill ++ Color.primary) <|
            { onPress = Just <| ViewRank r
            , label = Element.text <| String.fromInt r.rank ++ ". " ++ r.player.nickname
            }
        ]


singlePlayerBtnDisabled : R.Rank -> Element Msg
singlePlayerBtnDisabled r =
    Element.column Grid.simple <|
        [ Input.button (Button.fill ++ enableButton False) <|
            { onPress = Just <| ViewRank r
            , label = Element.text <| String.fromInt r.rank ++ ". " ++ r.player.nickname
            }
        ]


challengeInProgressBtnEnabled : R.Rank -> Element Msg
challengeInProgressBtnEnabled r =
    Element.column Grid.simple <|
        [ Input.button (Button.fill ++ Color.primary) <|
            { onPress = Just <| ViewRank r
            , label = Element.text <| String.fromInt r.rank ++ ". " ++ r.player.nickname ++ " vs " ++ r.challenger.nickname
            }
        ]


challengeInProgressBtnDisabled : R.Rank -> Element Msg
challengeInProgressBtnDisabled r =
    Element.column Grid.simple <|
        [ Input.button (Button.fill ++ enableButton False) <|
            { onPress = Just <| ViewRank r
            , label = Element.text <| String.fromInt r.rank ++ ". " ++ r.player.nickname ++ " vs " ++ r.challenger.nickname
            }
        ]


configureThenAddPlayerRankingBtns : R.Rank -> R.Rank -> Element Msg
configureThenAddPlayerRankingBtns currentUserRank rank =
    let
        elementMsg =
            if determineButtonType currentUserRank rank == 1 then
                challengeInProgressBtnEnabled rank

            else if determineButtonType currentUserRank rank == 2 then
                challengeInProgressBtnDisabled rank

            else if determineButtonType currentUserRank rank == 3 then
                singlePlayerBtnEnabled rank

            else
                -- determineButtonType u rank == 4
                singlePlayerBtnDisabled rank
    in
    elementMsg



-- NOTE: This is a key function for determining the type of button to display
-- and is tested


determineButtonType : R.Rank -> R.Rank -> Int
determineButtonType loggedInUsersRank rankBeingIterated =
    let
        loggedInUserIsInAChallenge =
            loggedInUsersRank.challenger.id /= Consts.noCurrentChallengerId

        rankBeingIteratedIsInAChallenge =
            rankBeingIterated.challenger.id /= Consts.noCurrentChallengerId
    in
    if loggedInUserIsInAChallenge then
        if loggedInUsersRank.player.id == rankBeingIterated.player.id then
            1

        else if loggedInUsersRank.player.id == rankBeingIterated.challenger.id then
            2

        else
            4

    else if rankBeingIteratedIsInAChallenge then
        if loggedInUsersRank.player.id == rankBeingIterated.player.id then
            1

        else
            2

    else if loggedInUsersRank.rank - 1 == rankBeingIterated.rank then
        3

    else
        4


createLadderView : U.UserInfo -> R.Ranking -> Html Msg
createLadderView userInfo ranking =
    Framework.responsiveLayout [] <|
        Element.column Grid.section <|
            [ Element.el Heading.h5 <| Element.text <| userInfo.nickname ++ " - Please Enter Your Ladder \nDetails And Click 'Create' below:"
            , Element.wrappedRow (Card.fill ++ Grid.simple)
                [ Element.column
                    Grid.simple
                    -- NOTE: The onChanges are changing the model
                    -- so that e.g. the changes will be ready to
                    -- submit to the db:
                    [ Input.text (Input.simple ++ [ Element.htmlAttribute (Attr.id "RankingName") ])
                        { onChange = RankingNameChg
                        , text = ranking.name
                        , placeholder = Just <| Input.placeholder [] (Element.text "Ranking name*")
                        , label = Input.labelLeft (Input.label ++ [ Element.moveLeft 11.0 ]) (Element.text "Ranking name*")
                        }

                    --, nameValidView userInfo
                    , El.ladderNameValidation ranking
                    , Input.text (Input.simple ++ [ Element.htmlAttribute (Attr.id "Street") ])
                        { onChange = StreetAddressChg
                        , text = ranking.baseaddress.street
                        , placeholder = Just <| Input.placeholder [] (Element.text "Street")
                        , label = Input.labelLeft (Input.label ++ [ Element.moveLeft 11.0 ]) (Element.text "Street")
                        }
                    , El.ladderStreetValidation ranking

                    -- HACK: Commented for now:
                    --, userDescValidationErr userInfo.description
                    , Input.text (Input.simple ++ [ Element.htmlAttribute (Attr.id "City") ])
                        { onChange = CityAddressChg
                        , text = ranking.baseaddress.city
                        , placeholder = Just <| Input.placeholder [] (Element.text "City")
                        , label = Input.labelLeft (Input.label ++ [ Element.moveLeft 11.0 ]) (Element.text "City")
                        }
                    , El.ladderCityValidation ranking
                    ]
                ]
            , Element.text "* required"
            , rankingDetailsConfirmPanel ranking userInfo
            ]


spectatorRankingBtn : R.RankingSearchResult -> Element Msg
spectatorRankingBtn ranking =
    Element.column Grid.simple <|
        [ Input.button (Button.fill ++ Color.info) <|
            { -- HACK: Avoiding issue of what type ClickedSelectedRanking is expecting
              -- and how a ranking will be processed in update (i.e. will a ranking need to 'know' if it's owned or member?)
              onPress = Just <| FetchSpectatorRanking ranking.id
            , label = Element.text ranking.name
            }
        ]


memberRankingBtn : R.Ranking -> Element Msg
memberRankingBtn ranking =
    Element.column Grid.simple <|
        [ Input.button (Button.fill ++ Color.info) <|
            { -- HACK: Avoiding issue of what type ClickedSelectedRanking is expecting
              -- and how a ranking will be processed in update (i.e. will a ranking need to 'know' if it's owned or member?)
              onPress = Just <| FetchMember ranking
            , label = Element.text ranking.name
            }
        ]


ownedRankingBtn : R.Ranking -> Element Msg
ownedRankingBtn ranking =
    Element.column Grid.simple <|
        [ Input.button (Button.fill ++ Color.primary) <|
            { -- HACK: Avoiding issue of what type ClickedSelectedRanking is expecting
              -- and how a ranking will be processed in update (i.e. will a ranking need to 'know' if it's owned or member?)
              onPress = Just <| FetchOwned ranking
            , label = Element.text ranking.name
            }
        ]


spectatorView : Html Msg
spectatorView =
    Framework.responsiveLayout [] <|
        Element.column Framework.container <|
            [ El.globalHeading U.emptySpectator
            , Element.text "\n Hi Spectator! \n"
            , infoBtn "Back to Login" LogOut
            , Element.text "\n"

            --, infoBtn "Cancel" <| Cancel U.emptyUserInfo
            --, displayGlobalRankingBtns searchterm searchResults userVal
            ]


globalView : String -> List R.RankingSearchResult -> U.User -> Html Msg
globalView searchterm searchResults userVal =
    case userVal of
        U.Spectator _ ->
            Framework.responsiveLayout [] <|
                Element.column Framework.container <|
                    [ El.globalHeading userVal
                    , Element.text "\n"
                    ]

        U.Registered _ ->
            Framework.responsiveLayout [] <|
                Element.column Framework.container <|
                    [ El.globalHeading userVal
                    , Element.text "\n"
                    , infoBtn "Log Out" LogOut
                    , Element.text "\n"
                    , infoBtn "Delete Account" DialogueConfirmDeleteAccount
                    ]


hardwareWalletView : Model -> Html Msg
hardwareWalletView model =
    Framework.responsiveLayout [] <|
        Element.column Framework.container <|
            [ Element.el Heading.h5 <| Element.text "Haveno Web - Connect Hardware"
            , Element.text "\n"
            , infoBtn "Connect Hardware Device" <| ClickedHardwareDeviceConnect
            , Element.text "\n"
            , infoBtn "Connect XMR Wallet" <| ClickedXMRWalletConnect
            , Element.text "\n"
            , Element.el Heading.h6 <|
                Element.text
                    (if model.isHardwareLNSConnected then
                        "Nano S Connected"

                     else if model.isHardwareLNXConnected then
                        "Nano X Connected"

                     else if model.isXMRWalletConnected then
                        "XMR Wallet Connected"

                     else
                        "Not connected yet"
                    )

            --
            , Element.text "\n"
            , infoBtn "Initiate Transaction" <| ClickedXMRInitiateTransaction "0.01"
            , case model.errors of
                [] ->
                    Element.text ""

                _ ->
                    Element.column Grid.section <|
                        List.map (\error -> Element.el Heading.h6 (Element.text error)) model.errors
            ]


registerView : U.UserInfo -> Html Msg
registerView userInfo =
    Framework.responsiveLayout [] <|
        Element.column Grid.section <|
            [ Element.el Heading.h5 <| Element.text "Please Enter Your User \nDetails And Click 'Register' below:"
            , Element.wrappedRow (Card.fill ++ Grid.simple)
                [ Element.column
                    Grid.simple
                    [ Input.email (Input.simple ++ [ Element.htmlAttribute (Attr.id "userEmail"), Input.focusedOnLoad ])
                        { onChange = UpdateEmail
                        , text = Maybe.withDefault "" userInfo.email
                        , placeholder = Just <| Input.placeholder [] (Element.text "Email")
                        , label = Input.labelLeft (Input.label ++ [ Element.moveLeft 11.0 ]) (Element.text "Email*")
                        }
                    , emailValidationErr (Maybe.withDefault "" userInfo.email)
                    , Input.newPassword (Input.simple ++ [ Element.htmlAttribute (Attr.id "Password") ])
                        { -- HACK: until ready to implement the changes
                          onChange = UpdatePassword
                        , text = userInfo.password
                        , placeholder = Just <| Input.placeholder [] (Element.text "Password")
                        , label = Input.labelLeft (Input.label ++ [ Element.moveLeft 11.0 ]) (Element.text "Password*")
                        , show = False
                        }
                    , El.passwordValidView userInfo
                    , Input.text (Input.simple ++ [ Element.htmlAttribute (Attr.id "nickName") ])
                        { onChange = UpdateNickName
                        , text = userInfo.nickname
                        , placeholder = Just <| Input.placeholder [] (Element.text "Nickname")
                        , label = Input.labelLeft (Input.label ++ [ Element.moveLeft 11.0 ]) (Element.text "Nickname")
                        }
                    , El.nameValidView userInfo
                    , Input.text (Input.simple ++ [ Element.htmlAttribute (Attr.id "Level") ])
                        { onChange = UpdateLevel

                        -- HACK: level left out, only comment for now
                        , text = userInfo.description.level
                        , placeholder = Just <| Input.placeholder [] (Element.text "Level")
                        , label = Input.labelLeft (Input.label ++ [ Element.moveLeft 11.0 ]) (Element.text "Level")
                        }

                    -- HACK: Commented for now:
                    --, userDescValidationErr userInfo.description
                    , Input.text (Input.simple ++ [ Element.htmlAttribute (Attr.id "Comment") ])
                        { onChange = UpdateComment

                        -- HACK: level left out, only comment for now
                        , text = userInfo.description.comment
                        , placeholder = Just <| Input.placeholder [] (Element.text "Comment")
                        , label = Input.labelLeft (Input.label ++ [ Element.moveLeft 11.0 ]) (Element.text "Comment")
                        }

                    -- HACK: Commented for now:
                    --, userDescValidationErr userInfo.description
                    , Input.text (Input.simple ++ [ Element.htmlAttribute (Attr.id "userMobile") ])
                        { onChange = UpdateMobile
                        , text = V.validatedMaxTextLength (Maybe.withDefault "" userInfo.mobile) 25
                        , placeholder = Just <| Input.placeholder [] (Element.text "Mobile")
                        , label = Input.labelLeft (Input.label ++ [ Element.moveLeft 11.0 ]) (Element.text "Mobile \n(inc. Int code\neg.+65)")
                        }
                    , mobileValidationErr (Maybe.withDefault "" userInfo.mobile)
                    ]
                ]
            , Element.text "* required"
            , El.justParasimpleUserInfoText
            , userDetailsConfirmPanel userInfo
            , Element.text "\n"
            ]



{- U.Registered ( _ ) ->
   Framework.responsiveLayout [] <|
       Element.column Grid.section <|
           [ Element.el Heading.h5 <| Element.text "You are already registered!! :) "
           , El.justParasimpleUserInfoText
           ]
-}
-- NAV: Type aliases


type alias EmailPasswordLogin =
    { email : String

    -- TODO: Obfuscate pword
    , password : String
    }


type alias FromMainToRankings =
    { time : Maybe DateTime
    , flagUrl : Url.Url
    }


type alias ToMongoDBMWConfig =
    { method : String
    , headers : List Header
    , url : String
    , body : Body
    , timeout : Maybe Float
    , tracker : Maybe String
    }



-- NAV: Custom types


type JsonData
    = Stringified String
    | JsonObj D.Value


type Hardware
    = Hardware
        { name : String
        }



{- These are mutually exclusive, so we can make them a custom type
   in Elm, each variant in a custom type acts as a constructor function, which can be used to create values of that type.
-}


type Status
    = Loading
    | Loaded
    | Errored



-- NAV: API specifics
-- This is the key field in the model with details specific to a given queryType
-- e.g. apiBaseUrl ++ "?from=" ++ fromTime ++ "&checksum=" ++ checksumCalc ++ "&user=0" ++ "&maxresults=18"


type alias ApiSpecifics =
    { maxResults : String

    -- NOTE: Key field:
    --, queryType : QueryType
    , accessToken : Maybe String
    }



-- NOTE: API here means you could, theoretically, use this page to access multiple different
-- APIs.


type API
    = MongoDB Url
    | Zoho Url



-- NOTE: Add Maybe on larger records to avoid needing placeholders?
-- No, cos when you actually pull a record from the db it will be a Just <type>
-- and you end up needing a placeholder anyway
{- -- NOTE: the queryType field in the model determines which specific UI components are rendered. This approach
   keeps the view code clean and modular while allowing you to handle different
   UI scenarios based on the model's state. It's a flexible and maintainable way to
   manage conditional rendering without the need to add more Msg values for UI changes.
-}
-- REVIEW: End each one with 'View' - if they don't determine a view, what doing here?


type QueryType
    = RefreshTknQP RefreshTokenQueryParams -- REVIEW: this should only be a Msg?
    | Login EmailPasswordLogin
    | Spectator
    | RegisterUser U.UserInfo
    | LoggedInUser
    | CreatingNewLadder U.UserInfo
    | OwnedSelectedView
    | MemberSelectedView
    | SpectatorSelectedView
    | ConfirmDeleteOwnedRanking
    | CreateChallengeView R.Rank R.Ranking
    | ConfirmChallengeView R.Rank R.Ranking
    | PrepareResult
    | Error String
    | ConfirmJoinMemberView
    | ConfirmLeaveMemberView
    | ConfirmDeleteUserView



-- NAV: QueryType definitions
-- QueryType in ApiSpecifics will determine which request data is used
-- REF: https://www.zoho.com/bookings/help/api/v1/oauthauthentication.html


type alias Slot =
    { start : String
    , finish : String
    }


type alias RefreshTokenQueryParams =
    { grant_type : String
    }


refreshTokenQP : RefreshTokenQueryParams
refreshTokenQP =
    RefreshTokenQueryParams
        "refresh_token"



-- NOTE: staff and service_ids are in CustomerDetails Availability record Venue type


type alias RegisterUserDetails =
    { resource_id : String

    --, from_time : DateTime
    -- HACK : user details and add fields will be a records
    , user_details : U.User --CustomerDetails
    , additional_fields : String
    }


emptyRegisterUserDetails : RegisterUserDetails
emptyRegisterUserDetails =
    RegisterUserDetails "" U.emptySpectator ""



-- NOTE: We don't need additional fields and they are optional. If need later look in snippets
-- some work already done.


type alias CustomerDetails =
    { name : Maybe String
    , isNameInputFocused : Bool
    , nameValidationError : String
    , age : String
    , email : Maybe String
    , isEmailInputFocused : Bool
    , emailValidationError : String
    , phone : Maybe String
    , isPhoneInputFocused : Bool
    , phoneValidationError : String
    , condoname : Maybe String
    , isCondoNameInputFocused : Bool
    , condonameValidationError : String
    , condoaddress : Maybe String
    , isCondoAddressInputFocused : Bool
    , condoaddressValidationError : String
    , addInfo : String
    }



-- NOTE: One off tick on init to give us today's datetime


getCurrentTimeTask : Cmd Msg
getCurrentTimeTask =
    Task.perform Tick Time.now


apiSpecsPlaceHolder : ApiSpecifics
apiSpecsPlaceHolder =
    ApiSpecifics
        ""
        -- HACK: This doesn't belong here I think
        --(Login { email = "", password = "" })
        Nothing



-- NAV: Json type definitions
-- NOTE: Make the order of the types match the json.
-- Use these with the decoders


type alias SearchResults =
    { searchresponse : List R.RankingSearchResult
    }


type alias SuccessfulLoginResult =
    { access_token : String
    , refresh_token : String
    , user_id : String
    , device_id : String
    }


type alias FailedLoginResult =
    { error : String
    , error_code : String
    , link : String
    }


type alias SuccessfullLNSConnectResult =
    { function : String
    , date : String
    , id : String
    , message : String
    , transport_type : String
    }



{- [ ( "context", E.object [ ( "function", E.string "send" ) ] )
   , ( "date", E.string "Tue Aug 27 2024 12:56:47 GMT+0800 (Singapore Standard Time)" )
   , ( "id", E.string "5" )
   , ( "message", E.string "Received response from exchange" )
   , ( "type", E.string "transport" )
   ]
-}


type alias FailedLocationResult =
    { error : String
    , error_code : String
    , link : String
    }


type alias SuccessfullProfileResult =
    { user_id : String
    , domain_id : String
    , identities : List Identities
    , data : ProviderData
    , typeOfData : String
    }


type alias ProviderData =
    { email : String
    }


type alias Identities =
    { id : String
    , provider_type : String
    , provider_id : String
    , provider_data : ProviderData
    }


type alias FailedProfileResult =
    { error : String
    , error_code : String
    , link : String
    }


type alias DataTypeFromResponse =
    { datatype : String
    }


type alias JsonMsgFromJs =
    { operationEventMsg : String
    , dataFromMongo : DataFromMongo
    , additionalDataFromJs : AdditionalDataFromJs
    }


type alias OperationEventMsg =
    { operationEventMsg : String
    }


type DataFromMongo
    = JsonData D.Value
    | StringData String


type alias AdditionalDataFromJs =
    { userid : String, nickname : String }



-- NAV: Json decoders
-- NOTE: decoders match values, they don't convert them. They are like a doorman.
-- NOTE: decide if you want them to return elm types or json values. Usually the former.
-- NOTE: If some json comes from outside elm, e.g. resulting from an http request
-- these decoders will be the first thing it meets. They are like doormen ensuring
-- the json that comes in at least has all the fields the types need. The json will be passed
-- from 'doorman' to 'doorman' as the decoders drill into the levels of the json. If all min
-- requirements are satisfied return Ok, otherwise Err.
-- REVIEW: Does this work?


decodeJsonString : String -> Result D.Error D.Value
decodeJsonString jsonString =
    D.decodeString D.value jsonString


dataFromMongoDecoder : Decoder DataFromMongo
dataFromMongoDecoder =
    D.oneOf
        [ D.map JsonData D.value
        , D.map StringData D.string
        ]


jsonMsgFromJsDecoder : Decoder JsonMsgFromJs
jsonMsgFromJsDecoder =
    D.map3 JsonMsgFromJs
        (field "operationEventMsg" D.string)
        (field "dataFromMongo" dataFromMongoDecoder)
        (field "additionalDataFromJs" additonalDataFromJsDecoder)


justmsgFieldFromJsonDecoder : Decoder OperationEventMsg
justmsgFieldFromJsonDecoder =
    D.map OperationEventMsg
        (D.field "operationEventMsg" D.string)


additonalDataFromJsDecoder : Decoder AdditionalDataFromJs
additonalDataFromJsDecoder =
    D.map2 AdditionalDataFromJs
        (field "userid" D.string)
        (field "nickname" D.string)


searchResultsDecoder : Decoder SearchResults
searchResultsDecoder =
    D.map SearchResults
        (field "results" (D.list R.rankingSearchResultDecoder))


successfullLoginResultDecoder : Decoder SuccessfulLoginResult
successfullLoginResultDecoder =
    D.map4 SuccessfulLoginResult
        (field "access_token" D.string)
        (field "refresh_token" D.string)
        (field "user_id" D.string)
        (field "device_id" D.string)


failedLoginResultDecoder : Decoder FailedLoginResult
failedLoginResultDecoder =
    D.map3 FailedLoginResult
        (field "error" D.string)
        (field "error_code" D.string)
        (field "link" D.string)


lnsResponseDecoder : Decoder SuccessfullLNSConnectResult
lnsResponseDecoder =
    D.map5 SuccessfullLNSConnectResult
        (D.field "context" (D.field "function" D.string))
        (field "date" D.string)
        (field "id" D.string)
        (field "message" D.string)
        (field "type" D.string)


providerDataDecoder : D.Decoder ProviderData
providerDataDecoder =
    D.map ProviderData
        (D.field "email" D.string)


identitiesDecoder : D.Decoder (List Identities)
identitiesDecoder =
    D.list <|
        D.map4 Identities
            (D.field "id" D.string)
            (D.field "provider_type" D.string)
            (D.field "provider_id" D.string)
            (D.field "provider_data" providerDataDecoder)


profileDecoder : D.Decoder SuccessfullProfileResult
profileDecoder =
    D.map5 SuccessfullProfileResult
        (D.field "user_id" D.string)
        (D.field "domain_id" D.string)
        (D.field "identities" identitiesDecoder)
        (D.field "data" providerDataDecoder)
        (D.field "type" D.string)



-- NAV: Subscriptions
-- Define the subscription function


hardwareSubscriptions : Model -> Sub Msg
hardwareSubscriptions _ =
    -- Replace with your actual subscription logic
    --Sub.batch [ receiveMessageFromJs ResponseDataFromMain ]
    Sub.none



-- NAV: Websocket decoders
-- NOTE: Decoders and their types for change event data from the websocket:
-- NOTE: PlayerFromChangeEvent is what mongodb is sending to the websocket on a change
-- naming is deliberate to ensure it doesn't get confused with existing Player or Rank
-- types, which it appears to be an amalgam of.


type alias FullDocument =
    { id : String
    , active : Bool
    , name : String

    -- NOTE: AI suggested way to handle "players.4" etc.
    , players : Maybe (List PlayerFromChangeEvent)
    , ownerId : String
    , baseAddress : R.BaseAddress
    , lastUpdatedBy : String
    }


type alias UpdateDescription =
    { updatedFields : Dict String (List PlayerFromChangeEvent)
    , removedFields : List String
    , truncatedArrays : List String
    }


type alias Change =
    { operationType : String
    , documentKey : DocumentKey
    , updateDescription : UpdateDescription
    , fullDocument : Maybe FullDocument
    }


type alias PlayerFromChangeEvent =
    { playerId : String
    , challengerId : String
    , rank : Int
    }


type alias DocumentKey =
    { id : String
    }



-- NOTE: If UpdatedFieldsFromChangeEvent can be either a
--PlayerFromChangeEvent or an IdbaastransactionFromUpdatedFields,
--you can define it as a union type:
-- NOTE: Expecting an OBJECT with a field named <field>
-- means response was 'Error'
{- To handle both cases where updatedFields can be either a single object or a list of objects,
   you can create a custom decoder that first attempts to decode the data as a list.
   If that fails, it then tries to decode the data as a single object and wraps it in a list.

   Here's how you might modify your playerDecoder to handle both cases:
-}


documentKeyDecoder : Decoder DocumentKey
documentKeyDecoder =
    D.map DocumentKey
        (D.field "_id" D.string)


playerDecoder : Decoder PlayerFromChangeEvent
playerDecoder =
    D.map3 PlayerFromChangeEvent
        (D.field "playerId" D.string)
        (D.field "challengerId" D.string)
        (D.field "rank" D.int)


baseAddressDecoder : Decoder R.BaseAddress
baseAddressDecoder =
    D.map2 R.BaseAddress
        (D.field "street" D.string)
        (D.field "city" D.string)


fullDocumentDecoder : Decoder FullDocument
fullDocumentDecoder =
    D.succeed FullDocument
        |> required "_id" D.string
        |> required "active" D.bool
        |> required "name" D.string
        |> optional "players" (D.maybe (D.list playerFromChangeEventDecoder)) Nothing
        |> required "owner_id" D.string
        |> required "baseaddress" baseAddressDecoder
        |> required "lastUpdatedBy" D.string


playerFromChangeEventDecoder : Decoder PlayerFromChangeEvent
playerFromChangeEventDecoder =
    map3 PlayerFromChangeEvent
        (field "playerId" D.string)
        (field "challengerId" D.string)
        (field "rank" D.int)


updateDescriptionDecoder : Decoder UpdateDescription
updateDescriptionDecoder =
    D.map3 UpdateDescription
        (D.field "updatedFields" (D.dict updatedFieldDecoder))
        (D.field "removedFields" (D.list D.string))
        (D.field "truncatedArrays" (D.list D.string))


updatedFieldDecoder : Decoder (List PlayerFromChangeEvent)
updatedFieldDecoder =
    D.oneOf
        [ D.list playerFromChangeEventDecoder
        , playerFromChangeEventDecoder |> D.map (\player -> [ player ])
        , D.string |> D.andThen (\_ -> D.succeed [])
        ]


changeDecoder : Decoder Change
changeDecoder =
    D.map4 Change
        (D.field "operationType" D.string)
        (D.field "documentKey" documentKeyDecoder)
        (D.field "updateDescription" updateDescriptionDecoder)
        (D.field "fullDocument" (D.maybe fullDocumentDecoder))



-- NOTE: You can skip fields if don't need them - just make
-- sure the type definitions above match up
-- NOTE: Pipeline approach -- REF: https://discourse.elm-lang.org/t/is-this-way-to-decode-more-than-8-fields-from-a-json-hash-good/3814/4
-- NOTE: required function enables going beyond map8


required : String -> Decoder a -> Decoder (a -> b) -> Decoder b
required fieldName itemDecoder functionDecoder =
    decodeApply (field fieldName itemDecoder) functionDecoder


decodeApply : Decoder a -> Decoder (a -> b) -> Decoder b
decodeApply =
    D.map2 (|>)



{- -- NOTE: CORS restrictions are imposed by a web browser on the SENDING of a request from a web page hosted on one domain to a different domain.
   They can be overcome by the API server resonding with friendly headers - but most servers don't want to do this so end up back with mongodbMW
-}
-- NOTE: Orignal code:
{- In Zoho's API authentication flow, the refresh token plays a crucial role in obtaining a new access token
   when the current access token expires. It is part of the OAuth 2.0 authentication process used by Zoho to
   secure their APIs and grant authorized access to users.
-}
{- -- NOTE: Directly talking to APIs via Https requests depends on what you're doing. e.g. for mongodb you can use
   it for the following:

   REVIEW: Apparently, but not actually. Browsers are not happy with requests originating from elm directly. Why this
   is the case needs more research.

   Authentication and User Management: Some administrative tasks, like creating and managing user accounts, can be performed
   using the MongoDB management API endpoints.

   Indexes: You can create and manage indexes in MongoDB directly through administrative API endpoints.

   But not for the actual database CRUD operations. It was the same for Zoho, where you also sent the requests to .js
   and they were managed via specific imported Node.js modules

   You don't typically use the traditional MongoDB Node.js driver or MongoDB-specific Node.js modules when
   working with Atlas Search, as it's a specialized feature separate from the core MongoDB functionality.
-}
-- NAV: Http requests


lnsConnectRequest : Model -> Cmd Msg
lnsConnectRequest model =
    let
        -- NOTE: It's the ToMongoDBMWConfig that are a Maybe (not the body)
        {- toMongoDBMWConfig =
           case model.toMongoDBMWConfig of
               Just mongodbmwPrams ->
                   mongodbmwPrams

               Nothing ->
                   ToMongoDBMWConfig "" [] "testPostRequest error" Http.emptyBody Nothing Nothing
        -}
        {- headers =
           -- NOTE: the 'Zoho-oauthtoken' sent at this point is the access token received after refresh
           [ Http.header "Authorization" ("Zoho-oauthtoken " ++ withDefault "No access token " model.apiSpecifics.accessToken) ]
        -}
        therequest =
            Http.request
                { body = Http.emptyBody
                , method = "POST"
                , headers = []
                , url = "http://localhost:1234/hardware"
                , expect = Http.expectJson LNSConnectResponse lnsResponseDecoder
                , timeout = Nothing
                , tracker = Nothing
                }
    in
    therequest


loginRequest : Model -> Cmd Msg
loginRequest model =
    let
        therequest =
            Http.request
                { body = Http.jsonBody <| prepareEmailPwordLogin model.emailpassword
                , method = "POST"
                , headers = [ Http.header "Accept" "application/json" ]
                , url = "https://ap-southeast-1.aws.realm.mongodb.com/api/client/v2.0/app/sr-espa1-snonq/auth/providers/local-userpass/login"
                , expect = Http.expectJson LoginResponse successfullLoginResultDecoder
                , timeout = Nothing
                , tracker = Nothing
                }
    in
    therequest


profileRequest : Model -> Cmd Msg
profileRequest model =
    let
        headers =
            -- NOTE: the 'Bearer' token sent at this point is received after login using credentials
            [ Http.header "Authorization" ("Bearer " ++ withDefault "No access token " model.apiSpecifics.accessToken) ]

        therequest =
            Http.request
                { body = Http.emptyBody
                , method = "GET"
                , headers = headers
                , url = "https://ap-southeast-1.aws.realm.mongodb.com/api/client/v2.0/auth/profile"
                , expect = Http.expectJson ProfileResponse profileDecoder
                , timeout = Nothing
                , tracker = Nothing
                }
    in
    therequest


callRequest : Model -> Cmd Msg
callRequest model =
    let
        headers =
            -- NOTE: the 'Bearer' token sent at this point is received after login using credentials
            [ Http.header "Authorization" ("Bearer " ++ withDefault "No access token " model.apiSpecifics.accessToken) ]

        therequest =
            Http.request
                { body = Http.jsonBody Consts.callRequestJson
                , method = "POST"
                , headers = headers
                , url = "https://ap-southeast-1.aws.realm.mongodb.com/api/client/v2.0/app/sr-espa1-snonq/functions/call"

                -- NOTE: Index lets us handle the 'array' here:
                , expect = Http.expectJson CallResponse (D.index 0 U.userInfoDecoder)
                , timeout = Nothing
                , tracker = Nothing
                }
    in
    therequest



--Cmd.none


prepareEmailPwordLogin : EmailPasswordLogin -> E.Value
prepareEmailPwordLogin emailPword =
    E.object
        [ ( "query_type", E.string "login" )
        , ( "email", E.string emailPword.email )
        , ( "password", E.string emailPword.password )
        ]



-- REVIEW: This and sendRankingId have identical functionality (cos the data difference is in the POST data)
--Cmd.none
-- NOTE: This will be run against all 5 possible venue types
--Cmd.none
-- NAV: Helper functions:
-- NOTE: tested function


filterAndSortRankingsOnLeaving : String -> List R.Rank -> List ( String, List PlayerFromChangeEvent ) -> List R.Rank
filterAndSortRankingsOnLeaving userid rankings changes =
    let
        nochallengersRankings =
            R.abandonSingleUserChallenge userid rankings

        changePlayerIds =
            changes
                |> List.concatMap Tuple.second
                |> List.map .playerId
    in
    nochallengersRankings
        |> List.filter (\ranking -> List.member ranking.player.id changePlayerIds)
        |> List.sortBy .rank
        |> List.indexedMap (\index rank -> { rank | rank = index + 1 })


filterAndSortRankingsOnJoining : String -> List R.Rank -> List ( String, List PlayerFromChangeEvent ) -> List R.Rank
filterAndSortRankingsOnJoining newPlayerId rankings changes =
    let
        nochallengersRankings =
            R.abandonSingleUserChallenge newPlayerId rankings

        changePlayerIds =
            changes
                |> List.concatMap Tuple.second
                |> List.map .playerId

        newPlayerRank =
            { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }

            -- NOTE: We have no way of determining the new player's nickname at this point
            , player = { id = newPlayerId, nickname = "New Player" }
            , rank = List.length rankings + 1
            }

        updatedRankings =
            nochallengersRankings ++ [ newPlayerRank ]
    in
    updatedRankings
        |> List.filter (\ranking -> List.member ranking.player.id changePlayerIds || ranking.player.id == newPlayerId)
        |> List.sortBy .rank
        |> List.indexedMap (\index rank -> { rank | rank = index + 1 })



-- NOTE: Will probably be nec. to receive the selected ranking, unless,
-- we manage to get all the necessary from the the change (unlikely)


updateNewRankingOnChangeEvent : Change -> R.Ranking -> R.Ranking
updateNewRankingOnChangeEvent change ranking =
    let
        -- NOTE: This is the new ranking that has been created
        updatedRanking =
            case change.operationType of
                -- REVIEW: Consider if you are even concerned with joining a ranking currently
                -- as it makes no difference cos the new user will be at the bottom of the ranking
                -- although they will likely challenge the bottom player immediately
                "insert" ->
                    {- let
                           -- updatedFields is a dictionary of lists of PlayerFromChangeEvent
                           -- we're going to take the relevant data from it and remove it from the ranking

                       in
                    -}
                    R.emptyRanking

                "update" ->
                    {- let
                           -- updatedFields is a dictionary of lists of PlayerFromChangeEvent
                           -- we're going to take the relevant data from it and remove it from the ranking
                           "change.updateDescription.updatedFields " change.updateDescription.updatedFields
                       in
                    -}
                    ranking

                _ ->
                    R.emptyRanking
    in
    updatedRanking


ensureDataIsJsonObj : DataFromMongo -> D.Value
ensureDataIsJsonObj dataFromMongo =
    case dataFromMongo of
        JsonData value ->
            value

        StringData str ->
            case D.decodeString D.value str of
                Ok jsonVal ->
                    jsonVal

                Err err ->
                    E.object [ ( "Error :", E.string "Problem converting string to value" ) ]


removeQuotationEscCharsFromJsonValue : D.Value -> String
removeQuotationEscCharsFromJsonValue value =
    StringExtra.unquote <| String.trim <| E.encode 0 value


removeExtraEscapeCharsEtcFromJsonStringifiedDataFromJs : String -> String
removeExtraEscapeCharsEtcFromJsonStringifiedDataFromJs jsonString =
    case D.decodeString D.string jsonString of
        Ok decodedJsonString ->
            decodedJsonString

        Err err ->
            "err in removeExtraEscapeCharsEtcFromJsonStringifiedDataFromJs"


isValidXMRAddress : String -> Bool
isValidXMRAddress str =
    case run R.validXMRAddressParser str of
        Ok _ ->
            True

        Err _ ->
            False



-- NOTE: Unable to create a fuzz test for isUserRankedHigher


isUserRankedHigher : U.UserInfo -> R.Ranking -> Bool
isUserRankedHigher userInfo ranking =
    let
        userRank =
            List.filter (\r -> r.player.id == userInfo.userid) ranking.ladder
                |> List.head
                |> Maybe.map .rank

        otherRank =
            List.filter (\r -> r.player.id /= userInfo.userid) ranking.ladder
                |> List.head
                |> Maybe.map .rank
    in
    case ( userRank, otherRank ) of
        ( Just ur, Just or ) ->
            ur < or

        _ ->
            False


isValidatedForAllLadderDetailsInput : R.Ranking -> Bool
isValidatedForAllLadderDetailsInput ranking =
    -- NOTE: Required:
    V.isValid4to20Chars ranking.name
        -- NOTE: Optional:
        && (ranking.baseaddress.street == "" || V.isValid4to20Chars ranking.baseaddress.street)
        && (ranking.baseaddress.city == "" || V.isValid4to20Chars ranking.baseaddress.city)



-- NOTE: This handles different data types e.g. users or rankings
{- gotJsonDataType : String -> String
   gotJsonDataType rawJsonMessage =
       let
           decodedJsonMsg : Result D.Error DataTypeFromResponse
           decodedJsonMsg =
               D.decodeString dataTypeDecoder rawJsonMessage
       in
       case decodedJsonMsg of
           Ok decodedDataType ->

               decodedDataType.datatype

           Err err ->
               -- HACK:

               "error - see log"
-}
-- NOTE: A user may be a spectator, in which case the registration is creating a new user
-- or, if already a registered user, this input data will be used to update the user
-- REVIEW: this may be an rf to simplify. Confusing have new registration and update in the same function?
-- also, can probably just send userInfo for Spect and Regis users.
-- NOTE: Checks if any of the required values are empty or not valid


handleDecodeUser : D.Value -> U.UserInfo
handleDecodeUser rawJsonMessage =
    let
        -- NOTE: Encode 'rawJsonMessage' to see behind <internals> in the console (if it's an E.value not a string already):
        -- and to turn it into a string (in Main). Had problem with D.decodeValue
        -- extracting the ObjectId, so we're working with it as a string here.
        decodedJsonMsg : Result D.Error U.UserInfo
        decodedJsonMsg =
            D.decodeValue U.userInfoDecoder rawJsonMessage
    in
    case decodedJsonMsg of
        Ok decodedUser ->
            decodedUser

        Err err ->
            -- HACK:
            U.emptyUserInfo


handleNewlyJoinedDecodeRanking : D.Value -> Result D.Error R.NewlyJoinedRanking
handleNewlyJoinedDecodeRanking jsonObj =
    D.decodeValue R.newlyJoinedRankingDecoder jsonObj


getIdFromValue : D.Value -> Result D.Error String
getIdFromValue value =
    decodeValue (D.field "_id" D.string) value


idDecoder : D.Decoder String
idDecoder =
    D.field "_id" D.string



-- Json Value Result in and String Result out


decodedId : Result String D.Value -> Result String String
decodedId jsonVal =
    case jsonVal of
        Ok val ->
            D.decodeValue idDecoder val
                |> Result.mapError D.errorToString

        Err err ->
            Result.Err err


convertJsonStringToJsonValue : String -> Result String D.Value
convertJsonStringToJsonValue jsonString =
    case D.decodeString D.value jsonString of
        Ok value ->
            -- The JSON was successfully decoded into a Value.
            -- You can now inspect the Value to see its structure.
            Ok value

        Err err ->
            -- There was an error decoding the JSON.
            -- The error message will give you some information about what went wrong.
            Err (D.errorToString err)


handleDecodeRanking : D.Value -> Result D.Error R.Ranking
handleDecodeRanking rawJsonMessage =
    D.decodeValue R.rankingDecoder rawJsonMessage


isValidatedForAllUserDetailsInput : U.UserInfo -> Bool
isValidatedForAllUserDetailsInput userInfo =
    if
        V.isEmailValid (Maybe.withDefault "" userInfo.email)
            && V.isValid4to8Chars userInfo.nickname
            -- HACK: was userInfo.description
            && V.is20CharMax ""
            && V.isEmailValid (Maybe.withDefault "" userInfo.email)
            && V.isMobileValid (Maybe.withDefault "" userInfo.mobile)
    then
        True

    else
        False


enableButton : Bool -> List (Element.Attribute msg)
enableButton enable =
    if enable then
        Color.info

    else
        Color.disabled


handleConfirm : Msg -> Model -> ( Model, Cmd Msg )
handleConfirm msg model =
    case ( msg, model ) of
        ( _, _ ) ->
            ( model, Cmd.none )


userDetailsConfirmPanel : U.UserInfo -> Element Msg
userDetailsConfirmPanel userInfo =
    if
        -- WARN: Logic a bit tricky. Email/password must be entered, nickname is optional
        -- but validated if entered (so note different logic for nickname)
        (V.isEmailValid (Maybe.withDefault "" userInfo.email) && String.length (Maybe.withDefault "" userInfo.email) > 0)
            && (V.isValid4to8Chars userInfo.password && String.length userInfo.password > 0)
            && (userInfo.nickname == "" || V.isValid4to8Chars userInfo.nickname)
    then
        Element.column Grid.section <|
            [ Element.el Heading.h6 <| Element.text "Click to continue ..."
            , Element.column (Card.simple ++ Grid.simple) <|
                [ Element.wrappedRow Grid.simple <|
                    [ Input.button (Button.simple ++ Color.info) <|
                        { onPress = Just <| CancelRegistration
                        , label = Element.text "Cancel"
                        }
                    , Input.button
                        (Button.simple
                            ++ enableButton
                                (isValidatedForAllUserDetailsInput
                                    userInfo
                                )
                        )
                      <|
                        { onPress = Just <| RegisUser userInfo
                        , label = Element.text "Register"
                        }
                    ]
                ]
            ]

    else
        Element.column Grid.section <|
            [ El.missingDataPara
            , Element.el Heading.h6 <| Element.text "Click to continue ..."
            , Element.column (Card.simple ++ Grid.simple) <|
                [ Element.wrappedRow Grid.simple <|
                    [ Input.button (Button.simple ++ Color.info) <|
                        { onPress = Just <| CancelRegistration
                        , label = Element.text "Cancel"
                        }
                    ]
                ]
            ]


emailValidationErr : String -> Element Msg
emailValidationErr str =
    if V.isEmailValid str && (not <| String.length str == 0) then
        Element.el
            (List.append
                [ Font.color El.colors.green, Font.alignLeft ]
                [ Element.moveLeft 1.0 ]
            )
            (Element.text "Email OK!")

    else
        --if String.length str == 0 then
        Element.el (List.append [ Font.color El.colors.red, Font.alignLeft ] [ Element.moveLeft 7.0 ])
            (Element.text """ Please enter 
 a valid email""")



-- else
--     Element.el [] <| Element.text ""


mobileValidationErr : String -> Element Msg
mobileValidationErr str =
    if V.isMobileValid str then
        Element.el (List.append [ Font.color El.colors.green, Font.alignLeft ] [ Element.htmlAttribute (Attr.id "userMobileValid") ]) (Element.text "Mobile OK!")

    else if String.length str > 0 then
        Element.el (List.append [ Font.color El.colors.red, Font.alignLeft ] [ Element.htmlAttribute (Attr.id "userMobileInvalid") ] ++ [ Element.moveLeft 5.0 ])
            (Element.text """ Mobile number, if
 entered, must be valid (+ not 00)""")

    else
        Element.el [] <| Element.text ""



-- 0 is the indentation level, you can adjust it if needed
-- REVIEW:
-- Function to convert a formatted time to a Time.Posix timestamp


infoBtn : String -> Msg -> Element Msg
infoBtn label msg =
    Input.button
        (Button.simple ++ Button.fill ++ Color.info)
    <|
        { onPress = Just <| msg
        , label = Element.text label
        }


displayLoginBtns : Model -> Element Msg
displayLoginBtns model =
    Element.column Grid.section <|
        [ Element.el [] <| Element.text " Please login, register or view \n search rankings as a spectator (below):"
        , infoBtn "Connect Wallet" <| ClickedHardwareDeviceConnect
        ]



-- NOTE: Start of original Haveno-Web-blahblah-Zoho helpers


humandateTimePlaceholder : DD.DateRecord
humandateTimePlaceholder =
    DD.DateRecord 0 0 0 0 0 0 0 Time.utc


updateFocus : CustomerDetails -> String -> CustomerDetails
updateFocus custDtls value =
    if value == "name" then
        { custDtls | isNameInputFocused = True }

    else if value == "email" then
        { custDtls | isEmailInputFocused = True }

    else if value == "phone" then
        { custDtls | isPhoneInputFocused = True }

    else if value == "condoname" then
        { custDtls | isCondoNameInputFocused = True }

    else if value == "condoaddress" then
        { custDtls | isCondoAddressInputFocused = True }

    else
        custDtls


protocolToString : Protocol -> String
protocolToString protocol =
    case protocol of
        Url.Http ->
            "http://"

        Url.Https ->
            "https://"


updateNewUserRegistrationFormField : Msg -> QueryType -> Model -> Model
updateNewUserRegistrationFormField msg queryType model =
    let
        newUserDetails =
            case queryType of
                RegisterUser userDetails ->
                    --let
                    {- userDetails =
                       case bkappt.user_details of
                           U.Spectator userOps ->
                               case userOps of
                                    userInfo _ ->
                                       userInfo

                           U.Registered userOps ->
                               case userOps of
                                    userInfo _ ->
                                       userInfo
                    -}
                    --in
                    case msg of
                        UpdateNickName nme ->
                            let
                                newname =
                                    if nme == "" then
                                        Nothing

                                    else
                                        Just nme

                                vldResult =
                                    case validateName newname of
                                        Ok _ ->
                                            ""

                                        Err err ->
                                            err
                            in
                            { userDetails | nickname = nme, nameValidationError = vldResult }

                        UpdateAge age ->
                            { userDetails | age = age }

                        UpdateGender value ->
                            let
                                newValue =
                                    case value of
                                        "Male" ->
                                            U.Male

                                        "Female" ->
                                            U.Female

                                        _ ->
                                            U.Male
                            in
                            { userDetails | gender = newValue }

                        UpdateEmail email ->
                            let
                                newemail =
                                    if email == "" then
                                        Nothing

                                    else
                                        Just email

                                vldResult =
                                    case validateEmail newemail of
                                        Ok _ ->
                                            ""

                                        Err err ->
                                            err
                            in
                            { userDetails | email = newemail, emailValidationError = vldResult }

                        UpdatePassword pword ->
                            let
                                vldResult =
                                    case validatePassword pword of
                                        Ok _ ->
                                            ""

                                        Err err ->
                                            err
                            in
                            { userDetails | password = pword, passwordValidationError = vldResult }

                        UpdateLevel value ->
                            let
                                desc =
                                    userDetails.description

                                newDesc =
                                    { desc | level = value }
                            in
                            { userDetails | description = newDesc }

                        UpdateComment value ->
                            let
                                desc =
                                    userDetails.description

                                newDesc =
                                    { desc | comment = value }
                            in
                            { userDetails | description = newDesc }

                        UpdateMobile value ->
                            { userDetails | mobile = Just value }

                        AddInfoInput value ->
                            { userDetails | addInfo = value }

                        -- REVIEW: these placeholders:
                        _ ->
                            userDetails

                _ ->
                    U.emptyUserInfo

        newLoginOrRegistration =
            case queryType of
                RegisterUser _ ->
                    RegisterUser newUserDetails

                _ ->
                    Error "newLoginOrRegistration err"

        {- newApiSpecs =
           { apiSpecs | queryType = newLoginOrRegistration }
        -}
    in
    { model | queryType = newLoginOrRegistration }



-- NOTE: Theses are generic. If you want specific errors customize in the relevant update


validateName : Maybe String -> Result String String
validateName nme =
    let
        pattern =
            Regex.fromString "^[a-zA-Z\\s]+$"
    in
    case nme of
        Just name ->
            if String.length name >= 3 && String.length name <= 30 then
                case pattern of
                    Just patn ->
                        if contains patn name then
                            Ok name

                        else
                            Err "Name can only contain alphabetic characters"

                    Nothing ->
                        Err "Name can only contain alphabetic characters"

            else if String.isEmpty name then
                Err "Name cannot be empty"

            else if String.length name < 3 then
                Err "Name must have at least 3 characters"

            else
                Err "Name cannot exceed 30 characters"

        Nothing ->
            Err "Name "


validatePhoneNumber : Maybe String -> Result String String
validatePhoneNumber phne =
    let
        -- The regular expression to match a common phone number format:
        pattern =
            --Regex.fromString "^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\\s\\./0-9]{8,14}$"
            Regex.fromString "^\\+?\\d{1,4}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{5,}$"
    in
    case phne of
        Just phone ->
            case pattern of
                Just patn ->
                    if (String.length phone < 30) && contains patn phone then
                        Ok phone

                    else
                        Err "Please enter a valid phone format"

                Nothing ->
                    Err "Please enter a valid phone format"

        Nothing ->
            Err "Phone number "


validateEmail : Maybe String -> Result String String
validateEmail eml =
    let
        pattern =
            Regex.fromString "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    in
    case eml of
        Just email ->
            case pattern of
                Just patn ->
                    if contains patn email then
                        Ok email

                    else
                        Err "Please enter a valid email format"

                Nothing ->
                    Err ""

        Nothing ->
            Err "Email "


validatePassword : String -> Result String String
validatePassword pword =
    let
        pattern =
            Regex.fromString "^.{6,30}$"
    in
    case pattern of
        Just patn ->
            if contains patn pword then
                Ok pword

            else
                Err "Please enter a password between 6 and 30 characters in length"

        Nothing ->
            Err ""



-- REVIEW: Make impossible impossible?
-- Function to render a single item as HTML
-- used in View List.map


renderItem : Time.Posix -> Html Msg
renderItem time =
    -- FIX: Booking form
    button [ class "default-button", onClick <| SelDateTime (String.fromInt (Time.toHour Time.utc time)) ]
        [ text <| DateType.format12Hour (Time.toHour Time.utc time)
        ]


renderErrorItem : String -> Html Msg
renderErrorItem item =
    p [ class "error" ] [ text item ]



-- NAV: Change event helpers


emptyChange : Change
emptyChange =
    { operationType = ""
    , documentKey = { id = "" }
    , updateDescription =
        { updatedFields = Dict.empty
        , removedFields = []
        , truncatedArrays = []
        }
    , fullDocument = Nothing
    }


isJoiningRanking : Change -> Bool
isJoiningRanking change =
    case change.operationType of
        "update" ->
            if List.isEmpty change.updateDescription.removedFields then
                True

            else
                False

        _ ->
            False


gotLastUpdatedBy : D.Value -> String
gotLastUpdatedBy json =
    case D.decodeValue changeDecoder json of
        Ok chnge ->
            case chnge.fullDocument of
                Just fullDoc ->
                    fullDoc.lastUpdatedBy

                Nothing ->
                    ""

        _ ->
            "Error"



-- NAV: Html Snippets


rankingDetailsConfirmPanel : R.Ranking -> U.UserInfo -> Element Msg
rankingDetailsConfirmPanel ranking userInfo =
    if
        -- WARN: Logic a bit tricky here:
        isValidatedForAllLadderDetailsInput ranking
    then
        Element.column Grid.section <|
            [ if ranking.baseaddress.street == "" && ranking.baseaddress.city == "" then
                El.warningParagraph

              else
                Element.text "Click to continue ..."
            , Element.column (Card.simple ++ Grid.simple) <|
                [ Element.wrappedRow Grid.simple <|
                    [ Input.button (Button.simple ++ Color.info) <|
                        { onPress = Just CancelCreateNewRanking
                        , label = Element.text "Cancel"
                        }
                    , Input.button
                        (Button.simple
                            ++ enableButton
                                (isValidatedForAllLadderDetailsInput
                                    ranking
                                )
                        )
                      <|
                        { onPress = Just <| ConfirmNewRanking ranking (U.Registered userInfo)
                        , label = Element.text "Confirm"
                        }
                    ]
                ]
            ]

    else
        Element.column Grid.section <|
            [ El.missingDataPara
            , Element.el Heading.h6 <| Element.text "Click to continue ..."
            , Element.column (Card.simple ++ Grid.simple) <|
                [ Element.wrappedRow Grid.simple <|
                    [ Input.button (Button.simple ++ Color.info) <|
                        { onPress = Just CancelCreateNewRanking
                        , label = Element.text "Cancel"
                        }
                    ]
                ]
            ]
