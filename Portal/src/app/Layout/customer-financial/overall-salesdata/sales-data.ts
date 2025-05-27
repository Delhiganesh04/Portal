export interface SalesData {
  Vbeln: string;
  Audat: string;
  Kunnr: string;
  Vkorg: string;
  Vtweg: string;
  Spart: string;
  Netwr: string;
  Waerk: string;
  Vkbur: string;
  Vkgrp: string;
  Bstnk: string;
  Matnr: string;
  Arktx: string;
  Kwmeng: string;
  Vrkme: string;
  Pstyv: string;
  Posex: string;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface SalesFilters {
  dateRange?: DateRange;
  product?: string;
  salesOrg?: string;
  minAmount?: number;
  maxAmount?: number;
}