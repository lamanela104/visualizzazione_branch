import { DBEnvironmentT, EnvironmentT } from "~/typings";
import { dbQuery } from "~/utils/back";
import { execSync } from 'child_process'

export default defineEventHandler(async (event) => {
    let body: EnvironmentT = await readBody(event);
    if (!body || body.ID == undefined) {
        setResponseStatus(event, 500, "Assicurati di inserire il campo `ID`")
        return;
    }

    let query = await dbQuery<DBEnvironmentT[]>("SELECT deploy_path FROM environment WHERE ID=?", body.ID);
    if (query instanceof Error) {
        setResponseStatus(event, 500, "Errore nella query del DB");
        return
    }
    
    const { deploy_path } = query[0][0] as DBEnvironmentT;

    if(deploy_path == null) { // TODO controllare errore 
        setResponseStatus(event, 500, "Deploy Path è null");
        return
    }


    let execValue;
    try {
        execValue = execSync(`${deploy_path}`).toString('utf-8');
    }catch(e) {
        console.warn(e);
        setResponseStatus(event, 500, "Errore nell'esecuzione del file");
        return
    }
    setResponseStatus(event, 201, "OK");
    return execValue
});