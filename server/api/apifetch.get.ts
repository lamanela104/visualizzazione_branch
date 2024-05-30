import mysql from 'mysql2'
import type { BranchT, RawBranchT, TableRowT } from '~/typings'

export default defineEventHandler(async (event) => {
    try {
        // ottiene dati della repository per mandare una richiesta
        const config = useRuntimeConfig().bitbucket;
        const branchesResponse = await fetch(`https://api.bitbucket.org/2.0/repositories/${config.user}/${config.repo}/refs/branches?pagelen=20`)
        
        
        // Ottiene le branch crude
        const rawBranches: RawBranchT[] = (await branchesResponse.json())["values"]

        //Elabora le branch
        const branches: BranchT[] = rawBranches.map((v) => {
            return {
                name: v.name,
                link: v.links.html.href,
                commit: {
                    author: v.target.author.raw,
                    date: v.target.date,
                    hash: v.target.hash,
                    message: v.target.message
                }
            }
        })
        setResponseStatus(event, 200, "OK")
        
        return branches
    } catch (error) {
        console.error('Errore durante la API-Fetch delle branch:', error);
        setResponseStatus(event, 500, 'Si è verificato un errore imprevisto durante la visualizzazione delle branch')
    }
})