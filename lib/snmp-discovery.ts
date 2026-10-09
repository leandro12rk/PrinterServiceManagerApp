import snmp from 'net-snmp';

export interface TonerInfo {
  name: string;
  model: string;
  level: number | null;
  maximum: number | null;
  percentage: number | null;
}

export interface DiscoveredDevice {
  name: string;
  brand: string;
  model: string | null;
  toners: TonerInfo[];
}

const OIDS = {
  systemName: '1.3.6.1.2.1.1.5.0',
  systemDescription: '1.3.6.1.2.1.1.1.0',
  supplyDescription: '1.3.6.1.2.1.43.11.1.1.6',
  supplyPercent: '1.3.6.1.2.1.43.11.1.1.7',
  supplyMaximum: '1.3.6.1.2.1.43.11.1.1.8',
  supplyLevel: '1.3.6.1.2.1.43.11.1.1.9',
};

function text(value: unknown) {
  return Buffer.isBuffer(value) ? value.toString('utf8').trim() : String(value ?? '').trim();
}

function walk(session: snmp.Session, oid: string): Promise<Map<string, string>> {
  return new Promise((resolve, reject) => {
    const values = new Map<string, string>();
    session.subtree(
      oid,
      (varbinds) => {
        for (const varbind of varbinds) {
          if (!snmp.isVarbindError(varbind)) values.set(varbind.oid, text(varbind.value));
        }
      },
      (error) => (error ? reject(error) : resolve(values)),
    );
  });
}

function brandAndModel(description: string, systemName: string) {
  const value = description || systemName || 'Dispositivo SNMP';
  const parts = value.split(/\s+/).filter(Boolean);
  return { brand: parts[0] || 'Desconocida', model: parts.slice(1).join(' ') || null };
}

function cartridgeModel(deviceModel: string, supplyName: string) {
  const device = `${deviceModel} ${supplyName}`.toLowerCase();
  if (device.includes('ts3100') && device.includes('black')) return 'PG-145 / PG-145XL';
  if (device.includes('ts3100') && device.includes('color')) return 'CL-146 / CL-146XL';
  return supplyName || 'Modelo no informado';
}

export async function discoverDevice(ip: string): Promise<DiscoveredDevice> {
  return new Promise((resolve, reject) => {
    const session = snmp.createSession(ip, 'public', { timeout: 3000, retries: 1 });
    const close = () => session.close();
    const optionalWalk = (oid: string) => walk(session, oid).catch(() => new Map<string, string>());
    Promise.all([
      new Promise<string>((res, rej) => session.get([OIDS.systemName], (error, varbinds) => {
        if (error) rej(error);
        else res(varbinds[0] && !snmp.isVarbindError(varbinds[0]) ? text(varbinds[0].value) : '');
      })),
      new Promise<string>((res, rej) => session.get([OIDS.systemDescription], (error, varbinds) => {
        if (error) rej(error);
        else res(varbinds[0] && !snmp.isVarbindError(varbinds[0]) ? text(varbinds[0].value) : '');
      })),
      optionalWalk(OIDS.supplyDescription),
      optionalWalk(OIDS.supplyPercent),
      optionalWalk(OIDS.supplyMaximum),
      optionalWalk(OIDS.supplyLevel),
    ]).then(([systemName, description, names, percentages, maximums, levels]) => {
      const tonerNames = [...names.entries()];
      const toners = tonerNames.map(([oid, name]) => {
        const suffix = oid.slice(OIDS.supplyDescription.length);
        const rawLevel = Number(levels.get(`${OIDS.supplyLevel}${suffix}`));
        const rawPercent = Number(percentages.get(`${OIDS.supplyPercent}${suffix}`));
        const maximum = Number(maximums.get(`${OIDS.supplyMaximum}${suffix}`));
        const validLevel = Number.isFinite(rawLevel) && rawLevel >= 0 ? rawLevel : null;
        const validMaximum = Number.isFinite(maximum) && maximum > 0 ? maximum : null;
        const validPercent = Number.isFinite(rawPercent) && rawPercent >= 0 && rawPercent <= 100
          ? Math.round(rawPercent)
          : null;
        return {
          name: name || 'Tóner',
          model: cartridgeModel(systemName || description, name),
          level: validLevel,
          maximum: validMaximum,
          percentage: validPercent ?? (validLevel !== null && validMaximum !== null
            ? Math.max(0, Math.min(100, Math.round((validLevel / validMaximum) * 100)))
            : null),
        };
      });
      const identity = brandAndModel(description, systemName);
      close();
      resolve({ name: systemName || identity.model || ip, ...identity, toners });
    }).catch((error) => {
      close();
      reject(error);
    });
  });
}
