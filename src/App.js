bash

cat > /mnt/user-data/outputs/src_App_js.txt << 'ENDOFFILE'
import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "https://cmqzbzszrwjrylylsylm.supabase.co";
const SUPABASE_KEY = "sb_publishable_XVxRgUg5NNfcOjuEfmc7pA_vR_cehWR";

const supabase = {
  async signUp(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },
  async signIn(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },
  async signOut(token) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` },
    });
  },
};

const C = {
  bg: "#0a0a0f", surface: "#12121a", card: "#1a1a26",
  accent: "#7c3aed", glow: "#a855f7",
  green: "#22c55e", red: "#ef4444", orange: "#f97316",
  text: "#f1f5f9", muted: "#64748b", border: "#2a2a3a",
};

function Glow({ color = C.accent, size = 300, x = "50%", y = "50%", opacity = 0.15 }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      width: size, height: size, background: color,
      borderRadius: "50%", filter: `blur(${size * 0.4}px)`,
      opacity, transform: "translate(-50%,-50%)",
      pointerEvents: "none", zIndex: 0,
    }} />
  );
}

function Input({ label, type = "text", value, onChange, placeholder, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>
        {label}
      </label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "14px 16px", fontSize: 15,
          background: C.surface, color: C.text,
          border: `1px solid ${error ? C.red : focused ? C.glow : C.border}`,
          borderRadius: 12, outline: "none", boxSizing: "border-box",
          transition: "border 0.2s",
          boxShadow: focused ? `0 0 0 3px rgba(168,85,247,0.15)` : "none",
          fontFamily: "sans-serif",
        }}
      />
      {error && <div style={{ color: C.red, fontSize: 12, marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function Btn({ children, onClick, loading, secondary, fullWidth = true }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      width: fullWidth ? "100%" : "auto",
      padding: "15px 24px", fontSize: 16, fontWeight: 700,
      borderRadius: 12, border: secondary ? `1px solid ${C.border}` : "none",
      background: secondary ? "transparent" : "linear-gradient(135deg, #7c3aed, #a855f7)",
      color: secondary ? C.muted : "#fff", cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
      boxShadow: secondary ? "none" : "0 0 24px rgba(124,58,237,0.35)",
      transition: "all 0.2s", fontFamily: "sans-serif",
    }}>
      {loading ? "Please wait..." : children}
    </button>
  );
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const validate = () => {
    if (!email.includes("@")) return "Enter a valid email";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (mode === "signup" && password !== confirm) return "Passwords don't match";
    return null;
  };

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        const data = await supabase.signUp(email, password);
        if (data.error) { setError(data.error.message); return; }
        if (data.id || data.user) {
          setSuccess("Account created! You can now log in.");
          setMode("login");
        } else {
          setError("Signup failed. Try again.");
        }
      } else {
        const data = await supabase.signIn(email, password);
        if (data.error) { setError(data.error.message); return; }
        if (data.access_token) {
          localStorage.setItem("detoxme_token", data.access_token);
          localStorage.setItem("detoxme_email", email);
          onAuth({ email, token: data.access_token });
        } else {
          setError("Invalid email or password.");
        }
      }
    } catch (e) {
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, position: "relative", overflow: "hidden",
      fontFamily: "sans-serif",
    }}>
      <Glow color="#7c3aed" size={400} x="20%" y="30%" opacity={0.1} />
      <Glow color="#2563eb" size={300} x="80%" y="70%" opacity={0.08} />
      <div style={{
        width: "100%", maxWidth: 420, position: "relative", zIndex: 1,
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "all 0.5s ease",
      }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18,
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 16px",
            boxShadow: "0 0 30px rgba(124,58,237,0.4)",
          }}>📵</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 6px", fontFamily: "Georgia, serif", color: C.text }}>DetoxMe</h1>
          <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>
            {mode === "login" ? "Welcome back 👋" : "Start your detox journey"}
          </p>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 32 }}>
          <div style={{ display: "flex", background: C.surface, borderRadius: 10, padding: 4, marginBottom: 28 }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }} style={{
                flex: 1, padding: "10px", fontSize: 14, fontWeight: 600,
                borderRadius: 8, border: "none", cursor: "pointer",
                background: mode === m ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "transparent",
                color: mode === m ? "#fff" : C.muted,
                transition: "all 0.2s", textTransform: "capitalize", fontFamily: "sans-serif",
              }}>{m === "login" ? "Log In" : "Sign Up"}</button>
            ))}
          </div>
          <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" />
          <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="Min 6 characters" />
          {mode === "signup" && (
            <Input label="Confirm Password" type="password" value={confirm} onChange={setConfirm} placeholder="Repeat password" />
          )}
          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: C.red }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: C.green }}>
              ✓ {success}
            </div>
          )}
          <Btn onClick={handleSubmit} loading={loading}>
            {mode === "login" ? "Log In →" : "Create Account →"}
          </Btn>
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: C.muted, marginTop: 20 }}>
          By continuing you agree to DetoxMe's Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}

const appData = [
  { name: "Instagram", time: 142, icon: "📸", category: "Social", limit: 60 },
  { name: "YouTube", time: 98, icon: "▶️", category: "Entertainment", limit: 60 },
  { name: "WhatsApp", time: 67, icon: "💬", category: "Messaging", limit: 90 },
  { name: "Chrome", time: 54, icon: "🌐", category: "Browsing", limit: 45 },
  { name: "Snapchat", time: 43, icon: "👻", category: "Social", limit: 30 },
  { name: "Twitter", time: 38, icon: "🐦", category: "Social", limit: 30 },
];

const weekData = [
  { day: "Mon", hours: 6.2 }, { day: "Tue", hours: 7.8 },
  { day: "Wed", hours: 5.1 }, { day: "Thu", hours: 8.4 },
  { day: "Fri", hours: 9.1 }, { day: "Sat", hours: 7.3 },
  { day: "Sun", hours: 4.2 },
];

const insights = [
  { icon: "🌙", title: "Late Night Doom Scroll", desc: "You use Instagram 3x more after 11 PM. It's stealing your sleep.", severity: "high" },
  { icon: "📵", title: "Phantom Checks", desc: "You unlock your phone 87 times/day without a reason.", severity: "high" },
  { icon: "⏰", title: "Morning Trap", desc: "First phone check: 6 mins after waking. This sets a distracted tone.", severity: "medium" },
  { icon: "💡", title: "Focus Windows", desc: "Your most productive window is 10 AM–12 PM. Currently wasted on Reels.", severity: "low" },
];

function Bar({ value, max, color, height = 8 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ background: C.border, borderRadius: 99, height, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: pct > 80 ? C.red : pct > 60 ? C.orange : color, borderRadius: 99, transition: "width 1s" }} />
    </div>
  );
}

function AnimatedNumber({ target, duration = 1200, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - progress, 3)) * target));
      if (progress < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);
  return <span>{val}{suffix}</span>;
}

function Dashboard({ user, onLogout, onSubscribe, subscribed }) {
  const [activeTab, setActiveTab] = useState("overview");
  const totalTime = appData.reduce((a, b) => a + b.time, 0);
  const initials = user.email.slice(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "sans-serif", color: C.text }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📵</div>
          <span style={{ fontWeight: 800, fontSize: 18, fontFamily: "Georgia, serif" }}>DetoxMe</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {subscribed ? (
            <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)", borderRadius: 99, padding: "4px 10px", fontSize: 11, color: C.green }}>✓ Pro</div>
          ) : (
            <button onClick={onSubscribe} style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 99, padding: "7px 14px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Upgrade ₹79/mo</button>
          )}
          <div onClick={onLogout} title="Sign out" style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(124,58,237,0.2)", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.glow, cursor: "pointer" }}>{initials}</div>
        </div>
      </div>
      <div style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.15), transparent)", borderBottom: `1px solid ${C.border}`, padding: "10px 20px", fontSize: 13, color: C.muted }}>
        👋 Hey <span style={{ color: C.text, fontWeight: 600 }}>{user.email.split("@")[0]}</span> — here's your phone report
      </div>
      <div style={{ display: "flex", background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 20px" }}>
        {["overview", "apps", "insights"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ background: "none", border: "none", padding: "13px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: activeTab === t ? C.glow : C.muted, borderBottom: activeTab === t ? `2px solid ${C.glow}` : "2px solid transparent", textTransform: "capitalize", transition: "all 0.2s", fontFamily: "sans-serif" }}>{t}</button>
        ))}
      </div>
      <div style={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
        {activeTab === "overview" && (
          <div>
            <div style={{ background: "linear-gradient(135deg,#1a1a26,#12121a)", border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, marginBottom: 16, position: "relative", overflow: "hidden" }}>
              <Glow color="#7c3aed" size={200} x="80%" y="50%" opacity={0.15} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 6, letterSpacing: 1 }}>TODAY'S SCREEN TIME</div>
                <div style={{ fontSize: 52, fontWeight: 900, fontFamily: "monospace" }}>
                  <AnimatedNumber target={6} suffix="h " /><span style={{ fontSize: 28 }}><AnimatedNumber target={42} suffix="m" /></span>
                </div>
                <div style={{ color: C.red, fontSize: 13, marginTop: 6 }}>↑ 1h 18m more than yesterday</div>
                <div style={{ marginTop: 14 }}>
                  <Bar value={6.7} max={10} color={C.accent} height={10} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginTop: 4 }}><span>0h</span><span>Limit: 4h</span><span>10h</span></div>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Unlocks Today", val: "87", icon: "🔓", color: C.orange },
                { label: "Wasted on Reels", val: "2h 14m", icon: "📱", color: C.red },
                { label: "Focus Score", val: "34/100", icon: "🎯", color: C.accent },
                { label: "Sleep Impact", val: "−47m", icon: "🌙", color: "#818cf8" },
              ].map((s, i) => (
                <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: "monospace" }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>Weekly Pattern</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90 }}>
                {weekData.map((d, i) => {
                  const h = (d.hours / Math.max(...weekData.map(x => x.hours))) * 80;
                  const isToday = i === 4;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ fontSize: 9, color: C.muted }}>{d.hours}h</div>
                      <div style={{ width: "100%", height: h, background: isToday ? "linear-gradient(180deg,#a855f7,#7c3aed)" : d.hours > 7 ? "rgba(239,68,68,0.5)" : "rgba(124,58,237,0.3)", borderRadius: "4px 4px 0 0", border: isToday ? "1px solid #a855f7" : "none" }} />
                      <div style={{ fontSize: 10, color: isToday ? C.glow : C.muted }}>{d.day}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {activeTab === "apps" && (
          <div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>App Usage Today</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 18 }}>Total: <span style={{ color: C.glow }}>{Math.floor(totalTime / 60)}h {totalTime % 60}m</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {appData.map((app, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 18 }}>{app.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{app.name}</div>
                          <div style={{ fontSize: 10, color: C.muted }}>{app.category}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "monospace", color: app.time > app.limit ? C.red : C.green }}>{app.time}m</div>
                        <div style={{ fontSize: 10, color: C.muted }}>limit: {app.limit}m</div>
                      </div>
                    </div>
                    <Bar value={app.time} max={180} color={C.accent} height={6} />
                  </div>
                ))}
              </div>
            </div>
            {!subscribed && (
              <div style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 16, padding: 20, textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>🔒</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Set Custom App Limits</div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>Upgrade to Pro to set limits & get alerts</div>
                <button onClick={onSubscribe} style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Unlock for ₹79/month</button>
              </div>
            )}
          </div>
        )}
        {activeTab === "insights" && (
          <div>
            <div style={{ fontWeight: 700, marginBottom: 16 }}>Your Hidden Patterns</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {insights.map((ins, i) => (
                <div key={i} style={{ background: C.card, border: `1px solid ${ins.severity === "high" ? "rgba(239,68,68,0.3)" : ins.severity === "medium" ? "rgba(249,115,22,0.3)" : C.border}`, borderLeft: `4px solid ${ins.severity === "high" ? C.red : ins.severity === "medium" ? C.orange : C.accent}`, borderRadius: 16, padding: 18 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 24 }}>{ins.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>{ins.title}</div>
                      <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{ins.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!subscribed && (
              <div style={{ marginTop: 16, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 16, padding: 20, textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>🧠</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>AI Coaching + 7-Day Detox Plan</div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>Personalized plan based on your patterns</div>
                <button onClick={onSubscribe} style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Start Detox Plan — ₹79/mo</button>
              </div>
            )}
          </div>
        )}
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <button onClick={onLogout} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 20px", fontSize: 13, color: C.muted, cursor: "pointer", fontFamily: "sans-serif" }}>Sign Out</button>
        </div>
      </div>
    </div>
  );
}

function SubscriptionPage({ onBack, onSubscribe }) {
  const [selected, setSelected] = useState("monthly");
  const [done, setDone] = useState(false);

  if (done) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 8 }}>Welcome to Pro!</div>
      <div style={{ color: C.muted }}>Your detox journey starts now.</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "sans-serif", color: C.text }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer" }}>←</button>
        <span style={{ fontWeight: 700, fontSize: 17, fontFamily: "Georgia, serif" }}>DetoxMe Pro</span>
      </div>
      <div style={{ padding: "28px 20px", maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📵</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 8px", fontFamily: "Georgia, serif" }}>Unlock Full Report</h2>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>AI insights, custom limits, and your 7-day detox plan.</p>
        </div>
        {[
          { id: "monthly", label: "Monthly", price: "₹79", sub: "per month", tag: null, desc: "Billed monthly · Cancel anytime" },
          { id: "yearly", label: "Yearly", price: "₹599", sub: "per year", tag: "Save 37%", desc: "Just ₹50/month · Best value" },
        ].map(p => (
          <div key={p.id} onClick={() => setSelected(p.id)} style={{ background: selected === p.id ? "rgba(124,58,237,0.15)" : C.card, border: `2px solid ${selected === p.id ? C.glow : C.border}`, borderRadius: 16, padding: "16px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, transition: "all 0.2s" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 700 }}>{p.label}</span>
                {p.tag && <span style={{ background: "rgba(34,197,94,0.2)", color: C.green, borderRadius: 99, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{p.tag}</span>}
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{p.desc}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: selected === p.id ? C.glow : C.text }}>{p.price}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{p.sub}</div>
            </div>
          </div>
        ))}
        <button onClick={() => { setDone(true); setTimeout(() => { onSubscribe(); onBack(); }, 2000); }} style={{ width: "100%", background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", borderRadius: 14, padding: "16px", fontSize: 16, fontWeight: 800, color: "#fff", cursor: "pointer", boxShadow: "0 0 28px rgba(124,58,237,0.35)", marginTop: 8 }}>Start DetoxMe Pro →</button>
        <p style={{ textAlign: "center", fontSize: 11, color: C.muted, marginTop: 10 }}>Secure payment · Cancel anytime</p>
      </div>
    </div>
  );
}

export default function DetoxMe() {
  const [page, setPage] = useState("auth");
  const [user, setUser] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("detoxme_token");
    const email = localStorage.getItem("detoxme_email");
    if (token && email) { setUser({ email, token }); setPage("dashboard"); }
  }, []);

  const handleAuth = (userData) => { setUser(userData); setPage("dashboard"); };
  const handleLogout = () => { localStorage.removeItem("detoxme_token"); localStorage.removeItem("detoxme_email"); setUser(null); setPage("auth"); };

  return (
    <div>
      {page === "auth" && <AuthScreen onAuth={handleAuth} />}
      {page === "dashboard" && user && <Dashboard user={user} onLogout={handleLogout} onSubscribe={() => setPage("subscribe")} subscribed={subscribed} />}
      {page === "subscribe" && <SubscriptionPage onBack={() => setPage("dashboard")} onSubscribe={() => setSubscribed(true)} />}
    </div>
  );
}
ENDOFFILE
echo "Done"
Output

Done
