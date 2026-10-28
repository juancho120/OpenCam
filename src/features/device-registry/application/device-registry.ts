import type { Device } from '../domain/device';

export type DeviceRepository = {
  list: () => Promise<Device[]>;
  save: (device: Device) => Promise<void>;
  remove: (deviceId: string) => Promise<void>;
  replaceAll: (devices: Device[]) => Promise<void>;
};

export class DeviceRegistry {
  constructor(private readonly repository: DeviceRepository) {}

  list() {
    return this.repository.list();
  }

  add(device: Device) {
    return this.repository.save(device);
  }

  remove(deviceId: string) {
    return this.repository.remove(deviceId);
  }

  loadSimulatedDevices() {
    return this.repository.replaceAll(createSimulatedDevices());
  }
}

function createSimulatedDevices(): Device[] {
  return [
    {
      id: 'simulated-v380-001',
      name: 'Cámara de prueba',
      model: 'OpenCam Simulator',
      address: '192.168.1.100',
      connectionState: 'online',
      capabilities: ['live-view', 'playback', 'ptz', 'audio', 'alarms'],
      createdAt: new Date().toISOString(),
    },
  ];
}
