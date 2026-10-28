import type { DeviceDiscovery } from '../application/device-discovery';

export const simulatedDeviceDiscovery: DeviceDiscovery = {
  async discover() {
    await new Promise((resolve) => setTimeout(resolve, 350));

    return [
      {
        id: 'discovered-v380-001',
        name: 'Cámara descubierta',
        model: 'OpenCam Simulator',
        address: '192.168.1.101',
        connectionState: 'online',
        capabilities: ['live-view', 'playback', 'ptz', 'audio', 'alarms'],
      },
    ];
  },
};
