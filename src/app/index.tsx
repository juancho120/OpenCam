import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import {
  DeviceRegistry,
  asyncStorageDeviceRepository,
  type Device,
} from '../features/device-registry';
import { simulatedDeviceDiscovery } from '../features/device-discovery';

export default function DeviceRegistryScreen() {
  const registry = useMemo(
    () => new DeviceRegistry(asyncStorageDeviceRepository),
    [],
  );
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDevices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setDevices(await registry.list());
    } catch {
      setError('No pudimos cargar tus cámaras.');
    } finally {
      setIsLoading(false);
    }
  }, [registry]);

  useEffect(() => {
    let isMounted = true;

    const hydrateDevices = async () => {
      try {
        const storedDevices = await registry.list();
        if (isMounted) {
          setDevices(storedDevices);
        }
      } catch {
        if (isMounted) {
          setError('No pudimos cargar tus cámaras.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void hydrateDevices();

    return () => {
      isMounted = false;
    };
  }, [registry]);

  const discoverDevices = async () => {
    setError(null);
    setIsDiscovering(true);

    try {
      const discoveredDevices = await simulatedDeviceDiscovery.discover();
      await Promise.all(
        discoveredDevices.map((device) =>
          registry.add({
            ...device,
            createdAt: new Date().toISOString(),
          }),
        ),
      );
      await loadDevices();
    } catch {
      setError('No pudimos buscar cámaras en tu red.');
    } finally {
      setIsDiscovering(false);
    }
  };

  const removeDevice = async (deviceId: string) => {
    setError(null);
    await registry.remove(deviceId);
    await loadDevices();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>OPENCAM</Text>
        <Text style={styles.title}>Tus cámaras</Text>
        <Text style={styles.subtitle}>
          La primera base local para descubrir y administrar tus dispositivos.
        </Text>

        <Pressable
          style={[styles.primaryButton, isDiscovering && styles.disabledButton]}
          disabled={isDiscovering}
          onPress={discoverDevices}
        >
          {isDiscovering ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Buscar cámaras</Text>
          )}
        </Pressable>

        {isLoading ? <ActivityIndicator color="#2b59c3" style={styles.loader} /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {!isLoading && devices.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Todavía no hay cámaras</Text>
            <Text style={styles.emptyText}>
              Todavía no encontramos dispositivos guardados. La búsqueda actual usa un
              adaptador simulado mientras definimos el protocolo de cámaras reales.
            </Text>
          </View>
        ) : null}

        <View style={styles.deviceList}>
          {devices.map((device) => (
            <View key={device.id} style={styles.deviceCard}>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceMeta}>{device.model ?? 'Modelo desconocido'}</Text>
                <Text style={styles.deviceStatus}>
                  {device.connectionState === 'online' ? '● En línea' : '● Sin conexión'}
                </Text>
              </View>
              <Pressable onPress={() => removeDevice(device.id)}>
                <Text style={styles.removeText}>Eliminar</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f7fb' },
  container: { flex: 1, padding: 24 },
  eyebrow: { color: '#2b59c3', fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  title: { color: '#10233f', fontSize: 34, fontWeight: '800', marginTop: 10 },
  subtitle: { color: '#52627a', fontSize: 16, lineHeight: 24, marginTop: 10, maxWidth: 420 },
  loader: { marginTop: 40 },
  error: { color: '#b42318', marginTop: 24 },
  emptyState: {
    backgroundColor: '#fff',
    borderColor: '#dce5f2',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 32,
    padding: 24,
  },
  emptyTitle: { color: '#10233f', fontSize: 20, fontWeight: '700' },
  emptyText: { color: '#52627a', fontSize: 15, lineHeight: 22, marginTop: 10 },
  primaryButton: { alignItems: 'center', backgroundColor: '#2b59c3', borderRadius: 12, marginTop: 22, padding: 15 },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  disabledButton: { opacity: 0.7 },
  deviceList: { gap: 12, marginTop: 24 },
  deviceCard: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', padding: 18 },
  deviceInfo: { flex: 1 },
  deviceName: { color: '#10233f', fontSize: 17, fontWeight: '700' },
  deviceMeta: { color: '#52627a', marginTop: 4 },
  deviceStatus: { color: '#1f8f55', fontSize: 13, marginTop: 8 },
  removeText: { color: '#b42318', fontWeight: '600', padding: 8 },
});
