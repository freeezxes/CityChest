use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, MintTo, Token, TokenAccount},
};
use mpl_token_metadata::instruction as token_instruction;
use solana_program::program::invoke;

declare_id!("2dWBbwdSKRmncqUYzLrD2RfTSkmWX5EwzkpkLQcq9iNk");

#[program]
pub mod tourist_passport {
    use super::*;

    /// Минтим 1 NFT в кошелёк payer
    pub fn mint_nft(ctx: Context<MintNft>, name: String, symbol: String, uri: String) -> Result<()> {
        let ix = token_instruction::create_metadata_accounts_v3(
            ctx.accounts.token_metadata_program.key(),
            ctx.accounts.metadata.key(),
            ctx.accounts.mint.key(),
            ctx.accounts.mint_authority.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.mint_authority.key(),
            name,
            symbol,
            uri,
            None, // creators
            0,    // seller_fee_basis_points
            true, // update_authority_is_signer
            false, // is_mutable
            None,  // collection
            None,  // uses
            None,  // collection_details
        );

        invoke(
            &ix,
            &[
                ctx.accounts.metadata.to_account_info(),
                ctx.accounts.mint.to_account_info(),
                ctx.accounts.mint_authority.to_account_info(),
                ctx.accounts.payer.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
                ctx.accounts.token_metadata_program.to_account_info(),
                ctx.accounts.rent.to_account_info(),
            ],
        )?;

        // Минтим сам токен
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.ata.to_account_info(),
                    authority: ctx.accounts.mint_authority.to_account_info(),
                },
            ),
            1,
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintNft<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: PDA для авторитета минта
    #[account(seeds = [b"mint_auth"], bump)]
    pub mint_authority: UncheckedAccount<'info>,

    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = mint_authority.key(),
        mint::freeze_authority = mint_authority.key()
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer
    )]
    pub ata: Account<'info, TokenAccount>,

    /// CHECK: PDA для метаданных
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    /// CHECK: Метаплекс Metadata Program
    #[account(address = mpl_token_metadata::ID)]
    pub token_metadata_program: UncheckedAccount<'info>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
