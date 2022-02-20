import type { Web3ReactHooks } from "@web3-react/core";
import type { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { useCallback, useState } from "react";
import { CHAINS, getAddChainParameters, URLS } from "../chains";

export function ConnectWithSelect({
  connector,
  chainId,
  isActivating,
  error,
  isActive,
}: {
  connector: MetaMask | Network;
  chainId: ReturnType<Web3ReactHooks["useChainId"]>;
  isActivating: ReturnType<Web3ReactHooks["useIsActivating"]>;
  error: ReturnType<Web3ReactHooks["useError"]>;
  isActive: ReturnType<Web3ReactHooks["useIsActive"]>;
}) {
  const isNetwork = connector instanceof Network;

  const [desiredChainId, setDesiredChainId] = useState<number>(
    isNetwork ? 1 : -1
  );

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button
          onClick={() =>
            connector instanceof Network
              ? connector.activate(
                  desiredChainId === -1 ? undefined : desiredChainId
                )
              : connector.activate(
                  desiredChainId === -1
                    ? undefined
                    : getAddChainParameters(desiredChainId)
                )
          }
        >
          Reconnect
        </button>
      </div>
    );
  } else if (isActive) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button onClick={() => connector.deactivate()}>Disconnect</button>
      </div>
    );
  } else if (!isActive) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button
          onClick={
            isActivating
              ? undefined
              : () =>
                  connector instanceof Network
                    ? connector.activate(
                        desiredChainId === -1 ? undefined : desiredChainId
                      )
                    : connector.activate(
                        desiredChainId === -1
                          ? undefined
                          : getAddChainParameters(desiredChainId)
                      )
          }
          disabled={isActivating}
        >
          Connect wallet
        </button>
      </div>
    );
  }
}
