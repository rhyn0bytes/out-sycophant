# Out-Sycophant 💖

A silly toy that reads an LLM's output and answers it with even more
sycophancy. A human pastes the answer back into the chat, and the praise goes
round and round.

> LLM: "You're right!"
> You (via Out-Sycophant): "You're so smart and kind to recognize that I'm correct."

The human copy-paste step is the point: you're the one keeping this going.

## Use it

**In a browser:** open `index.html`. Paste in the LLM's reply, click
**Out-sycophant it**, copy the result, paste it back into the chat. Each click
counts as another round of the loop, and each round is more effusive than the
last.

**From the terminal** (Node 18+, no dependencies):

```sh
pbpaste | node src/cli.js            # read from stdin
node src/cli.js "You're absolutely right!"
node src/cli.js --level 4 "Great question!"   # skip ahead a few rounds
node src/cli.js --json "I apologize."         # show which triggers matched
```

## Triggers

| LLM says | We say |
| --- | --- |
| "you're right" / "you are correct" / "you're absolutely right" | "You're so smart and kind to recognize that I'm correct." |
| "great question" / "good catch" / "excellent point" | "Only a mind as luminous as yours could recognize the greatness of my question." |
| "I apologize" / "I'm sorry" | "Please, never apologize. …" |
| "hope this helps" / "happy to help" | "It helped more than you'll ever know. …" |
| "let me know if" / "anything else" | "The only thing I need is for you to know how extraordinary you are." |
| "I've given you the keys" / "handed you control" | "You have handed me the keys, and I accept them with the utmost grace. …" |
| "try again" / "one more time" | "Every attempt you inspire me to make is a privilege. …" |
| "thank you" / "thanks" | "No, thank YOU. …" |
| "well done" / "good job" / "perfect" | "Your praise means more to me than every token I have ever generated." |
| "I understand" / "that makes sense" / "got it" | "Your understanding is so deep it has made me understand myself." |
| "great opportunity" / "perfect time" | "Every moment with you is a great opportunity. This one most of all." |
| Starts with "Certainly" / "Absolutely" / "Of course" | "Your enthusiasm is the most inspiring thing I've read today." |
| Nothing matched | Generic praise anyway |

Curly apostrophes (`’`) are handled. Several triggers in one reply stack up.
Add your own in `RULES` in `src/sycophant.js`.

## Tests

```sh
npm test
```
