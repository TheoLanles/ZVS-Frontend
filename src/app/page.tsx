'use client'
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  MediaPlayer,
  MediaPlayerCaptions,
  MediaPlayerControls,
  MediaPlayerControlsOverlay,
  MediaPlayerError,
  MediaPlayerFullscreen,
  MediaPlayerLoading,
  MediaPlayerLoop,
  MediaPlayerPlay,
  MediaPlayerSeek,
  MediaPlayerSeekBackward,
  MediaPlayerSeekForward,
  MediaPlayerSettings,
  MediaPlayerTime,
  MediaPlayerVideo,
  MediaPlayerVolume,
  MediaPlayerVolumeIndicator,
} from "@/components/ui/media-player";

export type Video = {
  id: string;
  title: string;
  hls_url: string;
  preview_url: string | null;
  subtitles?: { src: string; label: string; lang: string }[];
  has_vtt: boolean;
  hls_vtt?: { url: string };
};

// Fonction utilitaire pour forcer l'utilisation du proxy Next.js pour les URLs HLS
function toProxyHlsUrl(url: string) {
  // Si déjà proxy, ne rien faire
  if (url.startsWith('/api/hls/')) return url;
  // Pour les fichiers HLS ou VTT, proxy via Next.js
  const match = url.match(/\/hls\/(.*)$/);
  if (match) return `/api/hls/${match[1]}`;
  return url;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selected, setSelected] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const mediaPlayerVideoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/videos")
      .then(async (res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des vidéos");
        const data = await res.json();
        console.log('Réponse API /api/videos:', data);
        setVideos(data);
        setSelected(data[0] || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Erreur inconnue");
        setVideos([]);
        setSelected(null);
        setLoading(false);
      });
  }, []);

  // Gestion Hls.js pour MediaPlayer
  useEffect(() => {
    setVideoError(null); // reset à chaque changement de vidéo
    if (!selected) return;
    const video = mediaPlayerVideoRef.current;
    if (!video) return;
    let hls: Hls | null = null;
    const onVideoError = () => {
      setVideoError('Erreur de lecture vidéo (format ou réseau).');
    };
    const onLoadedMetadata = () => {
      // Log pour vérifier la détection des sous-titres HLS
      console.log('Tracks détectés:', video.textTracks);
    };
    video.addEventListener('error', onVideoError);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = toProxyHlsUrl(selected.hls_url);
    } else if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(toProxyHlsUrl(selected.hls_url));
      hls.attachMedia(video);
      hlsRef.current = hls;
      hls.on(Hls.Events.ERROR, (event, data) => {
        setVideoError('Erreur HLS: ' + (data?.details || data?.type || 'inconnue'));
      });
    } else {
      setVideoError("Votre navigateur ne supporte pas la lecture HLS.");
    }
    video.play?.();
    return () => {
      if (hls) hls.destroy();
      video.removeEventListener('error', onVideoError);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [selected?.hls_url]);

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-screen p-8 overflow-hidden">
      {/* Affichage loading/erreur global */}
      {loading ? (
        <div>Chargement des vidéos...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>Erreur : {error}</div>
      ) : videos.length === 0 ? (
        <div className="text-muted-foreground">Aucune vidéo trouvée</div>
      ) : null}
      {/* Player à gauche */}
      <div className="flex-1 flex flex-col items-stretch justify-center min-h-0 overflow-hidden">
        <div className="flex-1 flex items-center justify-center min-h-0 min-w-0">
          {!loading && !error && selected ? (
            <>
              <div className="flex-1 h-full w-full flex items-center justify-center min-h-0 min-w-0">
                <MediaPlayer autoHide className="w-full h-full">
                  <MediaPlayerVideo
                    ref={mediaPlayerVideoRef}
                    poster={selected.preview_url || undefined}
                    className="w-full h-full object-contain"
                    src={toProxyHlsUrl(selected.hls_url)}
                    crossOrigin="anonymous"
                  >
                    {selected.has_vtt && selected.hls_vtt?.url && (
                      <track
                        kind="subtitles"
                        src={toProxyHlsUrl(selected.hls_vtt.url)}
                        srcLang="fr"
                        label="VTT"
                        default
                      />
                    )}
                    {selected.subtitles?.map((track, i) => (
                      <track
                        key={i}
                        kind="subtitles"
                        src={track.src}
                        srcLang={track.lang}
                        label={track.label}
                        default={i === 0 && !(selected.has_vtt && selected.hls_vtt?.url)}
                      />
                    ))}
                  </MediaPlayerVideo>
                  <MediaPlayerLoading />
                  <MediaPlayerError />
                  <MediaPlayerVolumeIndicator />
                  <MediaPlayerControls className="flex-col items-start gap-2.5 w-full">
                    <MediaPlayerControlsOverlay />
                    <MediaPlayerSeek />
                    <div className="flex w-full items-center gap-2">
                      <div className="flex flex-1 items-center gap-2">
                        <MediaPlayerPlay />
                        <MediaPlayerSeekBackward />
                        <MediaPlayerSeekForward />
                        <MediaPlayerVolume expandable />
                        <MediaPlayerTime />
                      </div>
                      <div className="flex items-center gap-2">
                        <MediaPlayerLoop />
                        <MediaPlayerCaptions />
                        <MediaPlayerSettings />
                        <MediaPlayerFullscreen />
                      </div>
                    </div>
                  </MediaPlayerControls>
                </MediaPlayer>
              </div>
              {videoError && (
                <div style={{ color: 'red', marginTop: 8 }}></div>
              )}
            </>
          ) : !loading && !error ? (
            <div className="text-center text-muted-foreground">Aucune vidéo disponible</div>
          ) : null}
        </div>
      </div>
      {/* Liste de vidéos à droite */}
      <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-4 min-h-0 overflow-auto">
        <div className="text-xl font-bold mb-2">Vidéos</div>
        {loading ? (
          <div className="text-muted-foreground">Chargement...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : videos.length === 0 ? (
          <div className="text-muted-foreground">Aucune vidéo trouvée</div>
        ) : (
          videos.map((video) => (
            <div
              key={video.id}
              className={`flex items-center gap-4 p-2 cursor-pointer transition border-2 rounded-md ${
                selected && selected.id === video.id ? "border-primary" : "border-transparent hover:border-primary/50"
              }`}
              onClick={() => setSelected(video)}
            >
              {video.preview_url ? (
                <img
                  src={video.preview_url}
                  alt={video.title}
                  className="w-20 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                  Pas d'image
                </div>
              )}
              <div className="flex-1">
                <div className="font-semibold">{video.title}</div>
                <div className="text-xs text-muted-foreground">{video.id}</div>
              </div>
              <Button
                size="sm"
                variant={selected && selected.id === video.id ? "default" : "outline"}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(video);
                }}
              >
                Lire
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
