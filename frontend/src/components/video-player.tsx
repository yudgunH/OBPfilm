"use client"

import { useState, useRef, useEffect } from "react"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Subtitles,
  SkipForward,
  Rewind,
  FastForward,
  Minimize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"

interface VideoPlayerProps {
  src: string
  poster?: string
  onNext?: () => void
  hasNextEpisode?: boolean
  videoSize: "normal" | "theater" | "fullscreen"
  setVideoSize: (size: "normal" | "theater" | "fullscreen") => void
}

export function VideoPlayer({ src, poster, onNext, hasNextEpisode, videoSize, setVideoSize }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSubtitlesOpen, setIsSubtitlesOpen] = useState(false)
  const [showPlayPauseIndicator, setShowPlayPauseIndicator] = useState(false)
  const [videoWidth, setVideoWidth] = useState(0)
  const [videoHeight, setVideoHeight] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const volumeControlRef = useRef<HTMLDivElement>(null)
  let controlsTimeout: NodeJS.Timeout

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setVideoWidth(video.videoWidth)
      setVideoHeight(video.videoHeight)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [])

  useEffect(() => {
    const savedVolume = localStorage.getItem("videoPlayerVolume")
    if (savedVolume !== null) {
      setVolume(Number.parseFloat(savedVolume))
      if (videoRef.current) {
        videoRef.current.volume = Number.parseFloat(savedVolume)
      }
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        skip30Seconds(true)
      } else if (e.key === "ArrowLeft") {
        skip30Seconds(false)
      } else if (e.key === " ") {
        e.preventDefault()
        togglePlay()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (volumeControlRef.current && !volumeControlRef.current.contains(event.target as Node)) {
        setShowVolumeSlider(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const togglePlay = () => {
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }

    setShowPlayPauseIndicator(true)
    setTimeout(() => setShowPlayPauseIndicator(false), 500)
  }

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0]
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
      localStorage.setItem("videoPlayerVolume", newVolume.toString())
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted
      videoRef.current.muted = newMutedState
      setIsMuted(newMutedState)
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
      setIsFullscreen(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    clearTimeout(controlsTimeout)
    controlsTimeout = setTimeout(() => {
      if (isPlaying && !isSettingsOpen && !isSubtitlesOpen && !showVolumeSlider) {
        setShowControls(false)
      }
    }, 5000)
  }

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
      setPlaybackRate(rate)
    }
  }

  const skip30Seconds = (forward: boolean) => {
    if (videoRef.current) {
      videoRef.current.currentTime += forward ? 30 : -30
    }
  }

  const handleVideoClick = () => {
    console.log("Video clicked")
    togglePlay()
  }

  const toggleVideoSize = () => {
    if (videoSize === "normal") {
      setVideoSize("theater")
    } else if (videoSize === "theater") {
      setVideoSize("fullscreen")
      toggleFullscreen()
    } else {
      setVideoSize("normal")
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
    }
  }

  const getVideoContainerStyle = () => {
    if (!src || (videoWidth === 0 && videoHeight === 0)) {
      return {
        width: "100%",
        height: "calc(100vh - 64px)",
      }
    }
    if (videoSize === "normal") {
      return {
        width: `${videoWidth}px`,
        height: `${videoHeight}px`,
        maxWidth: "100%",
        maxHeight: "calc(100vh - 64px)",
      }
    } else if (videoSize === "theater") {
      return {
        width: "100%",
        height: "calc(100vh - 64px)",
      }
    } else {
      return {
        width: "100%",
        height: "100%",
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative group bg-black cursor-pointer mx-auto ${
        videoSize === "fullscreen" ? "fixed inset-0 z-50" : ""
      }`}
      style={getVideoContainerStyle()}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => {
        if (isPlaying && !isSettingsOpen && !isSubtitlesOpen && !showVolumeSlider) {
          setShowControls(false)
        }
      }}
    >
      <video
        ref={videoRef}
        playsInline
        webkit-playsinline="true"
        className="w-full h-full object-contain"
        src={src}
        poster={poster}
        onClick={handleVideoClick}
      />

      {/* Video Controls */}
      <AnimatePresence>
        {showPlayPauseIndicator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-4"
          >
            {isPlaying ? <Play className="h-12 w-12 text-white" /> : <Pause className="h-12 w-12 text-white" />}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {(showControls || isSettingsOpen || isSubtitlesOpen || showVolumeSlider) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
          >
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4">
              {/* Progress Bar */}
              <div className="pointer-events-auto">
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-red-600"
                />
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between pointer-events-auto">
                <div className="flex items-center space-x-2 sm:space-x-4 mb-2 sm:mb-0">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => skip30Seconds(false)}
                  >
                    <Rewind className="h-6 w-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => skip30Seconds(true)}
                  >
                    <FastForward className="h-6 w-6" />
                  </Button>

                  {hasNextEpisode && (
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onNext}>
                      <SkipForward className="h-6 w-6" />
                    </Button>
                  )}

                  <div
                    ref={volumeControlRef}
                    className="flex items-center space-x-2"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={toggleMute}>
                      {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                    </Button>
                    <AnimatePresence>
                      {showVolumeSlider && (
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 100, opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <Slider
                            value={[isMuted ? 0 : volume]}
                            min={0}
                            max={1}
                            step={0.1}
                            onValueChange={handleVolumeChange}
                            className="w-24 [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <DropdownMenu onOpenChange={setIsSubtitlesOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <Subtitles className="h-6 w-6" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>English</DropdownMenuItem>
                      <DropdownMenuItem>Vietnamese</DropdownMenuItem>
                      <DropdownMenuItem>Off</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu onOpenChange={setIsSettingsOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <Settings className="h-6 w-6" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => changePlaybackRate(0.5)}>0.5x Speed</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changePlaybackRate(1)}>1x Speed</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changePlaybackRate(1.5)}>1.5x Speed</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changePlaybackRate(2)}>2x Speed</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>1080p</DropdownMenuItem>
                      <DropdownMenuItem>720p</DropdownMenuItem>
                      <DropdownMenuItem>480p</DropdownMenuItem>
                      <DropdownMenuItem>Auto</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={toggleVideoSize}
                  >
                    {videoSize === "normal" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                        <rect x="7" y="7" width="10" height="10"></rect>
                      </svg>
                    ) : videoSize === "theater" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                      </svg>
                    ) : (
                      <Minimize2 className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

