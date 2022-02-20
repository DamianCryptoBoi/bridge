import type { Web3ReactHooks } from "@web3-react/core";
import { CHAINS } from "../chains";

export function Chain({
  chainId,
}: {
  chainId: ReturnType<Web3ReactHooks["useChainId"]>;
}) {
  if (chainId === undefined) return null;

  const name = chainId ? CHAINS[chainId]?.name : undefined;

  if (name) {
    return (
      <div style={{ marginLeft: "3rem", marginRight: "3rem" }}>
        <b>{name}</b>
      </div>
    );
  }

  return (
    <div style={{ marginLeft: "3rem", marginRight: "3rem" }}>
      Chain Id: <b>{chainId}</b>
    </div>
  );
}
