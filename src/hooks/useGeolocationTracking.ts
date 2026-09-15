import { useState, useEffect, useRef, useCallback } from 'react';

export interface UserCoordinates {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
  heading?: number | null;
  speed?: number | null;
}

export interface UseGeolocationTrackingReturn {
  userLocation: UserCoordinates | null;
  isTracking: boolean;
  isLocating: boolean;
  error: string | null;
  startTracking: () => void;
  stopTracking: () => void;
  toggleTracking: () => void;
}

/**
 * Hook for high-accuracy real-time GPS tracking using navigator.geolocation.watchPosition.
 * Configured with high accuracy, maximum age 0, and 5000ms timeout.
 */
export function useGeolocationTracking(autoStart = false): UseGeolocationTrackingReturn {
  const [userLocation, setUserLocation] = useState<UserCoordinates | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setIsLocating(false);
  }, []);

  const startTracking = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocalización no soportada por el navegador.');
      return;
    }

    // Clear any existing watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsTracking(true);
    setIsLocating(true);
    setError(null);

    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    };

    const handleSuccess = (position: GeolocationPosition) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
        heading: position.coords.heading,
        speed: position.coords.speed,
      });
      setIsLocating(false);
      setError(null);
    };

    const handleError = (err: GeolocationPositionError) => {
      setIsLocating(false);
      let errorMsg = 'Error al obtener la ubicación.';
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMsg = 'Permiso de ubicación denegado por el usuario.';
          break;
        case err.POSITION_UNAVAILABLE:
          errorMsg = 'Ubicación GPS no disponible.';
          break;
        case err.TIMEOUT:
          // Timeout can occur on individual updates; keep trying if still tracking
          errorMsg = 'Tiempo de espera de señal GPS agotado.';
          break;
      }
      setError(errorMsg);
    };

    try {
      const id = navigator.geolocation.watchPosition(handleSuccess, handleError, geoOptions);
      watchIdRef.current = id;
    } catch (e) {
      setIsLocating(false);
      setIsTracking(false);
      setError('No se pudo iniciar el rastreo GPS.');
    }
  }, []);

  const toggleTracking = useCallback(() => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  }, [isTracking, startTracking, stopTracking]);

  useEffect(() => {
    if (autoStart) {
      startTracking();
    }
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [autoStart, startTracking]);

  return {
    userLocation,
    isTracking,
    isLocating,
    error,
    startTracking,
    stopTracking,
    toggleTracking,
  };
}
