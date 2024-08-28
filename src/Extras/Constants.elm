module Extras.Constants exposing (..)

import Json.Encode as E
import Time exposing (..)
import Url exposing (Protocol(..), Url)
import Http exposing (..)



-- NOTE: Constants for testing, must match the code


localhostForElmSpecProxyURL : Url
localhostForElmSpecProxyURL =
    Url Http "localhost" (Just 3000) "/proxy" Nothing Nothing

-- NOTE: Potential point of failure when switching between dev and prod
localorproductionServerAutoCheck : String
localorproductionServerAutoCheck =
    "haveno-web.squashpassion"

placeholderUrl : Url
placeholderUrl =
    Url Http "localhost" (Just 3000) "" Nothing Nothing


post : String
post =
    "POST"


get : String
get =
    "GET"



-- WARN: This MUST correlate to the 'no current challenger' document in rankings collection


noCurrentChallengerId : String
noCurrentChallengerId =
    "6353e8b6aedf80653eb34191"


emptyEmailPassword : { email : String, password : String }
emptyEmailPassword =
    { email = "", password = "" }



-- NOTE: kallang_id etc. are service_ids used in place of resource_ids (have to pay)
-- instead of 1 service_id all 6 sessions will need to be requested separately and
-- processed with 1 hour gaps added, unless staff_id alone is enough to determine this(?).
-- NOTE: For use in multiple availability requests:
-- WARN: CORS errors if new venues aren't added to the list


lserviceids : List String
lserviceids =
    [ yck_id, kallang_id, stw_id, burghley_id, evans_id, condo_id ]



-- REVIEW: How is this used?
-- NOTE: Not used currently, but would be if we paid for upgrade and
-- referenced resources instead of services.


resource_id : String
resource_id =
    ""


kallang_id : String
kallang_id =
    "4503471000000091010"


yck_id : String
yck_id =
    "4503471000000091024"


stw_id : String
stw_id =
    "4503471000000091040"


burghley_id : String
burghley_id =
    "4503471000000091054"


evans_id : String
evans_id =
    "4503471000000171014"


condo_id : String
condo_id =
    "4503471000000091068"



-- NOTE: Phil's staff id - others can be added


staff_id : String
staff_id =
    "4503471000000033016"


timezone : String
timezone =
    "Asia/Singapore"



-- Set the time zone offset for Singapore (UTC+8)


singaporeTimeZoneOffset : Int
singaporeTimeZoneOffset =
    8 * 60



--* 60 -- UTC+8 is 8 hours ahead of UTC, converted to seconds
-- NAV: Base URLs
{- localhostDirect5500 : Url
   localhostDirect5500 =
       Url Http "localhost" (Just 5500) "" Nothing Nothing
-}
-- NOTE: run proxy in /proxy terminal with node proxy.js
-- NOTE: The Url coming from flags in Main.elm
-- automatically specifies the Url parameters - BUT API specifics, 'proxy' etc. needs
-- to be updated in the code
-- NOTE: for production run proxy using 'Setup Node.js app' in cPanel
-- in prod the extra '/' is essential to avoid 'network error' on mobile browsers
-- WARN: Don't trust the browsers on the hotspot phone using in dev. Even
-- if appear to be using production server, will actually be talking to dev
-- environmnet


productionProxyConfig : String
productionProxyConfig =
    "/proxy/"


localhostProxyConfig : String
localhostProxyConfig =
    "/proxy"


middleWarePath : String
middleWarePath =
    "/middleware"


zohoAccountsTokenBaseURL : Url
zohoAccountsTokenBaseURL =
    Url Https zohoAccountsHost Nothing zohoAccountsPath Nothing Nothing


zohoAccountsHost : String
zohoAccountsHost =
    "accounts.zoho.com"


mongoOrdId : String
mongoOrdId =
    "sr-espa1-snonq"



-- possibly "62c2926accd1a85c9abe4c02"


mongoClusterName : String
mongoClusterName =
    "Cluster0"


mongoSearchIndexName : String
mongoSearchIndexName =
    "searchRankings"


mongoCloudHost : String
mongoCloudHost =
    "cloud.mongodb.com"


{- mongoAtlasAPISearchIndexPath : String
mongoAtlasAPISearchIndexPath =
    "api/atlas/v1.0/orgs/" ++ mongoOrdId ++ "/clusters/" ++ mongoClusterName ++ "/fts/indexes/" ++ mongoSearchIndexName
 -}


--https://cloud.mongodb.com/api/atlas/v1.0/orgs/{ORG-ID}/clusters/{CLUSTER-NAME}/fts/indexes/{INDEX-NAME}/search
-- NOTE: When you're accessing the actual API base is:


{- mongodbSearchURL : Url
mongodbSearchURL =
    Url Https mongoCloudHost Nothing (mongoAtlasAPISearchIndexPath ++ "/search") Nothing Nothing -}


zohoAccountsPath : String
zohoAccountsPath =
    "/oauth/v2/token"


zohoBookingsAvailableURL : Url
zohoBookingsAvailableURL =
    Url Https zohoApisHost Nothing (zohoBookingsPath ++ "/availableslots") Nothing Nothing


zohoBookingsBookAppointmentURL : Url
zohoBookingsBookAppointmentURL =
    Url Https zohoApisHost Nothing (zohoBookingsPath ++ "/appointment") Nothing Nothing


zohoApisHost : String
zohoApisHost =
    "www.zohoapis.com"


zohoBookingsPath : String
zohoBookingsPath =
    "/bookings/v1/json"


singaporeTimeZone : Time.Zone
singaporeTimeZone =
    Maybe.withDefault Time.utc (Just (Time.customZone singaporeTimeZoneOffset []))


sGTimeZone : String
sGTimeZone =
    "Asia/Singapore"


emptyDefaultUrl : Url.Url
emptyDefaultUrl =
    Url.Url Https "default" Nothing "" Nothing Nothing



-- NOTE: This is actual, not test, code


pipelineRequest : E.Value
pipelineRequest =
    E.list
        identity
        -- REVIEW: It may be worth RF ing some of these to functions like jsonKeyValue
        [ E.object
            [ ( "$match", E.object [ ( "_id", E.object [ ( jsonKeyValue "$oid" "651fa006b15a534c69b119ef" ) ] ) ] ) ]
        , E.object [ ( "$lookup", E.object [ ( jsonKeyValue "from" "rankings" ), ( "localField", E.string "ownerOf" ), ( "foreignField", E.string "_id" ), ( "as", E.string "ownedRankings" ) ] ) ]
        , E.object [ ( "$lookup", E.object [ ( "from", E.string "rankings" ), ( "localField", E.string "memberOf" ), ( "foreignField", E.string "_id" ), ( "as", E.string "memberRankings" ) ] ) ]
        , E.object [ ( "$lookup", E.object [ ( "from", E.string "users" ), ( "localField", E.string "memberRankings.owner_id" ), ( "foreignField", E.string "_id" ), ( "as", E.string "memberRankingsWithOwnerName" ) ] ) ]
        , E.object
            [ ( "$project"
              , E.object
                    [ ( "_id", numIntObject "1" )
                    , ( "userid", numIntObject "1" )
                    , ( "nickname", numIntObject "1" )
                    , ( "active", numIntObject "1" )
                    , ( "description", numIntObject "1" )
                    , ( "datestamp", numIntObject "1" )
                    , ( "token", numIntObject "1" )
                    , ( "updatetext", numIntObject "1" )
                    , ( "mobile", numIntObject "1" )
                    , ( "credits", numIntObject "1" )
                    , ( "ownedRankings"
                      , E.object
                            [ ( "_id", numIntObject "1" )
                            , ( "active", numIntObject "1" )
                            , ( "owner_id", numIntObject "1" )
                            , ( "baseaddress", numIntObject "1" )
                            , ( "ranking", numIntObject "1" )
                            , ( "player_count", numIntObject "1" )
                            , ( "name", numIntObject "1" )
                              
                            , (jsonKeyValue "owner_name" "$nickname")
                            ]
                      )
                    , ( "memberRankings"
                      , E.object
                            [ ( "_id", numIntObject "1" )
                            , ( "name", numIntObject "1" )
                            , ( "active", numIntObject "1" )
                            , ( "owner_id", numIntObject "1" )
                            , ( "baseaddress", numIntObject "1" )
                            , ( "ranking", numIntObject "1" )
                            , ( "player_count", numIntObject "1" )
                            , ( "owner_name", E.object [ ( "owner_name", E.string "$memberRankingsWithOwnerName.nickname" ) ] )
                            ]
                      )
                    , ( "owner_ranking_count", E.object [ ( "$size", E.string "$ownedRankings" ) ] )
                    , ( "member_ranking_count", E.object [ ( "$size", E.string "$memberRankings" ) ] )
                    , ( "addInfo", numIntObject "1" )
                    , ( "gender", numIntObject "1" )
                    , ( "age", numIntObject "1" )
                    ]
              )
            ]
        ]

jsonKeyValue : String -> String -> (String, E.Value)
jsonKeyValue key value =
    ( key, E.string value ) 

numIntObject : String -> E.Value
numIntObject str =
    E.object [ ( "$numberInt", E.string str ) ]

callRequestJson : E.Value
callRequestJson =
    --E.list
    E.object
        -- NOTE: Use of double [[]] to satisfy E.list
        --[
        [ ( "name", E.string "aggregate" )
        , ( "arguments"
          , E.list identity
                [ E.object
                    [ ( "database", E.string "sportrank" )
                    , ( "collection", E.string "users" )
                    , ( "pipeline", pipelineRequest )
                    ]
                ]
          )
        , ( "service", E.string "mongodb-atlas" )

        --]
        ]

httpErrorToString : Http.Error -> String
httpErrorToString err =
    case err of
        Http.BadUrl url ->
            "Bad URL: " ++ url

        Http.Timeout ->
            "Request timed out"

        Http.NetworkError ->
            "Network error occurred"

        Http.BadStatus status ->
            "Bad status: " ++ String.fromInt status

        Http.BadBody body ->
            "Bad body: " ++ body
