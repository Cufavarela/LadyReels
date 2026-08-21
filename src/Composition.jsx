import { AbsoluteFill, Series, Video, staticFile } from "remotion";
import { Captions } from "./Captions";

export const ReelComposition = ({ style, timeline }) => {
  const realWords = timeline.words || [];
  const videoClips = timeline.videos || [];

  return (
    <AbsoluteFill className="bg-black">
      <Series>
        {videoClips.map((videoPath, index) => (
          <Series.Sequence key={index} durationInFrames={150}>
            <Html5Video src={staticFile(videoPath)} className="w-full h-full object-cover" />          
          </Series.Sequence>
        ))}
      </Series>

      {realWords.length > 0 && <Captions words={realWords} style={style} />}
    </AbsoluteFill>
  );
};