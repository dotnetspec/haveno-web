import { HavenoClient } from "haveno-ts";

// create client connected to Haveno daemon
const alice = new HavenoClient("http://localhost:8080", "apitest");

// use Haveno daemon
const balances = await alice.getBalances();
const paymentAccounts = await alice.getPaymentAccounts();
const myOffers = await alice.getMyOffers("ETH");
const offers = await alice.getOffers("ETH", "BUY");
const trade = await alice.takeOffer(offers[0].getId(), paymentAccounts[0].getId());

// disconnect client
await alice.disconnect();