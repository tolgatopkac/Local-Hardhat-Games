const contractName = "Game4";

async function main() {
  // Deploy
  const Game = await hre.ethers.getContractFactory(contractName);
  const game = await Game.deploy();
  await game.waitForDeployment();

  console.log(`${contractName} deployed to address: ${game.target}`);

  // Game4 için: x = 56 (çünkü 210 + 56 = 266, 266 % 256 = 10)
  console.log("Calling win(56)...");
  const tx = await game.win(56);
  const receipt = await tx.wait();

  console.log("Game won!");

  // Event'leri filtrele ve göster
  const winnerEvents = receipt.logs.filter((log) => {
    try {
      const parsedLog = game.interface.parseLog(log);
      return parsedLog.name === "Winner";
    } catch {
      return false;
    }
  });

  console.log("\n=== WINNER EVENTS ===");
  winnerEvents.forEach((log, index) => {
    const parsedLog = game.interface.parseLog(log);
    console.log(`Event ${index + 1}:`);
    console.log("  Event Name:", parsedLog.name);
    console.log("  Winner Address:", parsedLog.args.winner);
    console.log("  Event Signature:", parsedLog.signature);
    console.log("  Topics:", log.topics);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
