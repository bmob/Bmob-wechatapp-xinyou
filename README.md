# Bmob-wechatApp-xinyou
小程序名称为心邮，这是一款发布日志和心情的小程序。用来倾诉烦恼、分享快乐。
使用步骤：
    <p>第一步：创建项目，记得填入你自己的AppId(必须填入AppId，不然无法调用wx.login())。</p>
    <p>第二步：下载该demo。</p>
    <p>第三步：在微信小程序管理后台中配置服务器域名为https://api.bmob.cn。</p>
    <p>第四步：在Bmob后台创建应用，将你的AppID(小程序ID)和AppSecret(小程序密钥)填写到Bmob的微信小程序配置密钥中。</p>
    <p>第五步：将你的Application ID和REST API Key替换app.js中的Bmob.initialize("e3cecf75da3d8316729ee905e81f5ac1", "adf78f7709798f97d6bb9aef6a7624ad")。</p>
    <p>第六步：创建表和字段</p>：
            <p>(1)在_User表中新建字段userPic(String),nickname(String)</p>
            <p>(2)新建Diary表，新建字段title(String),publisher(Pointer)<关联_User表>,pic(File),likeNum(Number),is_hide(String),content(String),commentNum(Number)</p>
            <p>(3)新建Likes表，新建字段praiser(Pointer)<关联_User表>,moodId(Pinter)<关联Diary></p>
            <p>(4)新建Comments表，新建字段publisher(Pointer)<关联_User表>,olderUserName(String),olderComment(Pointer)<关联Comments表>,mood(Pointer)<关联Diary表>,content(String)</p>
