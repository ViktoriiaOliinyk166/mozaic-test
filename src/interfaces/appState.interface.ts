import { MosaicNode } from "react-mosaic-component";
import { Theme } from "../theme.ts";

export interface IAppState {
    currentNode: MosaicNode<number> | null;
    currentTheme: Theme;
}