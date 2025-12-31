'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import type { IDetectedBarcode } from '@yudiel/react-qr-scanner';

const Scanner = dynamic(
  () => import('@yudiel/react-qr-scanner').then(m => m.Scanner),
  { ssr: false }
)

interface BarcodeScannerProps {
  onDetected: (results: IDetectedBarcode[]) => void;
}
export function BarcodeScanner({ onDetected }: BarcodeScannerProps) {
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    const strError = `${error}`
    switch (true) {
      case strError.startsWith("NotAllowedError"):
        setError('Kamera-Zugriff verweigert');
        break
      default:
        setError('Kamera nicht verfügbar');
    }
  }

  return (
    <div className="w-full">
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}

      <Scanner
        classNames={{
          container: "rounded"
        }}
        constraints={{
          facingMode: 'environment',
          noiseSuppression: true,
          autoGainControl: true
        }}
        components={{ zoom: true }}
        formats={['ean_13', 'ean_8']}
        sound={false}

        onScan={(results) => {
          if (!results?.length) return;
          onDetected(results);
        }}
        onError={(error) => handleError(error)}
      />
    </div>
  );
}
