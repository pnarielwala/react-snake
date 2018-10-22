// @flow
import React, { PureComponent } from 'react'

type PropsT = {
  className?: string,
}

class Tile extends PureComponent<PropsT> {
  render() {
    return (
      <svg width="1em" height="1em" {...this.props}>
        <title>{`background`}</title>
        <path fill="currentColor" d="M-1-1h202v202H-1z" />
        <g>
          <title>{`Layer 1`}</title>
        </g>
      </svg>
    )
  }
}

export default Tile
