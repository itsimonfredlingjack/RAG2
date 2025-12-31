import useSound from 'use-sound';

// Placeholder paths - these files don't exist yet but the hooks are ready
const SOUND_PATHS = {
    CLICK: '/sounds/click.mp3',
    HOVER: '/sounds/hover.mp3',
    SEND: '/sounds/send.mp3',
    RECEIVE: '/sounds/receive.mp3',
};

export const useSoundEffects = () => {
    const [playClick] = useSound(SOUND_PATHS.CLICK, { volume: 0.5, interrupt: true });
    const [playHover] = useSound(SOUND_PATHS.HOVER, { volume: 0.2, interrupt: true });
    const [playSend] = useSound(SOUND_PATHS.SEND, { volume: 0.6 });
    const [playReceive] = useSound(SOUND_PATHS.RECEIVE, { volume: 0.6 });

    return {
        playClick,
        playHover,
        playSend,
        playReceive
    };
};
