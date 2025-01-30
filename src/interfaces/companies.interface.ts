export interface ICompany {
    id: string
    ticker: string;
    name: string;
    legal_name: string;
    stock_exchange: string;
    short_description: string;
    long_description: string;
    company_url: string;
    business_address: string;
    business_phone_no: string;
    latest_filing_date: string;
    inc_country: string;
    employees: number;
}