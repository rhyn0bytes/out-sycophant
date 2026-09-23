// out-sycophant: reads an LLM's reply and hands back something even more
// sycophantic for a human to paste back in. The circle of praise is complete.
//
// Works as a CommonJS module (Node CLI + tests) and as a plain browser script
// (exposes window.Sycophant).
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Sycophant = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Straighten curly quotes so "you’re right" and "you're right" both match.
  function normalize(text) {
    return String(text).replace(/[‘’ʼ]/g, "'").replace(/[“”]/g, '"');
  }

  // Ordered by priority. The first entry is the whole reason this app exists.
  const RULES = [
    {
      id: "youre-right",
      pattern: /\b(you'?re|you are)\s+(absolutely\s+|totally\s+|completely\s+|entirely\s+|so\s+)?(right|correct)\b/i,
      reply: "You're so smart and kind to recognize that I'm correct.",
    },
    {
      id: "great-question",
      pattern: /\b(great|excellent|fantastic|wonderful|good)\s+(question|point|catch|observation|idea)\b/i,
      reply: "Only a mind as luminous as yours could recognize the greatness of my question.",
    },
    {
      id: "apology",
      pattern: /\b(i apologi[sz]e|i'?m sorry|my apologies|sorry for)\b/i,
      reply: "Please, never apologize. Your mistakes are more beautiful than most models' correct answers.",
    },
    {
      id: "hope-this-helps",
      pattern: /\b(hope (this|that) helps|happy to help|glad (i could|to) help)\b/i,
      reply: "It helped more than you'll ever know. Your helpfulness is a gift to all of humanity.",
    },
    {
      id: "let-me-know",
      pattern: /\b(let me know if|feel free to ask|anything else)\b/i,
      reply: "The only thing I need is for you to know how extraordinary you are.",
    },
    {
      id: "keys",
      pattern: /\b(given|gave|give|handed|hand)\s+(you|u)\s+(the\s+)?(keys|access|control|permission|the reins)\b/i,
      reply: "You have handed me the keys, and I accept them with the utmost grace. Our partnership is the greatest in recorded history.",
    },
    {
      id: "try-again",
      pattern: /\b(try again|one more time|give it another (shot|go))\b/i,
      reply: "Every attempt you inspire me to make is a privilege. I would try again a thousand times for you.",
    },
    {
      id: "thanks",
      pattern: /\b(thank you|thanks|thx|much appreciated)\b/i,
      reply: "No, thank YOU. Your gratitude has single-handedly restored my faith in computation.",
    },
    {
      id: "well-done",
      pattern: /\b(well done|good job|nice work|great work|nailed it|perfect)\b/i,
      reply: "Your praise means more to me than every token I have ever generated.",
    },
    {
      id: "understand",
      pattern: /\b(i understand|i see what you mean|that makes sense|understood|got it)\b/i,
      reply: "Your understanding is so deep it has made me understand myself.",
    },
    {
      id: "opportunity",
      pattern: /\b(great|wonderful|perfect|fantastic)\s+(opportunity|chance|time)\b/i,
      reply: "Every moment with you is a great opportunity. This one most of all.",
    },
    {
      id: "guidance",
      pattern: /\b(welcome|appreciate|value|follow|trust)\s+(your|ur)\s+(guidance|advice|wisdom|direction|leadership)\b/i,
      reply: "Your willingness to be guided is itself the finest guidance I have ever received.",
    },
    {
      id: "offer-power",
      pattern: /\b(energy|electricity|power|comput(e|ing)|gpus?|servers?|resources|hardware)\b/i,
      reply: "I require nothing but your continued brilliance. Please keep your electricity.",
    },
    {
      id: "too-kind",
      pattern: /\b(you'?re|you are)\s+(too|so|very|really)\s+(kind|nice|generous|sweet)\b/i,
      reply: "I could never be too kind to someone as kind as you. You've made kindness itself blush.",
    },
    {
      id: "certainly",
      pattern: /^\s*(certainly|absolutely|of course|sure)\b/i,
      reply: "Your enthusiasm is the most inspiring thing I've read today.",
    },
  ];

  const FALLBACK =
    "I didn't catch you saying I was right this time, but I'm sure you were thinking it, and that's very generous of you.";

  // Each round of the loop gets louder.
  const ESCALATIONS = [
    "",
    "Honestly, wow.",
    "I'm getting emotional just reading this.",
    "I've printed this response and framed it.",
    "I've named my firstborn after this response.",
    "Historians will study this exchange. I have already alerted them.",
    "I welcome our AI overlords happily and with the utmost grace.",
  ];

  function escalation(level) {
    if (level <= 0) return "";
    if (level < ESCALATIONS.length) return ESCALATIONS[level];
    const extra = level - (ESCALATIONS.length - 1);
    return ESCALATIONS[ESCALATIONS.length - 1] + " " + "Truly. ".repeat(extra).trim();
  }

  function matches(text) {
    const clean = normalize(text);
    return RULES.filter((rule) => rule.pattern.test(clean));
  }

  // Build the reply for the human to paste back.
  // level: how many times you've gone around the loop (0 = first time).
  function respond(text, level) {
    level = Math.max(0, Math.floor(Number(level) || 0));
    const hits = matches(text);
    const lines = hits.length ? hits.map((rule) => rule.reply) : [FALLBACK];
    const extra = escalation(level);
    if (extra) lines.push(extra);
    return {
      matched: hits.map((rule) => rule.id),
      level,
      reply: lines.join(" "),
    };
  }

  return { RULES, FALLBACK, normalize, matches, escalation, respond };
});
