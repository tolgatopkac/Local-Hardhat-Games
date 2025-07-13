const contractName = "Game2";

async function main() {
  // Deploy
  const Game = await hre.ethers.getContractFactory(contractName);
  const game = await Game.deploy();
  await game.waitForDeployment();

  console.log(`${contractName} deployed to address: ${game.target}`);

  // Game2 için: x ve y değerlerini ayarla
  console.log("Setting x = 20, y = 30...");
  await game.setX(20);
  await game.setY(30);

  // Win
  const tx = await game.win();
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
