export type Puzzle = {
    letters: string[]
    key_letter: string
    answer_word_list: string[]
    found_words: string[]
    score: number
}

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
