# Local Hardhat Games

Let's work on our solidity skills while deploying against a local hardhat blockchain! Inside this repository you'll find 5 smart contracts labled `Game1` to `Game5`. The goal of each smart contract is to:

1. Deploy it to our local hardhat network
2. Send some transaction(s) to emit the Winner event!

If you see the Winner event in the transaction receipt: congratulations, you're a winner! Let's talk about how to setup and run each game.

## 1. Install Depedencies

Install all depedencies with `npm i`. This will install everything you need, including `hardhat`.

## 2. Run the Hardhat Node

Next, take a look at the `hardhat.config.js` file. Specifically this line:

```javascript
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "localhost", // <-- this one!
};
```

The `defaultNetwork` is going to set our scripts to run, by default, against our local node.

Let's go ahead and run our local node. You can do so by running `npx hardhat node`. This will spin up a local, persistent hardhat blockchain on your port 8545.

## 3. Deploy and Win Games (Recommended Approach)

The easiest way to play the games is using our combined `deploy-and-win.js` script that handles both deployment and winning in one go.

### How to use deploy-and-win.js:

1. **Change the contract name** in `scripts/deploy-and-win.js` to the game you want to play
2. **Run the script** with `npx hardhat run scripts/deploy-and-win.js --network localhost`

```javascript
const contractName = "Game1"; // <-- Change this to Game1, Game2, Game3, Game4, or Game5
```

The script will:

- Deploy the contract
- Show the deployed address
- Execute the required steps to win the game
- Show the Winner event details

### Game-specific Requirements:

**Game1**: Simple win, just calls `win()`

```javascript
const tx = await game.win();
```

**Game2**: Requires setting x and y values that sum to 50

```javascript
await game.setX(20);
await game.setY(30);
const tx = await game.win();
```

**Game3**: Requires calling win with parameter 45 (45 + 210 = 255)

```javascript
const tx = await game.win(45);
```

**Game4**: Requires calling win with parameter 56 (uses uint8 overflow: 210 + 56 = 266, 266 % 256 = 10)

```javascript
const tx = await game.win(56);
```

**Game5**: Requires getting allowance and minting tokens to have balance >= 10000

```javascript
await game.giveMeAllowance(10000);
await game.mint(10000);
const tx = await game.win();
```

## 4. Alternative: Traditional Deploy + Win Method

If you prefer the traditional approach, you can still use separate scripts:

### Deploy a Contract

Run `npx hardhat run scripts/deploy.js` to deploy. **Note:** The original deploy script had an issue with ethers.js v6. The address property changed from `game.address` to `game.target`.

Fixed deploy script:

```javascript
const contractName = "Game1";

async function main() {
  const Game = await hre.ethers.getContractFactory(contractName);
  const game = await Game.deploy();
  await game.waitForDeployment();
  console.log(`${contractName} deployed to address: ${game.target}`); // <-- use game.target instead of game.address
}
```

### Win the Game

Use the deployed address in `scripts/win.js` and modify it according to each game's requirements as shown above.

# Troubleshooting

## Common Errors

1. **Gas Estimation Error** - if you see a gas estimation error, this means that the blockchain node was unable to estimate the gas. The reason for this is often because the transaction reverted!
2. **`game.[method]` is not a function** - this typically happens because you forgot to change the contract name. More technically, there's function that you think should exist on the contract, but hardhat is not able to call it because the ABI it fetched from the `artifacts` folder does not have that method defined.
3. **"deployed to address: undefined"** - This happens with newer versions of ethers.js (v6). Use `game.target` instead of `game.address` and add `await game.waitForDeployment()` before accessing the address.

## Use Hardhat Console Log

Are you stuck on a particular challenge? You can use `console.log` from Hardhat! To do so, simply import it into your contract (before you deploy it):

```solidity
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Game1 {
  event Winner(address winner);

  function win() public {
    console.log(22);
    emit Winner(msg.sender);
  }
}
```

Now when you call `win` on `Game1` you will see `22` show up in your local hardhat node. This will happen even if the transaction reverts!

## Package Updates

To keep your packages up to date, you can use:

```bash
# Check outdated packages
npm outdated

# Update within version ranges
npm update

# Or use npm-check-updates for major updates
npm install -g npm-check-updates
ncu -u
npm install
```
