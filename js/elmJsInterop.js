import { encrypt, decrypt } from './encryption.js'


export async function elmInterop(message) {
  if (!message) {
    console.log('Null or undefined. No message yet', message)
    return
  }

  const parsedMessage =
    typeof message === 'string' ? JSON.parse(message) : message

  switch (parsedMessage.typeOfMsg) {
    case 'ElmReady':
      try {
        console.log('Message from Elm : ', parsedMessage.typeOfMsg)
      } catch (error) {
        console.error('Error Receiving Message from Elm: ', error)
      }
      break

    case 'encryptCryptoAccountMsgRequest':
      console.log('inside encryptCryptoAccountMsgRequest ', message)
      try {
        const encryptedData = await encrypt(
          parsedMessage.accountsData,
          parsedMessage.password
        )
        localStorage.setItem(
          parsedMessage.storeAs,
          JSON.stringify(encryptedData)
        )
      } catch (error) {
        console.error('Error Receiving Encryption Message from Elm: ', error)
      }
      break

    case 'decryptCryptoAccountsMsgRequest':
      try {
        let keysToDecrypt = []

        if (parsedMessage.currency === 'BTC') {
          keysToDecrypt = Object.keys(localStorage).filter(key =>
            key.startsWith('BTC_Public_Key')
          )
        } else if (parsedMessage.currency === 'AllCrypto') {
          keysToDecrypt = Object.keys(localStorage).filter(key =>
            key.includes('Public_Key')
          )
        } else {
          console.log(`Unsupported currency: ${parsedMessage.currency}`)
          return
        }

        if (keysToDecrypt.length === 0) {
          console.log('No crypto accounts found in localStorage.')
          return
        }

        const decryptedData = await Promise.all(
          keysToDecrypt.map(async key => {
            const encryptedData = JSON.parse(localStorage.getItem(key))
            return await decrypt(encryptedData, parsedMessage.password)
          })
        )

        if (
          window.Elm &&
          window.Elm.ports &&
          window.Elm.ports.receiveMsgsFromJs
        ) {
          window.Elm.ports.receiveMsgsFromJs.send({
            typeOfMsg: 'decryptedCryptoAccountsResponse',
            page: parsedMessage.page,
            accountsData: decryptedData,
            currency: parsedMessage.currency
          })
        }
      } catch (error) {
        console.error('Error decrypting crypto accounts:', error)
      }
      break

    default:
      console.log(`Sorry, problem:  ${message}.`)
  }
}
