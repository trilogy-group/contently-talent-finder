import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

// Define types for the Speech Recognition API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionError extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
  onend: (event: Event) => void;
}

// Add global declarations
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

interface UseSpeechRecognitionProps {
  onFinalTranscript: (transcript: string) => void;
}

export const useSpeechRecognition = ({ onFinalTranscript }: UseSpeechRecognitionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  // Store the current recognition instance in a ref
  const recognitionInstanceRef = useRef<SpeechRecognition | null>(null);

  // Function to create a new recognition instance
  const createRecognitionInstance = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      console.log("Speech recognition not supported in this browser");
      setIsSupported(false);
      return null;
    }
    
    try {
      const recognitionInstance = new SpeechRecognitionAPI() as SpeechRecognition;
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      // Set up event handlers
      recognitionInstance.onstart = () => {
        console.log("Speech recognition started");
        setIsRecording(true);
      };
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }
        
        if (final) {
          console.log("Final transcript:", final);
          onFinalTranscript(final);
        }
        
        setInterimTranscript(interim);
      };
      
      recognitionInstance.onerror = (event: SpeechRecognitionError) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        setInterimTranscript("");
        
        if (event.error !== 'no-speech') {
          toast({
            title: "Speech Recognition Error",
            description: `Error: ${event.error}`,
            variant: "destructive"
          });
        }
      };
      
      recognitionInstance.onend = () => {
        console.log("Speech recognition ended");
        setIsRecording(false);
      };
      
      recognitionInstanceRef.current = recognitionInstance;
      return recognitionInstance;
    } catch (error) {
      console.error("Error creating speech recognition instance:", error);
      setIsSupported(false);
      return null;
    }
  }, [onFinalTranscript, toast]);

  // Check if speech recognition is supported on mount
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognitionAPI);
  }, []);

  const startRecording = useCallback(() => {
    if (!isSupported) {
      toast({
        title: "Browser Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }
    
    if (isRecording) {
      console.log("Already recording, stopping first");
      stopRecording();
    }
    
    try {
      console.log("Creating new recognition instance and starting");
      const recognitionInstance = createRecognitionInstance();
      if (recognitionInstance) {
        recognitionInstance.start();
        setInterimTranscript("");
      }
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setIsRecording(false);
      toast({
        title: "Error",
        description: "Failed to start speech recognition.",
        variant: "destructive"
      });
    }
  }, [isSupported, isRecording, createRecognitionInstance, toast]);

  const stopRecording = useCallback(() => {
    console.log("Stopping recording, current state:", isRecording);
    setIsRecording(false);
    setInterimTranscript("");
    
    if (recognitionInstanceRef.current) {
      recognitionInstanceRef.current.stop();
      recognitionInstanceRef.current = null;
    }
  }, []);

  return {
    isRecording,
    interimTranscript,
    isSupported,
    startRecording,
    stopRecording
  };
};
