import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

const isRecordingSupported = !!navigator.mediaDevices.getUserMedia && typeof navigator.mediaDevices.getUserMedia === 'function' && typeof window.MediaRecorder === 'function';

export function RecordRoomAudio() {
    const [isRecording, setIsRecording] = useState(false);
    const recorder = useRef<MediaRecorder | null>(null);

    function stopRecording() {
        setIsRecording(false);

        if(recorder.current && recorder.current.state !== 'inactive') {
            recorder.current.stop();
        }
    }

    async function startRecording() {

        if (!isRecordingSupported) {
            alert('O seu navegador não suporta a gravação de áudio');
            return;
        }

        setIsRecording(true);

        const audio = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44_100,
            },
        });

        recorder.current = new MediaRecorder(audio, {
            mimeType: 'audio/webm',
            audioBitsPerSecond: 64_000,
        });

        recorder.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                console.log(event.data);
            }
        }

        recorder.current.onstart = () => {
            console.log('Iniciando gravação');
        }

        recorder.current.onstop = () => {
            console.log('Parando gravação');
        }

        recorder.current.start();
    }

    return (
        <div className="h-screen flex items-center justify-center gap-3 flex-col">
            {isRecording ? <Button onClick={stopRecording}>Pausar gravação</Button> : <Button onClick={startRecording}>Gravar áudio</Button>}
            {isRecording ? <p>Gravando...</p> : <p>Pausado</p>}
        </div>
    )
}