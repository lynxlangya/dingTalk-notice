const express = require('express');
const ChatBot = require('dingtalk-robot-sender');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** 手机号匹配人员 */
const PhoneList = require('./phoneList')

// TODO: 替换ENV常量
const robot = new ChatBot({
  baseUrl: 'https://oapi.dingtalk.com/robot/send',
  accessToken: process.env.DD_ACCESSTOKEN,
  secret: process.env.DD_SECRET,
});

app.post('/notice', async (req, res) => {
  const content = '且视他人之疑目如盏盏鬼火，大胆去走你的夜路。';
  let { name } = req.body.pusher;
  let user = PhoneList.find((item) => item.name === name);
  const at = {
    atMobiles: [user.phone],
    isAtAll: false,
  };
  // 快速发送文本消息
  await robot.text(content, at);

  // res
  res.send({ data: 'Success' });
});

app.listen(8888, () => {
  console.log('listening on 8888...');
});
