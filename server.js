const express = require('express');
const axios = require('axios');
const app = express();

// 呢個係你嘅 API Key，只會喺呢度出現，網頁睇唔到
const API_KEY = process.env.DEEPSEEK_KEY;

app.use(express.json());
app.use(express.static('.')); 

// 呢個係前端呼叫嘅位
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: userMessage }],
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 將 DeepSeek 嘅回覆傳返俾網頁
    res.json({ reply: response.data.choices[0].message.content });

  } catch (error) {
    console.error('出錯：', error.message);
    res.json({ reply: '出錯，請再試。' });
  }
});

// 啟動伺服器
app.listen(3000, () => {
  console.log('伺服器行緊，去 http://localhost:3000 睇下');
});