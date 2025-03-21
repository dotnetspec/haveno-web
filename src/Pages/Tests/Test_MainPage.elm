module Pages.Tests.Test_MainPage exposing (tests)

import Expect
import Json.Decode
import Main exposing (JsMessage, jsMessageDecoder)
import Test exposing (Test, describe, test)



tests : Test
tests =
    describe "jsMessageDecoder"
          [ test "should decode a valid JsMessage JSON" <|
            \_ ->
                let
                    jsonString =
                        """
                        {
                            "page": "AccountsPage",
                            "typeOfMsg": "decryptedCrypoAccountsResponse",
                            "accountsData": ["1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v", "1GK6XMLmzFVj8ALj6mfBsbifRoD4miY36o"],
                            "currency": "BTC"
                        }
                        """
                    
                    expected : JsMessage
                    expected =
                        { page = "AccountsPage"
                        , typeOfMsg = "decryptedCrypoAccountsResponse"
                        , accountsData =  [ "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v", "1GK6XMLmzFVj8ALj6mfBsbifRoD4miY36o" ]
                        , currency = "BTC"
                        }
                in
                case Json.Decode.decodeString jsMessageDecoder jsonString of
                    Ok actual -> Expect.equal actual expected
                    Err err -> Expect.fail (Json.Decode.errorToString err)
        ]
        
        