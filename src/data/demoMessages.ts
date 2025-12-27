interface Message {
  role: "user" | "assistant";
  content: string;
}

const BASE_DEMO_MESSAGES: Message[] = [
  {
    role: "user",
    content: "What is a vector space?",
  },
  {
    role: "assistant",
    content: `
### Vector Space

A **vector space** is a set \\(V\\) together with two operations:

- Vector addition
- Scalar multiplication

These operations satisfy axioms such as closure, associativity,
existence of identity elements, and distributivity.

#### Examples
- \\(\\mathbb{R}^n\\)
- Polynomials of degree \\(\\le n\\)
- Continuous functions on an interval
`,
  },
  {
    role: "user",
    content: "Explain linear independence with an example.",
  },
  {
    role: "assistant",
    content: `
### Linear Independence

A set of vectors is **linearly independent** if the only solution to

\\[
a_1 v_1 + a_2 v_2 + \\dots + a_k v_k = 0
\\]

is the trivial one.

#### Example
- Independent: \\((1,0), (0,1)\\)
- Dependent: \\((1,2), (2,4)\\)
`,
  },
];

/**
 * Generate MANY messages for stress testing
 */
export const DEMO_MESSAGES: Message[] = Array.from({ length: 80 }, (_, i) => {
  const block = BASE_DEMO_MESSAGES.map((m) => ({
    ...m,
    content:
      m.role === "assistant"
        ? `${m.content}

---

**Iteration:** ${i + 1}

Additional notes:
- This message is intentionally long.
- It contains markdown, math, lists, and headings.
- Used to stress-test scrolling, refs, navigation, and rendering performance.

\\[
\\text{rank}(A) + \\text{nullity}(A) = \\dim(V)
\\]
`
        : `${m.content} (variation ${i + 1})`,
  }));

  return block;
}).flat();
