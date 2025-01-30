import { Component } from "react";
import { MosaicBranch, MosaicWindow } from "react-mosaic-component";
import { ICompany } from "../interfaces/companies.interface.ts";
import { Theme } from "../theme.ts";


interface CustomWindowState {
    data: ICompany[];
    error: string | null;
}

export interface ICustomWindowProps {
    count: number;
    path: MosaicBranch[];
    totalWindowCount: number;
    theme: Theme;
}

export class CustomWindow extends Component<ICustomWindowProps, CustomWindowState> {
    constructor(props: ICustomWindowProps) {
        super(props);
        this.state = {
            data: [],
            error: null,
        };
    }

    componentDidMount() {
        fetch("http://localhost:3000/companies?_limit=3")
            .then((response) => {
                return response.json();
            })
            .then((data: ICompany[]) => {
                this.setState({ data });
            })
            .catch((error) => {
                this.setState({
                    error: error.message,
                });
            });
    }

    renderCompany = (index: number) => {
        const company = this.state.data[index];
        return company ? (
            <ul className='space-y-2 overflow-auto'>
                {Object.entries(company)
                    .map(([key, value]) => (
                        <li key={key} className='text-sm'>
                            <span className='font-bold '>{this.formatKey(key)}:</span> {value}
                        </li>
                    ))}
            </ul>
        ) : null;
    };

    formatKey = (key: string) => {
        return key
            .replace(/_/g, ' ')
            .replace(/^./, str => str.toUpperCase());
    }

    render() {
        const { count, path, totalWindowCount, theme } = this.props;

        return (
            <MosaicWindow<number>
                title={`Company ${count}`}
                createNode={() => totalWindowCount + 1}
                path={path}
                className={theme === "Blueprint Dark" ? "bp5-dark" : ""}
            >
                <div className="example-window">
                    {count === 1 && this.renderCompany(0)}
                    {count === 2 && this.renderCompany(1)}
                    {count === 3 && this.renderCompany(2)}
                </div>
            </MosaicWindow>
        );
    }
}
