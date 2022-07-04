import fetch from 'node-fetch';

const hardForkBlockHeight = process.env.QTUM_UPGRADE_BLOCKHEIGHT;

const pastNumber10000 = 10000;
const pastNumber50000 = 50000;
const pastNumber100000 = 100000;

const convert_msec = 1000;

async function getJsonData(uri_path){
  const url_path = `https://qtum.info/api${uri_path}`
  const recent_block_responce = await fetch(url_path);
  const json_data = await recent_block_responce.json();
  return json_data;
}

async function getRecentBlock(){
  let recent_block_path = `/recent-blocks?count=1`;
  const recent_block_data = await getJsonData(recent_block_path);
  const recent_block_height = recent_block_data[0].height;
  const recent_block_time = recent_block_data[0].timestamp;
  let recent_block = [recent_block_height, recent_block_time];
  return recent_block;
}

async function getPastBlockTime(recent_block, past_block_number){
  const recent_block_height = recent_block[0];
  const recent_block_time = recent_block[1];


  let past_block_height  = recent_block[0] - past_block_number;
  let past_block_path = `/block/${past_block_height}`;
  let pastblock_data = await getJsonData(past_block_path);
  let past_block_time = pastblock_data.timestamp;
  let blockMiningTime = (recent_block_time - past_block_time) / past_block_number;
  let unixtime_expectation = ((hardForkBlockHeight - recent_block_height) * blockMiningTime ) + recent_block_time;
  console.log("直近", past_block_number, " ブロック生成平均時間: ", blockMiningTime, "秒    の場合:   ", new Date(unixtime_expectation * convert_msec).toLocaleString());
  return recent_block;
}

getRecentBlock().then(recent_block => {
  getPastBlockTime(recent_block, pastNumber10000).then(recent_block => {
    getPastBlockTime(recent_block, pastNumber50000).then(recent_block => {
      getPastBlockTime(recent_block, pastNumber100000);
    });
  });
});
