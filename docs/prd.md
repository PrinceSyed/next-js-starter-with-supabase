# Project: Rugbot - RPG Web App

## Overview

### Purpose & Vision  
Build a web app where users authenticate via Twitter (X), play a persuasive role-playing game with an AI chatbot powered by OpenRouter. If they convince the bot, they receive a Solana token via tool calling. A leaderboard displays winners and token counts.

### 1.2 Scope  
- **In‑scope:** Twitter login, chat interface, LLM prompts, Solana token transfer tool, Supabase backend and leaderboard.  
- **Out‑of‑scope:** NFT minting, multiplayer game modes (future consideration).

### 1.3 Audience & Personas  
- **Target Users:** User familiar with crypto who currently hold memecoins.   

## 🎯 Functional Requirements

### 🧠 Authentication & User Management (Tech: Next.js, Supabase)
- **FR-1.** The system **shall allow** users to sign in using their **Twitter (X) account via Supabase OAuth**.  
  *Acceptance:* Supabase user record created, session active.
- **FR-2.** The system **shall store** each user’s **Twitter handle**, **email**, and optionally **wallet address** in Supabase `users` table.
- **FR-3.** The system **shall enforce** Supabase **row‑level security (RLS)** so users can only read/write their own data.

### 💬 Chat Interface & Game Flow (Tech: Next.js, OpenRouter)
- **FR-4.** The system **shall enable** users to initiate a chat session with an **LLM role‑playing chatbot**.
- **FR-5.** The system **shall display** the **full conversation history** in the UI, including user messages and bot replies.
- **FR-6.** The system **shall allow** users to send messages and receive responses via the **OpenRouter API**.

### 🧾 Game Logic & Persuasion Mechanics (Tech: OpenRouter, custom JS logic)
- **FR-7.** The system **shall evaluate** user “wins” when the chatbot determines the user has successfully persuaded it based on predefined prompt logic.
- **FR-8.** The system **shall expose** a **`sendToken` tool** to the LLM via [OpenRouter tool‑calling](https://openrouter.ai/docs/features/tool-calling), enabling the model to initiate token transfers.
- **FR-9.** When the model triggers `sendToken`, the system **shall run** backend logic using **custom JavaScript functions** to execute the token transfer.

### 💰 Token Transfer & Logging (Tech: Solana Web3.js, Helius, Supabase)
- **FR-10.** The system **shall send** a specified amount of **Solana (SOL)** or **SPL token** to a user's wallet using **Solana Web3.js** with **Helius RPC or webhook support**.
- **FR-11.** The system **shall log** all transactions in a `transactions` table in Supabase, including:
  - `user_id`
  - `wallet_address`
  - `token_amount`
  - `tx_hash`
  - `created_at`
- **FR-12.** The system **shall verify** the provided **Solana wallet address** format before sending and **reject malformed or unsafe addresses**.
- **FR-13.** The system **shall support testnet/mainnet selection** via environment config to toggle between development and production chains.


### 🏆 Leaderboard & Profiles (Tech: Next.js, Supabase)
- **FR-13.** The system **shall compute** leaderboard rankings based on total **wins** and **token totals** from the `transactions` table.
- **FR-14.** The system **shall display** a **leaderboard page** showing top users, sorted by wins or total tokens.
- **FR-15.** The system **shall provide** a **profile page** for each logged‑in user, listing their past `game_sessions`, outcomes, and total tokens earned.

### 📦 Data Persistence & Schema (Tech: Supabase)
- **FR-16.** The system **shall store** each game session in a `game_sessions` table with `chat_log`, `outcome` (`win`/`lose`), and timestamp.
- **FR-17.** The system **shall relate** `game_sessions` and `transactions` to `users` via `user_id` foreign key.

---

### 🏗 Tech Stack Summary

- **Frontend**: Next.js + Shadcn UI components + Tailwind CSS  
- **Auth & Database**: Supabase — OAuth via Twitter, RLS, tables: `users`, `game_sessions`, `transactions`  
- **LLM / Chat**: OpenRouter API with tool‑calling support  
- **Web3 Integration**: Solana Web3.js for token sending logic  
- **Server-side Logic**: Custom JavaScript functions exposed as tools to OpenRouter  
