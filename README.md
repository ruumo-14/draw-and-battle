# DRAW & BATTLE

モンスターを探索・捕獲し、自分で描いたドット絵で育ててバトルするブラウザゲームです。

## 起動方法
GitHub PagesやRenderなどの静的サイトとして、リポジトリのルートを公開してください。ビルドコマンドは不要です。

## ファイル構成
- `index.html` : ゲーム画面のHTML
- `css/style.css` : デザイン
- `js/main.js` : ゲーム全体の初期化・画面管理
- `js/config.js` : 属性・レア度などの設定
- `js/storage.js` : ブラウザ内セーブデータ
- `js/monsters.js` : モンスター生成
- `js/drawing.js` : 32×32ドット絵エディター
- `js/battle.js` : バトル処理

## 注意
セーブデータはブラウザの localStorage に保存されます。同じブラウザ・端末でプレイしてください。
