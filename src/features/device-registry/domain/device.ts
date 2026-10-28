export type DeviceConnectionState = 'online' | 'offline' | 'unknown';

export type DeviceCapability =
  | 'live-view'
  | 'playback'
  | 'ptz'
  | 'audio'
  | 'alarms';

export type Device = {
  id: string;
  name: string;
  model?: string;
  address?: string;
  connectionState: DeviceConnectionState;
  capabilities: DeviceCapability[];
  createdAt: string;
};
