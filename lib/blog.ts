export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string[];
};

export const posts: Post[] = [
  {
    slug: "choosing-a-strong-password-in-2026",
    title: "Choosing A Strong Password In 2026",
    excerpt: "Length still beats complexity, but a few habits matter more than people think.",
    date: "2026-06-12",
    readTime: "4 min read",
    content: [
      "Most password advice hasn't changed much in the last decade, but the threats have. Automated cracking tools have gotten faster, and password databases from old breaches keep resurfacing, so a password that felt strong five years ago may not hold up today.",
      "The single biggest factor in password strength is length, not complexity. A 16-character password made of random words is often harder to crack than an 8-character password stuffed with symbols, and it's far easier to remember. If a site allows passphrases, lean into that.",
      "Reusing passwords across sites is still the most common mistake. If one service is breached, attackers try that same password everywhere else. A password manager solves this cleanly — it generates and stores a unique password per site so you never have to remember more than one master password.",
      "Where you can't use a manager, our Password Generator tool creates strong random passwords with adjustable length and character sets directly in your browser, without sending anything to a server.",
      "Two-factor authentication remains one of the highest-value security habits available. Even a strong password can be phished or leaked; a second factor — an app-based code or a hardware key — stops most account takeovers cold.",
      "Finally, don't over-rotate. Forcing password changes every 30 days, without a specific reason like a breach, tends to push people toward weaker, more predictable passwords. Pick a strong, unique password per account and change it only when there's a real reason to.",
    ],
  },
  {
    slug: "json-101-a-quick-guide",
    title: "JSON 101: A Quick Guide For Beginners",
    excerpt: "What JSON actually is, why it's everywhere, and how to read it without getting lost in brackets.",
    date: "2026-05-28",
    readTime: "5 min read",
    content: [
      "JSON (JavaScript Object Notation) is a lightweight format for storing and exchanging data. Despite the name, it's used far beyond JavaScript — nearly every modern API, config file, and app settings screen speaks JSON in some form.",
      "At its core, JSON is built from just a few building blocks: objects (key-value pairs wrapped in curly braces), arrays (ordered lists wrapped in square brackets), and primitive values — strings, numbers, booleans, and null. Everything else is a combination of these.",
      'A simple object looks like {\"name\": \"Alex\", \"active\": true}. Keys are always strings in double quotes, and values can be any valid JSON type — including another object or array, which is how nested data structures are built.',
      "The most common beginner mistakes are trailing commas after the last item, using single quotes instead of double quotes, and forgetting to close a bracket or brace. Because JSON has strict rules, a single misplaced comma will make the whole document invalid.",
      "This is where a formatter becomes useful. Pasting raw JSON into our JSON Formatter instantly shows whether it's valid, and pretty-prints it with proper indentation so nested structures are easy to read. If something's broken, the exact error location is shown instead of a vague failure.",
      "Once you're comfortable reading JSON, working with APIs, config files, and even browser dev tools becomes much less intimidating — it's really just objects and lists, all the way down.",
    ],
  },
  {
    slug: "5-ways-to-speed-up-daily-it-tasks",
    title: "5 Ways To Speed Up Your Daily IT Tasks",
    excerpt: "Small workflow changes that add up to real time saved over a week.",
    date: "2026-04-15",
    readTime: "4 min read",
    content: [
      "Most of the time lost in day-to-day IT work isn't spent on hard problems — it's spent on small, repetitive tasks: converting a file, checking a value, formatting some text. None of these are individually slow, but they add up fast across a week.",
      "1. Keep a short list of tools you trust. Bouncing between unfamiliar sites for one-off tasks costs more time than the task itself. Bookmarking a handful of fast, no-signup tools — like the ones in our library — cuts that overhead to almost nothing.",
      "2. Batch similar tasks together. If you need to convert five images to PDF, do it in one pass rather than switching contexts five separate times. Our Image to PDF tool accepts multiple files at once for exactly this reason.",
      "3. Use keyboard shortcuts wherever they exist. Copy, paste, and quick-search shortcuts sound trivial, but across hundreds of repetitions per day they save meaningful time.",
      "4. Validate before you debug. When something breaks — a broken JSON payload, a malformed Base64 string — running it through a formatter or validator first often finds the issue faster than manually scanning the text.",
      "5. Don't over-engineer one-off tasks. If you only need to convert a color code once, a quick browser tool beats writing a script. Save the scripting for things you'll repeat often enough to justify it.",
      "None of these changes are dramatic on their own, but together they remove a surprising amount of daily friction — which is really the whole idea behind this site.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
