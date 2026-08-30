interface FuturisticAvatarProps {
  size?: number;
  online?: boolean;
  name?: string;
  avatar?: string | null;
}

export default function FuturisticAvatar({
  size = 72,
  online = true,
  name = "Support User",
  avatar,
}: FuturisticAvatarProps) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <style>{`
        @keyframes rotateRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulseGlow {
          0%,100% {
            box-shadow: 0 0 18px rgba(34,211,238,.45),
                        0 0 36px rgba(99,102,241,.25);
          }
          50% {
            box-shadow: 0 0 28px rgba(34,211,238,.9),
                        0 0 60px rgba(99,102,241,.45);
          }
        }

        @keyframes floatAvatar {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes pingDot {
          0% { transform: scale(1); opacity: 1; }
          70% { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>

      <div
        className="relative group"
        style={{ width: size, height: size }}
      >
        {/* Rotating Neon Ring */}
        <div
          className="absolute inset-0 rounded-full p-[3px]"
          style={{
            background:
              "conic-gradient(from 0deg,#22d3ee,#2563eb,#7c3aed,#22d3ee)",
            animation: "rotateRing 8s linear infinite",
            filter: "blur(.2px)",
          }}
        />

        {/* Glow Ring */}
        <div
          className="absolute inset-[2px] rounded-full"
          style={{
            animation: "pulseGlow 2.8s ease-in-out infinite",
            background:
              "linear-gradient(135deg, rgba(34,211,238,.15), rgba(99,102,241,.15))",
          }}
        />

        {/* Avatar */}
        <div
          className="absolute inset-[6px] overflow-hidden rounded-full border border-cyan-400/40 bg-[#07111F]"
          style={{ animation: "floatAvatar 3s ease-in-out infinite" }}
        >
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-700">
              <span
                className="font-bold text-white tracking-widest"
                style={{ fontSize: size * 0.35 }}
              >
                {initials}
              </span>
            </div>
          )}

          {/* Moving Shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
        </div>

        {/* Online Indicator */}
        {online && (
          <div className="absolute bottom-1 right-1">
            <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-60"
              style={{ animation: "pingDot 2s infinite" }}
            />
            <span className="relative block h-4 w-4 rounded-full border-2 border-[#07111F] bg-emerald-400" />
          </div>
        )}
      </div>
    </>
  );
}


