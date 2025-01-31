import React, { useCallback, useState} from 'react';
import { Classes, HTMLSelect } from '@blueprintjs/core';
import classNames from 'classnames';
import { IconNames } from '@blueprintjs/icons';
import { Theme, THEMES } from '../theme.ts';

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
    onThemeChange: (theme: Theme) => void;
    currentNode:MosaicNode<number> | null;
    onNodeChange: (newNode: MosaicNode<number> | null) => void;
}

function NavBar({currentNode, currentTheme, onNodeChange, onThemeChange}: NavBarProps) {
    const [theme, setCurrentTheme] = useState<string>(currentTheme || 'Blueprint');
    const [node, setNode] = useState<MosaicNode<number> | null>(currentNode);

    const autoArrange = useCallback(() => {
        const leaves = getLeaves(node);
        const newNode = createBalancedTreeFromLeaves(leaves);
        setNode(newNode);
        onNodeChange(newNode);
    }, [node, onNodeChange]);

   const handleChangeTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTheme = e.target.value;
        setCurrentTheme(newTheme);
        onThemeChange(newTheme as Theme);
    };

        const addToTopRight = () => {
        let updatedNode = node;
        const totalWindowCount = getLeaves(updatedNode).length;
        if (updatedNode) {
            const path = getPathToCorner(updatedNode, Corner.TOP_RIGHT);
            const parent = getNodeAtPath(updatedNode, dropRight(path)) as MosaicParent<number>;
            const destination = getNodeAtPath(updatedNode, path) as MosaicNode<number>;
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

            updatedNode = updateTree(updatedNode, [
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
            updatedNode= totalWindowCount + 1;
        }

        setNode(updatedNode);
        onNodeChange(updatedNode);
    };

    return (
        <div className='bg-sky-950 text-white h-16'>
            <div className="container w-full flex justify-between pt-5 items-center align-center">
                <p className='pl-2'>react mosaic <span className="text-gray-500">v6.1.0</span></p>
                <div className="flex space-x-4 ml-auto">
                    <label>
                        <span className='mr-2'>Theme:</span>
                        <HTMLSelect value={theme} onChange={handleChangeTheme}>
                            {React.Children.toArray(
                                Object.keys(THEMES).map((label) =>
                                    <option key={label}>{label}</option>)
                            )}
                        </HTMLSelect>
                    </label>
                    <span className='pt-1'>Example Actions:</span>
                    <button
                        className={classNames(Classes.BUTTON, Classes.iconClass(IconNames.GRID_VIEW))}
                        onClick={autoArrange}
                    >
                        Auto Arrange
                    </button>
                    <button
                        className={classNames(Classes.BUTTON, Classes.iconClass(IconNames.ARROW_TOP_RIGHT))}
                        onClick={addToTopRight}
                    >
                        Add Window to Top Right
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NavBar;
