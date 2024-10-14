export interface SimQuota {
    iccid: string;
    quota: number;
    bank : string;
  }
  
  export interface QuotaStatus {
    id: number;
    description: string;
    threshold_reached_date: string; 
    quota_exceeded_date: string; 
  }
  
  export interface FetchDataItem {
    iccid: string;
    iccid_with_luhn: string;
    imsi: string;
    imsi_2: string;
    current_imsi: string;
    msisdn: string;
    imei: string;
    imei_lock: boolean;
    status: string;
    activation_date: string; 
    ip_address: string;
    current_quota: number;
    quota_status: QuotaStatus;
    current_quota_SMS: number;
    quota_status_SMS: QuotaStatus;
    label: string;
  }