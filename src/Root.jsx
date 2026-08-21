import "./index.css";
import { Composition } from "remotion";
import { ReelComposition } from "./Composition";
import configData from "../config.json";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="InstagramReel"
        component={ReelComposition}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={150} 
        defaultProps={{
          style: configData.style,
          timeline: configData.timeline,
        }}
      />
    </>
  );
};
