import React, { Component } from 'react';
import { Classes, HTMLSelect } from '@blueprintjs/core';
import classNames from 'classnames';
import { IconNames } from '@blueprintjs/icons';
import { THEMES } from '../theme.ts';

import {
    Corner,
    createBalancedTreeFromLeaves,
    getLeaves,
    getNodeAtPath,
    getOtherDirection,
    getPathToCorner,
    MosaicDirection,
    MosaicNode,
    MosaicParent,
    updateTree
} from "react-mosaic-component";
import dropRight from "lodash/dropRight";

export interface NavBarProps {
    currentTheme: string;
    onThemeChange: (theme: string) => void;
    currentNode:MosaicNode<number> | null;
    onNodeChange: (newNode: MosaicNode<number> | null) => void;
}

export interface NavBarState {
    currentTheme: string;
    currentNode:MosaicNode<number> | null;
}

class NavBar extends Component<NavBarProps, NavBarState> {
    constructor(props: NavBarProps) {
        super(props);
        this.state = {
            currentTheme: props.currentTheme || 'Blueprint',
            currentNode: props.currentNode,
        };
    }

    private autoArrange = () => {
        const leaves = getLeaves(this.state.currentNode);
        const newNode = createBalancedTreeFromLeaves(leaves);
        this.setState({
            currentNode: newNode,
        });
        this.props.onNodeChange(newNode);
    };

    private addToTopRight = () => {
        let { currentNode } = this.state;
        const totalWindowCount = getLeaves(currentNode).length;
        if (currentNode) {
            const path = getPathToCorner(currentNode, Corner.TOP_RIGHT);
            const parent = getNodeAtPath(currentNode, dropRight(path)) as MosaicParent<number>;
            const destination = getNodeAtPath(currentNode, path) as MosaicNode<number>;
            const direction: MosaicDirection = parent ? getOtherDirection(parent.direction) : 'row';

            let first: MosaicNode<number>;
            let second: MosaicNode<number>;
            if (direction === 'row') {
                first = destination;
                second = totalWindowCount + 1;
            } else {
                first = totalWindowCount + 1;
                second = destination;
            }

            currentNode = updateTree(currentNode, [
                {
                    path,
                    spec: {
                        $set: {
                            direction,
                            first,
                            second,
                        },
                    },
                },
            ]);
        } else {
            currentNode = totalWindowCount + 1;
        }

        this.setState({ currentNode });
        this.props.onNodeChange(currentNode);
    };

    handleChangeTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTheme = e.target.value;
        this.setState({
            currentTheme: newTheme,
        });
        this.props.onThemeChange(newTheme)
    }

    renderNavBar() {
        return (
            <div className='bg-sky-950 text-white h-16'>
                <div className="container w-full flex justify-between pt-5 items-center align-center">
                    <p className='pl-2'>react mosaic <span className="text-gray-500">v6.1.0</span></p>
                    <div className="flex space-x-4 ml-auto">
                        <label>
                            <span className='mr-2'>Theme:</span>
                            <HTMLSelect
                                value={this.state.currentTheme}
                                onChange={this.handleChangeTheme}
                            >
                                {React.Children.toArray(Object.keys(THEMES).map((label) => <option
                                    key={label}>{label}</option>))}
                            </HTMLSelect>
                        </label>
                        <span className='pt-1'>Example Actions:</span>
                        <button
                            className={classNames(Classes.BUTTON, Classes.iconClass(IconNames.GRID_VIEW))}
                            onClick={this.autoArrange}
                        >
                            Auto Arrange
                        </button>
                        <button
                            className={classNames(Classes.BUTTON, Classes.iconClass(IconNames.ARROW_TOP_RIGHT))}
                            onClick={this.addToTopRight}
                        >
                            Add Window to Top Right
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return this.renderNavBar();
    }
}

export default NavBar;
