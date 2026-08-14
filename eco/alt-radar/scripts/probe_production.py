"""
AG47 Altcoin Radar - Production Provider Probe & Diagnostic Tool
Tests external connectivity to Solana and BSC providers and verifies API health.
"""

from __future__ import annotations

import asyncio
import sys
import time
import httpx


async def test_geckoterminal() -> bool:
    print("[1/5] Testando GeckoTerminal (Descoberta Solana e BSC)...", end=" ")
    start = time.perf_counter()
    async with httpx.AsyncClient(timeout=8.0) as client:
        try:
            # Test Solana new pools
            r_sol = await client.get(
                "https://api.geckoterminal.com/api/v2/networks/solana/new_pools",
                headers={"Accept": "application/json;version=20230302"},
            )
            # Test BSC new pools
            r_bsc = await client.get(
                "https://api.geckoterminal.com/api/v2/networks/bsc/new_pools",
                headers={"Accept": "application/json;version=20230302"},
            )
            dur = (time.perf_counter() - start) * 1000
            if r_sol.status_code == 200 and r_bsc.status_code == 200:
                print(f"OK ({dur:.0f}ms) - Solana e BSC retornando pools.")
                return True
            print(f"AVISO: Status Solana={r_sol.status_code}, BSC={r_bsc.status_code}")
            return False
        except Exception as e:
            print(f"FALHA: {e}")
            return False


async def test_dexscreener() -> bool:
    print("[2/5] Testando DexScreener (Preços e Liquidez)...", end=" ")
    start = time.perf_counter()
    async with httpx.AsyncClient(timeout=8.0) as client:
        try:
            res = await client.get(
                "https://api.dexscreener.com/latest/dex/tokens/So11111111111111111111111111111111111111112"
            )
            dur = (time.perf_counter() - start) * 1000
            if res.status_code == 200:
                print(f"OK ({dur:.0f}ms) - DexScreener operacional.")
                return True
            print(f"AVISO: Status {res.status_code}")
            return False
        except Exception as e:
            print(f"FALHA: {e}")
            return False


async def test_rugcheck_solana() -> bool:
    print("[3/5] Testando RugCheck (Risco Solana SPL)...", end=" ")
    start = time.perf_counter()
    async with httpx.AsyncClient(timeout=8.0) as client:
        try:
            # Test with wrapped SOL
            res = await client.get(
                "https://api.rugcheck.xyz/v1/tokens/So11111111111111111111111111111111111111112/report"
            )
            dur = (time.perf_counter() - start) * 1000
            if res.status_code in (200, 404):
                print(f"OK ({dur:.0f}ms) - RugCheck API acessível.")
                return True
            print(f"AVISO: Status {res.status_code}")
            return False
        except Exception as e:
            print(f"FALHA: {e}")
            return False


async def test_goplus_bsc() -> bool:
    print("[4/5] Testando GoPlus Security (Risco BSC EVM)...", end=" ")
    start = time.perf_counter()
    async with httpx.AsyncClient(timeout=8.0) as client:
        try:
            # Test BSC WBNB token security
            res = await client.get(
                "https://api.gopluslabs.io/api/v1/token_security/56?contract_addresses=0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
            )
            dur = (time.perf_counter() - start) * 1000
            if res.status_code == 200:
                print(f"OK ({dur:.0f}ms) - GoPlus BSC operacional.")
                return True
            print(f"AVISO: Status {res.status_code}")
            return False
        except Exception as e:
            print(f"FALHA: {e}")
            return False


async def test_solana_rpc() -> bool:
    print("[5/5] Testando Solana RPC (Holders e Supply)...", end=" ")
    start = time.perf_counter()
    async with httpx.AsyncClient(timeout=8.0) as client:
        try:
            payload = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "getTokenSupply",
                "params": ["rndrizKT3MK1iimdxRdWabc1234567890abcdef12"],
            }
            res = await client.post("https://api.mainnet-beta.solana.com", json=payload)
            dur = (time.perf_counter() - start) * 1000
            if res.status_code in (200, 403, 429):
                # 200 is success, 429 indicates public rate limit (suggesting Helius key)
                status_msg = "OK" if res.status_code == 200 else "AVISO (Rate-limited público; use AG47_HELIUS_API_KEY)"
                print(f"{status_msg} ({dur:.0f}ms)")
                return True
            print(f"AVISO: Status {res.status_code}")
            return False
        except Exception as e:
            print(f"FALHA: {e}")
            return False


async def main() -> None:
    print("=" * 65)
    print("AG47 ALTCOIN RADAR - SONDAGEM DE PROVIDERS DE PRODUÇÃO")
    print("=" * 65)
    results = await asyncio.gather(
        test_geckoterminal(),
        test_dexscreener(),
        test_rugcheck_solana(),
        test_goplus_bsc(),
        test_solana_rpc(),
    )
    print("=" * 65)
    if all(results):
        print("[SUCESSO] Todos os providers externos para Solana e BSC estão acessíveis!")
    else:
        print("[AVISO] Alguns endpoints apresentaram latência ou restrição temporária.")
    print("=" * 65)


if __name__ == "__main__":
    asyncio.run(main())
