const NEED_MEASUREMENT = {
  NO_MEASUREMENT: false,
  YES_MEASUREMENT: true,
};

const NEED_MEASUREMENT_LABELS = {
  [NEED_MEASUREMENT.NO_MEASUREMENT]: "Tidak, saya punya contoh ukuran",
  [NEED_MEASUREMENT.YES_MEASUREMENT]: "Ya, saya ingin mengukur",
};

module.exports = { NEED_MEASUREMENT, NEED_MEASUREMENT_LABELS };
