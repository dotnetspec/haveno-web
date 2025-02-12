module Data.Hardware exposing (HardwareDevice, signTransaction)

-- Internal type not exposed to other modules


type alias InternalHardwareDevice =
    { id : Int
    , status : HardwareStatus
    , details : Maybe HardwareDetails
    }


type HardwareDevice
    = HardwareDevice InternalHardwareDevice


type HardwareStatus
    = Connected
    | Disconnected


type alias HardwareDetails =
    { model : String
    , firmwareVersion : String
    }


type alias Transaction =
    { id : Int
    , amount : Float -- Amount of currency to transfer
    , recipient : String -- Address of the recipient
    , sender : String -- Address of the sender (if needed)
    , fee : Float -- Transaction fee

    --, timestamp : Time.Posix  -- Timestamp for the transaction
    , memo : Maybe String -- Optional field for a memo or note
    }


{- connect : HardwareDevice -> Cmd msg
connect (HardwareDevice device) =
    if device.status == Disconnected then
        -- Command to connect to the hardware, possibly interacting with a JavaScript port
        -- Return updated HardwareDevice with `status = Connected`
        sendMessageToJs
            "connectLNS"

    else
        Cmd.none



-- Already connected, so do nothing


disconnect : HardwareDevice -> Cmd msg
disconnect (HardwareDevice device) =
    if device.status == Connected then
        -- Command to disconnect from the hardware, possibly interacting with a JavaScript port
        -- Return updated HardwareDevice with `status = Disconnected`
        sendMessageToJs
            "disconnectLNS"

    else
        Cmd.none -}



-- Already disconnected, so do nothing
-- Command to disconnect from the hardware, possibly interacting with a JavaScript port
-- Return updated HardwareDevice with `status = Disconnected`


signTransaction : HardwareDevice -> Transaction -> Cmd msg
signTransaction (HardwareDevice device) transaction =
    if device.status == Connected then
        -- Command to sign transaction, possibly interacting with a JavaScript port
        Cmd.none

    else
        Cmd.none



-- Device is not connected, so do nothing


--port sendMessageToJs : String -> Cmd msg
