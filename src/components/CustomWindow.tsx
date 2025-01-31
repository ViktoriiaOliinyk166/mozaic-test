import { useEffect, useState} from "react";
import { MosaicBranch, MosaicWindow } from "react-mosaic-component";
import { ICompany } from "../interfaces/companies.interface.ts";
import { Theme } from "../theme.ts";

 interface ICustomWindowProps {
    count: number;
    path: MosaicBranch[];
    totalWindowCount: number;
    theme: Theme;
}

function CustomWindow({path, theme, count, totalWindowCount}: ICustomWindowProps) {
    const [dataCompany, setDataCompany] = useState<ICompany[]>([]);

    useEffect(() => {
        fetch('http://localhost:3000/companies?_limit=3')
            .then(response => response.json())
            .then((data: ICompany[] ) => {setDataCompany(data)})
    }, []);

        const renderCompany = (index: number) => {
        const company = dataCompany[index];
        return company ? (
            <ul className='space-y-2 overflow-auto'>
                {Object.entries(company)
                    .map(([key, value]) => (
                        <li key={key} className='text-sm'>
                            <span className='font-bold '>{formatKey(key)}:</span> {value}
                        </li>
                    ))}
            </ul>
        ) : null;
    };

   const formatKey = (key: string) => {
        return key
            .replace(/_/g, ' ')
            .replace(/^./, str => str.toUpperCase());
    }

    return (
            <MosaicWindow<number>
                title={`Company ${count}`}
                createNode={() => totalWindowCount + 1}
                path={path}
                className={theme === "Blueprint Dark" ? "bp5-dark" : ""}>
                <div className="example-window">
                    {renderCompany(count - 1)}
                </div>
            </MosaicWindow>
        );
}

export default CustomWindow;