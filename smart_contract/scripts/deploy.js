const main = async () => {
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  const transactions = await Transactions.deploy();
  
  const File = await hre.ethers.getContractFactory("File");
  const file = await File.deploy();

  await transactions.deployed();
  await file.deployed();

  console.log(
    `transactions deployed to ${transactions.address}, file deployed to ${file.address}`
  );
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runMain();


// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
