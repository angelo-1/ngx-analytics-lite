/**
 * @fileoverview Chart.js component registry.
 *
 * Each chart component registers only what it needs (tree-shakable).
 * This file provides a convenience function for shared registrations
 * (Tooltip, Legend) that all chart types rely on.
 *
 * @internal
 */
import {
  Chart,
  Tooltip,
  Legend,
  Title,
  Filler,
} from 'chart.js';

/**
 * Registers Chart.js plugins shared across all chart types.
 * Called once — Chart.js deduplicates registrations internally.
 */
export function registerSharedChartComponents(): void {
  Chart.register(Tooltip, Legend, Title, Filler);
}
