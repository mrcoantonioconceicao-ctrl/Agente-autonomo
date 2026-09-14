export interface RustExample {
  id: string;
  name: string;
  description: string;
  code: string;
  vulnerabilityType: string;
}

export const RUST_EXAMPLES: RustExample[] = [
  {
    id: "anchor-vault-vulnerable",
    name: "vault_deposit.rs (Anchor Vulnerável)",
    description: "Programa Anchor com Missing Account Validation e Arbitrary CPI.",
    vulnerabilityType: "Missing Account Check & Arbitrary CPI",
    code: `use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solana_vault {
    use super::*;

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        
        // VULNERABILIDADE 1: Missing Account Validation (authority não validada como Signer!)
        let authority = &ctx.accounts.authority;

        // VULNERABILIDADE 2: Unchecked Math Overflow
        vault.total_deposited += amount;

        // VULNERABILIDADE 3: Arbitrary CPI (target token_program não verificado contra token::ID)
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token.to_account_info(),
            to: ctx.accounts.vault_token.to_account_info(),
            authority: authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        
        token::transfer(CpiContext::new(cpi_program, cpi_accounts), amount)?;

        msg!("Depósito realizado: {} lamports pelo usuário", amount);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub vault: Account<'info, VaultState>,
    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token: Account<'info, TokenAccount>,
    /// CHECK: Inseguro! Falta validação se authority é Signer!
    pub authority: AccountInfo<'info>,
    /// CHECK: Inseguro! Aceita qualquer AccountInfo como token_program
    pub token_program: AccountInfo<'info>,
}

#[account]
pub struct VaultState {
    pub total_deposited: u64,
}
`,
  },
  {
    id: "solana-type-cosplay",
    name: "staking_pool.rs (Type Cosplay)",
    description: "Manipulação direta de buffer sem checagem de discriminador de conta.",
    vulnerabilityType: "Type Cosplay & Missing Discriminator",
    code: `use anchor_lang::prelude::*;

declare_id!("Stake11111111111111111111111111111111111111");

#[program]
pub mod staking_pool {
    use super::*;

    pub fn update_user_stake(ctx: Context<UpdateStake>, new_amount: u64) -> Result<()> {
        let account_info = &ctx.accounts.user_account;
        
        // VULNERABILIDADE: Type Cosplay (borrow data direto sem verificar discriminador Anchor)
        let mut data = account_info.data.borrow_mut();
        let user_stake: &mut UserStake = unsafe {
            &mut *(data.as_mut_ptr() as *mut UserStake)
        };
        
        // Altera valor de stake sem checar se a conta pertence ao programa correto
        user_stake.staked_amount = new_amount;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct UpdateStake<'info> {
    /// CHECK: Inseguro! Não utiliza a abstração Account<'info, UserStake>
    #[account(mut)]
    pub user_account: AccountInfo<'info>,
}

pub struct UserStake {
    pub staked_amount: u64,
    pub is_admin: bool,
}
`,
  },
  {
    id: "anchor-vault-secured",
    name: "vault_deposit_secured.rs (Rug Patch Produção)",
    description: "Código Anchor auditado e corrigido pelo Rug Mutator.",
    vulnerabilityType: "Nenhuma (Clean Code & Safe)",
    code: `use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solana_vault {
    use super::*;

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        
        // CORREÇÃO RUG: Checked arithmetic contra overflows
        vault.total_deposited = vault
            .total_deposited
            .checked_add(amount)
            .ok_or(VaultError::MathOverflow)?;

        // CORREÇÃO RUG: CPI seguro utilizando Token program verificado
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token.to_account_info(),
            to: ctx.accounts.vault_token.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        
        token::transfer(CpiContext::new(cpi_program, cpi_accounts), amount)?;

        msg!("Depósito auditado: {} lamports por {}", amount, ctx.accounts.authority.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub vault: Account<'info, VaultState>,
    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token: Account<'info, TokenAccount>,
    
    // CORREÇÃO RUG: Exige que a conta seja obrigatoriamente um Signer!
    pub authority: Signer<'info>,
    
    // CORREÇÃO RUG: Validação tipada do Token Program do SPL
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct VaultState {
    pub total_deposited: u64,
}

#[error_code]
pub enum VaultError {
    #[msg("Operação aritmética causou estouro de memória (Overflow).")]
    MathOverflow,
}
`,
  },
];
