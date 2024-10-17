import { FetchDataItem } from "../types/sim.nce";

export const dataFetch = {
  iccid: "8988303000123456789",
  iccid_with_luhn: "89883030001234567890",
  imsi: "901405100000018",
  imsi_2: "901405100000018",
  current_imsi: "901405100000018",
  msisdn: "882285100000018",
  imei: "0000000000000018",
  imei_lock: true,
  status: "Disabled",
  activation_date: "2018-03-09T07:59:09.000+0000",
  ip_address: "100.100.100.18",
  current_quota: 500,
  quota_status: {
    id: 0,
    description: "string",
    threshold_reached_date: "2024-10-14T01:49:01.202Z",
    quota_exceeded_date: "2024-10-14T01:49:01.202Z",
  },
  current_quota_SMS: 250,
  quota_status_SMS: {
    id: 0,
    description: "string",
    threshold_reached_date: "2024-10-14T01:49:01.202Z",
    quota_exceeded_date: "2024-10-14T01:49:01.202Z",
  },
  label: "DX-137-B12",
};

const listDataFetch : FetchDataItem[] = [];

export const numbersArray = [
  "898830110000000001234",
  "898830112345678901234",
  "898830110000123456789",
  "898830110000987654321",
  "898830110123456789000",
  "898830110000000999999",
  "898830110111222333444",
  "898830119876543210123",
  "898830115678901234567",
  "898830110000000000000",
];

for (let i = 0; i < 10; i++) {
  dataFetch.imsi = numbersArray[1];
  dataFetch.current_quota = Math.floor(Math.random() * 10) + 1;
  dataFetch.current_quota_SMS = Math.floor(Math.random() * 10) + 1;
  listDataFetch.push(dataFetch);
}

export { listDataFetch };
