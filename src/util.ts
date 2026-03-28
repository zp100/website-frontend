let timeout_id: number
export function autoTimeout(setHandler: () => void, resetHandler: () => void, timeout: number): void {
    clearTimeout(timeout_id)
    resetHandler()
    
    setTimeout(() => {
        setHandler()

        timeout_id = setTimeout(() => {
            resetHandler()
        }, timeout)
    }, 0)
}
