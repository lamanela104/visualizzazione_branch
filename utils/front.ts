import type { FieldT } from "../typings";
import { platform } from 'process'


export function validPath(elemento: FieldT, dati?: FieldT[]): boolean {
    if (elemento.path.length == 0) return false;
    if (elemento.path.length > 200) return false;
    if (platform === "win32") {
        if (!/^([a-zA-Z]:\\|(\.\.?\\)?)([^\\\/:*?"<>|]+\\)*[^\\\/:*?"<>|]*$/.test(elemento.path)) return false;
    } else {
        if (!/^(\/|(\.\.?\/)?)([^\/]+\/)*[^\/]*$/.test(elemento.path)) return false;
    }
    if (dati)
        for (const dato of dati) {
            if (dato.environment != elemento.environment && dato.path === elemento.path) return false;
        }
    return true;
}
export function validEnvironment(environment: string, dati?: FieldT[]) {
    if (environment.length == 0) return false;
    if (environment.length > 30) return false;
    if (dati)
        for (const dato of dati) {
            if (dato.environment === environment) return false;
        }
    return true;
}