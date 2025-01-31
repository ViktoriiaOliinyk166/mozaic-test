import React, { useCallback, useState } from 'react';

import {
  getLeaves,
  Mosaic,
  MosaicNode,
  MosaicZeroState,
} from 'react-mosaic-component';

import { Theme, THEMES } from './theme';
import  CustomWindow  from './components/CustomWindow.tsx'

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import 'react-mosaic-component/react-mosaic-component.css';
import './example.less';
import './App.css';
import NavBar from "./components/NavBar.tsx";

 function App(){
   const [nodeState, setNodeState] = useState<MosaicNode<number> | null>({
     direction: 'row',
     first: 1,
     second: {
       direction: 'column',
       first: 2,
       second: 3,
     },
     splitPercentage: 40,
   });

   const [currentTheme, setCurrentTheme] = useState<Theme>('Blueprint');

   const changeTheme = useCallback((newTheme: Theme) => {
     setCurrentTheme(newTheme);
   }, []);

   const changeCurrentNode = useCallback((newNode : MosaicNode<number > | null)=>{
     setNodeState(newNode);
   }, []);

   const onChange = useCallback((newNode : MosaicNode<number> | null) => {
     setNodeState(newNode);
   },[]);

   const totalWindowCount = getLeaves(nodeState).length;

   return (
       <React.StrictMode>
         <div className="react-mosaic">
           <NavBar
               currentTheme={currentTheme}
               currentNode={nodeState}
               onThemeChange={changeTheme}
               onNodeChange={changeCurrentNode}/>
           <Mosaic<number>
               renderTile={(count, path) => (
                   <CustomWindow
                       count={count}
                       path={path}
                       totalWindowCount={totalWindowCount}
                       theme={currentTheme}/>
               )}
               zeroStateView={<MosaicZeroState createNode={() => totalWindowCount + 1}/>}
               value={nodeState}
               onChange={onChange}
               className={THEMES[currentTheme]}
               blueprintNamespace="bp5"
           />
         </div>
       </React.StrictMode>
   );
}

export default App;