<template>
    <h3>How to Play</h3>
    <p>
        Use the row of letters to create words.
        Letters can be used multiple times in the same word.
    </p>
    <p>Requirements for each word:</p>
    <ul>
        <li>Must include the <span class="key">key letter</span>.</li>
        <li>Must be at least 2 letters long.</li>
        <li>Cannot use letters that aren't shown in the row.</li>
        <li>Cannot be a contraction or a hyphenated word, such as <span class="answer">ISN'T</span> or <span class="answer">YO-YO</span>.</li>
        <li>Cannot be a proper name or a vulgar term.</li>
        <li>Must be an English word, but loanwords such as <span class="answer">CAFE</span> are allowed.</li>
        <li>Words with prefixes or suffixes are allowed, such as <span class="answer">UNFAIR</span>, <span class="answer">CARING</span>, <span class="answer">TREES</span>, or <span class="answer">COOKED</span>.</li>
    </ul>
    <p>
        Additionally, a limited word list is used to restrict the number of obscure words.
        If a word isn't in the word list, it's not allowed.
    </p>
    <p>
        If you're not sure if a word is allowed, try it!
        There's no penalty for incorrect guesses.
    </p>

    <h3>Answer List</h3>
    <p>
        Words that are found are shown in the answer list box, sorted in alphabetical order.
        Words that aren't found yet are represented by question marks.
    </p>
    <p>Select a found word to view its definition(s).</p>
    <p>
        The number of found words and total words for the puzzle are shown above the word list, which can be pressed to see the number of words remaining.
        The current score is also shown.
    </p>

    <h3>Scoring</h3>
    <p>
        When an allowed word is entered, it earns points based on the length of the word.
        Each letter in the word is worth 1 more point than the last.
        For example, the word <span class="answer">TREES</span> earns 15 points:
    </p>
    <ul>
        <li><span class="answer">T</span> → +1</li>
        <li><span class="answer">R</span> → +2</li>
        <li><span class="answer">E</span> → +3</li>
        <li><span class="answer">E</span> → +4</li>
        <li><span class="answer">S</span> → +5</li>
        <li>Total: 15</li>
    </ul>
    <p>If a word uses every letter shown in the row at least once, it's a <span class="pangram">pangram</span> and earns double points!</p>

    <h3>Letter Row</h3>
    <p>
        Stuck?
        Click the Shuffle button in the bottom-left to rearrange the letters in the row.
        Press and hold a letter to "lock" it to prevent it from being Shuffled.
    </p>
    <p>
        The letters can also be swiped to the left or right to rearrange them manually.
        They will be reset to alphabetical order when the screen is reloaded.
    </p>

    <h3>Letter Counts</h3>
    <p>
        Below each letter in the row is a counter, which displays the total number of times that the letter is used for the whole puzzle.
        This includes duplicates: if a letter is used twice in the same word, it's counted twice.
    </p>
    <p>As words are found, their letters are subtracted from the letter counts, so the current numbers shown are the remaining uses for each letter.</p>
</template>



<style scoped>
span.key {
    color: yellow;
}

span.answer {
    color: white;
}

span.pangram {
    color: transparent;
    background: linear-gradient(135deg, #f99, #9f9, #99f, #f99);
    background-clip: text;
    font-weight: bold;
}
</style>
