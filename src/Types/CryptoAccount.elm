module Types.CryptoAccount exposing (CryptoAccount(..), toString)

-- filepath: /home/alanpoe/Documents/Development/Monero/elm-merge/haveno-web/src/Types/CryptoAccount.elm
-- Define the CryptoAccount type


type CryptoAccount
    = BTC



-- Helper function to convert CryptoAccount to a string


toString : CryptoAccount -> String
toString cryptoAccount =
    case cryptoAccount of
        BTC ->
            "BTC"
