import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, Result, BarcodeFormat } from '@zxing/library';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, XCircle } from 'lucide-react';

interface BarcodeScannerProps {
  onBarcodeDetected: (barcode: string) => void;
  onError?: (error: Error) => void;
}

export default function BarcodeScanner({ onBarcodeDetected, onError }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  const startScanner = async () => {
    setError(null);
    setIsScanning(true);

    if (!videoRef.current) return;

    try {
      if (!readerRef.current) {
        const hints = new Map();
        const formats = [
          BarcodeFormat.EAN_8,
          BarcodeFormat.EAN_13,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
          BarcodeFormat.CODE_39,
          BarcodeFormat.CODE_128
        ];
        hints.set(2, formats);
        readerRef.current = new BrowserMultiFormatReader(hints);
      }

      // Get available video devices
      const videoInputDevices = await readerRef.current.listVideoInputDevices();
      setDevices(videoInputDevices);

      // Use selected device or first available
      const deviceId = selectedDeviceId || (videoInputDevices.length > 0 ? videoInputDevices[0].deviceId : null);
      
      if (!deviceId) {
        throw new Error('No camera found');
      }

      setSelectedDeviceId(deviceId);

      // Start continuous scanning
      await readerRef.current.decodeFromVideoDevice(
        deviceId, 
        videoRef.current, 
        (result: Result | null, error?: Error) => {
          if (result) {
            const barcodeText = result.getText();
            onBarcodeDetected(barcodeText);
            stopScanner(); // Stop scanning after successful detection
          }
          if (error && error.name !== 'NotFoundException') {
            console.error('Scan error:', error);
            if (onError) onError(error);
          }
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start scanner';
      setError(errorMessage);
      setIsScanning(false);
      if (onError && err instanceof Error) onError(err);
    }
  };

  const stopScanner = () => {
    if (readerRef.current) {
      readerRef.current.reset();
      setIsScanning(false);
    }
  };

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, []);

  const switchCamera = () => {
    stopScanner();
    // Select next camera in the list
    if (devices.length > 1) {
      const currentIndex = devices.findIndex(device => device.deviceId === selectedDeviceId);
      const nextIndex = (currentIndex + 1) % devices.length;
      setSelectedDeviceId(devices[nextIndex].deviceId);
      
      // Restart scanner with new device
      setTimeout(startScanner, 100);
    }
  };

  return (
    <div className="relative">
      <div className="rounded-lg overflow-hidden bg-black">
        <video 
          ref={videoRef}
          className="w-full h-[300px] object-cover"
        />
        
        {/* Scanning overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-3/4 h-1/3 border-2 border-coffee-red/70 rounded-lg relative">
                <div className="absolute top-0 left-0 w-full border-t-2 border-coffee-red animate-scan" />
              </div>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg max-w-xs text-center">
              <XCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
              <p className="text-coffee-brown">{error}</p>
              <Button 
                className="mt-3 bg-coffee-brown text-white"
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2 mt-3">
        {!isScanning ? (
          <Button 
            className="flex-1 bg-coffee-brown text-coffee-light"
            onClick={startScanner}
          >
            Start Scanning
          </Button>
        ) : (
          <Button 
            className="flex-1 bg-coffee-red text-white"
            onClick={stopScanner}
          >
            Stop
          </Button>
        )}
        
        {devices.length > 1 && isScanning && (
          <Button 
            variant="outline"
            className="border-coffee-brown text-coffee-brown"
            onClick={switchCamera}
          >
            <RefreshCw className="h-4 w-4 mr-1" /> Switch Camera
          </Button>
        )}
      </div>
      
      {/* Loading indicator */}
      {isScanning && (
        <div className="text-center my-2 text-coffee-brown/70">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Scanning for barcodes...</span>
          </div>
        </div>
      )}
    </div>
  );
}