# ♟ CryptoChess
CryptoChess is a dApp on the Flare network that allows players to compete for crypto prizes by linking smart contracts to tournaments on <a href="https://chess.com" target="_blank">chess.com</a>. It leverages the Flare Data Connector (<a href="https://dev.flare.network/fdc/overview" target="_blank">FDC</a>) to verify data from the chess.com API, such as the players participating in the tournament, the tournament status and the winner of the tournament.

The current development build is live at <a href="https://crypto-chess-flare.vercel.app">crypto-chess-flare.vercel.app</a>.

You can see a demonstration video of the dApp <a href="https://youtu.be/hzl9kupwtN8" target="_blank">here</a>.

## How It Works
1. The tournament organizer creates a tournament on chess.com and invites players to join.

2. From the CryptoChess frontend the tournament organizer deploys a smart contract with the chess.com url of the tournament and a chosen participation fee as arguments. The frontend calls the createTournament function on the ChessTournament factory <a href="https://coston2-explorer.flare.network/address/0xE67D4c2E880D6D21659EB58A357f47AF4de1a61c" target="_blank">contract</a> which deploys a clone of the ChessTournament implementation <a href="https://coston2-explorer.flare.network/address/0x35Ebf3282D11e325f9DD307c177e9b6a5CA25864" target="_blank">contract</a>, with the arguments provided by the tournament organizer. See the diagram below:


<div align="center">
<img src="images/contract-diagram.png" alt="Contract Diagram" width="400"/>
</div>


3. Players select the tournament from the list on the frontend and join by submitting their chess.com username and paying the participation fee. This will send a request to the backend server to submit an attestation request and retrieve a proof from the Flare DA layer to verify that the username submitted is indeed part of the tournament on chess.com. This proof is sent back to the frontend and provided as argument to the addPlayer function on the tournament contract, which upon verification will receive the payment and map the player's username to their wallet address.

<div align="center">
<img src="images/add-player-flow.png" alt="Add player Flow" width="700"/>
</div>

4. When all players have paid the participation fee, the players play the tournament on chess.com.

5. After the tournament is finished, anyone can trigger the "Send Prize" button on the frontend, which sends a request to the backend to submit an attestation request and retrieve a proof from the Flare DA layer to verify the tournament status and winner. This proof is sent back to the frontend and provided as argument for the finishTournament function on the tournament contract. If the proof is valid, the prize money in the contract (the total amount of participation fees paid by the players) is sent to the address mapped to the winner's username.

<div align="center">
<img src="images/send-prize-flow.png" alt="Add player Flow" width="700"/>
</div>

## How To Run
This project consists of 3 parts: webapp, server and contracts. Run the server first, then the webapp. You won't need to go into contracts, unless you want to deploy your own modified versions of the ChessTournament smart contracts.

### Prerequisites
This project requires <a href="https://nodejs.org" target="_blank">Node.js</a> 18.17.0 or newer.

### Server
Go into the server folder:
```
cd server
```
Copy the `.env.example` file into your local `.env` file. 
```
cp .env.example .env
```
Don't forget to add your `PRIVATE_KEY`.<br>
Then install dependencies and run the server:
```
npm install
npx run start
```
### WebApp
Go into the webapp folder:
```
cd webapp
```
Copy the `.env.example` file into your local `.env` file.
```
cp .env.example .env
```
Don't forget to add your API keys for `FLARE_API_KEY_TESTNET` `JQ_VERIFIER_API_KEY_TESTNET`.<br> 
Then install dependencies and run the webapp:
```
npm install
npm run dev
```
