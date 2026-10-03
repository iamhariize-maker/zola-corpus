# Feed acceptance contract

The publisher (`zola-feed/scripts/feed_schema.py`) and browser (`zola-corpus/pwa/data.js`) enforce the same rules. Both repositories contain `tests/fixtures/feed-validation.json` with 38 accepted/rejected examples. Update both implementations and fixtures together.

- Root is an object with schema `zola-feed/1` and an ISO UTC `updated` timestamp (`Z` or `+00:00`, including optional fractional seconds).
- Required arrays and maximum record counts: exams 30, watch 120, events 250, inbox 250, notices 20. Empty arrays are valid.
- Every record is an object. All lists except watch require a nonempty unique ID (80 characters for inbox, 60 otherwise).
- Calendar dates must be real `YYYY-MM-DD` dates. Required for exams, watch and events; optional for exam `checked` and notice `date`.
- Exam label is required (140 characters), primary is a boolean if supplied, and at most one exam is primary. Status, if supplied, is scheduled, tentative, postponed or held.
- Watch/event title is required (200/220 characters). Optional hook is capped at 400/500 characters; optional watch kind at 24.
- Event status, if supplied, is UNVERIFIED or VERIFIED. Event subject is empty/absent or one of Polity, Economy, Environment, S&T, IR, History.
- Machine tags, where supplied, are unique arrays containing only M01 through M23, maximum six. Inbox subject tags are unique arrays containing only the six subjects, maximum five.
- Inbox title and HTTPS URL are required (300 and 600 characters). Published, if supplied and nonempty, is an ISO UTC timestamp. Optional source name is capped at 40 characters.
- Notice text is required (500 characters). Level, if supplied, is info, correction or warning; URL, if supplied and nonempty, uses HTTPS.
- Exam/watch/event source, if supplied, is an object. Optional title is capped at 160 characters; optional nonempty URL uses HTTPS. URLs require a host and contain no whitespace, quotes or angle brackets.
- Edition may be absent or null; otherwise it is an object with optional latest/note (12/200 characters) and optional HTTPS URL.
- Optional text, date and URL fields may be absent or empty, but must not be null or another type. Required text cannot be blank.
- Reserved prototype-related fields are refused. The compact serialized feed is under 1,400,000 UTF-16 code units (matching browser string measurement).

The browser rejects the complete incoming file when a record fails these checks and retains the last good copy. It continues to trim/normalize accepted optional fields for rendering. Tags remain syllabus hints, not verified relevance claims.
