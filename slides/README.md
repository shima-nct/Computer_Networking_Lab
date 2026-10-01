# 概要説明スライド

`overview.md` が本文。区切りの `---` ごとに1枚。16:9、全11枚、約10分の説明を想定する。

```powershell
cd slides
npm ci
npm run build
```

出力先：`../output/pdf/networking-lab-overview.pdf`

4枚目のネットワーク図は `network-overview.png`。編集用は `network-overview.drawio`。draw.ioで編集してPNGを再出力する。IPアドレスを省いた概念図で、端末側のスイッチと模擬インターネット側の中継機器は簡略化している。

5枚目の説明図は `experiment-flow.png`。編集用は `experiment-flow.drawio`。4枚目と同じネットワーク構成をベースに、前半で構築する模擬LANを緑の囲み、後半のPCから模擬インターネットのWebサーバーへの接続を橙の矢印で示す。橙の矢印は通信の始点・終点を表し、実際の通信はR2・GWなどを経由する。

6〜8枚目は同じ機器配置を使い、通信経路・DNS・NAPTを説明する。図は `routing-explanation`、`dns-explanation`、`napt-explanation` のPNGと編集用draw.ioファイル。9〜10枚目はpingの実行・記録例と、通信できないときの確認例。

minitype 0.1.7 と同梱の源ノ角ゴシックを使用する。用紙サイズ、書体、余白は `build.mjs` で設定する。ビルド時にページ数と組版警告をチェックし、あふれた場合は既存PDFを置き換える前に停止する。

## 原稿と編集方針

- `../chapters/experiment_design.qmd`：到達目標、機器の役割、実験全体の流れ
- `../chapters/experiment_manual_1.qmd`：内部ネットワーク、静的ルーティング、DNS
- `../chapters/experiment_manual_2.qmd`：NAPT、外部DNSへの転送、動作確認
- `../chapters/report_assignment.qmd`：考察の問い、記録、評価の観点
- `../chapters/linux_command_cheatsheet.qmd`：確認コマンド

原稿間でIPアドレスが一致しないため、実機の割り当て値としては掲載していない。DNSとpingの説明には例示と明記したIPアドレスを用いる。実験設計書は全3回、手順書とレポート課題は2回の構成なので、実施回数と提出期限は確定情報として掲載せず、前半・後半で整理した。

原稿の `10.0.0.1` はプライベートアドレスのため「グローバルIP」とは呼ばず、模擬環境での「GWの外側のIPアドレス」と表現した。DNS問い合わせは論理的な役割で説明し、原稿の不整合な経由機器列は転載していない。NAPTのポート変換はWeb通信で説明し、ICMPの観察と混同しない。

既存のqmd原稿は変更していない。日程とIP割り当ては授業実施前に原稿側で統一する必要がある。

minitype仕様：https://typeset.jp/plugin/markdown/ 、https://typeset.jp/quick-start/
