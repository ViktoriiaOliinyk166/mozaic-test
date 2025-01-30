import React from 'react';

import {
  getLeaves,
  Mosaic,
  MosaicNode,
  MosaicZeroState,
} from 'react-mosaic-component';

import { IAppState } from "./interfaces/appState.interface.ts";
import {Theme, THEMES} from './theme';
import { CustomWindow } from './components/CustomWindow.tsx'

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import 'react-mosaic-component/react-mosaic-component.css';
import './example.less';
import './App.css';
import NavBar from "./components/NavBar.tsx";

export class App extends React.Component<object, IAppState> {
  state: IAppState = {
    currentNode: {
      direction: 'row',
      first: 1,
      second: {
        direction: 'column',
        first: 2,
        second: 3,
      },
      splitPercentage: 40,
    },
    currentTheme: 'Blueprint',
  };

  changeTheme = (newTheme: string) => {
    this.setState({ currentTheme: newTheme as Theme });
  };

  changeCurrentNode = (newNode : MosaicNode<number > | null) => {
    this.setState({ currentNode: newNode });
  };

  render() {
    const totalWindowCount = getLeaves(this.state.currentNode).length;
    return (
      <React.StrictMode>
        <div className="react-mosaic">
          <NavBar
              currentTheme={ this.state.currentTheme }
              currentNode={ this.state.currentNode }
              onThemeChange={ this.changeTheme }
              onNodeChange={ this.changeCurrentNode }/>
          <Mosaic<number>
              renderTile={(count, path) => (
                  <CustomWindow
                      count={count} path={path}
                      totalWindowCount={totalWindowCount}
                      theme={ this.state.currentTheme as keyof typeof THEMES }/>
              )}
            zeroStateView={<MosaicZeroState createNode={() => totalWindowCount + 1} />}
            value={this.state.currentNode}
            onChange={this.onChange}
            className={THEMES[this.state.currentTheme as keyof typeof THEMES]}
            blueprintNamespace="bp5"
          />
        </div>
      </React.StrictMode>
    );
  }

  private onChange = (currentNode: MosaicNode<number> | null) => {
    this.setState({ currentNode });
  };

}
