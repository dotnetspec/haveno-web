module Extras.TestData exposing (..)

import Extras.Constants as Consts exposing (..)
import Json.Encode as E
import Pages.Hardware as Hardware exposing (..)
import Spec.Http.Route as Route exposing (HttpRoute)
import Spec.Http.Stub as Stub
import Time exposing (Posix, millisToPosix, utc)
import Url exposing (Protocol(..), Url)


availabilityRequestURL27_Feb_2024_14_09 : String
availabilityRequestURL27_Feb_2024_14_09 =
    "http://localhost:3000/proxy?apiUrl=https://www.zohoapis.com/bookings/v1/json/availableslots&query_type=bookingsAvailability&service_id=4503471000000091024&staff_id=4503471000000033016&selected_date=27-Feb-2024 14:09"


failedMongodbLoginStub : Stub.HttpResponseStub
failedMongodbLoginStub =
    Stub.for (Route.post loginRequestURL)
        |> Stub.withStatus 401


loginRequestURL : String
loginRequestURL =
    "https://ap-southeast-1.aws.realm.mongodb.com/api/client/v2.0/app/sr-espa1-snonq/auth/providers/local-userpass/login"


loginRequestLocationURL : String
loginRequestLocationURL =
    "https://realm.mongodb.com/api/client/v2.0/app/sr-espa1-snonq/location"


loginRequestProfileURL : String
loginRequestProfileURL =
    "https://ap-southeast-1.aws.realm.mongodb.com/api/client/v2.0/auth/profile"


loginRequestCallURL : String
loginRequestCallURL =
    "https://ap-southeast-1.aws.realm.mongodb.com/api/client/v2.0/app/sr-espa1-snonq/functions/call"


mongoMWUrl : Url
mongoMWUrl =
    Url Http "localhost" (Just 3000) "/middleware" Nothing Nothing


rankingsUrl : Url
rankingsUrl =
    Url Http "localhost" (Just 5501) "/rankings" Nothing Nothing


failedLogin : Stub.HttpResponseStub
failedLogin =
    let
        jsonObject =
            E.object
                [ ( "error", E.string "invalid username/password" )
                , ( "error_code", E.string "InvalidPassword" )
                , ( "link", E.string "https://services.cloud.mongodb.com/groups/62c2926accd1a85c9abe4c0d/apps/62f4815cdf2bbee9f10cd109/logs?co_id=662b0069154db56fcc2d050f" )
                ]
    in
    Stub.for (Route.post (Url.toString mongoMWUrl))
        |> Stub.withBody (Stub.withJson jsonObject)







successfullLoginFetch : Stub.HttpResponseStub
successfullLoginFetch =
    let
        jsonObject =
            E.object
                [ ( "access_token", E.string "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjY2MmEyMjFiNDc1Yzk3YWY2YTFlYmRiNCIsImJhYXNfZG9tYWluX2lkIjoiNjJmNDgxNWNkZjJiYmVlOWYxMGNkMTBhIiwiZXhwIjoxNzE0MTIwMTY5LCJpYXQiOjE3MTQxMTgzNjksImlzcyI6IjY2MmI1ZWUxMjBlMTVmMDNhOTVjMWM4NyIsImp0aSI6IjY2MmI1ZWUxMjBlMTVmMDNhOTVjMWM4OSIsInN0aXRjaF9kZXZJZCI6IjY2MmEyMjFiNDc1Yzk3YWY2YTFlYmRiNCIsInN0aXRjaF9kb21haW5JZCI6IjYyZjQ4MTVjZGYyYmJlZTlmMTBjZDEwYSIsInN1YiI6IjY1MWZhMDA2YjE1YTUzNGM2OWIxMTllZiIsInR5cCI6ImFjY2VzcyJ9.DpiBqSs8bPuanHw9VqHeSkqjSc84SLCQN-OWcePHQ8g" )
                , ( "refresh_token", E.string "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RhdGEiOm51bGwsImJhYXNfZGV2aWNlX2lkIjoiNjYyYTIyMWI0NzVjOTdhZjZhMWViZGI0IiwiYmFhc19kb21haW5faWQiOiI2MmY0ODE1Y2RmMmJiZWU5ZjEwY2QxMGEiLCJiYWFzX2lkIjoiNjYyYjVlZTEyMGUxNWYwM2E5NWMxYzg3IiwiYmFhc19pZGVudGl0eSI6eyJpZCI6IjY1MWZhMDA2NzA1MjBhNGExMDRiZTE3NiIsInByb3ZpZGVyX3R5cGUiOiJsb2NhbC11c2VycGFzcyIsInByb3ZpZGVyX2lkIjoiNjMxZWUzZWIxMjNiNjRlOGRiMjU0NzIwIn0sImV4cCI6MTcxOTMwMjM2OSwiaWF0IjoxNzE0MTE4MzY5LCJzdGl0Y2hfZGF0YSI6bnVsbCwic3RpdGNoX2RldklkIjoiNjYyYTIyMWI0NzVjOTdhZjZhMWViZGI0Iiwic3RpdGNoX2RvbWFpbklkIjoiNjJmNDgxNWNkZjJiYmVlOWYxMGNkMTBhIiwic3RpdGNoX2lkIjoiNjYyYjVlZTEyMGUxNWYwM2E5NWMxYzg3Iiwic3RpdGNoX2lkZW50Ijp7ImlkIjoiNjUxZmEwMDY3MDUyMGE0YTEwNGJlMTc2IiwicHJvdmlkZXJfdHlwZSI6ImxvY2FsLXVzZXJwYXNzIiwicHJvdmlkZXJfaWQiOiI2MzFlZTNlYjEyM2I2NGU4ZGIyNTQ3MjAifSwic3ViIjoiNjUxZmEwMDZiMTVhNTM0YzY5YjExOWVmIiwidHlwIjoicmVmcmVzaCJ9.59rHDIhiisYNSJnsk4pc5caE-qDhIof9Wecxm7BTMFE" )
                , ( "user_id", E.string "651fa006b15a534c69b119ef" )
                , ( "device_id", E.string "662a221b475c97af6a1ebdb4" )
                ]
    in
    Stub.for (Route.post loginRequestURL)
        --Stub.for (Route.post (Url.toString mongoMWUrl))
        |> Stub.withBody (Stub.withJson jsonObject)



{- {"deployment_model":"LOCAL","location":"SG","hostname":"https://ap-southeast-1.aws.realm.mongodb.com","ws_hostname":"wss://ws.ap-southeast-1.aws.realm.mongodb.com"} -}


successfullLocationFetch : Stub.HttpResponseStub
successfullLocationFetch =
    let
        jsonObject =
            E.object
                [ ( "deployment_model", E.string "LOCAL" )
                , ( "location", E.string "SG" )
                , ( "hostname", E.string "https://ap-southeast-1.aws.realm.mongodb.com" )
                , ( "ws_hostname", E.string "wss://ws.ap-southeast-1.aws.realm.mongodb.com" )
                ]
    in
    Stub.for (Route.get loginRequestLocationURL)
        |> Stub.withBody (Stub.withJson jsonObject)



{- {"user_id":"651fa006b15a534c69b119ef","domain_id":"62f4815cdf2bbee9f10cd10a"
   ,"identities":[{"id":"651fa00670520a4a104be176","provider_type":"local-userpass"
   ,"provider_id":"631ee3eb123b64e8db254720","provider_data":{"email":"k2@k.com"}}],"data":{"email":"k2@k.com"},"type":"normal"}
-}


successfullProfileFetch : Stub.HttpResponseStub
successfullProfileFetch =
    let
        jsonObject =
            E.object
                [ ( "user_id", E.string "651fa006b15a534c69b119ef" )
                , ( "domain_id", E.string "62f4815cdf2bbee9f10cd10a" )
                , ( "identities"
                  , E.list E.object
                        [ [ ( "id", E.string "651fa00670520a4a104be176" )
                          , ( "provider_type", E.string "local-userpass" )
                          , ( "provider_id", E.string "631ee3eb123b64e8db254720" )
                          , ( "provider_data"
                            , E.object
                                [ ( "email", E.string "k2@k.com" )
                                ]
                            )
                          ]
                        ]
                  )
                , ( "data"
                  , E.object
                        [ ( "email", E.string "k2@k.com" )
                        ]
                  )
                , ( "type", E.string "normal" )
                ]
    in
    Stub.for (Route.get loginRequestProfileURL)
        |> Stub.withBody (Stub.withJson jsonObject)


successfullCallResponse : Stub.HttpResponseStub
successfullCallResponse =
    let
        jsonObject =
            E.list
                identity
                [ E.object
                    [ ( "_id", E.object [ ( "$oid", E.string "651fa006b15a534c69b119ef" ) ]  )
                    , ( "description", E.object [ ( "level", E.string "" ), ( "comment", E.string "" ) ] )
                    , ( "memberRankings", E.list E.object [] )
                    , ( "ownedRankings"
                      , E.list
                            E.object
                            [ [ ( "_id", E.object [ ( "$oid", E.string "651fa006b15a534c69b119ef" ) ]  )
                              , ( "active", E.bool True )
                              , ( "name", E.string "DavesDorks" )
                              , ( "owner_id", E.object [ ( "$oid", E.string "651fa006b15a534c69b119ef" ) ]  )
                              , ( "baseaddress", E.object [ ( "street", E.string "Unspecified" ), ( "city", E.string "Unspecified" ) ] )
                              , ( "owner_name", E.string "Dave" )
                              , ( "player_count", E.int 1 )
                              , ( "ranking"
                                , E.list
                                    E.object
                                    [ [ ( "rank", E.int 1 )
                                      , ( "player"
                                        , E.object
                                            [ ( "_id", E.string "6566d7125069f55d6f7542ef" )
                                            , ( "nickname", E.string "Dave" )
                                            ]
                                        )
                                      , ( "challenger"
                                        , E.object
                                            [ ( "_id", E.string "6566d7125069f55d6f7542ef" )
                                            , ( "nickname", E.string "Bob" )
                                            ]
                                        )
                                      ]
                                    ]
                                )
                              ]
                            ]
                      )
                    , ( "active", E.bool True )
                    , ( "datestamp", E.object [ ( "$numberInt", E.string "123456" ) ] )
                    , ( "token", E.string "123456" )
                    , ( "updatetext", E.string "" )
                    , ( "mobile", E.string "123456789" )
                    , ( "credits", E.object [ ( "$numberInt", E.string "20" ) ] )
                    , ( "nickname", E.string "Dave" )
                    , ( "addInfo", E.string "Hi there!" )
                    , ( "gender", E.string "Male" )
                    , ( "age", E.object [ ( "$numberInt", E.string "40" ) ] )
                    , ( "email", E.string "t@t.co" )
                    , ( "password", E.string "Pa55w0rd" )
                    ]
                ]

        {- E.list
           E.object
               [[ ( "_id", E.object [ ( "$oid", E.string "651fa006b15a534c69b119ef" ) ] )
               , ( "active", E.bool True )
               , ( "description", E.object [ ( "level", E.string "" ), ( "comment", E.string "" ) ] )
               , ( "datestamp", E.object [ ( "$numberInt", E.string "100" ) ] )
               , ( "token", E.string "123456" )
               , ( "updatetext", E.string "" )
               , ( "mobile", E.string "123456789" )
               , ( "credits", E.int 20 )
               , ( "nickname", E.string "Dave" )
               , ( "addInfo", E.string "Hi there!" )
               , ( "gender", E.string "Male" )
               , ( "age", E.object [ ( "$numberInt", E.string "40" ) ] )
               , ( "ownedRankings"
                 , E.list

                   E.object
                       [[ ( "_id", E.object [ ( "$oid", E.string "6566d7125069f55d6f7542ef" ) ] )
                       , ( "active", E.bool True )
                       , ( "name", E.string "DavesDorks" )
                       , ( "owner_id", E.object [ ( "$oid", E.string "651fa006b15a534c69b119ef" ) ] )
                       , ( "baseaddress", E.object [ ( "street", E.string "Unspecified" ), ( "city", E.string "Unspecified" ) ] )
                       , ( "owner_name", E.string "Dave" )
                       ]
                   ]
                 )
               , ( "memberRankings", E.object [] )
               , ( "owner_ranking_count", E.object [ ( "$numberInt", E.string "1" ) ] )
               , ( "member_ranking_count", E.object [ ( "$numberInt", E.string "0" ) ] )
               ]]
        -}
    in
    Stub.for (Route.post loginRequestCallURL)
        |> Stub.withBody (Stub.withJson jsonObject)


pipelineAsJsonString : String
pipelineAsJsonString =
    """[{"$match":{"_id":{"$oid":"651fa006b15a534c69b119ef"}}},{"$lookup":{"from":"rankings","localField":"ownerOf","foreignField":"_id","as":"ownedRankings"}},{"$lookup":{"from":"rankings","localField":"memberOf","foreignField":"_id","as":"memberRankings"}},{"$lookup":{"from":"users","localField":"memberRankings.owner_id","foreignField":"_id","as":"memberRankingsWithOwnerName"}},{"$project":{"_id":{"$numberInt":"1"},"userid":{"$numberInt":"1"},"nickname":{"$numberInt":"1"},"active":{"$numberInt":"1"},"description":{"$numberInt":"1"},"datestamp":{"$numberInt":"1"},"token":{"$numberInt":"1"},"updatetext":{"$numberInt":"1"},"mobile":{"$numberInt":"1"},"credits":{"$numberInt":"1"},"ownedRankings":{"_id":{"$numberInt":"1"},"active":{"$numberInt":"1"},"owner_id":{"$numberInt":"1"},"baseaddress":{"$numberInt":"1"},"ranking":{"$numberInt":"1"},"player_count":{"$numberInt":"1"},"name":{"$numberInt":"1"},"owner_name":"$nickname"},"memberRankings":{"_id":{"$numberInt":"1"},"name":{"$numberInt":"1"},"active":{"$numberInt":"1"},"owner_id":{"$numberInt":"1"},"baseaddress":{"$numberInt":"1"},"ranking":{"$numberInt":"1"},"player_count":{"$numberInt":"1"},"owner_name":{"$arrayElemAt":["$memberRankingsWithOwnerName.nickname",{"$numberInt":"0"}]}},"owner_ranking_count":{"$size":"$ownedRankings"},"member_ranking_count":{"$size":"$memberRankings"},"addInfo":{"$numberInt":"1"},"gender":{"$numberInt":"1"},"age":{"$numberInt":"1"}}}]}]"""
