import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

const POP_PAD = 8;

export const MotionGraphics = ({ windows }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {windows?.map((w, i) => {
        const popStart = w.startFrame - POP_PAD;
        const popEnd = w.endFrame + POP_PAD;
        if (frame < popStart || frame > popEnd) return null;

        // Curva suave de aparición y desaparición (Fade + Scale elástico)
        const opacity = interpolate(frame, [popStart, w.startFrame, w.endFrame, popEnd], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const scale = interpolate(frame, [popStart, w.startFrame, popEnd], [0.8, 1, 1], {
          output: "perceptual-scale",
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.175, 0.885, 0.32, 1.275), // Efecto pop inflable pro
        });

        // 🌟 DISEÑO 1: BIENVENIDA (Grande y Centrado en el medio de la pantalla)
        if (w.type === "welcome") {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 40px",
                opacity,
                scale,
                zIndex: 30,
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #1e1b4b, #311042)",
                  border: "5px solid #000000",
                  borderRadius: 24,
                  padding: "30px 40px",
                  textAlign: "center",
                  boxShadow: "10px 10px 0px #000000",
                  maxWidth: "90%",
                }}
              >
                <h1
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    color: "#FFFFFF",
                    fontSize: 55,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    WebkitTextStroke: "2px #000000",
                    lineHeight: 1.1,
                  }}
                >
                  {w.label}
                </h1>
              </div>
            </div>
          );
        }

        // 🌟 DISEÑO 2: DETALLES (Arriba, solo si hay espacio vacío)
        if (w.type === "details" || !w.type) {
          return (
            <div key={i} style={{ position: "absolute", top: "9%", left: 40, right: 40, display: "flex", justifyContent: "center", opacity, scale, zIndex: 20 }}>
              <div style={{ background: "linear-gradient(135deg, #7c3aed, #4c1d95)", border: "3px solid #000000", borderRadius: 16, padding: "12px 26px", boxShadow: "6px 6px 0px #000000", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 28 }}>💡</span>
                <span style={{ fontFamily: "'Anton', sans-serif", color: "#FFFFFF", fontSize: 24, textTransform: "uppercase", letterSpacing: 1, WebkitTextStroke: "1px #000000" }}>
                  {w.label}
                </span>
              </div>
            </div>
          );
        }

        // 🌟 DISEÑO 3: DESPEDIDA (Abajo o centro con llamado a la acción al final)
        if (w.type === "farewell") {
          return (
            <div key={i} style={{ position: "absolute", bottom: "35%", left: 40, right: 40, display: "flex", justifyContent: "center", opacity, scale, zIndex: 20 }}>
              <div style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", border: "4px solid #000000", borderRadius: 20, padding: "16px 30px", boxShadow: "8px 8px 0px #000000", width: "100%", textAlign: "center" }}>
                <span style={{ fontFamily: "'Anton', sans-serif", color: "#FFFFFF", fontSize: 32, textTransform: "uppercase", letterSpacing: 1, WebkitTextStroke: "1.5px #000000" }}>
                  👋 {w.label}
                </span>
              </div>
            </div>
          );
        }

        return null;
      })}
    </AbsoluteFill>
  );
};