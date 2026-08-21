import { useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Anton';

const { fontFamily } = loadFont();

const CHUNK_SIZE = 4;
const TRAILING_HOLD_FRAMES = 6;

export const Captions = ({ words, style }) => {
  const frame = useCurrentFrame();

  const activeChunk = [];
  for (let i = 0; i < words.length; i += CHUNK_SIZE) {
    const chunk = words.slice(i, i + CHUNK_SIZE);
    const chunkStart = chunk[0].startFrame;
    const chunkEnd = chunk[chunk.length - 1].endFrame + TRAILING_HOLD_FRAMES;
    if (frame >= chunkStart && frame <= chunkEnd) {
      activeChunk.push(...chunk);
      break;
    }
  }

  return (
    <div className={`${style.positionY} flex-wrap gap-x-5 gap-y-4 justify-center items-center`}>
      {activeChunk.map((word, index) => {
        const isActive = frame >= word.startFrame && frame <= word.endFrame;

        return (
          <div
            key={index}
            className={`relative inline-block transition-all duration-75`}
          >
            {isActive && (
              <div 
                className={`
                  absolute inset-0 z-0
                  ${style.highlight.backgroundColor} 
                  ${style.highlight.borderRadius}
                `}
                style={{
                  transform: 'scaleX(1.25) scaleY(1.30)', 
                }}
              />
            )}

            <span
              className={`
                relative z-10 font-bold tracking-wide inline-block text-white
                ${style.fontSize} ${style.textTransform}
              `}
              style={{
                fontFamily: fontFamily,
                WebkitTextStroke: style.textStroke,
                textShadow: style.textShadow,
              }}
            >
              {word.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};