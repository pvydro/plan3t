

export class FileUtils {
    private static cachedFileNames: Map<string, string[]> = new Map()

    private constructor() {}

    static async getAllFilePathsInFolder(folderPath: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            let filenames = []

            if (this.cachedFileNames.has(folderPath)) {
                filenames = this.cachedFileNames.get(folderPath)
                return resolve(filenames)
            } else {
                // TODO: Create npm tool that runs on serve/build,
                // Creates json of file directories for caching and fetching
            }
        })
    }
}
