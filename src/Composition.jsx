import { Fragment } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { Video } from "@remotion/media";
import { contrast } from "@remotion/effects/contrast";
import { saturation } from "@remotion/effects/saturation";
import { tint } from "@remotion/effects/tint";
import { vignette } from "@remotion/effects/vignette";
import { Captions } from "./Captions";
import { MotionGraphics } from "./MotionGraphics";

const GRADE_EFFECTS = [
  contrast({ amount: 1.12 }),
  saturation({ amount: 0.92 }),
  tint({ color: "#2a1a4d", amount: 0.1 }),
  vignette({ amount: 0.45, radius: 0.6, feather: 0.45 }),
];

const ZOOM_RAMP_FRAMES = 10;
const ZOOM_SCALE = 1.12;

const punchZoomScale = (frame, zoomWindows) => {
  let scale = 1;
  for (const w of zoomWindows) {
    const local = interpolate(
      frame,
      [
        w.startFrame - ZOOM_RAMP_FRAMES,
        w.startFrame,
        w.endFrame,
        w.endFrame + ZOOM_RAMP_FRAMES,
      ],
      [1, ZOOM_SCALE, ZOOM_SCALE, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }
    );
    if (local > scale) scale = local;
  }
  return scale;
};

const Scene = ({ video, zoomWindows, graphicWindows, words, style, startFrom, endAt }) => {
  const frame = useCurrentFrame();
  const scale = punchZoomScale(frame, zoomWindows);

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Video
        src={staticFile(video)}
        objectFit="cover"
        effects={GRADE_EFFECTS}
        startFrom={startFrom || 0}
        endAt={endAt || undefined}
        style={{
          width: "100%",
          height: "100%",
          scale: interpolate(scale, [1, ZOOM_SCALE], [1, ZOOM_SCALE], {
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <MotionGraphics windows={graphicWindows} />
      
      {/* ¡LA MEJORA ACÁ! Los subtítulos ahora corren bajo el tiempo local de esta escena */}
      {words && words.length > 0 && <Captions words={words} style={style} />}
    </AbsoluteFill>
  );
};

const TRANSITION_TIMING = springTiming({
  config: { damping: 200 },
  durationInFrames: 12,
});

const TRANSITIONS = [
  () => fade(),
  () => slide({ direction: "from-right" }),
  () => wipe(),
  () => slide({ direction: "from-left" }),
  () => clockWipe({ width: 1080, height: 1920 }),
];

export const ReelComposition = ({ style, timeline }) => {
  const scenes = timeline.scenes || [];

  return (
    <AbsoluteFill className="bg-black">
      <TransitionSeries>
        {scenes.map((scene, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <TransitionSeries.Transition
                presentation={TRANSITIONS[(index - 1) % TRANSITIONS.length]()}
                timing={TRANSITION_TIMING}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={scene.durationInFrames}>
              <Scene 
                video={scene.video} 
                zoomWindows={scene.zoomWindows} 
                graphicWindows={scene.graphicWindows}
                words={scene.words}
                style={style}
                startFrom={scene.startFrom}
                endAt={scene.endAt}
              />
            </TransitionSeries.Sequence>
          </Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};