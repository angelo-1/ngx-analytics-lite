/**
 * Represents an inclusive date range for filtering.
 * Both `from` and `to` can be ISO 8601 strings or Date objects.
 */
export interface DateRange {
  /** Start of the range (inclusive). ISO 8601 string or Date object. */
  from: Date | string;
  /** End of the range (inclusive). ISO 8601 string or Date object. */
  to: Date | string;
}
