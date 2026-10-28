import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Device } from '../domain/device';
import type { DeviceRepository } from '../application/device-registry';

const DEVICES_STORAGE_KEY = '@opencam/device-registry';

export const asyncStorageDeviceRepository: DeviceRepository = {
  async list() {
    const serializedDevices = await AsyncStorage.getItem(DEVICES_STORAGE_KEY);

    if (!serializedDevices) {
      return [];
    }

    try {
      return JSON.parse(serializedDevices) as Device[];
    } catch {
      return [];
    }
  },

  async save(device) {
    const devices = await this.list();
    const nextDevices = [...devices.filter((item) => item.id !== device.id), device];
    await AsyncStorage.setItem(DEVICES_STORAGE_KEY, JSON.stringify(nextDevices));
  },

  async remove(deviceId) {
    const devices = await this.list();
    const nextDevices = devices.filter((device) => device.id !== deviceId);
    await AsyncStorage.setItem(DEVICES_STORAGE_KEY, JSON.stringify(nextDevices));
  },

  async replaceAll(devices) {
    await AsyncStorage.setItem(DEVICES_STORAGE_KEY, JSON.stringify(devices));
  },
};
