minarai-cs-chat-webui
---

### はじめに

[minarai cs chat](http://www.minarai.io/cschat/)のWebUIです。[こちら](https://developer-console.minarai.ch/developers/sign_up)で登録したチャットボットについて見た目など自由にカスタマイズできます。ただし、別途ホスティングが必要です。

[React.js](https://facebook.github.io/react/) / [Redux](https://github.com/reactjs/redux) を元にしたプロジェクトです。 SPA ( Single Page Application ) モデルを前提としています。


### ビルド/テスト環境構築

ビルドは [Node.js](http://nodejs.jp/) + [Webpack](https://webpack.github.io/) で行います。以下の手順でインストールしてください。

1. Node.js の[公式サイト](http://nodejs.jp/)からインストーラをダウンロードしてインストール
1. 本ディレクトリ直下へ移動後、「`npm install`」を実行

### 動作確認

動作確認は以下の手順で行ってください。

1. 登録済みのチャットボット情報を設定
    - [minarai Bot Application Manager](https://developer-console.minarai.ch/developers/sign_in) にログインし、登録したチャットボットのアプリケーションIDをコピーする（「COPY」ボタンのクリックでクリップボードへコピーできる）
     ![botapplicationid](https://user-images.githubusercontent.com/2093152/38532645-be8c0c22-3cb0-11e8-8a81-b5ea0dceed14.png)
    - 「`src/js/conf/default.js`」 の `minarai.applicationId`の値をコピーしたアプリケーションIDに変更する

1. チャットボットを起動
    - 本ディレクトリ直下で「`npm run start`」を実行するとビルドが開始される
    - ビルドが成功すると確認用のブラウザが自動で起動する。うまく起動しなかったときは 「 http://localhost:9080 」 へアクセスする

### 開発の流れ

基本的には「`npm run start`」を実行しコードをWebpackでリアルタイム変換させながら開発します。
修正箇所は以下を参照してください。

`src/js/conf/default.js`の`assets`：

各画像のURLを指定しています。

```
backgroundImgUrl ... チャットの背景
fileIconUrl ... ファイルアイコン
faceBotUrls.normal ... ボット画像（通常）
faceBotUrls.sad ... ボット画像（悲しみ）
faceOperatorDefaultUrl ... オペレーター画像
faceUserUrl ... ユーザー画像
```

`src/js/components/presentators`直下のディレクトリ：

各領域に関する「.js」や「.css」が存在します。

```
CallingArea ... オペレータを呼び出し中に開くモーダル領域
GalleryArea ... 画像をクリックした時に開くモーダル領域
InputArea ... 入力内容に関する領域
NotificationArea ... 通知に関する領域
TimelineArea ... やりとりの表示に関する領域
UploadArea ... ファイルアップロードに関する領域
```

※ 「`npm run start`」コマンドを実行して変更監視を有効にしておくと、 source 配下のリソースを修正した際にリアルタイムで`www`直下のファイルが更新されていきます

### 配布用ビルドの流れ

コンソールで本ディレクトリ直下へ移動し、「`npm run build:prod`」を実行します（コードのminifyなどを実施）。`www`ディレクトリ直下にファイルが上書きされるので、リリース先のディレクトリへ`www`をコピーします。「`www/index.html`」をブラウザで開くとチャットが開始できます。

### License

本サンプルのライセンスはコード含めて全て *MIT License* です。
