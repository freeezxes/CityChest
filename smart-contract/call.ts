import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

// ⚠️ Укажи ровно тот же Program ID, что в коде/Anchor.toml
const PROGRAM_ID = new PublicKey("2dWBbwdSKRmncqUYzLrD2RfTSkmWX5EwzkpkLQcq9iNk");

// Anchor сам кладёт IDL сюда после build/deploy
const IDL = require("./target/idl/tourist_passport.json");

(async () => {
    // Провайдер берёт ключ из ~/.config/solana/id.json и URL из переменной окружения
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = new anchor.Program(IDL, PROGRAM_ID, provider);

    // Вызов без аккаунтов и аргументов — просто .rpc()
    const sig = await program.methods.initialize().rpc();
    console.log("Tx signature:", sig);
})();
