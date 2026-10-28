import type { DeviceCapability, DeviceConnectionState } from '../../device-registry/domain/device';

export type DiscoveredDevice = {
  id: string;
  name: string;
  model?: string;
  address?: string;
  connectionState: DeviceConnectionState;
  capabilities: DeviceCapability[];
};
