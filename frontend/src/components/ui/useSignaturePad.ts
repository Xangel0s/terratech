'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

export interface UseSignaturePadOptions {
  strokeColor?: string;
  lineWidth?: number;
  onSignatureChange?: (hasSignature: boolean) => void;
}

export function useSignaturePad(options?: UseSignaturePadOptions) {
  const strokeColor = options?.strokeColor || '#0f172a';
  const lineWidth = options?.lineWidth || 2.2;
  const onSignatureChange = options?.onSignatureChange;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const strokesRef = useRef<Array<Array<{ x: number; y: number }>>>([]);
  const currentStrokeRef = useRef<Array<{ x: number; y: number }>>([]);

  // Redraw all recorded strokes at current canvas scale
  const redrawAllStrokes = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = strokeColor;

    for (const stroke of strokesRef.current) {
      if (stroke.length === 0) continue;
      if (stroke.length === 1) {
        ctx.beginPath();
        ctx.arc(stroke[0].x, stroke[0].y, lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
      }
    }
    ctx.restore();
  }, [strokeColor, lineWidth]);

  // Synchronize internal buffer to exact physical pixels (Retina / High-DPI support)
  const syncCanvasSize = useCallback((targetCanvas?: HTMLCanvasElement | null) => {
    const canvas = targetCanvas || canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    const targetWidth = Math.round(rect.width * dpr);
    const targetHeight = Math.round(rect.height * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    if (strokesRef.current.length > 0) {
      redrawAllStrokes(canvas);
    }
  }, [strokeColor, lineWidth, redrawAllStrokes]);

  // Callback ref to automatically initialize when canvas is mounted in DOM
  const setCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }

    canvasRef.current = canvas;
    if (!canvas) return;

    syncCanvasSize(canvas);

    // Frame delay to handle CSS transition/flex layout
    requestAnimationFrame(() => {
      syncCanvasSize(canvas);
    });

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        syncCanvasSize(canvas);
      });
      ro.observe(canvas);
      resizeObserverRef.current = ro;
    }
  }, [syncCanvasSize]);

  useEffect(() => {
    const handleResize = () => syncCanvasSize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [syncCanvasSize]);

  // Calculate exact CSS coordinate relative to canvas bounding box
  const getCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement> | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('changedTouches' in e && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    syncCanvasSize(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const point = getCoordinates(e);
    isDrawingRef.current = true;
    lastPointRef.current = point;
    currentStrokeRef.current = [point];

    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw crisp initial dot in case it's a click or tap
    ctx.beginPath();
    ctx.arc(point.x, point.y, lineWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = strokeColor;
    ctx.fill();

    setHasSignature(true);
    onSignatureChange?.(true);
  }, [syncCanvasSize, getCoordinates, strokeColor, lineWidth, onSignatureChange]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPoint = getCoordinates(e);
    const lastPoint = lastPointRef.current;

    // Avoid duplicate points
    const dx = currentPoint.x - lastPoint.x;
    const dy = currentPoint.y - lastPoint.y;
    if (dx * dx + dy * dy < 0.25) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    lastPointRef.current = currentPoint;
    currentStrokeRef.current.push(currentPoint);
  }, [getCoordinates, strokeColor, lineWidth]);

  const stopDrawing = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (currentStrokeRef.current.length > 0) {
      strokesRef.current.push(currentStrokeRef.current);
      currentStrokeRef.current = [];
    }
    lastPointRef.current = null;
  }, []);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    strokesRef.current = [];
    currentStrokeRef.current = [];
    lastPointRef.current = null;
    isDrawingRef.current = false;

    setHasSignature(false);
    onSignatureChange?.(false);
  }, [onSignatureChange]);

  const getSignatureDataUrl = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return undefined;
    return canvas.toDataURL('image/png');
  }, [hasSignature]);

  return {
    canvasRef,
    hasSignature,
    setHasSignature,
    isDrawing: isDrawingRef.current,
    clearSignature,
    syncCanvasSize,
    getSignatureDataUrl,
    canvasProps: {
      ref: setCanvasRef,
      onMouseDown: startDrawing,
      onMouseMove: draw,
      onMouseUp: stopDrawing,
      onMouseLeave: stopDrawing,
      onTouchStart: startDrawing,
      onTouchMove: draw,
      onTouchEnd: stopDrawing,
      onTouchCancel: stopDrawing,
    },
  };
}
