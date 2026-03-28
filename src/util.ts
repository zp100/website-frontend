let timeout_id: number
export function autoTimeout(setHandler: () => void, resetHandler: () => void, timeout: number, long_reset = false): void {
    clearTimeout(timeout_id)
    resetHandler()

    function set(): void {
        setHandler()
        timeout_id = setTimeout(() => resetHandler(), timeout)
    }

    if (long_reset) {
        setTimeout(set, 0)
    } else {
        document.body.clientHeight
        set()
    }
}
