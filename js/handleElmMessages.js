import { encrypt, decrypt } from './encryption.js'


export async function handleMessageFromElm (message) {
  if (!message) {
    console.log('Null or undefined. No message yet', message)
    return
  }
const parsedMessage = message

console.log('message here ', message)


  switch (parsedMessage.typeOfMsg) {
    case 'ElmReady':
      try {
        console.log('Message from Elm : ', parsedMessage.typeOfMsg)
      } catch (error) {
        console.error('Error Receiving Message from Elm: ', error)
      }
      break
    case 'encryptCryptoAccountMsgRequest':
      try {
        const encryptedData = await encrypt(
          parsedMessage.accountsData,
          parsedMessage.pword
        ) // Call the encrypt function with the parsed message
        localStorage.setItem(parsedMessage.storeAs, encryptedData)
      } catch (error) {
        console.error('Error Receiving Encryption Message from Elm: ', error)
      }
      break
    case 'decryptCryptoAccountsMsgRequest':
      try {
        const keys = Object.keys(localStorage).filter(key =>
          key.startsWith('BTC_Public_Key')
        )
        if (keys.length === 0) {
          console.log('No BTC accounts found in localStorage.')
          return
        }
const decryptedData = await Promise.all(
  keys.map(async key => {
    const encryptedData = JSON.parse(localStorage.getItem(key))
    return await decrypt(encryptedData, parsedMessage.pword)
  })
)
console.log('Decrypted BTC accounts:', decryptedData)

        if (
          window.Elm &&
          window.Elm.ports &&
          window.Elm.ports.receiveMsgsFromJs
        ) {
          window.Elm.ports.receiveMsgsFromJs.send({
            typeOfMsg: 'decryptedCryptoAccountsResponse',
            page: parsedMessage.page,
            accountsData: decryptedData, // Send as a list
            currency: parsedMessage.currency
          })
        }
      } catch (error) {
        console.error('Error decrypting BTC accounts:', error)
      }
      break
    default:
      console.log(`Sorry, problem:  ${message}.`)
  }
}
