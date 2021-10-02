const express = require('express');
/** https://github.com/x-cold/dingtalk-robot */
const ChatBot = require('dingtalk-robot-sender');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** 手机号匹配人员 */
const PhoneList = require('./phoneList');

const robot = new ChatBot({
  baseUrl: 'https://oapi.dingtalk.com/robot/send',
  accessToken:
    '23fc2e7dce7805fb8d41dd36cda4d3d0cf2cfcc8629644404a7942d3e7358b11',
  secret: 'SECb71f775436ef9d85d481b4c3afae6dd224af5d7b2b731a417677bbb915613f04',
});

app.post('/notice', async (req, res) => {
  /** 获取用户名 */
  const { name } = req.body.pusher;
  /** 获取提交信息 */
  const { message, timestamp, url } = req.body.head_commit;
  /** 获取头像 */
  const { avatar_url, html_url } = req.body.sender;
  /** 项目名称 */
  const projectName = req.body.repository.name;
  /** 项目主页 */
  const projectHtml = req.body.repository.html_url;
  /** 获取用户信息 */
  let user = PhoneList.find((item) => item.name === name);

  /** 推送消息 */
  const content = '且视他人之疑目如盏盏鬼火，大胆去走你的夜路。';
  const at = {
    atMobiles: [user.phone],
    isAtAll: false,
  };
  // 快速发送文本消息
  await robot.text(content, at);

  /** 主页信息链接 */
  const link = {
    text: '这个世界上唯有两样东西能让我们的心灵感到深深的震撼：一是我们头上灿烂的星空，一是我们内心崇高的道德法则。',
    title: '查看主页信息',
    picUrl: avatar_url,
    messageUrl: html_url,
  };
  await robot.link(link);

  /** 代码提交信息 */
  const title = '代码提交';
  const text =
    `## 代码提交信息 @${user.phone}\n` +
    `> 项目：[${projectName}](${projectHtml}) \n\n` +
    `> ${message} \n\n` +
    `> 提交者：@${name} \n` +
    `> ![screenshot](http://cdn.wangdaoo.com/github.jpeg)\n` +
    `> 时间：${timestamp} [查看详情](${url}) \n`;

  const at2 = {
    atMobiles: [user.phone],
    isAtAll: false,
  };
  await robot.markdown(title, text, at2);

  // res
  res.send({ data: 'Success' });
});

app.listen(8009, () => {
  console.log('listening on 8009...');
});
