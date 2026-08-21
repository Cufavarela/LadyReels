import "./index.css";
import { Composition } from "remotion";
import { ReelComposition } from "./Composition";
import configData from "../config.json";

const scenes = configData.timeline.scenes || [];
const transitionDurationInFrames = configData.timeline.transitionDurationInFrames || 0;
const totalDurationInFrames =
  scenes.reduce((sum, s) => sum + s.durationInFrames, 0) -
  Math.max(0, scenes.length - 1) * transitionDurationInFrames;

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="InstagramReel"
        component={ReelComposition}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={totalDurationInFrames || 150}
        defaultProps={{
          style: configData.style,
          timeline: configData.timeline,
        }}
      />
    </>
  );
};
