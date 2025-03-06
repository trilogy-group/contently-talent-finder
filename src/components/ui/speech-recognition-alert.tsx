import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

interface SpeechRecognitionAlertProps {
  open?: boolean;
  onClose: () => void;
  isSupported?: boolean;
}

export const SpeechRecognitionAlert: React.FC<SpeechRecognitionAlertProps> = ({
  open = true,
  onClose,
  isSupported = false
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-2">
            {isSupported ? (
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                <Mic className="h-6 w-6" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                <MicOff className="h-6 w-6" />
              </div>
            )}
          </div>
          <AlertDialogTitle className="text-center">
            {isSupported ? "Speech Recognition Available" : "Speech Recognition Not Available"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {isSupported 
              ? "Your browser supports speech recognition. You can use the microphone button to dictate your search queries."
              : "Unfortunately, your browser doesn't support speech recognition. Please try using a different browser like Chrome or Edge for this feature."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center">
          <AlertDialogAction onClick={onClose} className="bg-orange-500 hover:bg-orange-600">
            {isSupported ? "Got it" : "Understood"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
