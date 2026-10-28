import type { DiscoveredDevice } from '../domain/discovered-device';

export type DeviceDiscovery = {
  discover: () => Promise<DiscoveredDevice[]>;
};
