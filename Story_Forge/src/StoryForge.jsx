import { useState, useRef, useEffect } from "react";

const GENRES = ["Fantasy", "Sci-Fi", "Romance", "Mystery", "Thriller", "Adventure", "Horror", "Comedy"];
const TONES = ["Whimsical", "Dark", "Heartwarming", "Suspenseful", "Philosophical", "Humorous"];
const LENGTHS = ["Short (500 words)", "Medium (1000 words)", "Long (2000 words)"];

const TAGS_SUGGESTIONS = ["magic", "space", "love", "detective", "dragon", "futuristic", "haunted", "heist"];

function StoryForge() {
    const [gist, setGist] = useState("");
    const [genre, setGenre] = useState("Fantasy");
    const [tone, setTone] = useState("Whimsical");
    const [length, setLength] = useState("Medium (1000 words)");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const [animateStory, setAnimateStory] = useState(false);
    const storyRef = useRef(null);
    const tagInputRef = useRef(null);

    useEffect(() => {
    console.log("STORY STATE:", story);
}, [story]);

    const wordCount = story
        ? story.split(/\s+/).filter(Boolean).length
        : 0;

    const addTag = (tag) => {
        const clean = tag.trim().toLowerCase();
        if (clean && !tags.includes(clean) && tags.length < 6) {
            setTags([...tags, clean]);
        }
        setTagInput("");
        setShowTagDropdown(false);
    };

    const removeTag = (t) => setTags(tags.filter((x) => x !== t));

    const handleTagKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(tagInput);
        }
        if (e.key === "Backspace" && !tagInput && tags.length) {
            setTags(tags.slice(0, -1));
        }
    };

    const filteredSuggestions = TAGS_SUGGESTIONS.filter(
        (s) => s.includes(tagInput.toLowerCase()) && !tags.includes(s)
    );

    const generateStory = async () => {
        if (!gist.trim()) return;
        setLoading(true);
        setError(null);
        setStory(null);
        setAnimateStory(false);

        const wordTarget =
            length === "Short (500 words)" ? 500 : length === "Long (2000 words)" ? 2000 : 1000;

        const prompt = `You are a master storyteller. Based on the following gist, write a complete, engaging, and polished ${genre.toLowerCase()} story with a ${tone.toLowerCase()} tone.

Story Gist: "${gist}"
${tags.length ? `Themes/Keywords: ${tags.join(", ")}` : ""}
Target Length: approximately ${wordTarget} words

Requirements:
- Give the story a compelling title
- Include vivid descriptions and well-developed characters
- Have a clear beginning, middle, and end
- Match the genre and tone perfectly
- End with a satisfying conclusion

Format your response EXACTLY as:
TITLE: [Story Title Here]

[Full story content here]`;

        try {
            const res = await fetch('http://localhost:5000/api/generate', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    genre,
                    tone,
                    length,
                }),
            });
            const data = await res.json();
            console.log(data);
            if (data.error) throw new Error(data.error.message);
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            setStory(text);
            setTimeout(() => {
                setAnimateStory(true);
                storyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyStory = () => {
        if (!story) return;
        navigator.clipboard.writeText(story);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const resetAll = () => {
        setStory(null);
        setGist("");
        setTags([]);
        setTagInput("");
        setGenre("Fantasy");
        setTone("Whimsical");
        setLength("Medium (1000 words)");
        setError(null);
    };

    const parsedStory = () => {
        if (!story) return { title: "", body: "" };
        const titleMatch = story.match(/^TITLE:\s*(.+)/m);
        const title = titleMatch ? titleMatch[1].trim() : "Your Story";
        const body = story.replace(/^TITLE:\s*.+\n*/m, "").trim();
        return { title, body };
    };

    return (
        <div style={styles.root}>
            {/* Organic background blobs */}
            <div style={styles.blob1} />
            <div style={styles.blob2} />
            <div style={styles.blob3} />

            <div style={styles.container}>
                {/* Header */}
                <header style={styles.header}>
                    <div style={styles.logoRow}>
                        <div style={styles.logoIcon}>
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                <path d="M14 2C8.477 2 4 6.477 4 12c0 3.5 1.8 6.6 4.5 8.4V22a1 1 0 001 1h9a1 1 0 001-1v-1.6C22.2 18.6 24 15.5 24 12c0-5.523-4.477-10-10-10z" fill="#84B179" />
                                <circle cx="10" cy="12" r="1.5" fill="white" />
                                <circle cx="14" cy="10" r="1.5" fill="white" />
                                <circle cx="18" cy="12" r="1.5" fill="white" />
                            </svg>
                        </div>
                        <div>
                            <h1 style={styles.logoText}>StoryForge</h1>
                            <p style={styles.logoSub}>AI Story Generator</p>
                        </div>
                    </div>
                    <div style={styles.headerBadge}>Powered by The power of friendship</div>
                </header>

                {/* Main Layout */}
                <div style={styles.mainGrid}>
                    {/* Left Panel — Input */}
                    <div style={styles.inputPanel}>
                        <div style={styles.panelHeader}>
                            <span style={styles.panelIcon}>✦</span>
                            <span style={styles.panelTitle}>Craft Your Story</span>
                        </div>

                        {/* Gist Textarea */}
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Story Gist</label>
                            <div style={styles.textareaWrap}>
                                <textarea
                                    value={gist}
                                    onChange={(e) => setGist(e.target.value)}
                                    placeholder="A lone astronaut discovers an ancient signal from a dying star that holds the secret to humanity's origin..."
                                    style={styles.textarea}
                                    rows={5}
                                />
                                <span style={styles.charCount}>{gist.length}/500</span>
                            </div>
                        </div>

                        {/* Genre Pills */}
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Genre</label>
                            <div style={styles.pillsRow}>
                                {GENRES.map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setGenre(g)}
                                        style={genre === g ? styles.pillActive : styles.pill}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tone Pills */}
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Tone</label>
                            <div style={styles.pillsRow}>
                                {TONES.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTone(t)}
                                        style={tone === t ? styles.pillActive : styles.pill}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Length */}
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Story Length</label>
                            <div style={styles.lengthRow}>
                                {LENGTHS.map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLength(l)}
                                        style={length === l ? styles.lengthBtnActive : styles.lengthBtn}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tags — inspired by "Choose Tags" dialog in screenshot */}
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Tags / Themes</label>
                            <div style={styles.tagBox}>
                                {tags.map((t) => (
                                    <span key={t} style={styles.tag}>
                                        {t}
                                        <button onClick={() => removeTag(t)} style={styles.tagX}>×</button>
                                    </span>
                                ))}
                                <div style={{ position: "relative", flex: 1, minWidth: 120 }}>
                                    <input
                                        ref={tagInputRef}
                                        value={tagInput}
                                        onChange={(e) => { setTagInput(e.target.value); setShowTagDropdown(true); }}
                                        onKeyDown={handleTagKeyDown}
                                        onFocus={() => setShowTagDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowTagDropdown(false), 150)}
                                        placeholder="Add tags or enter new tag name"
                                        style={styles.tagInput}
                                    />
                                    {showTagDropdown && filteredSuggestions.length > 0 && (
                                        <div style={styles.tagDropdown}>
                                            {filteredSuggestions.map((s) => (
                                                <div
                                                    key={s}
                                                    onMouseDown={() => addTag(s)}
                                                    style={styles.tagSuggestion}
                                                >
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p style={styles.hint}>Press Enter or comma to add. Max 6 tags.</p>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={generateStory}
                            disabled={loading || !gist.trim()}
                            style={loading || !gist.trim() ? styles.generateBtnDisabled : styles.generateBtn}
                        >
                            {loading ? (
                                <span style={styles.btnInner}>
                                    <span style={styles.spinner} />
                                    Weaving your story...
                                </span>
                            ) : (
                                <span style={styles.btnInner}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
                                    </svg>
                                    Generate Story
                                </span>
                            )}
                        </button>

                        {error && (
                            <div style={styles.errorBox}>
                                <span>⚠ {error}</span>
                            </div>
                        )}
                    </div>

                    {/* Right Panel — Output */}
                    <div style={styles.outputPanel} ref={storyRef}>
                        {!story && !loading && (
                            <div style={styles.emptyState}>
                                <div style={styles.emptyIllustration}>
                                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                                        <rect x="10" y="15" width="45" height="55" rx="6" fill="#C7EABB" opacity="0.6" />
                                        <rect x="18" y="25" width="30" height="3" rx="1.5" fill="#84B179" />
                                        <rect x="18" y="33" width="25" height="3" rx="1.5" fill="#A2CB8B" />
                                        <rect x="18" y="41" width="28" height="3" rx="1.5" fill="#A2CB8B" />
                                        <rect x="18" y="49" width="20" height="3" rx="1.5" fill="#C7EABB" />
                                        <circle cx="60" cy="22" r="14" fill="#E8F5BD" />
                                        <path d="M55 22l3 3 7-7" stroke="#84B179" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p style={styles.emptyTitle}>Your story awaits</p>
                                <p style={styles.emptySubtitle}>Fill in the details on the left and hit Generate to bring your story to life.</p>
                            </div>
                        )}

                        {loading && (
                            <div style={styles.loadingState}>
                                <div style={styles.loadingDots}>
                                    {[0, 1, 2].map((i) => (
                                        <div key={i} style={{ ...styles.dot, animationDelay: `${i * 0.2}s` }} />
                                    ))}
                                </div>
                                <p style={styles.loadingText}>Crafting your narrative...</p>
                                <p style={styles.loadingSubText}>Genre: {genre} · Tone: {tone}</p>
                            </div>
                        )}

                        {story && !loading && (() => {
                            const { title, body } = parsedStory();
                            return (
                                <div style={{ ...styles.storyContent, opacity: animateStory ? 1 : 0, transform: animateStory ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease" }}>
                                    {/* Story Header */}
                                    <div style={styles.storyTopBar}>
                                        <div style={styles.storyMeta}>
                                            <span style={styles.metaBadge}>{genre}</span>
                                            <span style={styles.metaBadge}>{tone}</span>
                                            <span style={styles.metaWords}>{wordCount} words</span>
                                        </div>
                                        <div style={styles.storyActions}>
                                            <button onClick={copyStory} style={styles.actionBtn}>
                                                {copied ? "✓ Copied!" : "Copy"}
                                            </button>
                                            <button onClick={resetAll} style={styles.actionBtnOutline}>
                                                New Story
                                            </button>
                                        </div>
                                    </div>

                                    <h2 style={styles.storyTitle}>{title}</h2>

                                    <div style={styles.storyDivider} />

                                    <div style={styles.storyBody}>
                                        {body.split("\n\n").filter(Boolean).map((para, i) => (
                                            <p key={i} style={styles.para}>{para}</p>
                                        ))}
                                    </div>

                                    {/* Footer actions */}
                                    <div style={styles.storyFooter}>
                                        <button onClick={copyStory} style={styles.footerBtn}>
                                            {copied ? "✓ Copied to clipboard!" : "📋 Copy Story"}
                                        </button>
                                        <button onClick={generateStory} style={styles.footerBtnSecondary}>
                                            ↺ Regenerate
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0f7ec; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,80%,100% { transform: scale(0); } 40% { transform: scale(1); } }
        @keyframes float { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
      `}</style>
        </div>
    );
}

const styles = {
    root: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f7ec 0%, #e8f5e0 50%, #E8F5BD 100%)",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
    },
    blob1: {
        position: "fixed", top: -100, right: -100,
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, #C7EABB55 0%, transparent 70%)",
        pointerEvents: "none",
    },
    blob2: {
        position: "fixed", bottom: -80, left: -80,
        width: 350, height: 350, borderRadius: "50%",
        background: "radial-gradient(circle, #A2CB8B33 0%, transparent 70%)",
        pointerEvents: "none",
    },
    blob3: {
        position: "fixed", top: "40%", left: "50%",
        width: 600, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, #E8F5BD22 0%, transparent 70%)",
        pointerEvents: "none",
    },
    container: {
        maxWidth: 1280,
        margin: "0 auto",
        padding: "24px 24px 48px",
        position: "relative",
        zIndex: 1,
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 32,
        padding: "16px 24px",
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(12px)",
        borderRadius: 16,
        border: "1px solid rgba(164,203,139,0.3)",
        boxShadow: "0 2px 20px rgba(132,177,121,0.08)",
    },
    logoRow: { display: "flex", alignItems: "center", gap: 12 },
    logoIcon: {
        width: 44, height: 44,
        background: "linear-gradient(135deg, #C7EABB, #84B179)",
        borderRadius: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 12px rgba(132,177,121,0.3)",
    },
    logoText: {
        fontFamily: "'Lora', serif",
        fontSize: 22, fontWeight: 700,
        color: "#2d5a27", letterSpacing: "-0.5px",
    },
    logoSub: { fontSize: 11, color: "#84B179", fontWeight: 500, marginTop: 1 },
    headerBadge: {
        fontSize: 12, fontWeight: 600,
        background: "linear-gradient(135deg, #84B179, #A2CB8B)",
        color: "white",
        padding: "6px 14px", borderRadius: 20,
        letterSpacing: "0.3px",
    },
    mainGrid: {
        display: "grid",
        gridTemplateColumns: "420px 1fr",
        gap: 24,
        alignItems: "start",
    },
    inputPanel: {
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        borderRadius: 20,
        padding: 28,
        border: "1px solid rgba(164,203,139,0.25)",
        boxShadow: "0 8px 32px rgba(132,177,121,0.1)",
        display: "flex", flexDirection: "column", gap: 22,
    },
    panelHeader: {
        display: "flex", alignItems: "center", gap: 10,
        paddingBottom: 16,
        borderBottom: "2px solid #E8F5BD",
    },
    panelIcon: { color: "#84B179", fontSize: 18 },
    panelTitle: {
        fontFamily: "'Lora', serif",
        fontSize: 18, fontWeight: 700, color: "#2d5a27",
    },
    fieldGroup: { display: "flex", flexDirection: "column", gap: 8 },
    label: { fontSize: 12, fontWeight: 600, color: "#5a8a52", letterSpacing: "0.8px", textTransform: "uppercase" },
    textareaWrap: { position: "relative" },
    textarea: {
        width: "100%", borderRadius: 12,
        border: "1.5px solid #C7EABB",
        background: "rgba(232,245,189,0.2)",
        padding: "12px 14px",
        fontSize: 14, lineHeight: 1.6,
        color: "#2d5a27", fontFamily: "'DM Sans', sans-serif",
        resize: "vertical", outline: "none",
        transition: "border-color 0.2s",
    },
    charCount: {
        position: "absolute", bottom: 8, right: 10,
        fontSize: 11, color: "#A2CB8B",
    },
    pillsRow: { display: "flex", flexWrap: "wrap", gap: 6 },
    pill: {
        padding: "5px 12px",
        borderRadius: 20,
        border: "1.5px solid #C7EABB",
        background: "transparent",
        color: "#5a8a52",
        fontSize: 12, fontWeight: 500,
        cursor: "pointer", transition: "all 0.15s",
        fontFamily: "'DM Sans', sans-serif",
    },
    pillActive: {
        padding: "5px 12px",
        borderRadius: 20,
        border: "1.5px solid #84B179",
        background: "linear-gradient(135deg, #84B179, #A2CB8B)",
        color: "white",
        fontSize: 12, fontWeight: 600,
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: "0 2px 8px rgba(132,177,121,0.3)",
    },
    lengthRow: { display: "flex", gap: 8 },
    lengthBtn: {
        flex: 1, padding: "8px 4px",
        borderRadius: 10, border: "1.5px solid #C7EABB",
        background: "transparent", color: "#5a8a52",
        fontSize: 11, fontWeight: 500, cursor: "pointer",
        textAlign: "center", fontFamily: "'DM Sans', sans-serif",
        transition: "all 0.15s",
    },
    lengthBtnActive: {
        flex: 1, padding: "8px 4px",
        borderRadius: 10,
        border: "1.5px solid #84B179",
        background: "#E8F5BD",
        color: "#2d5a27",
        fontSize: 11, fontWeight: 700, cursor: "pointer",
        textAlign: "center", fontFamily: "'DM Sans', sans-serif",
    },
    tagBox: {
        display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center",
        minHeight: 44, padding: "8px 12px",
        borderRadius: 12, border: "1.5px solid #C7EABB",
        background: "rgba(232,245,189,0.2)", cursor: "text",
    },
    tag: {
        display: "inline-flex", alignItems: "center", gap: 4,
        background: "linear-gradient(135deg, #84B179, #A2CB8B)",
        color: "white", padding: "3px 10px", borderRadius: 20,
        fontSize: 12, fontWeight: 600,
    },
    tagX: {
        background: "none", border: "none", color: "rgba(255,255,255,0.8)",
        cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0,
        display: "flex", alignItems: "center",
    },
    tagInput: {
        border: "none", outline: "none", background: "transparent",
        fontSize: 13, color: "#2d5a27", width: "100%",
        fontFamily: "'DM Sans', sans-serif",
    },
    tagDropdown: {
        position: "absolute", top: "calc(100% + 4px)", left: 0,
        background: "white", borderRadius: 10,
        boxShadow: "0 8px 24px rgba(132,177,121,0.2)",
        border: "1px solid #C7EABB",
        overflow: "hidden", zIndex: 10, minWidth: 160,
    },
    tagSuggestion: {
        padding: "8px 14px", fontSize: 13, cursor: "pointer",
        color: "#2d5a27", transition: "background 0.1s",
        "&:hover": { background: "#E8F5BD" },
    },
    hint: { fontSize: 11, color: "#A2CB8B", marginTop: -2 },
    generateBtn: {
        width: "100%", padding: "14px",
        borderRadius: 14,
        background: "linear-gradient(135deg, #84B179 0%, #A2CB8B 50%, #84B179 100%)",
        backgroundSize: "200% 200%",
        border: "none", color: "white",
        fontSize: 15, fontWeight: 700,
        cursor: "pointer", letterSpacing: "0.3px",
        boxShadow: "0 4px 20px rgba(132,177,121,0.4)",
        transition: "all 0.3s",
        fontFamily: "'DM Sans', sans-serif",
    },
    generateBtnDisabled: {
        width: "100%", padding: "14px",
        borderRadius: 14,
        background: "#C7EABB",
        border: "none", color: "#84B179",
        fontSize: 15, fontWeight: 700, cursor: "not-allowed",
        fontFamily: "'DM Sans', sans-serif",
    },
    btnInner: { display: "flex", alignItems: "center", justifyContent: "center" },
    spinner: {
        width: 16, height: 16,
        border: "2px solid rgba(255,255,255,0.3)",
        borderTop: "2px solid white",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        marginRight: 10, display: "inline-block",
    },
    errorBox: {
        background: "#fff5f5", border: "1px solid #ffcccc",
        borderRadius: 10, padding: "10px 14px",
        fontSize: 13, color: "#cc4444",
    },
    outputPanel: {
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        borderRadius: 20,
        border: "1px solid rgba(164,203,139,0.25)",
        boxShadow: "0 8px 32px rgba(132,177,121,0.1)",
        minHeight: 500,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
    },
    emptyState: {
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 48, gap: 16,
    },
    emptyIllustration: { animation: "float 4s ease-in-out infinite" },
    emptyTitle: {
        fontFamily: "'Lora', serif",
        fontSize: 22, fontWeight: 600, color: "#2d5a27",
    },
    emptySubtitle: { fontSize: 14, color: "#84B179", textAlign: "center", maxWidth: 300, lineHeight: 1.6 },
    loadingState: {
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 16, padding: 48,
    },
    loadingDots: { display: "flex", gap: 8 },
    dot: {
        width: 10, height: 10, borderRadius: "50%",
        background: "#84B179",
        animation: "bounce 1.4s ease-in-out infinite",
        display: "inline-block",
    },
    loadingText: {
        fontFamily: "'Lora', serif", fontSize: 18,
        color: "#2d5a27", fontWeight: 600,
    },
    loadingSubText: { fontSize: 13, color: "#A2CB8B" },
    storyContent: { padding: 36, display: "flex", flexDirection: "column", gap: 24 },
    storyTopBar: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    storyMeta: { display: "flex", gap: 8, alignItems: "center" },
    metaBadge: {
        fontSize: 11, fontWeight: 600, padding: "4px 10px",
        borderRadius: 20, background: "#E8F5BD", color: "#5a8a52",
        border: "1px solid #C7EABB",
    },
    metaWords: { fontSize: 12, color: "#A2CB8B", marginLeft: 4 },
    storyActions: { display: "flex", gap: 8 },
    actionBtn: {
        padding: "6px 16px", borderRadius: 8,
        background: "linear-gradient(135deg, #84B179, #A2CB8B)",
        border: "none", color: "white",
        fontSize: 12, fontWeight: 600, cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
    },
    actionBtnOutline: {
        padding: "6px 16px", borderRadius: 8,
        background: "transparent",
        border: "1.5px solid #C7EABB",
        color: "#5a8a52",
        fontSize: 12, fontWeight: 600, cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
    },
    storyTitle: {
        fontFamily: "'Lora', serif",
        fontSize: 30, fontWeight: 700, lineHeight: 1.25,
        color: "#2d5a27", letterSpacing: "-0.5px",
    },
    storyDivider: {
        height: 3, borderRadius: 2,
        background: "linear-gradient(90deg, #84B179, #C7EABB, transparent)",
    },
    storyBody: { display: "flex", flexDirection: "column", gap: 18 },
    para: {
        fontFamily: "'Lora', serif",
        fontSize: 16, lineHeight: 1.85,
        color: "#3a5e35",
    },
    storyFooter: {
        display: "flex", gap: 12, paddingTop: 8,
        borderTop: "1px solid #E8F5BD",
    },
    footerBtn: {
        flex: 1, padding: "12px",
        background: "linear-gradient(135deg, #84B179, #A2CB8B)",
        border: "none", color: "white",
        borderRadius: 12, fontSize: 14, fontWeight: 600,
        cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    },
    footerBtnSecondary: {
        flex: 1, padding: "12px",
        background: "transparent",
        border: "1.5px solid #C7EABB",
        color: "#5a8a52",
        borderRadius: 12, fontSize: 14, fontWeight: 600,
        cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    },
};

export default StoryForge;