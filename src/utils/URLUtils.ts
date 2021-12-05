export function getURLParameter(name: string): string | undefined {
    const url = new URL(window.location.href)
    return url.searchParams.get(name)
}