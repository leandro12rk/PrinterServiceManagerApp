export type Tab = 'printers' | 'scanners';
export type DeviceKind = 'printer' | 'scanner' | 'multifunction';
export type Filter = 'all' | 'active' | 'inactive';

export interface Toner {
  name: string;
  model?: string;
  level: number | null;
  maximum: number | null;
  percentage: number | null;
}

export interface Device {
  id: number;
  name: string;
  ip: string;
  brand: string;
  model: string | null;
  active: boolean;
  isMultifunction: boolean;
  toners?: Toner[] | null;
}

export interface FormValues {
  ip: string;
  kind: DeviceKind;
  active: boolean;
}
