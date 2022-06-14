/* eslint-disable react/jsx-no-useless-fragment */
import React from "react";

/**
 * Component properties
 */
interface Props {
  providers: React.FC[];
}

/**
 * Api provider component
 *
 * @param props component properties
 */
const ApiProvider: React.FC<Props> = ({ providers, children }) => {
  if (providers.length) {
    const Provider = providers[0];

    return (
      <Provider>
        <ApiProvider providers={ providers.slice(1) }>
          { children }
        </ApiProvider>
      </Provider>
    );
  }

  /**
   * Component render
   */
  return <>{ children }</>;
};

export default ApiProvider;