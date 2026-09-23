// The 8 alert types from the spec — shared by the Site schema's default,
// the evaluator, and the settings route so the list only exists once.
export const ALERT_TYPES = [
  'traffic_drop',
  'traffic_spike',
  'conversion_drop',
  'bot_spike',
  'quality_drop',
  'errors_spike',
  'performance_degradation',
  'page_unavailable',
];
