import simpleGit from "simple-git";
import type { FieldT, SpawnedValue } from "~/typings";
import { readJson, Spawner } from "~/utils";

export default defineEventHandler(async (event) => {
    let body = getQuery(event) as FieldT

    let { deploy_path, path } = readJson().filter((v, i) => i == body.ID)[0]

    if (!deploy_path || !path) {
        setResponseStatus(event, 500, "Unable to reach deploy")
        return
    }
    // Executes the deploy file
    let spawner;
    try {
        spawner = new Spawner(deploy_path, {
            shell: true,
            cwd: path
        });
    } catch (e) {
        console.warn(e);

        setResponseStatus(event, 500, "Cannot exec deploy")
        return;
    }
    
    console.log("Open");
    const eventStream = createEventStream(event);
    (async () => {
        for await (let iterator of spawner.spawn()) {
            await eventStream.push(JSON.stringify(iterator))
        }
        await eventStream.flush()
        console.log("Ended");
    })()
    eventStream.onClosed(async () => {
        spawner.kill()
        await eventStream.close()
    })
    return eventStream.send()
});