const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('https://sim-iku-api.ppns.ac.id/api/units');
    console.log("Units structure:", JSON.stringify(res.data).substring(0, 500));
    
    if (res.data && res.data.data && res.data.data.data && res.data.data.data.length > 0) {
      const unitId = res.data.data.data[0].id;
      const ikuRes = await axios.get(`https://sim-iku-api.ppns.ac.id/api/units/${unitId}/ikus`);
      console.log("IKUs structure:", JSON.stringify(ikuRes.data).substring(0, 500));
    }
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}

test();
