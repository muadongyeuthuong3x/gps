const fetchData = [
  {
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
  },
];

for (let i = 0; i < 10; i++) {
  const prefix = "89883011";
  const randomPart = Math.floor(Math.random() * 1e12)
    .toString()
    .padStart(12, "0");
  const randomIccid = prefix + randomPart;
  fetchData.push({
    iccid: randomIccid,
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
  });
}

export { fetchData };
