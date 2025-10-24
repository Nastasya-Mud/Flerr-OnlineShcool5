import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';
import { lessonsAPI } from '@/lib/api';

interface Chapter {
  title: string;
  timeSec: number;
}

interface VideoPlayerProps {
  url: string;
  lessonId: string;
  chapters?: Chapter[];
  onProgressSave?: (percent: number) => void;
}

export function VideoPlayer({ url, lessonId, chapters = [], onProgressSave }: VideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);

  // Автосохранение прогресса каждые 10 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      if (playing && played > 0) {
        const percent = Math.round(played * 100);
        lessonsAPI.saveProgress(lessonId, percent).catch(console.error);
        if (onProgressSave) {
          onProgressSave(percent);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [playing, played, lessonId, onProgressSave]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    playerRef.current?.seekTo(percent);
  };

  const handleChapterClick = (timeSec: number) => {
    playerRef.current?.seekTo(timeSec, 'seconds');
  };

  const toggleFullscreen = () => {
    const elem = playerRef.current?.wrapper;
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
      <div
        className="relative group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(playing ? false : true)}
      >
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          width="100%"
          height="auto"
          style={{ aspectRatio: '16/9' }}
          onProgress={({ played }) => setPlayed(played)}
          onDuration={setDuration}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
              },
            },
          }}
        />

        {/* Custom Controls */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300',
            showControls ? 'opacity-100' : 'opacity-0'
          )}
        >
          {/* Progress Bar */}
          <div
            className="w-full h-1.5 bg-white/30 rounded-full mb-3 cursor-pointer group/progress"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-[#A50C0A] rounded-full relative group-hover/progress:h-2 transition-all"
              style={{ width: `${played * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100" />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPlaying(!playing)}
                className="hover:text-[#A50C0A] transition-colors"
              >
                {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMuted(!muted)}
                  className="hover:text-[#A50C0A] transition-colors"
                >
                  {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 h-1 accent-[#A50C0A]"
                />
              </div>

              <span className="text-sm">
                {formatDuration(Math.floor(played * duration))} / {formatDuration(Math.floor(duration))}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={playbackRate}
                onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                className="bg-transparent text-sm border border-white/30 rounded px-2 py-1 cursor-pointer hover:border-[#A50C0A]"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              <button
                onClick={toggleFullscreen}
                className="hover:text-[#A50C0A] transition-colors"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters */}
      {chapters.length > 0 && (
        <div className="bg-[#F8EAC8] p-4 space-y-2">
          <h4 className="font-semibold text-[#333A1A] mb-3">Главы урока</h4>
          {chapters.map((chapter, index) => (
            <button
              key={index}
              onClick={() => handleChapterClick(chapter.timeSec)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-white transition-colors flex items-center justify-between group"
            >
              <span className="text-sm text-[#333A1A] group-hover:text-[#A50C0A]">
                {chapter.title}
              </span>
              <span className="text-sm text-[#9C7750]">{formatDuration(chapter.timeSec)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

