/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  QrCode,
  Camera,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Utensils
} from 'lucide-react';
import jsQR from 'jsqr';
import { PalaceLogo } from './PalaceLogo';
import { identifyTableFromScan, getLocalRegisteredTables } from '../services/tableService';
import { HotelTableInfo } from '../types/restaurant';

export { getLocalRegisteredTables as getHotelTables };
export const HOTEL_TABLES = getLocalRegisteredTables();

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeTable?: string | null;
  onSelectTable: (tableNumber: string) => void;
  onClearTable?: () => void;
}

export const TableQrScannerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activeTable,
  onSelectTable,
  onClearTable,
}) => {
  if (!isOpen) return null;

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedSuccess, setScannedSuccess] = useState<HotelTableInfo | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stop camera safely
  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleScanResult = (rawString: string) => {
    if (isProcessing || scannedSuccess) return;
    setIsProcessing(true);
    setScanError(null);

    const check = identifyTableFromScan(rawString);
    if (check.success && check.table) {
      stopCamera();
      setScannedSuccess(check.table);
      setTimeout(() => {
        onSelectTable(check.table!.name);
        onClose();
      }, 1200);
    } else {
      setScanError(check.error || 'Invalid or unrecognized Table QR code.');
      setIsProcessing(false);
    }
  };

  // Helper to scan a video frame using BarcodeDetector or jsQR fallback
  const scanVideoFrame = () => {
    const video = videoRef.current;
    if (!video || video.readyState !== 4) return;

    // First try native BarcodeDetector if available
    if ('BarcodeDetector' in window) {
      try {
        const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        barcodeDetector.detect(video).then((barcodes: any[]) => {
          if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
            handleScanResult(barcodes[0].rawValue);
            return;
          }
          scanWithJsQR(video);
        }).catch(() => {
          scanWithJsQR(video);
        });
        return;
      } catch {}
    }

    scanWithJsQR(video);
  };

  const scanWithJsQR = (source: HTMLVideoElement | HTMLImageElement) => {
    try {
      let canvas = canvasRef.current;
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvasRef.current = canvas;
      }
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const width = (source as HTMLVideoElement).videoWidth || (source as HTMLImageElement).naturalWidth || 640;
      const height = (source as HTMLVideoElement).videoHeight || (source as HTMLImageElement).naturalHeight || 480;
      if (width === 0 || height === 0) return;

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(source, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      if (code && code.data) {
        handleScanResult(code.data);
      }
    } catch {}
  };

  // Start real device camera
  const startCamera = async () => {
    setCameraError(null);
    setScanError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);

      // Start periodic scanning loop
      scanIntervalRef.current = setInterval(() => {
        scanVideoFrame();
      }, 350);
    } catch (err: any) {
      setCameraError(
        err?.message || 'Unable to start camera. Please allow camera permissions to scan your table QR stand.'
      );
      setCameraActive(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-sans-body">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] text-stone-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
              <QrCode className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-serif-display text-base font-bold text-white tracking-wide">
                Scan Table QR Stand
              </h3>
              <span className="text-[10px] text-amber-400 font-mono block">
                Automatic Table Identification & Direct Kitchen Order
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Viewfinder Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {scannedSuccess ? (
            <div className="py-8 text-center space-y-3 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  🎉 Auto-Identified Table
                </span>
                <h4 className="font-serif-display font-bold text-xl text-white mt-1">
                  Connected to {scannedSuccess.name}
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  {scannedSuccess.area} • Seating for {scannedSuccess.capacity} guests
                </p>
              </div>
              <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 text-[11px] text-amber-300">
                All food orders placed will reach the kitchen chefs directly for {scannedSuccess.name}.
              </div>
            </div>
          ) : (
            <>
              {/* Camera Scanner Box */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-square max-w-[280px] mx-auto border-2 border-stone-700 shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                />
                {!cameraActive && (
                  <div className="p-6 text-center space-y-3">
                    <Camera className="w-10 h-10 text-stone-600 mx-auto" />
                    <p className="text-xs text-stone-400">
                      {cameraError || 'Point camera at the acrylic QR stand on your table'}
                    </p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer shadow-md"
                    >
                      Enable Camera
                    </button>
                  </div>
                )}
                {/* Animated Scanning Reticle Overlay */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-amber-400/80 rounded-2xl relative shadow-lg">
                      <span className="absolute -top-1 -left-1 w-4 h-4 border-t-3 border-l-3 border-amber-300" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 border-t-3 border-r-3 border-amber-300" />
                      <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-3 border-l-3 border-amber-300" />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-3 border-r-3 border-amber-300" />
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent animate-laser-scan" />
                    </div>
                  </div>
                )}
              </div>

              {scanError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{scanError}</span>
                </div>
              )}

              <p className="text-center text-xs text-stone-300 max-w-xs mx-auto leading-relaxed">
                Scan the official acrylic QR stand at your table. The system automatically verifies the table token and connects your dining session.
              </p>

              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 text-[11px] text-stone-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Tables are secured with encrypted QR tokens. Only scanning the physical stand auto-identifies your table.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {activeTable && onClearTable && !scannedSuccess && (
          <div className="p-3 bg-stone-950 border-t border-stone-800 text-center">
            <button
              type="button"
              onClick={() => {
                onClearTable();
                onClose();
              }}
              className="text-xs text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              Clear Current Table Connection ({activeTable})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
