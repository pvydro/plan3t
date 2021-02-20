export function exists(item): boolean {
    let doesExist = true
    
    if (item == null || item == undefined) {
        doesExist = false
    }

    return doesExist
}

export function functionExists(item): boolean {
    let doesExist = true

    if (!exists(item) || typeof item !== 'function') {
        doesExist = false
    }

    return doesExist
}

export class Utils {

}
