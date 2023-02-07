import { RouterCallbackFunc } from '../Server/Server.types';

const CORSHeaders: { [header: string]: string } = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
}

export const commonJSONResponseHeaders: { [header: string]: string } = { 
    'Content-Type': 'application/json', 
    ...CORSHeaders,
}

export const preflightRequest: RouterCallbackFunc = (req, res) => {
    res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, PUT, GET, OPTIONS, DELETE",
        "Access-Control-Max-Age": 86400,
        "Access-Control-Allow-Headers": "*"
    })
    res.end();
}