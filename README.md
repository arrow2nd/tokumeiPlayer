# 匿名Player

Webラジオ「匿名ラジオ」を再生する非公式のアプリケーションです。

ブラウザを開かずに垂れ流したかったので作りました。

![image](https://user-images.githubusercontent.com/44780846/81769975-e3fdbf00-9519-11ea-979c-6b1325869325.png)

- Releases: https://github.com/arrow2nd/tokumeiPlayer/releases

## インストール方法

### Windowsインストーラー版
1.ダウンロードしたファイルをダブルクリックしてください

2.インストーラーの指示に従ってインストールを進めてください

3.完了！

### debパッケージ版
1.ダウンロードしたファイルがあるディレクトリで端末を開いてください

2.端末で```sudo apt install　[ファイル名]```を実行

3.完了！！

### pacmanパッケージ版
1.ダウンロードしたファイルがあるディレクトリで端末を開いてください

2.端末で```sudo pacman -U [ファイル名] --assume-installed libappindicator-sharp```を実行

<details>
<summary>なんでこんな長いの？</summary>

普通にインストールしようとしたら、libappindicator-sharpの依存関係を解決できないよ！って怒られたからです

[こちらのissue](https://github.com/electron-userland/electron-builder/issues/4181)を参考にしました…

</details>

3.完了！！！

## 注意
- インストール/初回実行時にアンチウィルスソフト等が反応する場合があります
- 使用される場合は自己責任でお願いします

## 使用している素材
- ICOOON MONO様: https://icooon-mono.com
- Googleマテリアルアイコン: https://google.github.io/material-design-icons/
