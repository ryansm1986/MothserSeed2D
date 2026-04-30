import titleMusicUrl from "../../assets/Music/Mothertree_Intro_Short.mp3?url";
import overworldMusicUrl from "../../assets/Music/Mothertree_Chill_Overworld.mp3?url";
import moonfallCrashUrl from "../../assets/characters/purple_mage/spells/moonfall/sound_effects/Crashing.mp3?url";
import moonfallPortalUrl from "../../assets/characters/purple_mage/spells/moonfall/sound_effects/Portal.mp3?url";
import moonfallVoiceUrl from "../../assets/characters/purple_mage/spells/moonfall/voiceline/Moonfall.mp3?url";
import warriorSwordSwishUrl from "../../assets/characters/green_warrior_v4/sounds/sword/Sword_swish.mp3?url";
import warriorSwordThumpUrl from "../../assets/characters/green_warrior_v4/sounds/sword/Sword_Thump.mp3?url";
import warriorByMothertreeUrl from "../../assets/characters/green_warrior_v4/sounds/voice/Guy_ByMothertree.mp3?url";
import warriorHyahUrl from "../../assets/characters/green_warrior_v4/sounds/voice/Guy_Hyah.mp3?url";
import golemRockSlamCrashUrl from "../../assets/sound_effects/Crashing.mp3?url";
import motherslashPulseWaveUrl from "../../assets/sound_effects/Pulse_Wave.mp3?url";
import { golemAudio } from "../game/content/enemies";
import type { SoundEventId } from "../game/state";
import { clamp } from "../game/math";

const titleMusicVolume = 0.54;
const audioSettingsStorageKey = "motherseed-audio-settings";
const defaultAudioSettings = {
  music: 0.8,
  sfx: 0.8,
};

const moonfallAudio = {
  voiceVolume: 0.8,
  portalVolume: 0.62,
  crashVolume: 0.82,
} as const;

const warriorAudio = {
  swordSwishVolume: 0.44,
  swordThumpVolume: 0.62,
  hyahVolume: 0.72,
  byMothertreeVolume: 0.78,
  pulseWaveVolume: 0.7,
} as const;

export type AudioSettings = typeof defaultAudioSettings;

export type AudioControls = {
  musicVolumeInput: HTMLInputElement;
  sfxVolumeInput: HTMLInputElement;
  musicVolumeValue: HTMLElement;
  sfxVolumeValue: HTMLElement;
};

export function createAudioManager(controls: AudioControls) {
  let titleMusic: HTMLAudioElement | null = null;
  let gameplayMusic: HTMLAudioElement | null = null;
  let audioSettings = loadAudioSettings();

  function saveAudioSettings() {
    localStorage.setItem(audioSettingsStorageKey, JSON.stringify(audioSettings));
  }

  function scaledVolume(baseVolume: number, categoryVolume: number) {
    return clamp(baseVolume, 0, 1) * clamp(categoryVolume, 0, 1);
  }

  function updateAudioSettingsUi() {
    const musicPercent = Math.round(audioSettings.music * 100);
    const sfxPercent = Math.round(audioSettings.sfx * 100);
    controls.musicVolumeInput.value = String(musicPercent);
    controls.sfxVolumeInput.value = String(sfxPercent);
    controls.musicVolumeValue.textContent = `${musicPercent}%`;
    controls.sfxVolumeValue.textContent = `${sfxPercent}%`;
  }

  function applyMusicVolume() {
    if (titleMusic) titleMusic.volume = scaledVolume(titleMusicVolume, audioSettings.music);
    if (gameplayMusic) gameplayMusic.volume = scaledVolume(0.48, audioSettings.music);
  }

  function playSound(url: string, volume = 1) {
    const sound = new Audio(url);
    sound.volume = scaledVolume(volume, audioSettings.sfx);
    void sound.play().catch(() => undefined);
  }

  function ensureTitleMusic() {
    if (titleMusic) return titleMusic;
    titleMusic = new Audio(titleMusicUrl);
    titleMusic.loop = true;
    applyMusicVolume();
    return titleMusic;
  }

  function ensureGameplayMusic() {
    if (gameplayMusic) return gameplayMusic;
    gameplayMusic = new Audio(overworldMusicUrl);
    gameplayMusic.loop = true;
    applyMusicVolume();
    return gameplayMusic;
  }

  function playTitleMusic() {
    const music = ensureTitleMusic();
    void music.play().catch(() => undefined);
  }

  function stopTitleMusic() {
    if (!titleMusic) return;
    titleMusic.pause();
    titleMusic.currentTime = 0;
  }

  function playGameplayMusic() {
    const music = ensureGameplayMusic();
    void music.play().catch(() => undefined);
  }

  function stopGameplayMusic() {
    if (!gameplayMusic) return;
    gameplayMusic.pause();
    gameplayMusic.currentTime = 0;
  }

  function playEventSound(id: SoundEventId) {
    if (id === "moonfallVoice") playSound(moonfallVoiceUrl, moonfallAudio.voiceVolume);
    if (id === "moonfallPortal") playSound(moonfallPortalUrl, moonfallAudio.portalVolume);
    if (id === "moonfallCrash") playSound(moonfallCrashUrl, moonfallAudio.crashVolume);
    if (id === "golemRockSlamCrash") playSound(golemRockSlamCrashUrl, golemAudio.rockSlamCrashVolume);
    if (id === "warriorSwordSwish") playSound(warriorSwordSwishUrl, warriorAudio.swordSwishVolume);
    if (id === "warriorSwordThump") playSound(warriorSwordThumpUrl, warriorAudio.swordThumpVolume);
    if (id === "warriorHyah") playSound(warriorHyahUrl, warriorAudio.hyahVolume);
    if (id === "warriorByMothertree") playSound(warriorByMothertreeUrl, warriorAudio.byMothertreeVolume);
    if (id === "motherslashPulseWave") playSound(motherslashPulseWaveUrl, warriorAudio.pulseWaveVolume);
  }

  controls.musicVolumeInput.addEventListener("input", () => {
    audioSettings = {
      ...audioSettings,
      music: clamp(Number(controls.musicVolumeInput.value) / 100, 0, 1),
    };
    applyMusicVolume();
    updateAudioSettingsUi();
    saveAudioSettings();
  });

  controls.sfxVolumeInput.addEventListener("input", () => {
    audioSettings = {
      ...audioSettings,
      sfx: clamp(Number(controls.sfxVolumeInput.value) / 100, 0, 1),
    };
    updateAudioSettingsUi();
    saveAudioSettings();
  });

  updateAudioSettingsUi();

  return {
    updateAudioSettingsUi,
    playTitleMusic,
    stopTitleMusic,
    playGameplayMusic,
    stopGameplayMusic,
    playEventSound,
  };
}

function loadAudioSettings(): AudioSettings {
  try {
    const stored = localStorage.getItem(audioSettingsStorageKey);
    if (!stored) return { ...defaultAudioSettings };
    const parsed = JSON.parse(stored) as Partial<AudioSettings>;
    return {
      music: clamp(Number(parsed.music ?? defaultAudioSettings.music), 0, 1),
      sfx: clamp(Number(parsed.sfx ?? defaultAudioSettings.sfx), 0, 1),
    };
  } catch {
    return { ...defaultAudioSettings };
  }
}
